DELETE FROM group_to_policy gtp 
USING "policy" p
WHERE p.resource = 'add_point_code' AND  gtp.policy_id  = p.id;

DELETE FROM "policy" p WHERE p.resource = 'add_point_code';