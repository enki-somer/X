import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import CreatePost from "../../components/common/CreatePost";
import PostSkeleton from "../../components/common/PostSkeleton";
import Post from "../../components/common/Post";
import { SAMPLE_POSTS } from "../../utils/db/sampleData";

const HomePage = () => {
  const [feedType, setFeedType] = useState("forYou");
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts", feedType],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/post/feed?type=${feedType}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Error fetching posts");
        }
        return data;
      } catch (error) {
        // For demo purposes, return sample data
        console.log("Using sample data:", error);
        return SAMPLE_POSTS;
      }
    },
  });

  // Group posts by thread
  const organizedPosts = posts?.reduce(
    (acc, post) => {
      if (post.threadId) {
        if (!acc.threads[post.threadId]) {
          acc.threads[post.threadId] = [];
        }
        acc.threads[post.threadId].push(post);
      } else {
        acc.standalone.push(post);
      }
      return acc;
    },
    { threads: {}, standalone: [] }
  );

  const renderPosts = () => {
    if (!organizedPosts) return null;

    const elements = [];

    // Add standalone posts
    organizedPosts.standalone.forEach((post) => {
      elements.push(<Post key={post._id} post={post} />);
    });

    // Add thread posts
    Object.values(organizedPosts.threads).forEach((thread) => {
      // Sort thread posts by position
      const sortedThread = [...thread].sort(
        (a, b) => a.threadPosition - b.threadPosition
      );

      sortedThread.forEach((post, index) => {
        elements.push(<Post key={post._id} post={post} isThread={index > 0} />);
      });
    });

    return elements;
  };

  return (
    <main className="flex-1 border-x border-gray-800 min-h-screen max-w-[600px]">
      {/* Fixed Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold">Home</h1>
        </div>

        {/* Feed Type Tabs */}
        <div className="flex">
          <button
            onClick={() => setFeedType("forYou")}
            className={`flex-1 py-4 relative hover:bg-white/5 transition-colors ${
              feedType === "forYou" ? "font-bold" : ""
            }`}
          >
            For you
            {feedType === "forYou" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setFeedType("following")}
            className={`flex-1 py-4 relative hover:bg-white/5 transition-colors ${
              feedType === "following" ? "font-bold" : ""
            }`}
          >
            Following
            {feedType === "following" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
            )}
          </button>
        </div>
      </header>

      {/* Create Post */}
      <div className="border-b border-gray-800">
        <CreatePost />
      </div>

      {/* Posts Feed */}
      <div className="pb-16">
        {isLoading ? (
          <div className="flex flex-col">
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>
        ) : (
          <div className="flex flex-col">
            {renderPosts()}
            {(!posts || posts.length === 0) && (
              <div className="flex flex-col items-center justify-center gap-2 p-8">
                <p className="text-xl font-bold">Welcome to X</p>
                <p className="text-gray-500 text-center">
                  Follow some accounts to start seeing posts in your feed
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default HomePage;
