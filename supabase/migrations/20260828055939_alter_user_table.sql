ALTER TABLE public.users
  ADD CONSTRAINT users_id_fkey
  FOREIGN KEY (id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;

ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all profiles" ON "users" FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON "users" FOR UPDATE USING (auth.uid() = id);
