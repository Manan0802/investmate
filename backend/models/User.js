import mongoose from "mongoose";
const userSchema=new mongoose.Schema({// Field 1: fullName
    fullName: {
      type: String, // The data type is a string
      required: true, // This field is mandatory
      trim: true, // Removes any whitespace from the beginning and end
    },

    // Field 2: email
    email: {
      type: String,
      required: true,
      unique: true, // Every email in the database must be unique
      lowercase: true, // Converts the email to lowercase before saving
      trim: true,
    },

    // Field 3: password
    password: {
      type: String,
      required: [true, 'Password is required'], // Custom error message
    },


},{timestamps:true});
const User=mongoose.model('User',userSchema);
export default User;