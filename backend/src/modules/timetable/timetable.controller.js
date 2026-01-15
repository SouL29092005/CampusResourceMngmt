import { createTimetable } from "./timetable.service.js";

export async function generateTimetableController(req, res, next) {
  try {
    const classroomCount = req.body;
    const rooms = Array.from({ length: classroomCount }, (_, i) => `C${i + 1}`);

    const timetable = await createTimetable({rooms });

    res.status(201).json({
      success: true,
      timetable,
    });
  } catch (err) {
    next(err);
  }
}