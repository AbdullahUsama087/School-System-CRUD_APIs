import schoolModel from "../../../DataBase/Models/school.model.js";

// ===================== Add School =================

const addSchool = async (req, res, next) => {
  const { name } = req.body;
  const { _id } = req.authUser;

  if (!name) {
    return next(
      new Error("Please enter a name for the school", { cause: 400 })
    );
  }

  // Check the name  is unique
  const findSchool = await schoolModel.findOne({ name });
  if (findSchool) {
    return next(
      new Error("This name is already used, Please Choose a different one", {
        cause: 400,
      })
    );
  }

  // Create School Object
  const schoolObject = {
    name,
    createdBy: _id,
  };
  const school = await schoolModel.create(schoolObject);

  // Check if No School Object created
  if (!school) {
    return next(
      new Error("Fail to Add School, Please try again", { cause: 400 })
    );
  }
  res.status(200).json({ message: "School Added successfully", school });
};

// ===================== Update School =================

const updateSchool = async (req, res, next) => {
  const { schoolId } = req.params;
  const { name } = req.body;
  const { _id } = req.authUser;

  // Check if school exists by ID
  const school = await schoolModel.findOne({
    _id: schoolId,
    createdBy: _id,
  });
  if (!school) {
    return next(new Error("Invalid School ID", { cause: 400 }));
  }

  // Check on Name
  if (name) {
    //check that new name is different from the old name
    if (school.name == name) {
      return next(
        new Error(
          "you entered the same name School,Please enter a different one",
          {
            cause: 400,
          }
        )
      );
    }

    //check the new name is unique
    const findSchool = await schoolModel.findOne({ name });
    if (findSchool) {
      return next(
        new Error("This name is already used please enter a different one", {
          cause: 400,
        })
      );
    }

    // Update name
    school.name = name;
  }

  // Update userId who Updates the School
  school.updatedBy = _id;
  await school.save();
  res.status(200).json({ message: "School updated successfully", school });
};

// ===================== Get All Schools =================

const getAllSchools = async (req, res, next) => {
  const { _id } = req.authUser;
  const Schools = await schoolModel.find({ createdBy: _id }).populate([{
    path:'Classrooms',
  }]);
  res.status(200).json({ message: "Done", Schools });
};

// ===================== Delete School =================

const deleteSchool = async (req, res, next) => {
  const { schoolId } = req.params;
  const { _id } = req.authUser;

  // Check if school is exists and Delete from DataBase
  const schoolExists = await schoolModel.findOneAndDelete({
    _id: schoolId,
    createdBy: _id,
  });
  if (!schoolExists) {
    return next(new Error("Invalid SchoolId", { cause: 400 }));
  }

  res.status(200).json({ message: "School deleted successfully" });
};

export { addSchool, updateSchool, getAllSchools, deleteSchool };
