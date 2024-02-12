import { PrismaClient, Prisma } from '@prisma/client';
import { errorHandler, exists } from './error_handler.js';
const prisma = new PrismaClient();

const createManyJobs=async (req, res) => {
  const jobs = req.body;
  const requiredFields = ['id', 'name'];
  // Validación de datos
  let invalidData = [], validData = [];
  const jobsIds = await prisma.job.findMany({
    select: { id: true },
    orderBy: {
      id: 'desc',
    },
  });
  
  await jobs.forEach((job) => {
    let currentErrors = {};
    requiredFields.forEach((field) => {
      if (!job[field]) {
        currentErrors[field] = `${field} is required`;
      }
    });
    let jobAlreadyExists = exists(parseInt(job.id), jobsIds);
    // console.log(jobAlreadyExists);
    if (job.id && jobAlreadyExists) {
      currentErrors['id'] = `Hired Employee ID: ${job.id} already exists`;
    }
    // console.log(currentErrors);
    if (Object.keys(currentErrors).length > 0) {
      invalidData.push({ ...job, errors: currentErrors });
    } else {
      validData.push(job);
    }
  // console.log(jobs);
  });

  try {
    const createMany = await prisma.job.createMany({
      data: validData,
      skipDuplicates: true, // Skip 'Bobo'
    });
    return res.json({...createMany, invalidData: invalidData, validData: validData});
  } catch (e) {
    errorHandler(e, req, res);
  }
};
const createJob = async (req, res) => {
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
    const job = await prisma.job.create({
      data: {
        id: id,
        name: name,
      },
    });
    return res.json(job);
  } catch (e) {
    errorHandler(e, req, res);
  }
};

const getJobs=async (req, res) => {
  const jobs = await prisma.job.findMany({
    // where: { id: id },
    // include: { departments: true },
    orderBy:{
      id: 'asc',
    },
  });
  return res.json({ data: jobs });
};


const getJobByID = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await prisma.job.findUnique({
      where: { id: parseInt(id) },
      include: { departments: true },
    });
    if(!job) {
      throw new Error(`ID ${id} not found`);
    }
    return res.json(job);
  } catch (e) {
    errorHandler(e, req, res);
  }
};
const updateJobByID =async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const job = await prisma.job.update({
      where: { id: parseInt(id) },
      data: { name: name },
    });
    return res.json(job);
  } catch (e) {
    errorHandler(e, req, res);
  }
};
const deleteJobByID = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await prisma.job.delete({
      where: {
        id: parseInt(id)
      },
    });
    return res.json(job);
  } catch (e) {
    errorHandler(e, req, res);
  }
};
export {
  createJob,
  getJobs,
  getJobByID,
  updateJobByID,
  deleteJobByID,
  createManyJobs,
}