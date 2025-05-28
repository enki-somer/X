import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useRemoveFollower = () => {
  const queryClient = useQueryClient();

  const { mutate: removeFollower, isPending } = useMutation({
    mutationFn: async (userId) => {
      try {
        const res = await fetch(`/api/users/remove-follower/${userId}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong!");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["userConnections"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Follower removed successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { removeFollower, isPending };
};

export default useRemoveFollower;
