import SignOutButton from "@/components/SignOutButton";
import useUserSync from "@/hooks/useUserSync";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import PostComposer from "@/components/PostComposer";
import PostList from "@/components/PostList";
import { useState } from "react";
import usePosts from "@/hooks/usePosts";

const HomeScreen = () => {
  const [isRefetching, setIsRefetching] = useState(false);

  const { refetch: refreshPosts } = usePosts();

  const handlePullToRefresh = async () => {
    setIsRefetching(true);

    await refreshPosts();

    setIsRefetching(false);
  };

  useUserSync();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3">
        <Ionicons name="logo-twitter" size={24} color={"#1DA1F2"} />
        <Text className="text-xl font-bold text-gray-900">Home</Text>
        <SignOutButton />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handlePullToRefresh}
            tintColor={"#1DA1F2"}
          />
        }
      >
        <PostComposer />
        <PostList />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
