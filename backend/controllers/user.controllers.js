import uploadOnCloudinary from "../config/cloudinary.js";
import { upload } from "../middlewares/multer.js";
import User from "../models/user.model.js";

// Get the current user
export const getCurrentUser = async (req, res) => {
  try {
    let userID = req.userID;
    let user = await User.findById(userID).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found ..." });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Current user error:${error}` });
  }
};

//Edit the profile
export const editProfile = async (req, res) => {
  try {

    const { name } = req.body;
    // ✅ Build update object safely
    const updateData = { name };

    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.path);
      if (uploadResult?.secure_url) {
        updateData.image = uploadResult.secure_url;
        console.log("Cloudinary URL:", updateData.image);
      }
    }

    const user = await User.findByIdAndUpdate(req.userID, updateData, {
      new: true,
    });

    if (!user) {
      return res.status(400).json({ message: "User not found ..." });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Profile error: ${error}` });
  }
};

export const getOtherUsers = async (req, res) => {
  try {
    let users = await User.find({
      _id: { $ne: req.userID },
    }).select("-password");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Get other users error : ", error });
  }
};

export const search = async (req, res) => {
  try {
    let { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Query is required..." });
    }
    let users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { userName: { $regex: query, $options: "i" } },
      ],
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Search user error : ", error });
  }
};
