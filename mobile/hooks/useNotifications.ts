import { useApiClient } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useNotifications = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const {
    data: notifications,
    isLoading,
    isRefetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => api.get("/notifications"),
    select: (res) => res.data.metadata.notifications,
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (notificationId: string) =>
      api.delete(`/notifications/${notificationId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleDeleteNotification = (notificationId: string) => {
    deleteNotificationMutation.mutate(notificationId);
  };

  return {
    notifications: notifications || [],
    isLoading,
    error,
    refetch,
    isRefetching,
    deleteNotification: handleDeleteNotification,
    isDeletingNotification: deleteNotificationMutation.isPending,
  };
};

export default useNotifications;
