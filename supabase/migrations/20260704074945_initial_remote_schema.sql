


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."app_role" AS ENUM (
    'user',
    'secondary_admin',
    'main_admin',
    'owner'
);


ALTER TYPE "public"."app_role" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."app_role_rank"("role" "public"."app_role") RETURNS integer
    LANGUAGE "sql" IMMUTABLE
    AS $$
  select case role
    when 'user' then 10
    when 'secondary_admin' then 20
    when 'main_admin' then 30
    when 'owner' then 40
  end;
$$;


ALTER FUNCTION "public"."app_role_rank"("role" "public"."app_role") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."current_app_role"() RETURNS "public"."app_role"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select user_profile.role
  from public.user_profile
  where user_profile.id = auth.uid()
    and user_profile.active = true
  limit 1;
$$;


ALTER FUNCTION "public"."current_app_role"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."current_user_has_role"("required_role" "public"."app_role") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select coalesce(
    public.app_role_rank(public.current_app_role())
      >= public.app_role_rank(required_role),
    false
  );
$$;


ALTER FUNCTION "public"."current_user_has_role"("required_role" "public"."app_role") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_technician_skills"("p_technician_id" "uuid", "p_added_skills" "jsonb" DEFAULT '[]'::"jsonb", "p_removed_skill_ids" "uuid"[] DEFAULT '{}'::"uuid"[]) RETURNS "void"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
begin
  delete from public.technician_skill_set
  where technician_id = p_technician_id
    and id = any(coalesce(p_removed_skill_ids, '{}'::uuid[]));

  insert into public.technician_skill_set (
    technician_id,
    unit_id,
    commercial,
    brand_group_id,
    specific_issue_id
  )
  select
    p_technician_id,
    skill.unit_id,
    coalesce(skill.commercial, false),
    skill.brand_group_id,
    skill.specific_issue_id
  from jsonb_to_recordset(coalesce(p_added_skills, '[]'::jsonb)) as skill(
    unit_id uuid,
    commercial boolean,
    brand_group_id uuid,
    specific_issue_id uuid
  );
end;
$$;


ALTER FUNCTION "public"."update_technician_skills"("p_technician_id" "uuid", "p_added_skills" "jsonb", "p_removed_skill_ids" "uuid"[]) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."brand" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" DEFAULT ''::"text" NOT NULL,
    "group_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "active" boolean DEFAULT true NOT NULL,
    "slug" "text" DEFAULT ''::"text" NOT NULL
);


ALTER TABLE "public"."brand" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."brand_group" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" DEFAULT ''::"text" NOT NULL,
    "slug" "text" DEFAULT ''::"text" NOT NULL,
    "active" boolean DEFAULT true NOT NULL,
    "display_order" integer DEFAULT 999 NOT NULL
);


ALTER TABLE "public"."brand_group" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."service_zone" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "display_order" integer NOT NULL,
    "active" boolean DEFAULT true NOT NULL
);


ALTER TABLE "public"."service_zone" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."specific_issue" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" DEFAULT ''::"text" NOT NULL,
    "unit_id" "uuid" NOT NULL,
    "active" boolean DEFAULT true NOT NULL
);


ALTER TABLE "public"."specific_issue" OWNER TO "postgres";


COMMENT ON TABLE "public"."specific_issue" IS 'List of specific issues that are needed for ignore lists';



CREATE TABLE IF NOT EXISTS "public"."technician" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "active" boolean DEFAULT true NOT NULL,
    "name" "text" NOT NULL,
    "alias" "text" NOT NULL,
    "notes" "text",
    "can_service_built_in" boolean NOT NULL,
    "gas" boolean NOT NULL,
    "commercial" boolean NOT NULL,
    "can_service_stacked_washer" boolean NOT NULL,
    "can_service_stacked_dryer" boolean NOT NULL,
    "jobs_per_day" "text" DEFAULT ''::"text" NOT NULL,
    "home_zip_code" "text" DEFAULT ''::"text" NOT NULL
);


ALTER TABLE "public"."technician" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."technician_ignore_list" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "technician_id" "uuid" NOT NULL,
    "brand_id" "uuid",
    "unit_id" "uuid",
    "specific_issue_id" "uuid"
);


ALTER TABLE "public"."technician_ignore_list" OWNER TO "postgres";


COMMENT ON TABLE "public"."technician_ignore_list" IS 'List of services that technician can''t provide';



CREATE TABLE IF NOT EXISTS "public"."technician_service_zone" (
    "technician_id" "uuid" NOT NULL,
    "zone_id" "uuid" NOT NULL
);


ALTER TABLE "public"."technician_service_zone" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."technician_skill_set" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "technician_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "unit_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "brand_group_id" "uuid" DEFAULT "gen_random_uuid"(),
    "specific_issue_id" "uuid" DEFAULT "gen_random_uuid"(),
    "commercial" boolean DEFAULT false NOT NULL,
    CONSTRAINT "technician_skill_set_exactly_one_variant" CHECK ((((("commercial")::integer + (("brand_group_id" IS NOT NULL))::integer) + (("specific_issue_id" IS NOT NULL))::integer) = 1))
);


ALTER TABLE "public"."technician_skill_set" OWNER TO "postgres";


COMMENT ON TABLE "public"."technician_skill_set" IS 'Skills list of a technician';



CREATE TABLE IF NOT EXISTS "public"."unit" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" DEFAULT ''::"text" NOT NULL,
    "slug" "text" DEFAULT ''::"text" NOT NULL,
    "is_built_in" boolean DEFAULT false NOT NULL,
    "can_be_stacked" boolean DEFAULT false NOT NULL,
    "can_be_commercial" boolean DEFAULT false NOT NULL,
    "active" boolean DEFAULT true NOT NULL,
    "display_order" integer DEFAULT 999 NOT NULL,
    "can_be_gas" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."unit" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_profile" (
    "id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "full_name" "text",
    "role" "public"."app_role" DEFAULT 'user'::"public"."app_role" NOT NULL,
    "active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "alias" "text"
);


ALTER TABLE "public"."user_profile" OWNER TO "postgres";


ALTER TABLE ONLY "public"."brand_group"
    ADD CONSTRAINT "brand_group_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."brand_group"
    ADD CONSTRAINT "brand_group_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."brand_group"
    ADD CONSTRAINT "brand_group_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."brand"
    ADD CONSTRAINT "brand_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."brand"
    ADD CONSTRAINT "brand_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."brand"
    ADD CONSTRAINT "brand_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."service_zone"
    ADD CONSTRAINT "service_zone_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."service_zone"
    ADD CONSTRAINT "service_zone_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."service_zone"
    ADD CONSTRAINT "service_zone_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."specific_issue"
    ADD CONSTRAINT "specific_issue_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."specific_issue"
    ADD CONSTRAINT "specific_issue_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."specific_issue"
    ADD CONSTRAINT "specific_issue_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."technician_ignore_list"
    ADD CONSTRAINT "technician_ignore_list_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."technician"
    ADD CONSTRAINT "technician_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."technician"
    ADD CONSTRAINT "technician_name_unique" UNIQUE ("name");



ALTER TABLE ONLY "public"."technician"
    ADD CONSTRAINT "technician_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."technician_service_zone"
    ADD CONSTRAINT "technician_service_zone_pkey" PRIMARY KEY ("technician_id", "zone_id");



ALTER TABLE ONLY "public"."technician_skill_set"
    ADD CONSTRAINT "technician_skill_set_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."unit"
    ADD CONSTRAINT "unit_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."unit"
    ADD CONSTRAINT "unit_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."unit"
    ADD CONSTRAINT "unit_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."user_profile"
    ADD CONSTRAINT "user_profile_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."user_profile"
    ADD CONSTRAINT "user_profile_pkey" PRIMARY KEY ("id");



CREATE INDEX "service_zone_slug_idx" ON "public"."service_zone" USING "btree" ("slug");



CREATE INDEX "technician_service_zone_technician_id_idx" ON "public"."technician_service_zone" USING "btree" ("technician_id");



CREATE INDEX "technician_service_zone_zone_id_idx" ON "public"."technician_service_zone" USING "btree" ("zone_id");



CREATE UNIQUE INDEX "technician_skill_set_unique_brand_group_variant" ON "public"."technician_skill_set" USING "btree" ("technician_id", "unit_id", "brand_group_id") WHERE (("brand_group_id" IS NOT NULL) AND ("specific_issue_id" IS NULL) AND ("commercial" = false));



CREATE UNIQUE INDEX "technician_skill_set_unique_commercial_variant" ON "public"."technician_skill_set" USING "btree" ("technician_id", "unit_id") WHERE (("commercial" = true) AND ("brand_group_id" IS NULL) AND ("specific_issue_id" IS NULL));



CREATE UNIQUE INDEX "technician_skill_set_unique_specific_issue_variant" ON "public"."technician_skill_set" USING "btree" ("technician_id", "unit_id", "specific_issue_id") WHERE (("specific_issue_id" IS NOT NULL) AND ("brand_group_id" IS NULL) AND ("commercial" = false));



CREATE UNIQUE INDEX "unique_brand_group_skill" ON "public"."technician_skill_set" USING "btree" ("technician_id", "unit_id", "brand_group_id") WHERE ("brand_group_id" IS NOT NULL);



CREATE UNIQUE INDEX "unique_commercial_skill" ON "public"."technician_skill_set" USING "btree" ("technician_id", "unit_id") WHERE ("commercial" = true);



CREATE UNIQUE INDEX "unique_specific_issue_skill" ON "public"."technician_skill_set" USING "btree" ("technician_id", "unit_id", "specific_issue_id") WHERE ("specific_issue_id" IS NOT NULL);



CREATE OR REPLACE TRIGGER "set_user_profile_updated_at" BEFORE UPDATE ON "public"."user_profile" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



ALTER TABLE ONLY "public"."brand"
    ADD CONSTRAINT "brand_groupId_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."brand_group"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."specific_issue"
    ADD CONSTRAINT "specific_issue_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "public"."unit"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."technician_ignore_list"
    ADD CONSTRAINT "technician_ignore_list_brandId_fkey" FOREIGN KEY ("brand_id") REFERENCES "public"."brand"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."technician_ignore_list"
    ADD CONSTRAINT "technician_ignore_list_specific_issue_id_fkey" FOREIGN KEY ("specific_issue_id") REFERENCES "public"."specific_issue"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."technician_ignore_list"
    ADD CONSTRAINT "technician_ignore_list_technician_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "public"."technician"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."technician_ignore_list"
    ADD CONSTRAINT "technician_ignore_list_unitId_fkey" FOREIGN KEY ("unit_id") REFERENCES "public"."unit"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."technician_service_zone"
    ADD CONSTRAINT "technician_service_zone_technician_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "public"."technician"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."technician_service_zone"
    ADD CONSTRAINT "technician_service_zone_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "public"."service_zone"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."technician_skill_set"
    ADD CONSTRAINT "technician_skill_set_brandGroupId_fkey" FOREIGN KEY ("brand_group_id") REFERENCES "public"."brand_group"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."technician_skill_set"
    ADD CONSTRAINT "technician_skill_set_brand_group_id_fkey" FOREIGN KEY ("brand_group_id") REFERENCES "public"."brand_group"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."technician_skill_set"
    ADD CONSTRAINT "technician_skill_set_specificIssueId_fkey" FOREIGN KEY ("specific_issue_id") REFERENCES "public"."specific_issue"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."technician_skill_set"
    ADD CONSTRAINT "technician_skill_set_specific_issue_id_fkey" FOREIGN KEY ("specific_issue_id") REFERENCES "public"."specific_issue"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."technician_skill_set"
    ADD CONSTRAINT "technician_skill_set_technician_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "public"."technician"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."technician_skill_set"
    ADD CONSTRAINT "technician_skill_set_unitId_fkey" FOREIGN KEY ("unit_id") REFERENCES "public"."unit"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."technician_skill_set"
    ADD CONSTRAINT "technician_skill_set_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "public"."unit"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_profile"
    ADD CONSTRAINT "user_profile_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Active admins can delete technician service zones" ON "public"."technician_service_zone" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user_profile" "up"
  WHERE (("up"."id" = ( SELECT "auth"."uid"() AS "uid")) AND "up"."active" AND ("up"."role" = ANY (ARRAY['secondary_admin'::"public"."app_role", 'main_admin'::"public"."app_role", 'owner'::"public"."app_role"]))))));



CREATE POLICY "Active admins can delete technician skills" ON "public"."technician_skill_set" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user_profile" "up"
  WHERE (("up"."id" = "auth"."uid"()) AND ("up"."active" = true) AND ("up"."role" = ANY (ARRAY['secondary_admin'::"public"."app_role", 'main_admin'::"public"."app_role", 'owner'::"public"."app_role"]))))));



CREATE POLICY "Active admins can insert technician service zones" ON "public"."technician_service_zone" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profile" "up"
  WHERE (("up"."id" = ( SELECT "auth"."uid"() AS "uid")) AND "up"."active" AND ("up"."role" = ANY (ARRAY['secondary_admin'::"public"."app_role", 'main_admin'::"public"."app_role", 'owner'::"public"."app_role"]))))));



CREATE POLICY "Active admins can insert technician skills" ON "public"."technician_skill_set" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profile" "up"
  WHERE (("up"."id" = "auth"."uid"()) AND ("up"."active" = true) AND ("up"."role" = ANY (ARRAY['secondary_admin'::"public"."app_role", 'main_admin'::"public"."app_role", 'owner'::"public"."app_role"]))))));



CREATE POLICY "Active admins can update technicians" ON "public"."technician" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."user_profile" "up"
  WHERE (("up"."id" = "auth"."uid"()) AND ("up"."active" = true) AND ("up"."role" = ANY (ARRAY['secondary_admin'::"public"."app_role", 'main_admin'::"public"."app_role", 'owner'::"public"."app_role"])))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profile" "up"
  WHERE (("up"."id" = "auth"."uid"()) AND ("up"."active" = true) AND ("up"."role" = ANY (ARRAY['secondary_admin'::"public"."app_role", 'main_admin'::"public"."app_role", 'owner'::"public"."app_role"]))))));



CREATE POLICY "Authenticated users can read brand" ON "public"."brand" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can read brand_group" ON "public"."brand_group" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can read own profile" ON "public"."user_profile" FOR SELECT TO "authenticated" USING (("id" = "auth"."uid"()));



CREATE POLICY "Authenticated users can read service_zone" ON "public"."service_zone" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can read specific_issue" ON "public"."specific_issue" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can read technician" ON "public"."technician" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can read technician_ignore_list" ON "public"."technician_ignore_list" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can read technician_service_zone" ON "public"."technician_service_zone" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can read technician_skill_set" ON "public"."technician_skill_set" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can read unit" ON "public"."unit" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Main admins can read all profiles" ON "public"."user_profile" FOR SELECT TO "authenticated" USING ("public"."current_user_has_role"('main_admin'::"public"."app_role"));



ALTER TABLE "public"."brand" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."brand_group" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."service_zone" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."specific_issue" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."technician" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."technician_ignore_list" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."technician_service_zone" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."technician_skill_set" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."unit" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_profile" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






















































































































































GRANT ALL ON FUNCTION "public"."app_role_rank"("role" "public"."app_role") TO "anon";
GRANT ALL ON FUNCTION "public"."app_role_rank"("role" "public"."app_role") TO "authenticated";
GRANT ALL ON FUNCTION "public"."app_role_rank"("role" "public"."app_role") TO "service_role";



GRANT ALL ON FUNCTION "public"."current_app_role"() TO "anon";
GRANT ALL ON FUNCTION "public"."current_app_role"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."current_app_role"() TO "service_role";



GRANT ALL ON FUNCTION "public"."current_user_has_role"("required_role" "public"."app_role") TO "anon";
GRANT ALL ON FUNCTION "public"."current_user_has_role"("required_role" "public"."app_role") TO "authenticated";
GRANT ALL ON FUNCTION "public"."current_user_has_role"("required_role" "public"."app_role") TO "service_role";



GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."update_technician_skills"("p_technician_id" "uuid", "p_added_skills" "jsonb", "p_removed_skill_ids" "uuid"[]) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."update_technician_skills"("p_technician_id" "uuid", "p_added_skills" "jsonb", "p_removed_skill_ids" "uuid"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_technician_skills"("p_technician_id" "uuid", "p_added_skills" "jsonb", "p_removed_skill_ids" "uuid"[]) TO "service_role";


















GRANT ALL ON TABLE "public"."brand" TO "anon";
GRANT ALL ON TABLE "public"."brand" TO "authenticated";
GRANT ALL ON TABLE "public"."brand" TO "service_role";



GRANT ALL ON TABLE "public"."brand_group" TO "anon";
GRANT ALL ON TABLE "public"."brand_group" TO "authenticated";
GRANT ALL ON TABLE "public"."brand_group" TO "service_role";



GRANT ALL ON TABLE "public"."service_zone" TO "anon";
GRANT ALL ON TABLE "public"."service_zone" TO "authenticated";
GRANT ALL ON TABLE "public"."service_zone" TO "service_role";



GRANT ALL ON TABLE "public"."specific_issue" TO "anon";
GRANT ALL ON TABLE "public"."specific_issue" TO "authenticated";
GRANT ALL ON TABLE "public"."specific_issue" TO "service_role";



GRANT ALL ON TABLE "public"."technician" TO "anon";
GRANT ALL ON TABLE "public"."technician" TO "authenticated";
GRANT ALL ON TABLE "public"."technician" TO "service_role";



GRANT ALL ON TABLE "public"."technician_ignore_list" TO "anon";
GRANT ALL ON TABLE "public"."technician_ignore_list" TO "authenticated";
GRANT ALL ON TABLE "public"."technician_ignore_list" TO "service_role";



GRANT ALL ON TABLE "public"."technician_service_zone" TO "anon";
GRANT ALL ON TABLE "public"."technician_service_zone" TO "authenticated";
GRANT ALL ON TABLE "public"."technician_service_zone" TO "service_role";



GRANT ALL ON TABLE "public"."technician_skill_set" TO "anon";
GRANT ALL ON TABLE "public"."technician_skill_set" TO "authenticated";
GRANT ALL ON TABLE "public"."technician_skill_set" TO "service_role";



GRANT ALL ON TABLE "public"."unit" TO "anon";
GRANT ALL ON TABLE "public"."unit" TO "authenticated";
GRANT ALL ON TABLE "public"."unit" TO "service_role";



GRANT ALL ON TABLE "public"."user_profile" TO "anon";
GRANT ALL ON TABLE "public"."user_profile" TO "authenticated";
GRANT ALL ON TABLE "public"."user_profile" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";


