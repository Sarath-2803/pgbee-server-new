import { enquiryController } from "@/controllers";
import { Router } from "express";

const router = Router();

router.post("/", enquiryController.createEnquiry);
router.get("/", enquiryController.getEnquiriesByEnquiryId);
router.put("/:id", enquiryController.updateEnquiry);
router.delete("/:id", enquiryController.deleteEnquiry);
router.get("/hostel/:id", enquiryController.getEnquiriesByHostelId);
router.get("/student/:id", enquiryController.getEnquiriesByStudent);

export default router;
