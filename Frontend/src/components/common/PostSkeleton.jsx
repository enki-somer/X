const PostSkeleton = () => {
  return (
    <div className="border-b border-gray-800 p-4 flex gap-3">
      {/* Avatar Skeleton */}
      <div className="shrink-0">
        <div className="w-10 h-10 rounded-full bg-gray-800 animate-pulse" />
      </div>

      {/* Content Skeleton */}
      <div className="flex-1">
        {/* Header Skeleton */}
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 w-24 bg-gray-800 rounded animate-pulse" />
          <div className="h-4 w-16 bg-gray-800 rounded animate-pulse" />
        </div>

        {/* Text Skeleton */}
        <div className="space-y-2 mb-3">
          <div className="h-4 w-3/4 bg-gray-800 rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-gray-800 rounded animate-pulse" />
        </div>

        {/* Actions Skeleton */}
        <div className="flex justify-between max-w-md mt-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-8 h-4 bg-gray-800 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;
