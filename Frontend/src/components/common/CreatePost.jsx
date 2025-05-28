import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { FaTimes, FaImage, FaGlobe, FaLock } from "react-icons/fa";
import { MdGif, MdSchedule } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";

const MAX_CHARS = 280;

const CreatePost = ({ replyTo = null, onSuccess = () => {} }) => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [isPublic, setIsPublic] = useState(true);
  const imgRef = useRef(null);
  const textareaRef = useRef(null);

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const {
    mutate: createPost,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ text, img }) => {
      try {
        const res = await fetch("/api/post/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, img, replyTo, isPublic }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      setText("");
      setImg(null);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success(
        replyTo ? "Reply posted successfully" : "Post created successfully"
      );
      onSuccess();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isPending) return;
    createPost({ text, img });
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setText(value);
    }
  };

  const charsLeft = MAX_CHARS - text.length;
  const isOverLimit = charsLeft < 0;
  const isNearLimit = charsLeft <= 20;

  return (
    <div className="border-b border-gray-800 p-4">
      <div className="flex gap-3">
        {/* User Avatar */}
        <div className="shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src={authUser?.profileImg || "/avatar-placeholder.png"}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Post Input Area */}
        <div className="flex-1">
          {/* Privacy Toggle */}
          <div className="mb-2">
            <button
              onClick={() => setIsPublic(!isPublic)}
              className="text-primary text-sm font-medium rounded-full border border-primary/30 px-3 py-0.5 hover:bg-primary/10 transition-colors flex items-center gap-1"
            >
              {isPublic ? (
                <>
                  <FaGlobe className="w-3 h-3" />
                  <span>Everyone can reply</span>
                </>
              ) : (
                <>
                  <FaLock className="w-3 h-3" />
                  <span>Only followers can reply</span>
                </>
              )}
            </button>
          </div>

          <textarea
            ref={textareaRef}
            className="w-full bg-transparent border-none outline-none text-[20px] min-h-[50px] resize-none placeholder:text-gray-600 mb-2"
            placeholder={replyTo ? "Post your reply" : "What's happening?"}
            value={text}
            onChange={handleTextChange}
            rows={Math.min(5, Math.max(2, text.split("\n").length))}
          />

          {/* Image Preview */}
          {img && (
            <div className="relative mt-2 mb-4 group">
              <img
                src={img}
                alt="Selected"
                className="rounded-2xl max-h-[300px] w-auto border border-gray-800"
              />
              <button
                onClick={() => {
                  setImg(null);
                  imgRef.current.value = null;
                }}
                className="absolute top-2 right-2 bg-black/50 rounded-full p-2 hover:bg-black/75 transition-colors opacity-0 group-hover:opacity-100"
              >
                <IoCloseSharp className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-800">
            <div className="flex gap-1 text-primary">
              {/* Image Upload */}
              <label className="cursor-pointer hover:bg-primary/10 rounded-full p-2 transition-colors">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImgChange}
                  accept="image/*"
                  ref={imgRef}
                />
                <CiImageOn className="w-5 h-5" />
              </label>

              {/* GIF */}
              <button className="hover:bg-primary/10 rounded-full p-2 transition-colors">
                <MdGif className="w-5 h-5" />
              </button>

              {/* Emoji */}
              <button className="hover:bg-primary/10 rounded-full p-2 transition-colors">
                <BsEmojiSmileFill className="w-5 h-5" />
              </button>

              {/* Schedule */}
              <button className="hover:bg-primary/10 rounded-full p-2 transition-colors">
                <MdSchedule className="w-5 h-5" />
              </button>

              {/* Location */}
              <button className="hover:bg-primary/10 rounded-full p-2 transition-colors">
                <HiOutlineLocationMarker className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Character Counter */}
              {text.length > 0 && (
                <div className="flex items-center">
                  <div
                    className={`text-sm ${
                      isOverLimit
                        ? "text-red-500"
                        : isNearLimit
                        ? "text-yellow-500"
                        : "text-gray-500"
                    }`}
                  >
                    {charsLeft}
                  </div>
                </div>
              )}

              {/* Post Button */}
              <button
                className={`px-4 py-1.5 rounded-full font-semibold text-[15px] ${
                  (!text && !img) || isOverLimit
                    ? "bg-primary/50 text-white/50 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary/90 transition-colors"
                }`}
                disabled={(!text && !img) || isPending || isOverLimit}
                onClick={handleSubmit}
              >
                {isPending ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : replyTo ? (
                  "Reply"
                ) : (
                  "Post"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
