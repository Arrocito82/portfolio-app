import { PrismaClient, Prisma } from '@prisma/client';
import { errorHandler, exists } from './error_handler.js';
const prisma = new PrismaClient();
import moment from 'moment';

const validateManyHiredEmployees = async (req, res) => {
  const requiredFields = ['id', 'name', 'hire', 'departmentId', 'jobId'];
  const hiredEmployees = req.body;
  // Validación de datos
  let invalidData = [], validData = [];
  const jobsIds = await prisma.job.findMany({
    select: { id: true },
    orderBy: {
      id: 'desc',
    },
  });
  const departmentsIds = await prisma.department.findMany({
    select: { id: true },
    orderBy: {
      id: 'desc',
    },
  });
  const hiredEmployeeIds = await prisma.hiredEmployee.findMany({
    select: { id: true },
    orderBy: {
      id: 'desc',
    },
  });
  // console.log(jobsIds);
  // console.log(departmentsIds);
  await hiredEmployees.forEach((hiredEmployee) => {
    let currentErrors = {};
    let parsedHiredDate = new Date(hiredEmployee.hire);
    if (isNaN(parsedHiredDate)) {
       currentErrors['hire'] = `Invalid date format`;
    }
    requiredFields.forEach((field) => {
      if (!hiredEmployee[field]) {
        currentErrors[field] = `${field} is required`;
      }
    });
    let jobExists = exists(parseInt(hiredEmployee.jobId), jobsIds);
    let departmentExists = exists(parseInt(hiredEmployee.departmentId), departmentsIds);
    let hiredEmployeeAlreadyExists = exists(parseInt(hiredEmployee.id), hiredEmployeeIds);
    // console.log(jobExists);
    // console.log(departmentExists);
    // console.log(hiredEmployeeAlreadyExists);
    if (hiredEmployee.jobId && !jobExists) {
      currentErrors['jobId'] = `Job ID: ${hiredEmployee.jobId} not found`;
    }
    if (hiredEmployee.departmentId && !departmentExists) {
      currentErrors['departmentId'] = `Department ID: ${hiredEmployee.departmentId} not found`;
    }
    if (hiredEmployee.id && hiredEmployeeAlreadyExists) {
      currentErrors['id'] = `Hired Employee ID: ${hiredEmployee.id} already exists`;
    }
    // console.log(currentErrors);
    if (Object.keys(currentErrors).length > 0) {
      invalidData.push({ ...hiredEmployee, errors: currentErrors });
    } else {
      validData.push(hiredEmployee);
    }
    // console.log('Not quite yet');
    // console.log(invalidData);
    // console.log(validData);
  });
  // console.log('Final');
  // console.log(invalidData);
  // console.log(validData);
  return res.json({ invalidData: invalidData, validData: validData });

};
const createManyHiredEmployees = async (req, res) => {
  const hiredEmployees = req.body;
  const requiredFields = ['id', 'name', 'hire', 'departmentId', 'jobId'];
  // Validación de datos
  let invalidData = [], validData = [];
  const jobsIds = await prisma.job.findMany({
    select: { id: true },
    orderBy: {
      id: 'desc',
    },
  });
  const departmentsIds = await prisma.department.findMany({
    select: { id: true },
    orderBy: {
      id: 'desc',
    },
  });
  const hiredEmployeeIds = await prisma.hiredEmployee.findMany({
    select: { id: true },
    orderBy: {
      id: 'desc',
    },
  });
  // console.log(jobsIds);
  // console.log(departmentsIds);
  await hiredEmployees.forEach((hiredEmployee) => {
    let currentErrors = {};
    let parsedHiredDate = new Date(hiredEmployee.hire);
    if (isNaN(parsedHiredDate)) {
       currentErrors['hire'] = `Invalid date format`;
    }
    requiredFields.forEach((field) => {
      if (!hiredEmployee[field]) {
        currentErrors[field] = `${field} is required`;
      }
    });
    let jobExists = exists(parseInt(hiredEmployee.jobId), jobsIds);
    let departmentExists = exists(parseInt(hiredEmployee.departmentId), departmentsIds);
    let hiredEmployeeAlreadyExists = exists(parseInt(hiredEmployee.id), hiredEmployeeIds);
    // console.log(jobExists);
    // console.log(departmentExists);
    // console.log(hiredEmployeeAlreadyExists);
    if (hiredEmployee.jobId && !jobExists) {
      currentErrors['jobId'] = `Job ID: ${hiredEmployee.jobId} not found`;
    }
    if (hiredEmployee.departmentId && !departmentExists) {
      currentErrors['departmentId'] = `Department ID: ${hiredEmployee.departmentId} not found`;
    }
    if (hiredEmployee.id && hiredEmployeeAlreadyExists) {
      currentErrors['id'] = `Hired Employee ID: ${hiredEmployee.id} already exists`;
    }
    // console.log(currentErrors);
    if (Object.keys(currentErrors).length > 0) {
      invalidData.push({ ...hiredEmployee, errors: currentErrors });
    } else {
      validData.push(hiredEmployee);
    }
    // console.log('Not quite yet');
    // console.log(invalidData);
    // console.log(validData);
  });
  // console.log('Final');
  // console.log(invalidData);
  // console.log(validData);
  try {
    const createMany = await prisma.hiredEmployee.createMany({
      data:validData,
      skipDuplicates: true, // Skip 'Bobo'
    });
    return res.json({...createMany, invalidData: invalidData, validData: validData});
  } catch (e) {
    errorHandler(e, req, res);
  }
};
const createHiredEmployee = async (req, res) => {
  const { id, name, hire, departmentId, jobId } = req.body;
  const requiredFields = ['id', 'name', 'hire', 'departmentId', 'jobId'];
  let errors = [];
  let job = null, department = null, parsedHiredDate = null;
  requiredFields.forEach((field) => {
    if (!req.body[field]) {
      errors.push({ [field]: `${field} is required` });
    }
  });

  try {
    if (errors.length > 0) {
      return res.status(400).json({ errors: errors });
    }
    parsedHiredDate = new Date(hire);
    if (isNaN(parsedHiredDate)) {
      errors.push({ hire: `Invalid date format` });
    }
    job = await prisma.job.findUnique({
      where: { id: parseInt(jobId) }
    });
    department = await prisma.department.findUnique({
      where: { id: parseInt(departmentId) }
    });
    if (!job) {
      errors.push({ jobId: `Job ID: ${jobId} not found` });
    }
    if (!department) {
      errors.push({ departmentId: `Department ID: ${departmentId} not found` });
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors: errors });
    }

    const hiredEmployee = await prisma.hiredEmployee.create({
      data: {
        id: id,
        name: name,
        hire: hire,
        departmentId: departmentId,
        jobId: jobId,
      },
    });
    // hiredEmployee.hire = moment(hiredEmployee.hire).format('MMMM Do YYYY, h:mm:ss a');
    return res.json(hiredEmployee);
  } catch (e) {
    errorHandler(e, req, res);
  }
};

const getYears = async (req, res) => {
  try{

    const years = await prisma.$queryRaw(
      Prisma.sql`With "Preview"("year") as (SELECT extract(year from "HiredEmployee"."hire")::INTEGER as "year"
      FROM  "HiredEmployee") 
      select DISTINCT "year" from "Preview" ORDER BY "Preview"."year" ASC;`
      );
      // hiredEmployees.forEach((hiredEmployee) => hiredEmployee.hire = moment(hiredEmployee.hire).format('MMMM Do YYYY, h:mm:ss a'));
    }catch (e) {
      return res.json([]);
    }
};
const getHiredEmployees = async (req, res) => {
  const hiredEmployees = await prisma.hiredEmployee.findMany({
    select: {
      id: true,
      name: true,
      hire: true,
      department: true,
      job: true
    },
    orderBy:{id:'asc'}
  });
  // hiredEmployees.forEach((hiredEmployee) => hiredEmployee.hire = moment(hiredEmployee.hire).format('MMMM Do YYYY, h:mm:ss a'));
  return res.json({ data: hiredEmployees });
};


const getHiredEmployeeByID = async (req, res) => {
  const { id } = req.params;
  try {
    const hiredEmployee = await prisma.hiredEmployee.findUnique({
      where: { id: parseInt(id) },
      include: {
        department: true,
        job: true
      },
    });
    if (!hiredEmployee) {
      return res.status(400).json({ errors: [{ id: `ID ${id} not found` }] });
    }
    // hiredEmployee.hire = moment(hiredEmployee.hire).format('MMMM Do YYYY, h:mm:ss a');
    return res.json(hiredEmployee);
  } catch (e) {
    errorHandler(e, req, res);
  }
};
const updateHiredEmployeeByID = async (req, res) => {
  const { id } = req.params;
  const { name, hire, departmentId, jobId } = req.body;
  // console.log(req.body);
  let job = null, department = null;
  let errors = [];
  let data = {};
  const requiredFields = ['id', 'name', 'hire', 'departmentId', 'jobId'];
  requiredFields.forEach((field) => {
    if (req.body[field]) {
      data[field] = req.body[field];
    }
  });
  try {
    if (jobId) {
      job = await prisma.job.findUnique({
        where: { id: parseInt(jobId) }
      });
      if (!job) {
        errors.push({ jobId: `Job ID: ${jobId} not found` });
      }
    }
    if (departmentId) {
      department = await prisma.department.findUnique({
        where: { id: parseInt(departmentId) }
      });
      if (!department) {
        errors.push({ departmentId: `Department ID: ${departmentId} not found` });
      }
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors: errors });
    }
    const hiredEmployee = await prisma.hiredEmployee.update({
      where: { id: parseInt(id) },
      data: data,
    });
    // hiredEmployee.hire = moment(hiredEmployee.hire).format('MMMM Do YYYY, h:mm:ss a');
    return res.json(hiredEmployee);
  } catch (e) {
    errorHandler(e, req, res);
  }
};
const deleteHiredEmployeeByID = async (req, res) => {
  const { id } = req.params;
  try {
    const hiredEmployee = await prisma.hiredEmployee.delete({
      where: {
        id: parseInt(id)
      },
    });
    // hiredEmployee.hire = moment(hiredEmployee.hire).format('MMMM Do YYYY, h:mm:ss a');
    return res.json(hiredEmployee);
  } catch (e) {
    errorHandler(e, req, res);
  }
};
const getHiredEmployeesPerDepartmentForEachQuaterPerYear = async (req, res) => {
  const { year } = req.params;
  const result = await prisma.$queryRaw(
    Prisma.sql`SELECT "Department"."name" as "department", 
    "Job"."name"  as "job", 
    sum(
      CASE
        WHEN extract(quarter from "HiredEmployee"."hire")=1
      THEN 1
      ELSE
        0
      END
    )::INTEGER as "q1",
    sum(
      CASE
        WHEN extract(quarter from "HiredEmployee"."hire")=2
      THEN 1
      ELSE
        0
      END
    )::INTEGER as "q2",
    sum(
      CASE
        WHEN extract(quarter from "HiredEmployee"."hire")=3
      THEN 1
      ELSE
        0
      END
    )::INTEGER as "q3",
    sum(
      CASE
        WHEN extract(quarter from "HiredEmployee"."hire")=4
      THEN 1
      ELSE
        0
      END
    )::INTEGER as "q4"
    FROM  "HiredEmployee", "Department", "Job" 
    where "HiredEmployee"."departmentId" = "Department"."id" 
    and "HiredEmployee"."jobId" = "Job"."id"
    and extract(year from "HiredEmployee"."hire")=${year}::INTEGER
    GROUP BY "department", "job"	
    ORDER BY "department" ASC, "job" ASC ;`
  );
  return res.json(result);
};
const getHiredEmployeesPerDepartmentPerYearAboveAverage = async (req, res) => {
  const { year } = req.params;
  const result = await prisma.$queryRaw(
    Prisma.sql`
    with "hiredEmployeesPerDepartmentPerYear"("id", "department", "hired") as (
    SELECT "Department"."id", 
      "Department"."name",
      count("HiredEmployee"."departmentId")::INTEGER
      FROM  "Department", "HiredEmployee"
      where extract(year from "HiredEmployee"."hire")=${year}::INTEGER
      and "HiredEmployee"."departmentId" = "Department"."id"
      GROUP BY "Department"."id")
      SELECT *
      FROM "hiredEmployeesPerDepartmentPerYear"
      GROUP BY "hiredEmployeesPerDepartmentPerYear"."id", "hiredEmployeesPerDepartmentPerYear"."department","hiredEmployeesPerDepartmentPerYear"."hired"
      having "hired" > (select avg("hired") from "hiredEmployeesPerDepartmentPerYear")
      ORDER BY "hired" DESC
    ;`
  );
  return res.json(result);
};
export {
  createHiredEmployee,
  getHiredEmployees,
  getHiredEmployeeByID,
  updateHiredEmployeeByID,
  deleteHiredEmployeeByID,
  createManyHiredEmployees,
  validateManyHiredEmployees,
  getHiredEmployeesPerDepartmentForEachQuaterPerYear,
  getHiredEmployeesPerDepartmentPerYearAboveAverage,
  getYears
}