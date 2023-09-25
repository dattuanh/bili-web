CREATE OR REPLACE FUNCTION refresh_game_play_time(_user_id int) 
    RETURNS TABLE (user_id int4, game_type_id int4, value decimal(12,2), about_to_expire_value decimal(12,2), stales_at timestamptz)
    SECURITY DEFINER 
    LANGUAGE PLPGSQL 
    AS $$
DECLARE
    v_game_play_time_mat game_play_time_mat%rowtype;
    v_return game_play_time_mat%rowtype;
    v_stales_at game_play_time_mat.stales_at%type := 'infinity';
    array_length integer;
    total game_play_time_history.value%type := 0;
    v_about_to_expire_value game_play_time_history.value%type := 0;
    subtract_amount game_play_time_history.value%type := 0;
    history game_play_time_history%rowtype;
    temp_histories game_play_time_history[] := array[]::game_play_time_history[];
    temp_histories_remove temp_histories%type;
    temp_history game_play_time_history%rowtype;
    have_swap boolean;

BEGIN
    FOR v_game_play_time_mat IN 
        SELECT * FROM game_play_time_mat gptm WHERE gptm.user_id = _user_id
    LOOP
        total := 0;
        temp_histories := array[]::game_play_time_mat[];
        FOR history IN
            SELECT * FROM game_play_time_history gpth WHERE deleted_at IS NULL AND gpth.user_id =_user_id AND gpth.game_type_id = v_game_play_time_mat.game_type_id ORDER BY gpth.created_at 
        LOOP
            IF (history."action" = 'ADD' AND  history.expires_at IS NULL) THEN
                total := total + history.value;
            ELSIF (history."action" = 'ADD') THEN
                temp_histories := temp_histories || history;
            ELSIF history."action" = 'SUBTRACT' THEN
                subtract_amount := history.value;

                temp_histories_remove := array[]::game_play_time_mat[];
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
                        CONTINUE loop_subtract;
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
                    temp_histories := array[]::game_play_time_mat[];
                END IF;
            END IF;
        END LOOP;

        <<handle_rest_temp_history>>
        FOREACH temp_history IN ARRAY temp_histories LOOP
            CONTINUE handle_rest_temp_history WHEN temp_history.value <= 0 OR temp_history.expires_at <= now();
            v_stales_at = temp_history.expires_at;
            v_about_to_expire_value = temp_history.value;
            total := total + temp_history.value;
        END LOOP handle_rest_temp_history;

        UPDATE game_play_time_mat gptm
        SET "value" = total, stales_at = v_stales_at, about_to_expire_value = v_about_to_expire_value
        WHERE gptm.user_id = _user_id AND gptm.game_type_id = v_game_play_time_mat.game_type_id;

        user_id := _user_id;
        value := total;
        game_type_id := v_game_play_time_mat.game_type_id;
        about_to_expire_value := v_about_to_expire_value;
        stales_at := v_stales_at;
        RETURN NEXT;

    END LOOP;
END $$;