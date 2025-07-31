import { AppError, asyncHandler } from "@/middlewares";
import Rent from "@/models/rent-model";
import { ResponseHandler } from "@/utils";
import { Request, Response } from "express";

const addRent = asyncHandler(async (req: Request, res: Response) => {
  const { hostelId, sharingType, rent } = req.body;

  if (!hostelId || !sharingType || !rent)
    throw new AppError(
      "Missing required fields: hostelId, sharingType, rent",
      400,
    );

  const newRent = await Rent.createRent({
    hostelId,
    sharingType,
    rent,
  });

  if (!newRent) {
    throw new AppError("Failed to create rent", 500);
  }

  ResponseHandler.success(res, "Rent added successfully", {}, 201);
});

const getRentByHostelId = asyncHandler(async (req: Request, res: Response) => {
  const hostelId: string = req.params.id;

  const rent = await Rent.findOne({ where: { hostelId } });

  if (!rent) {
    throw new AppError("Rent not found for this hostel", 404, true);
  }

  ResponseHandler.success(res, "Rent retrieved successfully", { rent }, 200);
});

const updateRent = asyncHandler(async (req: Request, res: Response) => {
  const hostelId: string = req.params.id;
  const { sharingType, rent } = req.body;

  if (!hostelId || !sharingType || !rent)
    throw new AppError(
      "Missing required fields: hostelId, sharingType, rent",
      400,
    );

  const updatedRent = await Rent.update(
    { sharingType, rent },
    { where: { hostelId } },
  );

  if (updatedRent[0] === 0) {
    throw new AppError("Failed to update rent", 500);
  }

  ResponseHandler.success(res, "Rent updated successfully", {}, 200);
});

const deleteRent = asyncHandler(async (req: Request, res: Response) => {
  const hostelId: string = req.params.id;

  if (!hostelId) {
    throw new AppError("Hostel ID is required", 400);
  }

  const rent = await Rent.findOne({ where: { hostelId } });
  if (!rent) {
    throw new AppError("Rent not found for this hostel", 404);
  }

  await rent.destroy();

  ResponseHandler.success(res, "Rent deleted successfully", {}, 200);
});

export default {
  addRent,
  getRentByHostelId,
  updateRent,
  deleteRent,
};
