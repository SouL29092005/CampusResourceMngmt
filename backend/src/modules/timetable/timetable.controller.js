import fs from "fs";
import csv from "csv-parser";
import TimetableEntry from "./timetableEntry.model.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiError.js";

export const uploadTimetableCSV = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ApiError(400, "CSV file is required"));
    }

    const entries = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {
        entries.push({
          roomId: row.roomId,
          roomType: row.roomType,
          dayOfWeek: row.dayOfWeek,
          startTime: row.startTime,
          endTime: row.endTime,
          courseCode: row.courseCode,
          courseName: row.courseName,
          facultyName: row.facultyName,
          department: row.department,
          semester: Number(row.semester)
        });
      })
      .on("end", async () => {
        await TimetableEntry.deleteMany({});
        await TimetableEntry.insertMany(entries);

        fs.unlinkSync(req.file.path);

        return res.status(200).json(
          new ApiResponse(
            200,
            {
              insertedCount: entries.length
            },
            "Timetable uploaded successfully"
          )
        );
      });
  } catch (error) {
    next(error);
  }
};

export const getAllTimetableEntries = async (req, res, next) => {
  try {
    const timetable = await TimetableEntry.find({}).sort({
      dayOfWeek: 1,
      startTime: 1
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        timetable,
        "All timetable entries fetched successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};
