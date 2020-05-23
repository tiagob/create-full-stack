CREATE TABLE "public"."todos"("id" serial NOT NULL, "name" text NOT NULL, "complete" boolean NOT NULL DEFAULT false, PRIMARY KEY ("id") , UNIQUE ("id"));
