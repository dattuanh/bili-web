INSERT INTO public.noti_display_template ("name", default_lang, "type", "user_type") VALUES('Default MERCHANT_ORDER_ON_HOLD', 'VN', 'MERCHANT_ORDER_ON_HOLD', 'CUSTOMER');
INSERT INTO public.noti_display_template ("name", default_lang, "type", "user_type") VALUES('Default MERCHANT_ORDER_PROCESSING', 'VN', 'MERCHANT_ORDER_PROCESSING', 'CUSTOMER');
INSERT INTO public.noti_display_template ("name", default_lang, "type", "user_type") VALUES('Default MERCHANT_ORDER_COMPLETED', 'VN', 'MERCHANT_ORDER_COMPLETED', 'CUSTOMER');
INSERT INTO public.noti_display_template ("name", default_lang, "type", "user_type") VALUES('Default MERCHANT_ORDER_CANCELLED', 'VN', 'MERCHANT_ORDER_CANCELLED', 'CUSTOMER');

INSERT INTO public.noti_display_template ("name", default_lang, "type", "user_type") VALUES('Default CUSTOMER_GAME_PLAY_TIME_EXPIRES_IN_1_DAY', 'VN', 'CUSTOMER_GAME_PLAY_TIME_EXPIRES_IN_1_DAY', 'CUSTOMER');

INSERT INTO public.noti_display_template ("name", default_lang, "type", "user_type") VALUES('Default CUSTOMER_GAME_PLAY_TIME_EXPIRES_IN_1_DAY', 'VN', 'CUSTOMER_GAME_PLAY_TIME_EXPIRES_IN_1_DAY', 'CUSTOMER');

INSERT INTO noti_display_template_detail (title, "content", detail, lang, noti_display_template_id) 
SELECT 'Đơn quà {{{orderId}}} đã được tiếp nhận', 'Đơn quà {{{orderId}}} đã được tiếp nhận.', '', 'VN', ndt.id FROM noti_display_template ndt WHERE "type" = 'MERCHANT_ORDER_ON_HOLD';
INSERT INTO noti_display_template_detail (title, "content", detail, lang, noti_display_template_id) 
SELECT 'Đơn quà {{{orderId}}} đang vận chuyển', 'Đơn quà {{{orderId}}} đang vận chuyển.', '', 'VN', ndt.id FROM noti_display_template ndt WHERE "type" = 'MERCHANT_ORDER_PROCESSING';
INSERT INTO noti_display_template_detail (title, "content", detail, lang, noti_display_template_id) 
SELECT 'Đơn quà {{{orderId}}} giao thành công', 'Đơn quà {{{orderId}}} giao thành công.', '', 'VN', ndt.id FROM noti_display_template ndt WHERE "type" = 'MERCHANT_ORDER_COMPLETED';
INSERT INTO noti_display_template_detail (title, "content", detail, lang, noti_display_template_id) 
SELECT 'Đơn quà {{{orderId}}} giao thất bại', 'Đơn quà {{{orderId}}} giao thất bại.', '', 'VN', ndt.id FROM noti_display_template ndt WHERE "type" = 'MERCHANT_ORDER_CANCELLED';

INSERT INTO noti_display_template_detail (title, "content", detail, lang, noti_display_template_id) 
SELECT 'Lượt chơi của bạn sắp hết hạn.', '{{{playTimeAmount}}} lượt chơi của bạn sẽ hết hạn vào ngày mai. Bạn hãy quét mã ngay để nhận các phần quà hấp dẫn nhé!', '', 'VN', ndt.id FROM noti_display_template ndt WHERE "type" = 'CUSTOMER_GAME_PLAY_TIME_EXPIRES_IN_1_DAY';


DO $$
DECLARE v_merchant record;
BEGIN
    FOR v_merchant IN
        SELECT * FROM merchant WHERE deleted_at IS NULL AND parent_id IS NULL
    LOOP
        INSERT INTO noti_display_template ("name", default_lang, "type", "user_type", "owner_id") VALUES('Default CUSTOMER_GAME_PLAY_TIME_EXPIRES_IN_1_DAY', 'VN', 'CUSTOMER_GAME_PLAY_TIME_EXPIRES_IN_1_DAY', 'CUSTOMER', v_merchant.user_id);
    END LOOP;
END; $$;