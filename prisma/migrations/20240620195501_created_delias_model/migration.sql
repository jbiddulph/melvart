-- CreateTable
CREATE TABLE "Delias" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "size" TEXT,
    "category" TEXT,
    "file" TEXT,
    "artistNotes" TEXT,
    "price" INTEGER,
    "isfeatured" INTEGER NOT NULL DEFAULT 0,
    "islive" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Delias_pkey" PRIMARY KEY ("id")
);
