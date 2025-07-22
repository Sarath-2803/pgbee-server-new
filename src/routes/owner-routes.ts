import { ownerController } from "@/controllers";

import { Router } from "express";

const router = Router();
router.post("/owners", ownerController.regOwner);
router.get("/owners", ownerController.getAllOwners);
router.get("/owners/:id", ownerController.getOwnerById);
router.put("/owners/:id", ownerController.updateOwner);
router.delete("/owners/:id", ownerController.deleteOwner);

export default router;
