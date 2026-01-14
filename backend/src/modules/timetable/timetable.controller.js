import { createClassService } from "./timetable.service.js";
import { ApiResponse } from "../../utils/apiResponse.js";

export const createClass = async (req, res, next) => {
  try {
    const newClass = await createClassService(req.body);

    return res.status(201).json(
      new ApiResponse(201, newClass, "Class created successfully")
    );
  } catch (error) {
    next(error);
  }
};