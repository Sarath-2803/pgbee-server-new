import { Ammenities, Hostel } from "@/models";
import { Request, Response } from "express";
import { ResponseHandler } from "@/utils";
import { asyncHandler, AppError } from "@/middlewares";

const createAmmenities = asyncHandler(async (req: Request, res: Response) => {
  const {
    hostelId,
    wifi,
    ac,
    kitchen,
    parking,
    laundry,
    tv,
    firstAid,
    workspace,
    security,
  } = req.body;

  if (
    !hostelId ||
    typeof wifi !== "boolean" ||
    typeof ac !== "boolean" ||
    typeof kitchen !== "boolean" ||
    typeof parking !== "boolean" ||
    typeof laundry !== "boolean" ||
    typeof tv !== "boolean" ||
    typeof firstAid !== "boolean" ||
    typeof workspace !== "boolean" ||
    typeof security !== "boolean"
  ) {
    throw new AppError(
      "All fields are required and must be of correct type",
      400,
      true,
    );
  }

  const ammenities = await Ammenities.create({
    hostelId,
    wifi,
    ac,
    kitchen,
    parking,
    laundry,
    tv,
    firstAid,
    workspace,
    security,
  });

  if (!ammenities) {
    throw new AppError("failed to create ammenities", 500, true);
  }
  ResponseHandler.success(res, "Amenities created successfully", {}, 201);
});

const getAmmenitiesHostel = asyncHandler(
  async (req: Request, res: Response) => {
    const hostelId = req.params.id;
    if (!hostelId) {
      throw new AppError("Hostel ID is required", 400, true);
    }

    const ammenities = await Ammenities.findOne({ where: { hostelId } });
    if (!ammenities)
      throw new AppError("Amenities not found for this hostel", 404, true);

    ResponseHandler.success(
      res,
      "Amenities fetched successfully",
      { ammenities },
      200,
    );
  },
);

const updateAmmenities = asyncHandler(async (req: Request, res: Response) => {
  const hostelId = req.params.id;
  if (!hostelId) throw new AppError("Hostel ID is required", 400, true);

  const {
    wifi,
    ac,
    kitchen,
    parking,
    laundry,
    tv,
    firstAid,
    workspace,
    security,
    currentBill,
    waterBill,
    food,
    furniture,
    bed,
    water,
    studentsCount,
  } = req.body;

  const ammenities = await Ammenities.findOne({ where: { hostelId } });
  if (!ammenities)
    throw new AppError("Amenities not found for this hostel", 404, true);

  const updatedAmmenities = await ammenities.update({
    wifi,
    ac,
    kitchen,
    parking,
    laundry,
    tv,
    firstAid,
    workspace,
    security,
    currentBill,
    waterBill,
    food,
    furniture,
    bed,
    water,
    studentsCount,
  });

  if (!updatedAmmenities)
    throw new AppError("Failed to update amenities", 500, true);

  ResponseHandler.success(res, "Amenities updated successfully", {}, 200);
});

const deleteAmmenities = asyncHandler(async (req: Request, res: Response) => {
  const hostelId = req.params.id;
  if (!hostelId) {
    throw new AppError("Hostel ID is required", 400, true);
  }

  const ammenities = await Ammenities.findOne({ where: { hostelId } });
  if (!ammenities) {
    throw new AppError("Ammenities not found for this hostel", 404, true);
  }

  await ammenities.destroy();

  ResponseHandler.success(res, "Ammenities deleted successfully", {}, 200);
});

const filterAmmenities = asyncHandler(async (req: Request, res: Response) => {
  const {
    wifi,
    ac,
    kitchen,
    parking,
    laundry,
    tv,
    firstAid,
    workspace,
    security,
  } = req.body;

  if (
    typeof wifi !== "boolean" ||
    typeof ac !== "boolean" ||
    typeof kitchen !== "boolean" ||
    typeof parking !== "boolean" ||
    typeof laundry !== "boolean" ||
    typeof tv !== "boolean" ||
    typeof firstAid !== "boolean" ||
    typeof workspace !== "boolean" ||
    typeof security !== "boolean"
  ) {
    throw new AppError("All fields must be boolean", 400, true);
  }

  const whereConditions: Record<string, boolean> = {};

  if (wifi === true) whereConditions.wifi = true;
  if (ac === true) whereConditions.ac = true;
  if (kitchen === true) whereConditions.kitchen = true;
  if (parking === true) whereConditions.parking = true;
  if (laundry === true) whereConditions.laundry = true;
  if (tv === true) whereConditions.tv = true;
  if (firstAid === true) whereConditions.firstAid = true;
  if (workspace === true) whereConditions.workspace = true;
  if (security === true) whereConditions.security = true;

  if (Object.keys(whereConditions).length === 0) {
    const hostels = await Hostel.findAll();
    ResponseHandler.success(
      res,
      "Hostels fetched successfully",
      { hostels },
      200,
    );
  }

  const results = await Ammenities.findAll({
    where: whereConditions,
    include: [
      {
        model: Hostel,
      },
    ],
  });

  if (!results || results.length === 0) {
    throw new AppError(
      "No hostels found with the specified amenities",
      404,
      true,
    );
  }

  const hostelMap = new Map();
  for (const amenity of results) {
    if (amenity.hostel && !hostelMap.has(amenity.hostel.id)) {
      hostelMap.set(amenity.hostel.id, amenity.hostel);
    }
  }
  const hostels = Array.from(hostelMap.values());

  if (!hostels || hostels.length === 0) {
    throw new AppError(
      "No hostels found with the specified amenities",
      404,
      true,
    );
  }

  ResponseHandler.success(
    res,
    "Hostels fetched successfully",
    { hostels },
    200,
  );
});

export default {
  createAmmenities,
  getAmmenitiesHostel,
  updateAmmenities,
  deleteAmmenities,
  filterAmmenities,
};
