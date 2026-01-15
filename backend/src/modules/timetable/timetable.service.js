import { ClassModel } from "./class.model.js";
import { ApiError } from "../../utils/apiError.js";
import Timetable from "./timetable.model.js";
import { generateTimetable } from "./scheduler/generator.js";
import FacultyProfile from "../users/profiles/faculty.profile.model.js";
import { flattenClasses } from "./scheduler/flattener.js";

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


export async function createTimetable(rooms) {
  const classes = await ClassModel.find({ isActive: true }).lean();

  if (classes.length === 0) {
    throw new Error("No active classes found for this semester");
  }

  const facultyProfiles = await FacultyProfile.find().lean();

  if (facultyProfiles.length === 0) {
    throw new Error("No faculty profiles found");
  }

  const subjectToFaculties = {};
  for (const fac of facultyProfiles) {
    for (const subjectId of fac.subjects) {
      const key = subjectId.toString();
      subjectToFaculties[key] ??= [];
      subjectToFaculties[key].push(fac);
    }
  }

  const tasks = flattenClasses(classes);

  if (tasks.length === 0) {
    throw new Error("No schedulable tasks generated");
  }

  const entries = generateTimetable(tasks, subjectToFaculties, rooms);

  await Timetable.deleteMany({});

  const timetable = await Timetable.create({ entries });

  return timetable;
}