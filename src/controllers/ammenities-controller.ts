import { Ammenities, Hostel } from "@/models";
import { Request, Response } from "express";

const createAmmenities = async (req: Request, res: Response) => {
  try {
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
      currentBill,
      waterBill,
      food,
      furniture,
      bed,
      water,
      studentsCount,
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
      typeof security !== "boolean" ||
      typeof currentBill !== "boolean" ||
      typeof waterBill !== "boolean" ||
      typeof food !== "boolean" ||
      typeof furniture !== "boolean" ||
      typeof bed !== "boolean" ||
      typeof water !== "boolean" ||
      typeof studentsCount !== "number"
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required and must be of correct type",
      });
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
      currentBill,
      waterBill,
      food,
      furniture,
      bed,
      water,
      studentsCount,
    });

    if (!ammenities) {
      return res.status(500).json({
        ok: false,
        message: "Failed to create ammenities",
      });
    }

    res.status(201).json({
      ok: true,
      message: "Ammenities created successfully",
    });
  } catch (error) {
    console.error("Error creating ammenities:", error);
    res.status(500).json({
      ok: false,
      message: "Failed to create ammenities",
    });
  }
};

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
      currentBill,
      waterBill,
      food,
      furniture,
      bed,
      water,
      studentsCount,
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
      currentBill,
      waterBill,
      food,
      furniture,
      bed,
      water,
      studentsCount,
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

const filterAmmenities = async (req: Request, res: Response) => {
  try {
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
      return res.status(200).json({
        ok: true,
        hostels,
      });
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
      return res.status(404).json({
        ok: false,
        message: "No amenities found with the specified filters",
      });
    }

    const hostelMap = new Map();
    for (const amenity of results) {
      if (amenity.hostel && !hostelMap.has(amenity.hostel.id)) {
        hostelMap.set(amenity.hostel.id, amenity.hostel);
      }
    }
    const hostels = Array.from(hostelMap.values());

    if (!hostels || hostels.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "No hostels found with the specified amenities",
      });
    }

    res.status(200).json({
      ok: true,
      count: hostels.length,
      hostels,
    });
  } catch (error) {
    console.error("Error filtering amenities:", error);
    res.status(500).json({
      ok: false,
      message: "Failed to filter amenities",
    });
  }
};

export default {
  createAmmenities,
  getAmmenitiesHostel,
  updateAmmenities,
  deleteAmmenities,
  filterAmmenities,
};
