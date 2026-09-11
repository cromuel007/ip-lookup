-- CreateTable
CREATE TABLE "IpLookup" (
    "id" SERIAL NOT NULL,
    "ip" TEXT NOT NULL,
    "country" TEXT,
    "countryName" TEXT,
    "region" TEXT,
    "city" TEXT,
    "timezone" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IpLookup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IpLookup_ip_idx" ON "IpLookup"("ip");

-- CreateIndex
CREATE INDEX "IpLookup_createdAt_idx" ON "IpLookup"("createdAt");
