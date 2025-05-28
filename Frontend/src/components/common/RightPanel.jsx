import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FaSearch } from "react-icons/fa";
import useFollow from "../../hooks/useFollow";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import LoadingSpinner from "./LoadingSpinner";
import { TRENDING_TOPICS } from "../../utils/db/sampleData";

const RightPanel = () => {
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/suggested");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Something went wrong!");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  const { follow, isPending } = useFollow();

  if (suggestedUsers?.length === 0)
    return <div className="hidden md:block md:w-64"></div>;

  return (
    <div className="fixed top-0 right-4 h-screen w-[450px]">
      <div className="h-full overflow-y-auto no-scrollbar">
        <div className="flex flex-col gap-4 p-4">
          {/* Search Bar */}
          <div className="sticky top-0 bg-black pt-2 z-10">
            <div className="relative">
              <FaSearch className="absolute left-4 top-3.5 text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-gray-900 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-black text-white"
              />
            </div>
          </div>

          {/* Subscribe Card */}
          <div className="bg-gray-900 rounded-2xl p-4">
            <h2 className="text-xl font-bold mb-2">Subscribe to Premium</h2>
            <p className="text-gray-300 mb-3">
              Subscribe to unlock new features and if eligible, receive a share
              of revenue.
            </p>
            <button className="bg-primary text-white rounded-full py-2 px-4 font-bold hover:bg-primary/90 transition-colors">
              Subscribe
            </button>
          </div>

          {/* What's happening */}
          <div className="bg-gray-900 rounded-2xl">
            <h2 className="text-xl font-bold p-4">What's happening</h2>

            {/* Live Now */}
            <div className="px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-800 rounded-xl overflow-hidden">
                  <img
                    src="/posts/post3.png"
                    alt="Live"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <span className="text-red-500">● LIVE</span>
                    <span>Going Public</span>
                  </div>
                  <h3 className="font-bold">Tech IPO News</h3>
                </div>
              </div>
            </div>

            {/* Trending Topics */}
            {TRENDING_TOPICS.map((topic, index) => (
              <div
                key={index}
                className="px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors"
              >
                <div className="text-sm text-gray-500">
                  Trending in {topic.topic}
                </div>
                <div className="font-bold">{topic.hashtag}</div>
                <div className="text-sm text-gray-500">
                  {topic.postCount} posts
                </div>
              </div>
            ))}

            <button className="p-4 text-primary hover:bg-white/5 transition-colors w-full text-left">
              Show more
            </button>
          </div>

          {/* Who to follow */}
          <div className="bg-gray-900 rounded-2xl p-4">
            <h2 className="text-xl font-bold mb-4">Who to follow</h2>
            {isLoading ? (
              <>
                <RightPanelSkeleton />
                <RightPanelSkeleton />
                <RightPanelSkeleton />
              </>
            ) : (
              <div className="flex flex-col gap-4">
                {suggestedUsers?.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center gap-3 justify-between"
                  >
                    <Link
                      to={`/profile/${user.username}`}
                      className="flex items-center gap-3"
                    >
                      <div className="avatar">
                        <div className="w-10 h-10 rounded-full">
                          <img
                            src={user.profileImg || "/avatar-placeholder.png"}
                            alt={user.fullName}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm hover:underline">
                          {user.fullName}
                        </span>
                        <span className="text-gray-500 text-sm">
                          @{user.username}
                        </span>
                      </div>
                    </Link>
                    <button
                      className="btn btn-primary btn-sm text-white rounded-full"
                      onClick={() => follow(user._id)}
                      disabled={isPending}
                    >
                      {isPending ? <LoadingSpinner size="sm" /> : "Follow"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Links */}
          <div className="text-sm text-gray-500">
            <div className="flex flex-wrap gap-2">
              <a
                href="https://enkiduv.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                EnkiduV Development
              </a>
              <a
                href="https://github.com/enkidevs"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                GitHub
              </a>
              <a
                href="https://enkiduv.dev/blog"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Blog
              </a>
              <a
                href="https://enkiduv.dev/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Contact
              </a>
              <a
                href="https://enkiduv.dev/projects"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Projects
              </a>
              <span>© 2025 EnkiduV Development</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
