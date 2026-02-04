import User from "../users/user.model.js";
import { generateToken } from "../../utils/jwt.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials"
    });
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials"
    });
  }

  res.status(200).json({
    success: true,
    token: generateToken(user._id),
    user: {
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};


export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select("+password");

  const isMatch = await user.matchPassword(oldPassword);
  if (!isMatch) {
    return res.status(400).json({ message: "Old password incorrect" });
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully"
  });
};


// export const getMe = async (req, res) => {
//   res.status(200).json({
//     success: true,
//     data: req.user
//   });
// };