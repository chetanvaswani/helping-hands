-- AlterTable
ALTER TABLE "Otp" ALTER COLUMN "expiry" SET DEFAULT now() + interval '5 minutes';

-- CreateTable
CREATE TABLE "VisitorLocationLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "latitude" DECIMAL(10,7) NOT NULL,
    "longitude" DECIMAL(10,7) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VisitorLocationLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VisitorLocationLog" ADD CONSTRAINT "VisitorLocationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
