import { Student } from "@/models";
import { z } from "zod";
import { AppError, asyncHandler } from "@/middlewares";
import { ResponseHandler } from "@/utils";
import { Request, Response, NextFunction } from "express";

const studentSchema = z.object({
  userName: z.string().min(1, "Username is required"),
  dob: z.string().min(1, "Date of birth is required"),
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  phoneNo: z.string().min(1, "Phone Number is required"),
  gender: z.string().min(1, "Gender is required"),
  userId: z.string().optional(),
});

const updateStudentSchema = studentSchema.partial();

type createStudentDTO = z.infer<typeof studentSchema>;

const create = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user?.id;
    const studentData: createStudentDTO = studentSchema.parse(req.body);
    studentData.userId = userId;
    const newStudent = await Student.createStudent(studentData);
    if (!newStudent) throw new AppError("Failed to create student", 500, true);
    ResponseHandler.success(
      res,
      "Student created successfully",
      { newStudent },
      201,
    );
  },
);

const update = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const studentData = updateStudentSchema.parse(req.body);
    const student = await Student.findById(id);
    if (!student) {
      throw new AppError("Student not found", 404, true);
    }
    await student.update(studentData);
    ResponseHandler.success(res, "Student updated successfully", {}, 200);
  },
);

const deleteStudent = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      throw new AppError("Student not found", 404, true);
    }
    await student.destroy();
    ResponseHandler.success(res, "Student deleted successfully", {}, 200);
  },
);

const get = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      throw new AppError("Student not found", 404, true);
    }
    ResponseHandler.success(
      res,
      "Student fetched successfully",
      { student },
      200,
    );
  },
);

const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const students = await Student.findAll();
  if (!students || students.length === 0) {
    throw new AppError("No students found", 404, true);
  }
  ResponseHandler.success(
    res,
    "Students fetched successfully",
    { students },
    200,
  );
});

export default {
  create,
  update,
  deleteStudent,
  get,
  getAll,
};
