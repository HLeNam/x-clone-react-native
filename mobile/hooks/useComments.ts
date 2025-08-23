import { commentApi, useApiClient } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Alert } from "react-native";

const useComments = () => {
  const [commentText, setCommentText] = useState("");
  const api = useApiClient();

  const queryClient = useQueryClient();

  const createCommentMutation = useMutation({
    mutationFn: async ({
      postId,
      content,
    }: {
      postId: string;
      content: string;
    }) => {
      const response = await commentApi.createComment(api, postId, content);
      return response.data;
    },

    // optimistic update
    onMutate: async ({ postId, content }) => {
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

      queryClient.setQueryData(["posts"], (old: any) => {
        if (!old) return old;

        const updatedPosts = old.data.metadata.posts.map((post: any) => {
          if (post._id === postId) {
            return {
              ...post,
              comments: [
                ...post.comments,
                {
                  _id: Date.now().toString(),
                  content,
                  user: currentUser,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              ],
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

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },

    onSuccess: () => {
      setCommentText("");
      // queryClient.invalidateQueries({ queryKey: ["posts"] });
    },

    onError: (err, postId, context) => {
      Alert.alert("Error", "Failed to create comment. Please try again.");

      // Rollback trên error
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
    },
  });

  const createComment = (postId: string) => {
    if (!commentText.trim()) {
      Alert.alert("Empty Comment", "Please write something before posting!");
      return;
    }

    createCommentMutation.mutate({
      postId,
      content: commentText.trim(),
    });
  };

  return {
    commentText,
    setCommentText,
    createComment,
    isCreatingComment: createCommentMutation.isPending,
  };
};

export default useComments;
