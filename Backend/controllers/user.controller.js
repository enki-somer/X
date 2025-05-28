import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(" Error in getUserProfile: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);
    if (id === req.user._id.toString()) {
      return res.status(400).json({ error: "You can't follow yourself" });
    }
    if (!userToModify || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      // Unfollow
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

      //TODO: return the id of the user as a response

      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      // Follow
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      // Send notification to the user

      const newNotification = new Notification({
        from: req.user._id,
        to: userToModify._id,
        type: "follow",
      });
      await newNotification.save();

      //TODO: return the id of the user as a response

      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.error(" Error in followUnfollowUser: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    //to excluse users followed by me from the suggested users
    const userId = req.user._id;
    const usersFollowedByMe = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: { _id: { $ne: userId } },
      },
      { $sample: { size: 10 } },
    ]);

    const filtteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );
    const suggestedUsers = filtteredUsers.slice(0, 4);
    suggestedUsers.forEach((user) => {
      user.password = null;
    });

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.error(" Error in getSuggestedUsers: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  const { username, fullName, email, currentPassword, newPassword, bio, link } =
    req.body;
  let { profileImg, coverImg } = req.body;

  const userId = req.user._id;

  try {
    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if ((!newPassword && currentPassword) || (!currentPassword && newPassword))
      return res
        .status(400)
        .json({ error: "Please provide both current and new password" });

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res
          .status(400)
          .json({ error: "current password is not correct" });
      if (newPassword.length < 6)
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters" });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }
    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }

      const uplodedResponse = await cloudinary.uploader.upload(profileImg);

      profileImg = uplodedResponse.secure_url;
    }

    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }
      const uplodedResponse = await cloudinary.uploader.upload(coverImg);

      coverImg = uplodedResponse.secure_url;
    }
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;
    user.username = username || user.username;

    await user.save();
    user.password = null;
    res.status(200).json(user);
  } catch (error) {
    console.error(" Error in updateUser: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const followers = await User.find({ _id: { $in: user.followers } })
      .select("-password")
      .lean();

    res.status(200).json(followers);
  } catch (error) {
    console.error("Error in getFollowers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const following = await User.find({ _id: { $in: user.following } })
      .select("-password")
      .lean();

    res.status(200).json(following);
  } catch (error) {
    console.error("Error in getFollowing:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removeFollower = async (req, res) => {
  try {
    const { id } = req.params; // ID of the follower to remove
    const userToRemove = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (!userToRemove || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user is actually a follower
    if (!currentUser.followers.includes(id)) {
      return res.status(400).json({ error: "This user is not following you" });
    }

    // Remove the follower from current user's followers
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { followers: id },
    });

    // Remove current user from the follower's following list
    await User.findByIdAndUpdate(id, {
      $pull: { following: req.user._id },
    });

    res.status(200).json({ message: "Follower removed successfully" });
  } catch (error) {
    console.error("Error in removeFollower:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
