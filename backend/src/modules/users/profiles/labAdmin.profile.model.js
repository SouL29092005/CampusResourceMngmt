import mongoose from "mongoose";

const labAdminProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    labName: {
      type: String,
      required: true
    },

    qualification: {
      type: String,
      required: true
    },

    managedEquipment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Equipment"
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("LabAdminProfile", labAdminProfileSchema);
