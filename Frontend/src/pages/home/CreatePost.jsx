import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { FaTimes, FaImage } from "react-icons/fa";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const imgRef = useRef(null);

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const {
    mutate: CreatePost,
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
          body: JSON.stringify({ text, img }),
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
      toast.success("Post created successfully");
    },
  });

  const data = {
    profileImg: "/avatars/boy1.png",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    CreatePost({ text, img });
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
          <textarea
            className="w-full bg-transparent border-none outline-none text-[15px] min-h-[50px] resize-none placeholder:text-gray-600"
            placeholder="What's happening?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={Math.min(5, Math.max(2, text.split("\n").length))}
          />

          {/* Image Preview */}
          {img && (
            <div className="relative mt-2 mb-4">
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
                className="absolute top-2 right-2 bg-black/50 rounded-full p-1 hover:bg-black/75"
              >
                <IoCloseSharp className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-2 text-primary">
              <label className="cursor-pointer hover:bg-primary/10 rounded-full p-2">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImgChange}
                  accept="image/*"
                  ref={imgRef}
                />
                <CiImageOn className="w-5 h-5" />
              </label>
            </div>

            <button
              className={`px-4 py-1.5 rounded-full font-semibold ${
                !text && !img
                  ? "bg-primary/50 text-white/50 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
              disabled={(!text && !img) || isPending}
              onClick={handleSubmit}
            >
              {isPending ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Post"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreatePost;
