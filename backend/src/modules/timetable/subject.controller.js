import { SubjectModel } from "./subject.model.js";

// Create a new subject
export const createSubject = async (req, res) => {
  try {
    const { subjectCode, subjectName, weeklyHours, type } = req.body;

    if (!subjectCode || !subjectName || !weeklyHours) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const subject = await SubjectModel.create({
      subjectCode,
      subjectName,
      weeklyHours,
      type,
    });

    return res.status(201).json({
      success: true,
      data: subject,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all subjects
export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await SubjectModel.find().sort({ subjectCode: 1 });

    return res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single subject by ID
export const getSubjectById = async (req, res) => {
  try {
    const subject = await SubjectModel.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: subject,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update subject
export const updateSubject = async (req, res) => {
  try {
    const subject = await SubjectModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: subject,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete subject
export const deleteSubject = async (req, res) => {
  try {
    const subject = await SubjectModel.findByIdAndDelete(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Subject deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
