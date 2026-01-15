import User from "./user.model.js";
import StudentProfile from "./profiles/student.profile.model.js";
import FacultyProfile from "./profiles/faculty.profile.model.js";
import LibrarianProfile from "./profiles/librarian.profile.model.js";
import LabAdminProfile from "./profiles/labAdmin.profile.model.js";

export const createUserByAdmin = async (req, res) => {
  const { name, email, role, department, password, extra } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  switch (role) {
    case "student":
      await StudentProfile.create({
        userId: user._id,
        semester: extra.semester
      });
      break;

    case "faculty":
      await FacultyProfile.create({
        userId: user._id
      });
      break;

    case "librarian":
      await LibrarianProfile.create({
        userId: user._id,
      });
      break;

    case "lab_admin":
      await LabAdminProfile.create({
        userId: user._id,
        labName: extra.labName
      });
      break;
  }

  res.status(201).json({
    success: true,
    message: "User created successfully"
  });
};


export const deleteUserByAdmin = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully"
  });
};
