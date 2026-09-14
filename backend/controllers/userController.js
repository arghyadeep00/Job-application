import User from "../models/User.js";
import cloudinary from "../services/cloudinary.js";
import avatarUploadCloudinary from "../utils/avatarUploadCloudinary.js";
import resumeUploadCloudinary from "../utils/resumeUploadCloudinary.js";
export const avatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file require",
      });
    }
    const user = await User.findById(req.user.id);

    // check image present or not
    if (user.avatar?.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    // new image upload
    const uploadAvatar = await avatarUploadCloudinary(req.file.buffer);
    await User.findByIdAndUpdate(
      req.user.id,
      {
        avatar: {
          url: uploadAvatar.secure_url,
          public_id: uploadAvatar.public_id,
        },
      },
      {
        new: true,
      },
    );

    return res.status(201).json({
      success: true,
      message: "Profile update success",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
export const profile = async (req, res) => {
  try {
    const { firstname, middlename, lastname } = req.body;

    const updateFields = {};

    if (firstname !== undefined) updateFields.firstname = firstname;
    if (middlename !== undefined) updateFields.middlename = middlename;
    if (lastname !== undefined) updateFields.lastname = lastname;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided to update",
      });
    }

    await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true },
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
export const personal = async (req, res) => {
  try {
    const { phone, gender, dob, location } = req.body;
    const updateFields = {};

    if (phone !== undefined) updateFields.phone = phone;
    if (gender !== undefined) updateFields.gender = gender;
    if (dob !== undefined) updateFields.dob = dob;
    if (location !== undefined) updateFields.location = location;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided to update",
      });
    }

    await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true },
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
export const skills = async (req, res) => {
  try {
    const { skills, companyName, year } = req.body;

    const updateData = {};

    if (skills) updateData.skills = skills;

    if (companyName || year) {
      updateData.experience = {
        companyName,
        year
      };
    }

    await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false });
  }

};
export const education = async (req, res) => {
  try {
    const { board, endDate, institution, level, percentage, startDate } =
      req.body;

    const updateFields = {};

    if (board !== undefined) updateFields.board = board;
    if (endDate !== undefined) updateFields.endDate = endDate;
    if (institution !== undefined) updateFields.institution = institution;
    if (level !== undefined) updateFields.level = level;
    if (percentage !== undefined) updateFields.percentage = percentage;
    if (startDate !== undefined) updateFields.startDate = startDate;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided to update",
      });
    }
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { education: updateFields } },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
export const resume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Pdf file require",
      });
    }

    const user = await User.findById(req.user.id);

    // check resume present or not
    if (user.resume?.public_id) {
      await cloudinary.uploader.destroy(user.resume.public_id);
    }

    // new resume upload
    const uploadResume = await resumeUploadCloudinary(req.file.buffer);

    await User.findByIdAndUpdate(
      req.user.id,
      {
        resume: {
          url: uploadResume.secure_url,
          public_id: uploadResume.public_id,
        },
      },
      {
        new: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Resume updated",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
