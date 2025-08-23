import { postApi, useApiClient } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const usePosts = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const {
    data: postsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["posts"],
    queryFn: () => postApi.getPosts(api),
    select: (response) => response.data.metadata.posts,
  });

  const likePostMutation = useMutation({
    mutationFn: (postId: string) => postApi.likePost(api, postId),

    // optimistic update
    onMutate: async (postId: string) => {
      // Hủy bỏ các queries đang chạy để tránh conflict
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Lấy previous posts (đã được transform bởi select)
      const previousPosts = queryClient.getQueryData(["posts"]) as any[];

      // Lấy current user
      const currentUserResponse = queryClient.getQueryData(["authUser"]) as any;
      const currentUser = currentUserResponse?.data?.metadata;

      if (!currentUser || !previousPosts) {
        return { previousPosts };
      }

      // Optimistically update posts
      queryClient.setQueryData(["posts"], (old: any) => {
        if (!old) return old;

        const updatedPosts = old.data.metadata.posts.map((post: any) => {
          if (post._id === postId) {
            const isCurrentlyLiked = post.likes.includes(currentUser._id);

            const likes = isCurrentlyLiked
              ? post.likes.filter((id: string) => id !== currentUser._id) // Unlike
              : [...post.likes, currentUser._id]; // Like

            return {
              ...post,
              likes,
            };
          }
          return post;
        });

        return {
          ...old,
          data: {
            ...old.data,
            metadata: {
              ...old.data.metadata,
              posts: updatedPosts,
            },
          },
        };
      });

      return { previousPosts };
    },

    onError: (err, postId, context) => {
      // Rollback trên error
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: (postId: string) => postApi.deletePost(api, postId),

    // optimistic update
    onMutate: async (postId: string) => {
      // Hủy bỏ các queries đang chạy để tránh conflict
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Lấy previous posts (đã được transform bởi select)
      const previousPosts = queryClient.getQueryData(["posts"]) as any[];

      // Optimistically update posts
      queryClient.setQueryData(["posts"], (old: any) => {
        if (!old) return old;

        const updatedPosts = old.data.metadata.posts.filter(
          (post: any) => post._id !== postId,
        );

        return {
          ...old,
          data: {
            ...old.data,
            metadata: {
              ...old.data.metadata,
              posts: updatedPosts,
            },
          },
        };
      });

      return { previousPosts };
    },

    onError: (err, postId, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["userPosts"],
      });
    },
  });

  const checkIsLiked = (postLikes: string[], currentUser: any) => {
    const isLiked = currentUser && postLikes.includes(currentUser._id);
    return isLiked;
  };

  return {
    posts: postsData || [],
    isLoading,
    error,
    refetch,
    toggleLike: (postId: string) => likePostMutation.mutate(postId),
    deletePost: (postId: string) => deletePostMutation.mutate(postId),
    checkIsLiked,
  };
};

export default usePosts;
