import type { Request, Response } from "express";
import {
  Hostel,
  User,
  Ammenities,
  Owner,
  Rent,
  Review,
  Student,
} from "@/models";
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

// Zod schema for hostel creation
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

// Zod schema for partial updates
const updateHostelSchema = hostelSchema.partial();

type createHostelDTO = z.infer<typeof hostelSchema>;

// Reusable options to include all related models in queries
const includeAllRelations = [
  {
    model: User,
    attributes: { exclude: ["password", "createdAt", "updatedAt", "roleId"] },
    include: [
      {
        model: Owner,
        attributes: { exclude: ["createdAt", "updatedAt", "userId"] },
      },
    ],
  },
  {
    model: Review,
    attributes: { exclude: ["createdAt", "updatedAt", "hostelId"] },
  },
  {
    model: Ammenities,
    attributes: { exclude: ["createdAt", "updatedAt", "hostelId"] },
  },
  {
    model: Rent,
    attributes: { exclude: ["createdAt", "updatedAt", "hostelId"] },
  },
  {
    model: Student,
    attributes: { exclude: ["createdAt", "updatedAt", "userId"] },
    through: { attributes: ["enquiry", "createdAt"] }, // Include details from the Enquiry join table
  },
];

const regHostel = asyncHandler(async (req: Request, res: Response) => {
  const hostelData: createHostelDTO = hostelSchema.parse(req.body);
  const newHostel = await Hostel.createHostel(hostelData);
  if (!newHostel) throw new AppError("Failed to create hostel", 500, true);

  // Associate the hostel with the logged-in user
  await newHostel.setUser(req.user?.id as string);

  // Fetch the newly created hostel with all its relations to return the full object
  const completeHostel = await Hostel.findByPk(newHostel.id, {
    include: includeAllRelations,
  });

  ResponseHandler.success(
    res,
    "Hostel created successfully",
    { hostel: completeHostel },
    201,
  );
});

const getHostelById = asyncHandler(async (req: Request, res: Response) => {
  const hostelId = req.params.id;
  // Find the hostel by its primary key and include all related data
  const hostel = await Hostel.findByPk(hostelId, {
    include: includeAllRelations,
  });

  if (!hostel) {
    throw new AppError("Hostel not found", 404, true);
  }
  ResponseHandler.success(res, "Hostel fetched successfully", { hostel }, 200);
});

const getAllHostelsStudent = asyncHandler(
  async (req: Request, res: Response) => {
    // Find all hostels and include their related data
    const hostels = await Hostel.findAll({ include: includeAllRelations });

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
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("User not authenticated", 401, true);
  }

  // Find all hostels belonging to the authenticated user, including related data
  const hostels = await Hostel.findAll({
    where: { userId: userId },
    include: includeAllRelations,
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
  const userId = req.user?.id;
  if (!userId) {
    throw new AppError("User not authenticated", 401, true);
  }

  const hostelId = req.params.id;
  if (!hostelId) {
    throw new AppError("Hostel ID is required", 400, true);
  }

  const hostelData = updateHostelSchema.parse(req.body);
  const hostel = await Hostel.findByPk(hostelId);

  if (!hostel) {
    throw new AppError("Hostel not found", 404, true);
  }

  // Authorization: Ensure the user owns the hostel before updating
  if (hostel.userId !== userId) {
    throw new AppError(
      "You are not authorized to update this hostel",
      403,
      true,
    );
  }

  // Perform the update
  await hostel.update(hostelData);

  // Fetch the updated hostel with all its relations
  const updatedHostel = await Hostel.findByPk(hostelId, {
    include: includeAllRelations,
  });

  ResponseHandler.success(
    res,
    "Hostel updated successfully",
    { hostel: updatedHostel },
    200,
  );
});

const deleteHostel = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new AppError("User not authenticated", 401, true);
  }
  const hostelId = req.params.id;
  if (!hostelId) {
    throw new AppError("Hostel ID is required", 400, true);
  }
  const hostel = await Hostel.findByPk(hostelId);
  if (!hostel) {
    throw new AppError("Hostel not found", 404, true);
  }

  // Authorization: Ensure the user owns the hostel before deleting
  if (hostel.userId !== userId) {
    throw new AppError(
      "You are not authorized to delete this hostel",
      403,
      true,
    );
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
