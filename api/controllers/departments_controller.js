import { PrismaClient, Prisma } from '@prisma/client';
import { errorHandler, exists } from './error_handler.js';
const prisma = new PrismaClient();
const createManyDepartments=async (req, res) => {
  const departments = req.body;
  // console.log(departments);
  const requiredFields = ['id', 'name'];
  // Validación de datos
  let invalidData = [], validData = [];
  const departmentsIds = await prisma.department.findMany({
    select: { id: true },
    orderBy: {
      id: 'desc',
    },
  });
  
  await departments.forEach((department) => {
    let currentErrors = {};
    requiredFields.forEach((field) => {
      if (!department[field]) {
        currentErrors[field] = `${field} is required`;
      }
    });
    let departmentAlreadyExists = exists(parseInt(department.id), departmentsIds);
    // console.log(departmentAlreadyExists);
    if (department.id && departmentAlreadyExists) {
      currentErrors['id'] = `Hired Employee ID: ${department.id} already exists`;
    }
    // console.log(currentErrors);
    if (Object.keys(currentErrors).length > 0) {
      invalidData.push({ ...department, errors: currentErrors });
    } else {
      validData.push(department);
    }
  // console.log(departments);
  });
  try {
    const createMany = await prisma.department.createMany({
      data: validData,
      skipDuplicates: true, // Skip 'Bobo'
    });
    return res.json({...createMany, invalidData: invalidData, validData: validData});
  } catch (e) {
    errorHandler(e, req, res);
  }
};
const createDepartment = async (req, res) => {
  const { id, name } = req.body;
  const requiredFields = ['id', 'name'];
  let errors = [];
  requiredFields.forEach((field) => {
    if (!req.body[field]) {
      errors.push({ [field]: `${field} is required` });
    }
  });
  if (errors.length > 0) {
    return res.status(400).json({ errors: errors });
  }
  try {
    const department = await prisma.department.create({
      data: {
        id: id,
        name: name,
      },
    });
    return res.json(department);
  } catch (e) {
    errorHandler(e, req, res);
  }
};

const getDepartments=async (req, res) => {
  const departments = await prisma.department.findMany({
    // where: { id: id },
    // include: { departments: true },
    orderBy: {
      id: 'asc',
    },
  });
  return res.json({ data: departments });
};


const getDepartmentByID = async (req, res) => {
  const { id } = req.params;
  try {
    const department = await prisma.department.findUnique({
      where: { id: parseInt(id) }
    });
    if(!department) {
      throw new Error(`ID ${id} not found`);
    }
    return res.json(department);
  } catch (e) {
    errorHandler(e, req, res);
  }
};
const updateDepartmentByID =async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const department = await prisma.department.update({
      where: { id: parseInt(id) },
      data: { name: name },
    });
    return res.json(department);
  } catch (e) {
    errorHandler(e, req, res);
  }
};
const deleteDepartmentByID = async (req, res) => {
  const { id } = req.params;
  try {
    const department = await prisma.department.delete({
      where: {
        id: parseInt(id)
      },
    });
    return res.json(department);
  } catch (e) {
    errorHandler(e, req, res);
  }
};

export {
  createDepartment,
  getDepartments,
  getDepartmentByID,
  updateDepartmentByID,
  deleteDepartmentByID,
  createManyDepartments
}
