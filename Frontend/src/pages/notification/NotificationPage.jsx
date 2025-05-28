import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart, FaComment } from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

const NotificationPage = () => {
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch("/api/notification?markAsRead=true");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Error fetching notifications");
      }
      return data.notifications;
    },
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }, [queryClient]);

  const { mutate: deleteAllNotifications } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/notification", {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Error deleting notifications");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications deleted");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="max-w-2xl flex-1 border-x border-gray-700 min-h-screen pb-36">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <p className="font-bold">Notifications</p>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="m-1">
            <IoSettingsOutline className="w-4" />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <button onClick={() => deleteAllNotifications()}>
                Delete all notifications
              </button>
            </li>
          </ul>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center h-full items-center">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {!isLoading && notifications?.length === 0 && (
        <div className="text-center p-4 font-bold">No notifications 🤔</div>
      )}

      {!isLoading &&
        notifications?.map((notification) => (
          <div className="border-b border-gray-700" key={notification._id}>
            <div className="flex gap-4 p-4 items-start">
              <div>
                {notification.type === "follow" && (
                  <FaUser className="w-5 h-5 text-primary mt-1" />
                )}
                {notification.type === "like" && (
                  <FaHeart className="w-5 h-5 text-red-500 mt-1" />
                )}
                {notification.type === "comment" && (
                  <FaComment className="w-5 h-5 text-blue-500 mt-1" />
                )}
              </div>

              <div className="flex-1">
                <Link
                  to={`/profile/${notification.from.username}`}
                  className="hover:underline"
                >
                  <span className="font-bold">
                    @{notification.from.username}
                  </span>
                </Link>{" "}
                {notification.type === "follow" && "followed you"}
                {notification.type === "like" && "liked your post"}
                {notification.type === "comment" && (
                  <>
                    commented on your post:
                    <p className="text-gray-400 mt-1">{notification.text}</p>
                  </>
                )}
                {notification.post && notification.post.text && (
                  <div className="mt-2 p-3 bg-gray-800 rounded-lg">
                    <p className="text-gray-300">{notification.post.text}</p>
                    {notification.post.img && (
                      <img
                        src={notification.post.img}
                        alt="Post image"
                        className="mt-2 rounded-lg max-h-40 object-cover"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default NotificationPage;
