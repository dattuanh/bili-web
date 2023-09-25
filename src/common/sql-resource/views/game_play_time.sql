CREATE VIEW "game_play_time" AS SELECT user_id, game_id, value
    FROM game_play_time_mat gptm 
    WHERE CURRENT_TIMESTAMP < stales_at
    UNION ALL
    SELECT r.user_id, r.game_id, r.value
    FROM game_play_time_mat gptm
    CROSS JOIN refresh_game_play_time(gptm.user_id) r
    WHERE gptm.stales_at <= CURRENT_TIMESTAMP;


 