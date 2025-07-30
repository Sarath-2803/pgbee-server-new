import type { Request, Response } from "express";
import { Hostel, User } from "@/models";
import { z } from "zod";
import { AppError, asyncHandler } from "@/middlewares";
import { ResponseHandler } from "@/utils";

// Define authenticated user interface
interface AuthenticatedUser {
  id: string;
  email: string;
}

// Extend Express Request interface
declare module "express-serve-static-core" {
  interface Request {
    user?: AuthenticatedUser;
  }
}

const hostelSchema = z.object({
  hostelName: z.string().min(1, "Hostel name is required"),
  phone: z.string().min(10, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  curfew: z.boolean(),
  description: z.string().optional(),
  distance: z.number().min(0, "Distance must be a positive number"),
  location: z.string().min(1, "Location is required"),
  rent: z.number().min(0, "Rent must be a positive number"),
  gender: z.string().min(1, "Gender is required"),
  files: z.string().optional(),
  bedrooms: z.number().min(1, "At least one bedroom is required"),
  bathrooms: z.number().min(1, "At least one bathroom is required"),
});
const updateHostelSchema = hostelSchema.partial();

type createHostelDTO = z.infer<typeof hostelSchema>;

const regHostel = asyncHandler(async (req: Request, res: Response) => {
  const hostelData: createHostelDTO = hostelSchema.parse(req.body);
  const newHostel = await Hostel.createHostel(hostelData);
  if (!newHostel) throw new AppError("Failed to create hostel", 500, true);
  await newHostel.setUser(req.user?.id as string);
  ResponseHandler.success(res, "Hostel created successfully", {}, 201);
});

const getHostelById = asyncHandler(async (req: Request, res: Response) => {
  const hostelId = req.params.id;
  const hostel = await Hostel.findById(hostelId);
  if (!hostel) {
    throw new AppError("Hostel not found", 404, true);
  }
  ResponseHandler.success(res, "Hostel fetched successfully", { hostel }, 200);
});

const getAllHostelsStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const hostels = await Hostel.findAll();
    if (!hostels || hostels.length === 0) {
      throw new AppError("No hostels found", 404, true);
    }
    ResponseHandler.success(
      res,
      "Hostels fetched successfully",
      { hostels },
      200,
    );
  },
);

const getAllHostelsOwner = asyncHandler(async (req: Request, res: Response) => {
  const userId: string = (req.user as User)?.id;

  if (!userId) {
    throw new AppError("User not authenticated", 401, true);
  }

  const hostels = await Hostel.findAll({
    where: { userId: userId },
  });
  if (!hostels || hostels.length === 0) {
    throw new AppError("No hostels found for this user", 404, true);
  }

  ResponseHandler.success(
    res,
    "Hostels fetched successfully",
    { hostels },
    200,
  );
});

const updateHostel = asyncHandler(async (req: Request, res: Response) => {
  const userid: string = (req.user as User)?.id;
  if (!userid) {
    throw new AppError("User not authenticated", 401, true);
  }

  const hostelId = req.params.id;
  if (!hostelId) {
    throw new AppError("Hostel ID is required", 400, true);
  }
  const hostelData = updateHostelSchema.parse(req.body);
  const hostel = await Hostel.findById(hostelId);
  if (!hostel) {
    throw new AppError("Hostel not found", 404, true);
  }
  const updatedHostel = await hostel.update(hostelData);
  if (!updatedHostel) {
    throw new AppError("Failed to update hostel", 500, true);
  }
  ResponseHandler.success(
    res,
    "Hostel updated successfully",
    { hostel: updatedHostel },
    200,
  );
});

const deleteHostel = asyncHandler(async (req: Request, res: Response) => {
  const userid: string = (req.user as User)?.id;
  if (!userid) {
    throw new AppError("User not authenticated", 401, true);
  }
  const hostelId = req.params.id;
  if (!hostelId) {
    throw new AppError("Hostel ID is required", 400, true);
  }
  const hostel = await Hostel.findById(hostelId);
  if (!hostel) {
    throw new AppError("Hostel not found", 404, true);
  }
  await hostel.destroy();
  ResponseHandler.success(res, "Hostel deleted successfully", {}, 204);
});

export default {
  regHostel,
  getAllHostelsStudent,
  getAllHostelsOwner,
  getHostelById,
  updateHostel,
  deleteHostel,
};
