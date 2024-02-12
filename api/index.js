import express from 'express';
import { createJob, createManyJobs, deleteJobByID, getJobs, updateJobByID, getJobByID } from './controllers/jobs_controller.js';
import { createDepartment, 
  createManyDepartments, 
  deleteDepartmentByID, 
  getDepartments, 
  updateDepartmentByID, 
  getDepartmentByID } from './controllers/departments_controller.js';
import { createHiredEmployee, 
  createManyHiredEmployees, 
  deleteHiredEmployeeByID, 
  getHiredEmployees, 
  updateHiredEmployeeByID, 
  getHiredEmployeeByID, 
  validateManyHiredEmployees,
  getHiredEmployeesPerDepartmentForEachQuaterPerYear,
  getHiredEmployeesPerDepartmentPerYearAboveAverage, 
  getYears } from './controllers/hired_employees_controller.js';
import { PrismaClient, Prisma } from '@prisma/client';
const PORT=process.env.API_LOCAL_PORT;	
import cors from 'cors';
const corsOptions ={
   origin:process.env.CLIENT_ORIGIN, 
   credentials:false,//access-control-allow-credentials:true
   optionSuccessStatus:200,
}
const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors(corsOptions));
const apiRouter = express.Router();
app.use('/api', apiRouter);
// you need to set mergeParams: true on the router,
// if you want to access params from the parent router
const jobsRouter = express.Router({ mergeParams: true });
const departmentsRouter = express.Router({ mergeParams: true });
const hiredEmployeesRouter = express.Router({ mergeParams: true });
apiRouter.use('/jobs', jobsRouter);
apiRouter.use('/departments', departmentsRouter);
apiRouter.use('/hiredEmployees', hiredEmployeesRouter);
apiRouter.get('/years',getYears);
jobsRouter.route('/collection')
  .post(createManyJobs);
jobsRouter.route('/')
  .post(createJob)
  .get(getJobs);
jobsRouter.route('/:id')
  .get(getJobByID)
  .put(updateJobByID)
  .delete(deleteJobByID);
departmentsRouter.route('/collection')
  .post(createManyDepartments);
departmentsRouter.route('/')
  .post(createDepartment)
  .get(getDepartments);
departmentsRouter.route('/:id')
  .get(getDepartmentByID)
  .put(updateDepartmentByID)
  .delete(deleteDepartmentByID);
hiredEmployeesRouter.get('/:year/reporte1',getHiredEmployeesPerDepartmentForEachQuaterPerYear);
hiredEmployeesRouter.get('/:year/reporte2',getHiredEmployeesPerDepartmentPerYearAboveAverage);
hiredEmployeesRouter.route('/collection')
  .post(createManyHiredEmployees);
hiredEmployeesRouter.route('/collection/validate')
  .post(validateManyHiredEmployees);
hiredEmployeesRouter.route('/')
  .post(createHiredEmployee)
  .get(getHiredEmployees);
hiredEmployeesRouter.route('/:id')
  .get(getHiredEmployeeByID)
  .put(updateHiredEmployeeByID)
  .delete(deleteHiredEmployeeByID);
app.get('/', (req, res) => res.send(`Hello World! ${process.env.DATABASE_URL}`));
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
