import XSvg from "../svgs/X";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { toast } from "react-hot-toast";

const Sidebar = () => {
  const queryClient = useQueryClient();
  const location = useLocation();

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch("/api/notification");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Error fetching notifications");
      }
      return data.notifications;
    },
    // Don't fetch notifications on notifications page
    enabled: location.pathname !== "/notifications",
  });

  const hasUnreadNotifications = notifications?.some(
    (notification) => !notification.read
  );

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  return (
    <div className="fixed h-screen flex flex-col justify-between py-2 px-3">
      <div className="flex flex-col">
        {/* Desktop Logo */}
        <Link to="/" className="block p-3 mb-1">
          <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </Link>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1">
          <Link
            to="/"
            className={`flex items-center gap-4 p-3 rounded-full hover:bg-gray-900 transition-colors text-xl ${
              location.pathname === "/" ? "font-bold" : ""
            }`}
          >
            <MdHomeFilled className="w-7 h-7" />
            <span className="hidden md:block">Home</span>
          </Link>
          <Link
            to="/notifications"
            className={`flex items-center gap-4 p-3 rounded-full hover:bg-gray-900 transition-colors text-xl ${
              location.pathname === "/notifications" ? "font-bold" : ""
            }`}
          >
            <div className="relative">
              <IoNotifications className="w-7 h-7" />
              {hasUnreadNotifications && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full"></div>
              )}
            </div>
            <span className="hidden md:block">Notifications</span>
          </Link>
          <Link
            to={`/profile/${authUser?.username}`}
            className={`flex items-center gap-4 p-3 rounded-full hover:bg-gray-900 transition-colors text-xl ${
              location.pathname === `/profile/${authUser?.username}`
                ? "font-bold"
                : ""
            }`}
          >
            <FaUser className="w-7 h-7" />
            <span className="hidden md:block">Profile</span>
          </Link>
        </nav>

        {/* Post Button */}
        <button className="w-full bg-primary text-white rounded-full py-3 px-4 text-lg font-bold mt-4 hover:bg-primary/90 transition-colors">
          Post
        </button>
      </div>

      {/* User Profile Button */}
      {authUser && (
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 p-3 rounded-full hover:bg-gray-900 transition-colors w-full mt-auto"
        >
          <img
            src={authUser?.profileImg || "/avatar-placeholder.png"}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1 text-left hidden md:block">
            <div className="font-bold text-sm truncate">
              {authUser.fullName}
            </div>
            <div className="text-gray-500 text-sm">@{authUser.username}</div>
          </div>
          <BiLogOut className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default Sidebar;
