import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getUserProfile,
  followUnfollowUser,
  getSuggestedUsers,
  updateUser,
  getFollowers,
  getFollowing,
  removeFollower,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.post("/update", protectRoute, updateUser);
router.get("/:username/followers", protectRoute, getFollowers);
router.get("/:username/following", protectRoute, getFollowing);
router.post("/remove-follower/:id", protectRoute, removeFollower);

export default router;
