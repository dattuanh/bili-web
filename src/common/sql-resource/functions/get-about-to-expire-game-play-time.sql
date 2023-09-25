CREATE OR REPLACE FUNCTION get_game_play_time_about_to_expire(_user_id int, _game_type_id int, timestamp_to_check timestamptz, hour_to_expire int)
    RETURNS numeric(12,2)
    SECURITY DEFINER
    LANGUAGE PLPGSQL
    AS $$
DECLARE
    array_length integer;
    total game_play_time_history.value%type := 0;
    total_expired game_play_time_history.value%type := 0;
    subtract_amount game_play_time_history.value%type := 0;
    history game_play_time_history%rowtype;
    temp_histories game_play_time_history[] := array[]::game_play_time_history[];
    temp_histories_remove temp_histories%type;
    temp_history game_play_time_history%rowtype;
    have_swap boolean;
    time_check_plus_expire timestamptz := timestamp_to_check + (hour_to_expire * INTERVAL '1 HOUR');
BEGIN
    FOR history IN
        SELECT * FROM game_play_time_history gpth WHERE user_id = _user_id AND gpth.game_type_id = _game_type_id AND created_at <= timestamp_to_check AND deleted_at IS NULL ORDER BY created_at
    LOOP
        RAISE NOTICE 'his: %', history;
        IF (history."action" = 'ADD' AND (history.expires_at IS NULL OR history.expires_at > time_check_plus_expire)) THEN
            total := total + history.value;
        ELSIF (history."action" = 'ADD') THEN
            temp_histories := temp_histories || history;
        ELSIF history."action" = 'SUBTRACT' THEN
            subtract_amount := history.value;
            temp_histories_remove := array[]::game_play_time_history[];
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
                IF (temp_histories[i].value <= subtract_amount) THEN
                    subtract_amount := subtract_amount - temp_histories[i].value;
                    temp_histories[i].value := 0;
                    temp_histories_remove := temp_histories_remove || temp_histories[i];
                ELSIF (temp_histories[i].value > subtract_amount) THEN
                    temp_histories[i].value := temp_histories[i].value - subtract_amount;
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
                temp_histories := array[]::game_play_time_history[];
            END IF;
        END IF;
    END LOOP;

    FOREACH temp_history IN ARRAY temp_histories LOOP
        CONTINUE WHEN temp_history.value <= 0 OR temp_history.expires_at <= timestamp_to_check;
        total_expired := total_expired + temp_history.value;
    END LOOP;

    RETURN total_expired;
END $$;