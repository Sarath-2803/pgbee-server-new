import { AppError, asyncHandler } from "@/middlewares";
import { Enquiry, User } from "@/models";
import { ResponseHandler } from "@/utils";

const createEnquiry = asyncHandler(async (req, res, _next) => {
  const studentId: string = (req.user as User)?.id;
  const { hostelId, enquiry } = req.body;

  if (!hostelId || !enquiry) {
    throw new AppError("Hostel ID and enquiry are required", 400, true);
  }

  const newEnquiry = await Enquiry.createEnquiry({
    studentId,
    hostelId,
    enquiry,
  });

  if (!newEnquiry) {
    throw new AppError("Failed to create enquiry", 500, true);
  }

  ResponseHandler.success(
    res,
    "Enquiry created successfully",
    { newEnquiry },
    201,
  );
});

const getEnquiriesByHostelId = asyncHandler(async (req, res, _next) => {
  const hostelId: string = req.params.id;

  const enquiries = await Enquiry.findAll({ where: { hostelId } });

  if (!enquiries || enquiries.length === 0) {
    throw new AppError("No enquiries found", 404, true);
  }

  ResponseHandler.success(
    res,
    "Enquiries retrieved successfully",
    { enquiries },
    200,
  );
});

const getEnquiriesByEnquiryId = asyncHandler(async (req, res, _next) => {
  const enquiryId: string = req.params.id;

  const enquiry = await Enquiry.findById(enquiryId);
  if (!enquiry) {
    throw new AppError("Enquiry not found", 404, true);
  }

  ResponseHandler.success(
    res,
    "Enquiry retrieved successfully",
    { enquiry },
    200,
  );
});

const getEnquiriesByStudent = asyncHandler(async (req, res, _next) => {
  const studentId: string = (req.user as User)?.id;

  if (!studentId) {
    throw new AppError("User not authenticated", 401, true);
  }

  const enquiries = await Enquiry.findAll({ where: { studentId } });

  if (!enquiries || enquiries.length === 0) {
    throw new AppError("No enquiries found for this user", 404, true);
  }

  ResponseHandler.success(
    res,
    "User enquiries retrieved successfully",
    { enquiries },
    200,
  );
});

const updateEnquiry = asyncHandler(async (req, res, _next) => {
  const enquiryId: string = req.params.id;
  const { newEnquiry } = req.body;

  if (!newEnquiry) {
    throw new AppError("Enquiry content is required", 400, true);
  }

  const enquiry = await Enquiry.findById(enquiryId);
  if (!enquiry) {
    throw new AppError("Enquiry not found", 404, true);
  }

  const updatedEnquiry = await enquiry.update(newEnquiry);

  if (!updatedEnquiry) {
    throw new AppError("Failed to update enquiry", 500, true);
  }

  ResponseHandler.success(
    res,
    "Enquiry updated successfully",
    { updatedEnquiry },
    200,
  );
});

const deleteEnquiry = asyncHandler(async (req, res, _next) => {
  const enquiryId: string = req.params.id;

  const enquiry = await Enquiry.findById(enquiryId);
  if (!enquiry) {
    throw new AppError("Enquiry not found", 404, true);
  }

  const deletedEnquiry = await enquiry.destroy();

  ResponseHandler.success(
    res,
    "Enquiry deleted successfully",
    { deletedEnquiry },
    200,
  );
});

export default {
  createEnquiry,
  getEnquiriesByHostelId,
  getEnquiriesByEnquiryId,
  getEnquiriesByStudent,
  updateEnquiry,
  deleteEnquiry,
};
