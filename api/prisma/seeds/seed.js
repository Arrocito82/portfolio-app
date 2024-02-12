import { PrismaClient } from '@prisma/client';
import jobs from './jobs.json' with {type: 'json'};
import departments from './departments.json' with {type: 'json'};
import hiredEmployees from './hiredEmployees.json' with {type: 'json'};
const prisma = new PrismaClient();

async function main() {
  const jobsRecords = await prisma.job.createMany({
    data: jobs.data
  });
  const departmentsRecords = await prisma.department.createMany({
    data: departments.data
  });
  const hiredEmployeesRecords = await prisma.hiredEmployee.createMany({
    data: hiredEmployees.data
  });
  console.log({ jobsRecords, departmentsRecords, hiredEmployeesRecords});
};
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });