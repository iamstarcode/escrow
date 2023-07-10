INSERT INTO auth.users (
	id, 
	instance_id, 
	email,
	email_confirmed_at, 
	encrypted_password,
	aud, 
	"role", 
	raw_app_meta_data, 
	raw_user_meta_data,
	created_at, 
	updated_at, 
	last_sign_in_at, 
	confirmation_token, 
	email_change,
	email_change_token_new, recovery_token) 
	VALUES
	('d9c444f1-4e91-4abb-b4c7-1d18318990e9',  -- id
	'00000000-0000-0000-0000-000000000000',	  -- instance_id
	'abcd1234@gmail.com',  -- email
	'2023-02-24T19:57:41.849Z',  --email_conform
	'$2a$10$6LMfbZ87ci.Zt5B0wTuJCu9/3W/U2OAT/U.8Z5Au8mgIhcVWFvoum',  --encryp=abcd1234
	'authenticated',  --aud
	'authenticated', --aud
	'{"provider":"email","providers":["email"]}', --app_meta
	'{}', --user_meta
	'2023-02-24T19:57:41.849Z', --created_at
	'2023-02-24T19:57:41.849Z', --updated_at
	'2023-02-24T19:57:41.849Z', '', '', '', '');

INSERT INTO auth.identities (id, user_id, "provider", identity_data, created_at, updated_at, last_sign_in_at) VALUES
	('d9c444f1-4e91-4abb-b4c7-1d18318990e9', 'd9c444f1-4e91-4abb-b4c7-1d18318990e9', 'email', '{"sub":"d9c444f1-4e91-4abb-b4c7-1d18318990e9","email":"abcd1234@gmail.com"}', '2023-02-24T19:57:41.849Z', '2023-02-24T19:57:41.849Z', '2023-02-24T19:57:41.849Z');


INSERT INTO auth.users (
	id, 
	instance_id, 
	email,
	email_confirmed_at, 
	encrypted_password,
	aud, 
	"role", 
	raw_app_meta_data, 
	raw_user_meta_data,
	created_at, 
	updated_at, 
	last_sign_in_at, 
	confirmation_token, 
	email_change,
	email_change_token_new, recovery_token) 
	VALUES
	('9a52c713-0e87-4ece-b810-9a96952f8c5d',  -- id
	'00000000-0000-0000-0000-000000000000',	  -- instance_id
	'abcd1234_1@gmail.com',  -- email
	'2023-02-24T19:57:41.849Z',  --email_conform
	'$2a$10$6LMfbZ87ci.Zt5B0wTuJCu9/3W/U2OAT/U.8Z5Au8mgIhcVWFvoum',  --encryp=abcd1234
	'authenticated',  --aud
	'authenticated', --aud
	'{"provider":"email","providers":["email"]}', --app_meta
	'{}', --user_meta
	'2023-02-24T19:57:41.849Z', --created_at
	'2023-02-24T19:57:41.849Z', --updated_at
	'2023-02-24T19:57:41.849Z', '', '', '', '');

INSERT INTO auth.identities (id, user_id, "provider", identity_data, created_at, updated_at, last_sign_in_at) VALUES
	('9a52c713-0e87-4ece-b810-9a96952f8c5d', '9a52c713-0e87-4ece-b810-9a96952f8c5d', 'email', '{"sub":"9a52c713-0e87-4ece-b810-9a96952f8c5d","email":"abcd1234@gmail.com"}', '2023-02-24T19:57:41.849Z', '2023-02-24T19:57:41.849Z', '2023-02-24T19:57:41.849Z');


UPDATE "public"."profiles" SET 
 first_name = 'Abiola', 
 last_name = 'Bakare', 
 username = 'iamstarcode'
WHERE 
 id = 'd9c444f1-4e91-4abb-b4c7-1d18318990e9';

 UPDATE "public"."profiles" SET 
 first_name = 'Ijapa', 
 last_name = 'Tiroko', 
 username = 'ijapa'
WHERE 
 id = '9a52c713-0e87-4ece-b810-9a96952f8c5d';

INSERT INTO public.products (user_id, name, description, images, editable , price)
 VALUES (
 'd9c444f1-4e91-4abb-b4c7-1d18318990e9', 
 'iPhone X 64 gb ', 
 'Broke back iPhone X Color black', 
 '{"products/d9c444f1-4e91-4abb-b4c7-1d18318990e9/RYVGF3gOxNjHh5gHgyNP"}',
 true, 
 '125000');

 