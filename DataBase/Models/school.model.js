import mongoose, { Schema } from "mongoose";

const schoolSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// =================== Virtual Method ================
schoolSchema.virtual("Classrooms", {
  ref: "Classroom",
  localField: "_id",
  foreignField: "schoolId",
});

const schoolModel = mongoose.model("School", schoolSchema);

export default schoolModel;
