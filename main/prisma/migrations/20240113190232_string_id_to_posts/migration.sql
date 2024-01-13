/*
  Warnings:

  - The primary key for the `post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `video` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "favorite" DROP CONSTRAINT "favorite_post_id_fkey";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_post_id_fkey";

-- DropForeignKey
ALTER TABLE "post" DROP CONSTRAINT "post_video_id_fkey";

-- AlterTable
ALTER TABLE "country" ALTER COLUMN "created" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "favorite" ALTER COLUMN "post_id" SET DATA TYPE TEXT,
ALTER COLUMN "created" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "likes" ALTER COLUMN "post_id" SET DATA TYPE TEXT,
ALTER COLUMN "created" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "post" DROP CONSTRAINT "post_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "file" SET DEFAULT NULL,
ALTER COLUMN "created" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "video_id" SET DEFAULT NULL,
ALTER COLUMN "video_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "post_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "post_id_seq";

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "created" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "video" DROP CONSTRAINT "video_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "v1080p" SET DEFAULT NULL,
ALTER COLUMN "v720p" SET DEFAULT NULL,
ALTER COLUMN "v480p" SET DEFAULT NULL,
ALTER COLUMN "v144p" SET DEFAULT NULL,
ADD CONSTRAINT "video_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "video_id_seq";

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "video"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
