import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import useFollow from "../../hooks/useFollow";
import useRemoveFollower from "../../hooks/useRemoveFollower";
import { FaArrowLeft } from "react-icons/fa6";

const FollowModal = ({ type, username, onClose }) => {
  const { follow, isPending: isFollowPending } = useFollow();
  const { removeFollower, isPending: isRemovePending } = useRemoveFollower();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { data: users, isLoading } = useQuery({
    queryKey: ["userConnections", username, type],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/${username}/${type}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || `Failed to fetch ${type}`);
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  const isOwnProfile = authUser?.username === username;

  return (
    <dialog id={`${type}_modal`} className="modal">
      <div className="modal-box border rounded-md border-gray-700 shadow-md p-0">
        <div className="flex items-center gap-4 p-4 border-b border-gray-700">
          <button onClick={onClose}>
            <FaArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h3 className="font-bold text-lg">
              {type === "followers" ? "Followers" : "Following"}
            </h3>
            <p className="text-sm text-gray-400">@{username}</p>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-gray-700">
          {isLoading ? (
            <div className="p-4 text-center">
              <span className="loading loading-spinner loading-md"></span>
            </div>
          ) : !users?.length ? (
            <div className="p-4 text-center text-gray-500">No {type} yet</div>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-4 hover:bg-gray-800/50"
              >
                <Link
                  to={`/profile/${user.username}`}
                  className="flex items-center gap-3 flex-1"
                  onClick={onClose}
                >
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-full">
                      <img
                        src={user.profileImg || "/avatar-placeholder.png"}
                        alt={user.fullName}
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold">{user.fullName}</h4>
                    <p className="text-sm text-gray-400">@{user.username}</p>
                    <p className="text-sm text-gray-400 line-clamp-1">
                      {user.bio}
                    </p>
                  </div>
                </Link>
                <div className="flex items-center gap-2">
                  {isOwnProfile && type === "followers" && (
                    <button
                      className="btn btn-outline btn-sm text-red-500 hover:bg-red-500/10 hover:border-red-500 rounded-full"
                      onClick={() => removeFollower(user._id)}
                      disabled={isRemovePending}
                    >
                      {isRemovePending ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        "Remove"
                      )}
                    </button>
                  )}
                  {authUser?._id !== user._id && type === "following" && (
                    <button
                      className={`btn ${
                        user.followers?.includes(authUser?._id)
                          ? "btn-outline"
                          : "btn-primary text-white"
                      } rounded-full btn-sm`}
                      onClick={() => follow(user._id)}
                      disabled={isFollowPending}
                    >
                      {isFollowPending ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : user.followers?.includes(authUser?._id) ? (
                        "Unfollow"
                      ) : (
                        "Follow"
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button className="outline-none">close</button>
      </form>
    </dialog>
  );
};

export default FollowModal;
