import {
  regOwner,
  getAllOwners,
  getOwnerById,
  updateOwner,
  deleteOwner,
} from "@/controllers";

import { Router } from "express";

const router = Router();
router.post("/owners", regOwner);
router.get("/owners", getAllOwners);
router.get("/owners/:id", getOwnerById);
router.put("/owners/:id", updateOwner);
router.delete("/owners/:id", deleteOwner);

export default router;
