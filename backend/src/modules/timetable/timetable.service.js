import { ClassModel } from "./class.model.js";
import { ApiError } from "../../utils/apiError.js";

export const createClassService = async (payload) => {
  const {
    className,
    department,
    semester,
    section,
    subjects,
  } = payload;

  const existing = await ClassModel.findOne({ className });
  if (existing) {
    throw new ApiError(409, "Class already exists");
  }

  if (!subjects || subjects.length === 0) {
    throw new ApiError(400, "At least one subject is required");
  }

  const newClass = await ClassModel.create({
    className,
    department,
    semester,
    section,
    subjects,
  });

  return newClass;
};