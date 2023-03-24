INSERT INTO auth.users (id, instance_id, email, email_confirmed_at, encrypted_password, aud, "role", raw_app_meta_data, raw_user_meta_data, created_at, updated_at, last_sign_in_at, confirmation_token, email_change, email_change_token_new, recovery_token) VALUES
	('d9c444f1-4e91-4abb-b4c7-1d18318990e9', '00000000-0000-0000-0000-000000000000', 'abcd1234@gmail.com', '2023-02-24T19:57:41.849Z', '$2a$10$6LMfbZ87ci.Zt5B0wTuJCu9/3W/U2OAT/U.8Z5Au8mgIhcVWFvoum', 'authenticated', 'authenticated', '{"provider":"email","providers":["email"]}', '{}', '2023-02-24T19:57:41.849Z', '2023-02-24T19:57:41.849Z', '2023-02-24T19:57:41.849Z', '', '', '', '');

INSERT INTO auth.identities (id, user_id, "provider", identity_data, created_at, updated_at, last_sign_in_at) VALUES
	('d9c444f1-4e91-4abb-b4c7-1d18318990e9', 'd9c444f1-4e91-4abb-b4c7-1d18318990e9', 'email', '{"sub":"d9c444f1-4e91-4abb-b4c7-1d18318990e9","email":"abcd1234@gmail.com"}', '2023-02-24T19:57:41.849Z', '2023-02-24T19:57:41.849Z', '2023-02-24T19:57:41.849Z');

UPDATE "public"."profiles" SET 
 first_name = 'Abiola', 
 last_name = 'Bakare', 
 username = 'iamstarcode'
WHERE 
 id = 'd9c444f1-4e91-4abb-b4c7-1d18318990e9';
