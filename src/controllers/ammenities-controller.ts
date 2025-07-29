import { Ammenities } from "@/models";
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
  ResponseHandler.success(res, "Ammenities created successfully", 201);
});

const getAmmenitiesHostel = async (req: Request, res: Response) => {
  try {
    const hostelId = req.params.id;
    if (!hostelId) {
      return res.status(400).json({
        ok: false,
        message: "Hostel ID is required",
      });
    }

    const ammenities = await Ammenities.findOne({ where: { hostelId } });
    if (!ammenities) {
      return res.status(404).json({
        ok: false,
        message: "Ammenities not found for this hostel",
      });
    }

    res.status(200).json({
      ok: true,
      ammenities,
    });
  } catch (error) {
    console.error("Error fetching ammenities:", error);
    res.status(500).json({
      ok: false,
      message: "Failed to fetch ammenities",
    });
  }
};

const updateAmmenities = async (req: Request, res: Response) => {
  try {
    const hostelId = req.params.id;
    if (!hostelId) {
      return res.status(400).json({
        ok: false,
        message: "Hostel ID is required",
      });
    }

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

    const ammenities = await Ammenities.findOne({ where: { hostelId } });
    if (!ammenities) {
      return res.status(404).json({
        ok: false,
        message: "Ammenities not found for this hostel",
      });
    }

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
    });

    if (!updatedAmmenities) {
      return res.status(500).json({
        ok: false,
        message: "Failed to update ammenities",
      });
    }
    res.status(200).json({
      ok: true,
      message: "Ammenities updated successfully",
    });
  } catch (error) {
    console.error("Error updating ammenities:", error);
    res.status(500).json({
      ok: false,
      message: "Failed to update ammenities",
    });
  }
};

const deleteAmmenities = async (req: Request, res: Response) => {
  try {
    const hostelId = req.params.id;
    if (!hostelId) {
      return res.status(400).json({
        ok: false,
        message: "Hostel ID is required",
      });
    }
    const ammenities = await Ammenities.findOne({ where: { hostelId } });
    if (!ammenities) {
      return res.status(404).json({
        ok: false,
        message: "Ammenities not found for this hostel",
      });
    }

    await ammenities.destroy();

    res.status(200).json({
      ok: true,
      message: "Ammenities deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting ammenities:", error);
    res.status(500).json({
      ok: false,
      message: "Failed to delete ammenities",
    });
  }
};

export default {
  createAmmenities,
  getAmmenitiesHostel,
  updateAmmenities,
  deleteAmmenities,
};
