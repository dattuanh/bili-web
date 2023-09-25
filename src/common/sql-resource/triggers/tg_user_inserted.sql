CREATE FUNCTION tgf_user_insert()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE PLPGSQL
AS $$
BEGIN
    INSERT INTO user_transaction_lock ("type", user_id)
    VALUES ('POINT', new.id), ('CREDIT', new.id), ('GAME', new.id);
    RETURN new;
END;
$$;

CREATE TRIGGER tg_user_insert
AFTER INSERT ON "user"
FOR EACH ROW
EXECUTE PROCEDURE tgf_user_insert();

DO $$
DECLARE v_user record;
BEGIN
    FOR v_user IN
        SELECT * FROM "user" WHERE deleted_at IS NULL
    LOOP
        INSERT INTO user_transaction_lock ("type", user_id)
        VALUES ('POINT', v_user.id), ('CREDIT', v_user.id), ('GAME', v_user.id);
    END LOOP;
END; $$;

---- 

DROP TRIGGER IF EXISTS tg_user_insert;
DROP FUNCTION IF EXISTS tgf_user_insert;

---- 

