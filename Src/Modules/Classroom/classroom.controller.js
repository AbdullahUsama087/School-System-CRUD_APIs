import classroomModel from "../../../DataBase/Models/classroom.model.js";
import schoolModel from "../../../DataBase/Models/school.model.js";

// ===================== Add Classroom =================

const addClassroom = async (req, res, next) => {
  const { name } = req.body;
  const { _id } = req.authUser;
  const { schoolId } = req.query;

  // Check if the School exists
  const findSchool = await schoolModel.findById(schoolId);
  if (!findSchool) {
    return next(new Error("Invalid SchoolId", { cause: 400 }));
  }

  if (!name) {
    return next(
      new Error("Please enter a name for the classroom", { cause: 400 })
    );
  }

  // Check the name is unique
  const findClassroom = await classroomModel.findOne({ name });
  if (findClassroom) {
    return next(
      new Error("This name is already used, Please Choose a different one", {
        cause: 400,
      })
    );
  }

  // Create Classroom Object
  const classroomObject = {
    name,
    createdBy: _id,
    schoolId,
  };
  const classroom = await classroomModel.create(classroomObject);

  // Check if No Classroom Object created
  if (!classroom) {
    return next(
      new Error("Fail to Add Classroom, Please try again", { cause: 400 })
    );
  }
  res.status(200).json({ message: "Classroom Added successfully", classroom });
};

// ===================== Update Classroom =================

const updateClassroom = async (req, res, next) => {
  const { classroomId, schoolId } = req.query;
  const { name } = req.body;
  const { _id } = req.authUser;

  // Check if the School exists
  const findSchool = await schoolModel.findById(schoolId);
  if (!findSchool) {
    return next(new Error("Invalid SchoolId", { cause: 400 }));
  }

  // Check if classroom exists by ID
  const classroom = await classroomModel.findOne({
    _id: classroomId,
    createdBy: _id,
  });
  if (!classroom) {
    return next(new Error("Invalid ClassroomID", { cause: 400 }));
  }

  // Check on Name
  if (name) {
    //check that new name is different from the old name
    if (classroom.name == name) {
      return next(
        new Error(
          "you entered the same name Classroom,Please enter a different one",
          {
            cause: 400,
          }
        )
      );
    }

    //check the new name is unique
    const findClassroom = await classroomModel.findOne({ name });
    if (findClassroom) {
      return next(
        new Error("This name is already used please enter a different one", {
          cause: 400,
        })
      );
    }

    // Update name
    classroom.name = name;
  }

  // Update userId who Updates the Classroom
  classroom.updatedBy = _id;
  await classroom.save();
  res
    .status(200)
    .json({ message: "Classroom updated successfully", classroom });
};

// ===================== Get All Classrooms =================

const getAllClassrooms = async (req, res, next) => {
  const { _id } = req.authUser;
  const Classrooms = await classroomModel.find({ createdBy: _id }).populate([
    {
      path: "schoolId",
      select: "name -_id",
    },
  ]);
  res.status(200).json({ message: "Done", Classrooms });
};

// ===================== Delete Classroom =================

const deleteClassroom = async (req, res, next) => {
  const { classroomId, schoolId } = req.query;
  const { _id } = req.authUser;

  // Check if the School exists
  const findSchool = await schoolModel.findById(schoolId);
  if (!findSchool) {
    return next(new Error("Invalid SchoolId", { cause: 400 }));
  }

  // Check if classroom is exists and Delete from DataBase
  const classroomExists = await classroomModel.findOneAndDelete({
    _id: classroomId,
    createdBy: _id,
  });
  if (!classroomExists) {
    return next(new Error("Invalid ClassroomId", { cause: 400 }));
  }

  res.status(200).json({ message: "Classroom deleted successfully" });
};

export { addClassroom, updateClassroom, getAllClassrooms, deleteClassroom };
