import User from "../users/user.model.js";
import StudentProfile from "../users/profiles/student.profile.model.js";
import FacultyProfile from "../users/profiles/faculty.profile.model.js";
import LibrarianProfile from "../users/profiles/librarian.profile.model.js";
import LabAdminProfile from "../users/profiles/labAdmin.profile.model.js";
import { SubjectModel } from "../timetable/subject.model.js";


export const getMyProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  let profile = null;

  switch (user.role) {
    case "student":
      profile = await StudentProfile.findOne({ userId: user._id });
      break;

    case "faculty":
      profile = await FacultyProfile.findOne({ userId: user._id });
      break;

    case "librarian":
      profile = await LibrarianProfile.findOne({ userId: user._id });
      break;

    case "lab_admin":
      profile = await LabAdminProfile.findOne({ userId: user._id });
      break;
  }

  res.status(200).json({
    success: true,
    user,
    profile
  });
};


export const updateMyProfile = async (req, res) => {
  const userId = req.user._id;
  const role = req.user.role;
  const updates = req.body;

  let profile;

  switch (role) {
    case "student":
      profile = await StudentProfile.findOneAndUpdate(
        { userId },
        updates,
        { new: true, runValidators: true }
      );
      break;

    case "faculty":
      if (updates.subjects && Array.isArray(updates.subjects)) {
        const subjectDocs = await SubjectModel.find({
          subjectCode: { $in: updates.subjects },
        });

        if (subjectDocs.length !== updates.subjects.length) {
          return res.status(400).json({
            success: false,
            message: "One or more subject codes are invalid",
          });
        }

        // Replace subject codes with ObjectIds
        updates.subjects = subjectDocs.map((s) => s._id);
      }

      profile = await FacultyProfile.findOneAndUpdate(
        { userId },
        updates,
        { new: true, runValidators: true }
      );
      break;

    case "librarian":
      profile = await LibrarianProfile.findOneAndUpdate(
        { userId },
        updates,
        { new: true }
      );
      break;

    case "lab_admin":
      profile = await LabAdminProfile.findOneAndUpdate(
        { userId },
        updates,
        { new: true }
      );
      break;
  }

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: "Profile not found"
    });
  }

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    profile
  });
};
