DO $$
DECLARE v_merchant record;
BEGIN
    FOR v_merchant IN
        SELECT * FROM merchant WHERE deleted_at IS NULL AND parent_id IS NULL
    LOOP
        INSERT INTO user_credit_mat (user_id, total_credits, stales_at) 
        VALUES(v_merchant.user_id, 0, 'infinity');
    END LOOP;
END; $$;