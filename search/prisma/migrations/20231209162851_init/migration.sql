-- CreateTable
CREATE TABLE "history" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "search" TEXT NOT NULL,

    CONSTRAINT "history_pkey" PRIMARY KEY ("id")
);
