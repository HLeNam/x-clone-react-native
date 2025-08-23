import { Post, User } from "@/types";
import { formatDate, formatNumber } from "@/utils/formatters";
import { View, Text, Alert, Image, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onDelete: (postId: string) => void;
  currentUser: User;
  isLiked?: boolean;
}

const PostCard = ({
  post,
  onLike,
  onDelete,
  currentUser,
  isLiked,
}: PostCardProps) => {
  const isOwnPost = post.user._id === currentUser._id;

  const fullName = `${post.user.firstName} ${post.user.lastName}`;

  const handleDelete = () => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => onDelete(post._id),
      },
    ]);
  };

  return (
    <View className="border-b border-gray-100 bg-white">
      <View className="flex-row p-4">
        <Image
          source={{ uri: post.user.profilePicture || "" }}
          className="mr-3 h-12 w-12 rounded-full"
        />

        <View className="flex-1">
          <View className="mb-1 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="mr-1 font-bold text-gray-900">{fullName}</Text>

              <Text className="ml-1 text-gray-500">
                @{post.user.username} • {formatDate(post.createdAt)}
              </Text>
            </View>
            {isOwnPost && (
              <TouchableOpacity onPress={handleDelete}>
                <Feather name="trash" size={20} color="#657786" />
              </TouchableOpacity>
            )}
          </View>

          {post.content && (
            <Text className="mb-3 text-base leading-5 text-gray-900">
              {post.content}
            </Text>
          )}

          {post.image && (
            <Image
              source={{ uri: post.image }}
              className="mb-3 h-48 w-full rounded-2xl"
              resizeMode="cover"
            />
          )}

          <View className="max-w-xs flex-row justify-between">
            <TouchableOpacity
              className="flex-row items-center"
              // onPress={() => onComment(post)}
            >
              <Feather name="message-circle" size={18} color={"#657786"} />
              <Text className="ml-2 text-sm text-gray-500">
                {formatNumber(post.comments?.length || 0)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center">
              <Feather name="repeat" size={18} color={"#657786"} />
              <Text className="ml-2 text-sm text-gray-500">0</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => onLike(post._id)}
            >
              {isLiked ? (
                <AntDesign name="heart" size={18} color={"#E0245E"} />
              ) : (
                <Feather name="heart" size={18} color={"#657786"} />
              )}

              <Text
                className={`ml-2 text-sm ${isLiked ? "text-red-500" : "text-gray-500"}`}
              >
                {formatNumber(post.likes?.length || 0)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Feather name="share" size={18} color={"#657786"} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PostCard;
