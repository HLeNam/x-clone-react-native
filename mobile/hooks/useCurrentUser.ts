import { User } from "@/types";
import { useApiClient, userApi } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const useCurrentUser = () => {
  const api = useApiClient();

  const {
    data: currentUser,
    isLoading: isLoadingCurrentUser,
    error: currentUserError,
    refetch: refetchCurrentUser,
  } = useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["authUser"],
    queryFn: () => userApi.getCurrentUser(api),
    select: (response) => response.data.metadata,
  });

  return {
    currentUser: currentUser as User,
    isLoadingCurrentUser,
    currentUserError,
    refetchCurrentUser,
  };
};

export default useCurrentUser;
