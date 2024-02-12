-- CreateTable
CREATE TABLE "Job" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HiredEmployee" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "hire" TIMESTAMP(3) NOT NULL,
    "departmentId" INTEGER,
    "jobId" INTEGER,

    CONSTRAINT "HiredEmployee_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HiredEmployee" ADD CONSTRAINT "HiredEmployee_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HiredEmployee" ADD CONSTRAINT "HiredEmployee_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
