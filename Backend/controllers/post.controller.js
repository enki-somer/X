import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;

    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!text && !img) {
      return res.status(400).json({ message: "Post must have text or image" });
    }

    if (img) {
      const uploedResponse = await cloudinary.uploader.upload(img);
      img = uploedResponse.secure_url;
    }

    const newPost = new Post({
      text,
      img,
      user: userId,
    });

    await newPost.save();
    return res.status(201).json({ message: "Post created" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "You can only delete your own posts" });
    }
    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    await Post.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!text) {
      return res.status(400).json({ message: "Comment must have text" });
    }
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = { user: userId, text };
    post.comments.push(comment);
    await post.save();

    // Create notification for post owner if the commenter is not the post owner
    if (post.user.toString() !== userId.toString()) {
      console.log("Creating comment notification:", {
        from: userId,
        to: post.user,
        type: "comment",
        postId: postId,
        text: text,
      });
      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "comment",
        post: postId,
        text: text,
      });
      await notification.save();
      console.log("Comment notification created successfully");
    } else {
      console.log("No notification created - user commented on their own post");
    }

    res.status(200).json(post);
  } catch (error) {
    console.log("Error in commentOnPost:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const ifUserLiked = post.likes.includes(userId);

    if (ifUserLiked) {
      // unlike
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

      const updatedLikes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );

      res.status(200).json(updatedLikes);
    } else {
      // like
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      await post.save();

      // Only create notification if the liker is not the post owner
      if (post.user.toString() !== userId.toString()) {
        console.log("Creating like notification:", {
          from: userId,
          to: post.user,
          type: "like",
          postId: postId,
        });
        const notification = new Notification({
          from: userId,
          to: post.user,
          type: "like",
          post: postId,
        });
        await notification.save();
        console.log("Like notification created successfully");
      } else {
        console.log("No notification created - user liked their own post");
      }

      const updatedLikes = post.likes;
      res.status(200).json(updatedLikes);
    }
  } catch (error) {
    console.log("Error in likeUnlikePost:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (posts.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(posts);
  } catch (error) {
    console.log("error in getAllPosts", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getLikesPost = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });
    res.status(200).json(likedPosts);
  } catch (error) {
    console.log("error in getLikesPost", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const following = user.following;

    const feedPost = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    res.status(200).json(feedPost);
  } catch (error) {
    console.log("error in getFollowingPosts", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    res.status(200).json(posts);
  } catch (error) {
    console.log("error in getUserPosts", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
