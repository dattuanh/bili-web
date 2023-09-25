CREATE OR REPLACE FUNCTION refresh_user_credit(_user_id int)
        RETURNS user_credit_mat
        SECURITY DEFINER
        LANGUAGE PLPGSQL
        AS $$
DECLARE
    v_return user_credit_mat%rowtype;
    v_stales_at user_credit_mat.stales_at%type := 'infinity';
    array_length integer;
    total user_history_credit.credit%type := 0;
    subtract_amount user_history_credit.credit%type := 0;
    history user_history_credit%rowtype;
    temp_histories user_history_credit[] := array[]::user_history_credit[];
    temp_histories_remove temp_histories%type;
    temp_history user_history_credit%rowtype;
    have_swap boolean;
BEGIN
    FOR history IN
        SELECT * FROM user_history_credit WHERE user_id = _user_id AND deleted_at IS NULL ORDER BY created_at
    LOOP
        IF (history."action" = 'ADD_CREDIT' AND (history.expires_at IS NULL OR history.expires_at > now())) THEN
            total := total + history.credit;
        ELSIF (history."action" = 'ADD_CREDIT' AND history.expires_at < now()) THEN
            temp_histories := temp_histories || history;
        ELSIF history."action" = 'SPEND_CREDIT' THEN
            subtract_amount := history.credit;
            temp_histories_remove := array[]::user_history_credit[];
            array_length := COALESCE(ARRAY_UPPER(temp_histories, 1), 1);

            <<loop_sort>>
            FOR i IN 1 .. array_length LOOP
                have_swap := false;

                <<loop_sort_2>>
                FOR j IN 1 .. (array_length - i) LOOP
                    IF (temp_histories[j].expires_at > temp_histories[j+1].expires_at) THEN
                        temp_history := temp_histories[j];
                        temp_histories[j] := temp_histories[j+1];
                        temp_histories[j+1] := temp_history;
                        have_swap := true;
                    END IF;
                END LOOP loop_sort_2;

                EXIT loop_sort WHEN have_swap = false;
            END LOOP loop_sort;

            <<loop_subtract>>
            FOR i IN 1 .. array_length LOOP
                IF (temp_histories[i].expires_at < history.created_at) THEN
                    temp_histories_remove := temp_histories_remove || temp_histories[i];
                END IF;
                IF (temp_histories[i].credit <= subtract_amount) THEN
                    subtract_amount := subtract_amount - temp_histories[i].credit;
                    temp_histories[i].credit := 0;
                    temp_histories_remove := temp_histories_remove || temp_histories[i];
                ELSIF (temp_histories[i].credit > subtract_amount) THEN
                    temp_histories[i].credit := temp_histories[i].credit - subtract_amount;
                    subtract_amount := 0;
                    EXIT loop_subtract;
                END IF;
            END LOOP loop_subtract;

            IF (subtract_amount > 0) THEN
                total := total - subtract_amount;
            END IF;

            FOREACH temp_history IN ARRAY temp_histories_remove LOOP
                temp_histories := ARRAY_REMOVE(temp_histories, temp_history);
            END LOOP;

            IF (ARRAY_LENGTH(temp_histories, 1) IS NULL) THEN
                temp_histories := array[]::user_history_credit[];
            END IF;
        END IF;

        IF (history.expires_at > now() AND history.expires_at < v_stales_at) THEN
            v_stales_at := history.expires_at;
        END IF;
    END LOOP;

    UPDATE user_credit_mat
    SET total_credits = total,
        stales_at = v_stales_at
    WHERE user_id = _user_id RETURNING * INTO v_return;

    RETURN v_return;
END $$;