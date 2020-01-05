# Migration `20200105161347-initial`

This migration has been generated at 1/5/2020, 4:13:47 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."Entry" (
  "author" text  NOT NULL DEFAULT '' ,
  "createdAt" timestamp(3)  NOT NULL DEFAULT '1970-01-01 00:00:00' ,
  "description" text  NOT NULL DEFAULT '' ,
  "end" timestamp(3)    ,
  "id" text  NOT NULL  ,
  "start" timestamp(3)  NOT NULL DEFAULT '1970-01-01 00:00:00' ,
  "updatedAt" timestamp(3)  NOT NULL DEFAULT '1970-01-01 00:00:00' ,
  PRIMARY KEY ("id")
);

CREATE TABLE "public"."Sector" (
  "author" text  NOT NULL DEFAULT '' ,
  "id" text  NOT NULL  ,
  "name" text  NOT NULL DEFAULT '' ,
  PRIMARY KEY ("id")
);

CREATE TABLE "public"."Project" (
  "author" text  NOT NULL DEFAULT '' ,
  "id" text  NOT NULL  ,
  "name" text  NOT NULL DEFAULT '' ,
  PRIMARY KEY ("id")
);

ALTER TABLE "public"."Entry" ADD COLUMN "project" text  NOT NULL  REFERENCES "public"."Project"("id") ON DELETE RESTRICT,
ADD COLUMN "sector" text  NOT NULL  REFERENCES "public"."Sector"("id") ON DELETE RESTRICT;

CREATE UNIQUE INDEX "Sector.author_name" ON "public"."Sector"("author","name")

CREATE UNIQUE INDEX "Project.author_name" ON "public"."Project"("author","name")
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200105161347-initial
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,34 @@
+datasource db {
+  provider = "postgresql"
+  url      = env("POSTGRESQL_URL")
+}
+
+generator photon {
+  provider = "photonjs"
+}
+
+model Entry {
+  id String @default(cuid()) @id
+  author String
+  createdAt DateTime @default(now())
+  updatedAt DateTime @updatedAt
+  start DateTime @default(now())
+  end DateTime?
+  description String
+  sector Sector
+  project Project
+}
+
+model Sector {
+  id String @default(cuid()) @id
+  author String
+  name String
+  @@unique([author, name])
+}
+
+model Project {
+  id String @default(cuid()) @id
+  author String
+  name String
+  @@unique([author, name])
+}
```


