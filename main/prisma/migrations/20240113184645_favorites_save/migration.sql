/*
  Warnings:

  - You are about to drop the column `favorites` on the `post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "country" ALTER COLUMN "created" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "likes" ALTER COLUMN "created" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "post" DROP COLUMN "favorites",
ALTER COLUMN "file" SET DEFAULT NULL,
ALTER COLUMN "created" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "video_id" SET DEFAULT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "created" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "video" ALTER COLUMN "v1080p" SET DEFAULT NULL,
ALTER COLUMN "v720p" SET DEFAULT NULL,
ALTER COLUMN "v480p" SET DEFAULT NULL,
ALTER COLUMN "v144p" SET DEFAULT NULL;

-- CreateTable
CREATE TABLE "favorite" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,
    "created" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorite_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
