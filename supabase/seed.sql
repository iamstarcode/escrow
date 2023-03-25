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


INSERT INTO "public"."products" 
("id", "user_id", "name", "description", "images", "price")
 VALUES 
 ('1', 'd9c444f1-4e91-4abb-b4c7-1d18318990e9', 'Iphone X 64gb', 'Broken back iphone x', '["file:///data/user/0/com.iamstarcode.escrow/cache/ImagePicker/3ea593ba-fc04-4b99-b485-cff030838b47.jpeg","file:///data/user/0/com.iamstarcode.escrow/cache/ImagePicker/4c322b37-544c-4396-868f-7ce8c3de3034.jpeg","file:///data/user/0/com.iamstarcode.escrow/cache/ImagePicker/7279d019-3e7a-4390-b4b5-67ec00803a09.jpeg","file:///data/user/0/com.iamstarcode.escrow/cache/ImagePicker/4583dfc9-a6ad-4830-bc9f-6f9577c53c09.jpeg","file:///data/user/0/com.iamstarcode.escrow/cache/ImagePicker/e342d956-1d87-4949-b525-efc87d358597.jpeg","file:///data/user/0/com.iamstarcode.escrow/cache/ImagePicker/daab7dde-1570-4d0a-8aef-2aba6e3c5452.jpeg","file:///data/user/0/com.iamstarcode.escrow/cache/ImagePicker/6232ebda-e664-42a5-8d6d-edc817a82f6f.jpeg","file:///data/user/0/com.iamstarcode.escrow/cache/ImagePicker/e7df198a-d59f-483f-adc6-6639beac88b5.jpeg","file:///data/user/0/com.iamstarcode.escrow/cache/ImagePicker/5f1991cb-8d6b-4911-a104-7d6be80f9bf3.jpeg","file:///data/user/0/com.iamstarcode.escrow/cache/ImagePicker/913d5a1a-71cd-48c0-b983-925cf4852195.jpeg","file:///data/user/0/com.iamstarcode.escrow/cache/ImagePicker/082c12a9-d4bc-45ea-adc5-88a18ea9a1c7.jpeg"]', '120000');
