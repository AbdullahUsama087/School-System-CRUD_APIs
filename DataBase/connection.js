import mongoose from "mongoose";

const DbConnection = async () => {
  return await mongoose
    .connect(process.env.DB_CONNECTION_CLOUD)
    .then((res) => console.log("Database connection established successfully"))
    .catch((err) => console.error("Error connecting to Database", err));
};

export default DbConnection;
