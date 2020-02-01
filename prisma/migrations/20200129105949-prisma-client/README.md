# Migration `20200129105949-prisma-client`

This migration has been generated at 1/29/2020, 10:59:49 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."ActiveEntry" (
    "author" text  NOT NULL DEFAULT '',
    "description" text  NOT NULL DEFAULT '',
    "id" text  NOT NULL ,
    "project" text  NOT NULL ,
    "sector" text  NOT NULL ,
    "start" timestamp(3)  NOT NULL DEFAULT '1970-01-01 00:00:00',
    PRIMARY KEY ("id")
) 

ALTER TABLE "public"."Entry" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
DROP COLUMN "end",
ADD COLUMN "end" timestamp(3)  NOT NULL DEFAULT '1970-01-01 00:00:00';

CREATE UNIQUE INDEX "ActiveEntry.author" ON "public"."ActiveEntry"("author")

ALTER TABLE "public"."ActiveEntry" ADD FOREIGN KEY ("sector") REFERENCES "public"."Sector"("id") ON DELETE RESTRICT

ALTER TABLE "public"."ActiveEntry" ADD FOREIGN KEY ("project") REFERENCES "public"."Project"("id") ON DELETE RESTRICT
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200105161347-initial..20200129105949-prisma-client
--- datamodel.dml
+++ datamodel.dml
@@ -1,20 +1,27 @@
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url      = env("POSTGRESQL_URL")
 }
 generator photon {
-  provider = "photonjs"
+  provider = "prisma-client-js"
 }
+model ActiveEntry {
+  id String @default(cuid()) @id
+  author String @unique
+  start DateTime @default(now())
+  description String
+  sector Sector
+  project Project
+}
+
 model Entry {
   id String @default(cuid()) @id
   author String
-  createdAt DateTime @default(now())
-  updatedAt DateTime @updatedAt
-  start DateTime @default(now())
-  end DateTime?
+  start DateTime
+  end DateTime
   description String
   sector Sector
   project Project
 }
```


