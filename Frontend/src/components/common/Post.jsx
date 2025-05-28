import {
  FaRegComment,
  FaHeart,
  FaRegHeart,
  FaTrash,
  FaCheck,
  FaRetweet,
} from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import { FiShare } from "react-icons/fi";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import ConfirmationDialog from "./ConfirmationDialog";
import { formatPostDate } from "../../utils/db/date";

const Post = ({ post, isThread = false }) => {
  const [comment, setComment] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();
  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/post/${post._id}`, { method: "DELETE" });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong!");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/post/like/${post._id}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: (updatedLikes) => {
      // not a good UX to refetch all posts
      //queryClient.invalidateQueries({ queryKey: ["posts"] });

      // Instead, we can update the post object in the cache Only
      queryClient.setQueryData(["posts"], (oldData) => {
        return oldData.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: updatedLikes };
          }
          return p;
        });
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/post/comment/${post._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: comment }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Comment posted successfully");
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const postOwner = post.user;
  const isLiked = post.likes.includes(authUser?._id);
  const isMyPost = authUser?._id === post.user._id;
  const formattedDate = formatPostDate(post.createdAt);

  const handleDeletePost = () => {
    setIsDialogOpen(true); // Open the confirmation dialog
  };

  const handleConfirmDelete = () => {
    deletePost();
    setIsDialogOpen(false); // Close the confirmation dialog
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false); // Close the confirmation dialog
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (isCommenting) return;
    commentPost();
  };

  const handleLikePost = () => {
    if (isLiking) return;
    likePost();
  };

  const handleCommentClick = () => {
    // Implementation of handleCommentClick
  };

  const handleLikeClick = () => {
    // Implementation of handleLikeClick
  };

  const handleBookmarkClick = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: Implement bookmark functionality
    toast.success(
      isBookmarked ? "Removed from bookmarks" : "Added to bookmarks"
    );
  };

  return (
    <div
      className={`border-b border-gray-800 p-4 hover:bg-gray-900/50 transition-colors ${
        isThread ? "pt-0 border-l-2 border-l-gray-800 ml-6" : ""
      }`}
    >
      <div className="flex gap-3">
        {/* User Avatar */}
        <div className="flex flex-col items-center">
          <Link to={`/profile/${postOwner.username}`} className="shrink-0">
            <div className="w-10 h-10 rounded-full overflow-hidden hover:opacity-90 transition-opacity">
              <img
                src={postOwner.profileImg || "/avatar-placeholder.png"}
                alt={postOwner.username}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
          {isThread && <div className="w-0.5 grow bg-gray-800 my-2" />}
        </div>

        {/* Post Content */}
        <div className="flex-1 min-w-0">
          {/* Post Header */}
          <div className="flex items-center gap-2 mb-0.5">
            <Link
              to={`/profile/${postOwner.username}`}
              className="font-bold text-white hover:underline truncate flex items-center gap-1"
            >
              {postOwner.fullName}
              {postOwner.verified && (
                <span className="text-primary">
                  <FaCheck className="w-3.5 h-3.5" />
                </span>
              )}
            </Link>
            <div className="flex items-center gap-1 text-gray-500 min-w-0">
              <Link
                to={`/profile/${postOwner.username}`}
                className="hover:underline truncate"
              >
                @{postOwner.username}
              </Link>
              <span>·</span>
              <Link to={`/post/${post._id}`} className="hover:underline">
                <span className="whitespace-nowrap">{formattedDate}</span>
              </Link>
            </div>
            {isMyPost && (
              <button
                onClick={handleDeletePost}
                className="ml-auto text-gray-500 hover:text-red-500 p-1 rounded-full hover:bg-red-500/10"
              >
                {isDeleting ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <FaTrash className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          {/* Thread indicator */}
          {post.isThreadStarter && (
            <div className="text-gray-500 text-sm mb-2">Thread</div>
          )}

          {/* Post Text */}
          <div className="text-[15px] text-white mb-3 break-words whitespace-pre-wrap">
            {post.text}
          </div>

          {/* Post Image */}
          {post.img && (
            <div className="mb-3 rounded-2xl overflow-hidden border border-gray-800 hover:bg-gray-800 transition-colors">
              <img
                src={post.img}
                alt="Post image"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Post Actions */}
          <div className="flex items-center justify-between text-gray-500 max-w-md -ml-2">
            {/* Comment */}
            <button
              className="hover:text-primary flex items-center gap-2 transition-colors group p-2 rounded-full hover:bg-primary/10"
              onClick={handleCommentClick}
            >
              <FaRegComment className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm">{post.comments?.length || 0}</span>
            </button>

            {/* Repost */}
            <button className="hover:text-green-500 flex items-center gap-2 transition-colors group p-2 rounded-full hover:bg-green-500/10">
              <FaRetweet className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm">{post.retweets || 0}</span>
            </button>

            {/* Like */}
            <button
              className={`flex items-center gap-2 transition-colors group p-2 rounded-full ${
                isLiked
                  ? "text-pink-600"
                  : "hover:text-pink-600 hover:bg-pink-600/10"
              }`}
              onClick={handleLikeClick}
            >
              {isLiked ? (
                <FaHeart className="w-4 h-4 group-hover:scale-110 transition-transform" />
              ) : (
                <FaRegHeart className="w-4 h-4 group-hover:scale-110 transition-transform" />
              )}
              <span className="text-sm">{post.likes?.length || 0}</span>
            </button>

            {/* Bookmark */}
            <button
              className="hover:text-primary flex items-center gap-2 transition-colors group p-2 rounded-full hover:bg-primary/10"
              onClick={handleBookmarkClick}
            >
              {isBookmarked ? (
                <FaBookmark className="w-4 h-4 group-hover:scale-110 transition-transform" />
              ) : (
                <FaRegBookmark className="w-4 h-4 group-hover:scale-110 transition-transform" />
              )}
            </button>

            {/* Share */}
            <button className="hover:text-primary flex items-center gap-2 transition-colors group p-2 rounded-full hover:bg-primary/10">
              <FiShare className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
      />
    </div>
  );
};

export default Post;
