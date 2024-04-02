import bcrypt from "bcrypt";
import userModel from "../../../DataBase/Models/user.model.js";
import sendEmailService from "../../Services/sendEmailService.js";
import generateQrCode from "../../Utils/QrCodeFunction.js";
import { generateToken, verifyToken } from "../../Utils/tokenFunctions.js";

// ====================== 1- Sign UP =================

const signUp = async (req, res, next) => {
  const { userName, email, password, gender, role } = req.body;

  const isUserExist = await userModel.findOne({ email });
  if (isUserExist) {
    return res.status(400).json({ message: "Email is already exist" });
  }

  // Confirm Email
  // const token = jwt.sign({ email }, process.env.TOKEN_CONFIRMEMAIL_SIGNATURE, {
  //   expiresIn: "1h",
  // });
  console.log(isUserExist);
  const token = generateToken({
    payload: { email },
    signature: process.env.TOKEN_CONFIRMEMAIL_SIGNATURE,
    expiresIn: "1h",
  });
  if (!token) {
    return next(new Error("Fail to generate token", { cause: 400 }));
  }

  const confirmLink = `${req.protocol}://${req.headers.host}/user/confirmEmail/${token}`;

  const message = `<a href=${confirmLink}>Click Here To Confirm Your Email</a>`;

  await sendEmailService({
    message,
    to: email,
    subject: "Confirmation Email",
  });

  //Hashing Password
  const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS);

  const userInstance = new userModel({
    userName,
    email,
    password: hashedPassword,
    gender,
    role,
  });
  await userInstance.save();
  res
    .status(201)
    .json({ message: "Account created successfully", userInstance });
};

//======================= 2- Confirm Email=======================

const confirmEmail = async (req, res, next) => {
  const { token } = req.params;

  const decodedData = verifyToken({
    token,
    signature: process.env.TOKEN_CONFIRMEMAIL_SIGNATURE,
  });
  if (!decodedData) {
    return next(new Error("Fail to decode token", { cause: 400 }));
  }

  console.log(decodedData);

  const confirmationCheck = await userModel.findOne({
    email: decodedData.email,
  });
  if (!confirmationCheck) {
    return res.status(400).json({ message: "This email does not exist" });
  }
  if (confirmationCheck.isConfirmed) {
    return res.status(400).json({ message: "Your Email is already confirmed" });
  }
  const user = await userModel.findOneAndUpdate(
    { email: decodedData.email },
    { isConfirmed: true },
    { new: true }
  );
  if (!user) {
    return res.status(400).json({ message: "Fail to Conirm email" });
  }
  res
    .status(200)
    .json({ message: "Your email is confirmed successfully", user });
};

// ====================== 3- Sign In =================

const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email, isConfirmed: true });
  if (!user) {
    // return res.status(400).json({ message: "Email or Password is incorrect" });
    return next(new Error("Email or Password is incorrect", { cause: 400 }));
  }
  if (!user.isConfirmed) {
    return res.status(400).json({ message: "Your Email is not confirmed yet" });
  }
  const isPasswordCorrect = bcrypt.compareSync(password, user.password);

  const userToken = generateToken({
    payload: { userEmail: email, ID: user._id },
    signature: process.env.TOKEN_SIGNIN_SIGNATURE,
    expiresIn: 20,
  });
  if (!userToken) {
    return next(new Error("Fail to generate token", { cause: 400 }));
  }

  user.token = userToken;
  await user.save();

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Invalid login credentials" });
  }

  res.status(201).json({ message: "Logged In successfully", userToken });
};

// ====================== 4- Update Profile =================

const updateProfile = async (req, res, next) => {
  const { userName, newPassword, newEmail } = req.body;
  const { email, _id } = req.authUser;
  const { userId } = req.params;

  const isUserExist = await userModel.findById(userId);
  if (!isUserExist) {
    return res.status(400).json({ message: "User does not exists" });
  }
  if (isUserExist._id.toString() !== _id.toString()) {
    return res
      .status(401)
      .json({ message: "Unauthorized to update this user" });
  }

  // Hash Password

  const hashedPassword = bcrypt.hashSync(newPassword, +process.env.SALT_ROUNDS);

  const user = await userModel.findOneAndUpdate(
    { email, _id },
    { userName, email: newEmail, password: hashedPassword },
    { new: true }
  );
  if (user) {
    return res.status(200).json({ message: "Updated user Successfully" });
  }
  res.status(400).json({ message: "Fail to update user" });
};

// ====================== 5- Get Profile Data ===============

const getProfileData = async (req, res, next) => {
  const { _id } = req.params;
  const user = await userModel.findById(_id, "userName");
  if (!user) {
    res.status(404).json({ message: "InvalidId" });
  }
  const qrcode = await generateQrCode({ data: user });
  res.status(200).json({ message: "Done", UserData: user, qrcode });
};

// ====================== 6- Delete Profile ================

const deleteProfile = async (req, res, next) => {
  const { email, _id } = req.authUser;

  const user = await userModel.findOneAndDelete({ email, _id }, { new: true });
  if (user) {
    res.status(200).json({ message: "Profile deleted successfully" });
  } else {
    res.status(401).json({ message: "Fail to delete profile" });
  }
};

export {
  signUp,
  confirmEmail,
  signIn,
  updateProfile,
  getProfileData,
  deleteProfile,
};
