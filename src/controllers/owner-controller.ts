import type { Request, Response } from "express";
import Owner from "../models/owner-model";
import { z } from "zod";
import { ZodError } from "zod";

const ownerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  hostelName: z.string().min(1, "Hostel name is required"),
  phone: z.string().min(10, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  curfew: z.boolean(),
  description: z.string().optional(),
  distance: z.number().min(0, "Distance must be a positive number"),
  location: z.string().min(1, "Location is required"),
  rent: z.number().min(0, "Rent must be a positive number"),
  files: z.string().optional(),
  bedrooms: z.number().min(1, "At least one bedroom is required"),
  bathrooms: z.number().min(1, "At least one bathroom is required"),
});
const updateOwnerSchema = ownerSchema.partial();

export type createOwnerDTO = z.infer<typeof ownerSchema>;

export const regOwner = async (req: Request, res: Response) => {
  try {
    const ownerData: createOwnerDTO = ownerSchema.parse(req.body);
    const newOwner = await Owner.createOwner(ownerData);
    res.status(201).json(newOwner);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.flatten() });
    }
    console.error("Error creating owner:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getOwnerById = async (req: Request, res: Response) => {
  try {
    const ownerId = req.params.id;
    const owner = await Owner.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }
    res.status(200).json(owner);
  } catch (error) {
    console.error("Error fetching owner:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getAllOwners = async (req: Request, res: Response) => {
  try {
    const owners = await Owner.findAll();
    res.status(200).json(owners);
  } catch (error) {
    console.error("Error fetching owners:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const updateOwner = async (req: Request, res: Response) => {
  try {
    const ownerId = req.params.id;
    const ownerData = updateOwnerSchema.parse(req.body);
    const owner = await Owner.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }
    const updatedOwner = await owner.update(ownerData);
    res.status(200).json(updatedOwner);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.flatten() });

      console.error(`Error updating owner with id ${req.params.id}`, error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const deleteOwner = async (req: Request, res: Response) => {
  try {
    const ownerId = req.params.id;
    const owner = await Owner.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }
    await owner.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting owner with id${req.params.id}`, error);
    res.status(500).json({ error: "Internal server error" });
  }
};
