import type { Request, Response } from "express";
import { Hostel, User } from "@/models";
import { z } from "zod";
import { ZodError } from "zod";

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

const regHostel = async (req: Request, res: Response) => {
  try {
    const hostelData: createHostelDTO = hostelSchema.parse(req.body);
    const newHostel = await Hostel.createHostel(hostelData);
    await newHostel.setUser(req.user?.id as string);
    res.status(201).json({
      success: true,
      message: "Hostel created successfully",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.flatten() });
    }
    console.error("Error creating hostel:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getHostelById = async (req: Request, res: Response) => {
  try {
    const hostelId = req.params.id;
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({ error: "Hostel not found" });
    }
    res.status(200).json(hostel);
  } catch (error) {
    console.error("Error fetching hostel:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getAllHostelsStudent = async (req: Request, res: Response) => {
  try {
    const hostels = await Hostel.findAll();
    res.status(200).json(hostels);
  } catch (error) {
    console.error("Error fetching hostels:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllHostelsOwner = async (req: Request, res: Response) => {
  try {
    const userId: string = (req.user as User)?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const hostels = await Hostel.findAll({
      where: { userId: userId },
    });
    if (!hostels || hostels.length === 0) {
      return res.status(404).json({ error: "No hostels found for this user" });
    }

    res.status(200).json(hostels);
  } catch (error) {
    console.error("Error fetching hostels:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateHostel = async (req: Request, res: Response) => {
  try {
    const userid: string = (req.user as User)?.id;
    if (!userid) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const hostelId = req.params.id;
    if (!hostelId) {
      return res.status(400).json({ error: "Hostel ID is required" });
    }
    const hostelData = updateHostelSchema.parse(req.body);
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({ error: "Hostel not found" });
    }
    const updatedHostel = await hostel.update(hostelData);
    if (!updatedHostel) {
      return res.status(500).json({ error: "Failed to update hostel" });
    }
    res.status(200).json({
      message: "Hostel updated successfully",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.flatten() });
    }
  }
};

const deleteHostel = async (req: Request, res: Response) => {
  try {
    const userid: string = (req.user as User)?.id;
    if (!userid) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const hostelId = req.params.id;
    if (!hostelId) {
      return res.status(400).json({ error: "Hostel ID is required" });
    }
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({ error: "Hostel not found" });
    }
    await hostel.destroy();
    res.status(204).send({
      message: "Hostel deleted successfully",
    });
  } catch (error) {
    console.error(`Error deleting hostel with id ${req.params.id}`, error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  regHostel,
  getAllHostelsStudent,
  getAllHostelsOwner,
  getHostelById,
  updateHostel,
  deleteHostel,
};
