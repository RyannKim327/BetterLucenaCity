CREATE TYPE "user_type" AS ENUM (
  'Head Maintainer',
  'Maintainer',
  'Data Collaborator',
  'Data Validator',
  'Tester'
);

CREATE TABLE "users" (
  "id" uuid PRIMARY KEY,
  "email" varchar UNIQUE NOT NULL,
  "first_name" varchar,
  "last_name" varchar,
  "username" varchar UNIQUE NOT NULL,
  "avatar_url" text,
  "user_type" user_type,
  "date_added" timestamptz DEFAULT (now())
);

