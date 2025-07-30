import type { Request, Response } from "express";
import { Owner } from "@/models";
import { z } from "zod";
import { AppError, asyncHandler } from "@/middlewares";
import { ResponseHandler } from "@/utils";

const ownerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Phone number is required"),
});
const updateOwnerSchema = ownerSchema.partial();

type createOwnerDTO = z.infer<typeof ownerSchema>;

const regOwner = asyncHandler(async (req: Request, res: Response) => {
  const ownerData: createOwnerDTO = ownerSchema.parse(req.body);
  const newOwner = await Owner.createOwner(ownerData);
  if (!newOwner) throw new AppError("Failed to create owner", 500, true);
  ResponseHandler.success(res, "Owner created successfully", {}, 201);
});

const getOwnerById = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.params.id;
  const owner = await Owner.findById(ownerId);
  if (!owner) {
    throw new AppError("Owner not found", 404, true);
  }
  ResponseHandler.success(res, "Owner fetched successfully", { owner }, 200);
});

const getAllOwners = asyncHandler(async (req: Request, res: Response) => {
  const owners = await Owner.findAll();
  if (!owners || owners.length === 0) {
    throw new AppError("No owners found", 404, true);
  }
  ResponseHandler.success(res, "Owners fetched successfully", { owners }, 200);
});

const updateOwner = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.params.id;
  const ownerData = updateOwnerSchema.parse(req.body);
  const owner = await Owner.findById(ownerId);
  if (!owner) {
    throw new AppError("Owner not found", 404, true);
  }
  const updatedOwner = await owner.update(ownerData);
  if (!updatedOwner) {
    throw new AppError("Failed to update owner", 500, true);
  }
  ResponseHandler.success(
    res,
    "Owner updated successfully",
    { owner: updatedOwner },
    200,
  );
});

const deleteOwner = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.params.id;
  const owner = await Owner.findById(ownerId);
  if (!owner) {
    throw new AppError("Owner not found", 404, true);
  }
  await owner.destroy();
  ResponseHandler.success(res, "Owner deleted successfully", {}, 204);
});

export default {
  regOwner,
  getAllOwners,
  getOwnerById,
  updateOwner,
  deleteOwner,
};
