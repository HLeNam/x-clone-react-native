import useCurrentUser from "@/hooks/useCurrentUser";
import { useApiClient, userApi } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Alert } from "react-native";

const useProfile = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    location: "",
  });

  const { currentUser } = useCurrentUser();

  const updateProfileMutation = useMutation({
    mutationFn: (profileData: any) => userApi.updateProfile(api, profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      setIsEditModalVisible(false);
      Alert.alert("Success", "Profile updated successfully!");
    },
    onError: (error: any) => {
      console.log("🚀 ~ useProfile ~ error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to update profile",
      );
    },
  });

  const openEditModal = () => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        bio: currentUser.bio || "",
        location: currentUser.location || "",
      });
    }

    setIsEditModalVisible(true);
  };

  const updateFormField = (field: keyof typeof formData, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  return {
    isEditModalVisible,
    openEditModal,
    closeEditModal: () => setIsEditModalVisible(false),
    formData,
    saveProfile: () => updateProfileMutation.mutate(formData),
    updateFormField,
    isUpdating: updateProfileMutation.isPending,
    refresh: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  };
};

export default useProfile;
