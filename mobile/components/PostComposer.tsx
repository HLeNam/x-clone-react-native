import useCreatePost from "@/hooks/useCreatePost";
import { useUser } from "@clerk/clerk-expo";
import Feather from "@expo/vector-icons/Feather";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

const PostComposer = () => {
  const {
    content,
    setContent,
    selectedImage,
    isCreating,
    pickImageFromGallery,
    takePhoto,
    removeImage,
    createPost,
  } = useCreatePost();

  const { user } = useUser();

  return (
    <View className="border-b border-gray-100 bg-white p-4">
      <View className="flex-row">
        <Image
          source={{ uri: user?.imageUrl }}
          className="mr-3 h-12 w-12 rounded-full"
        />
        <View className="flex-1">
          <TextInput
            className="text-lg text-gray-900"
            placeholder="What's happening?"
            placeholderTextColor="#657786"
            multiline
            value={content}
            onChangeText={setContent}
            maxLength={280}
          />
        </View>
      </View>

      {selectedImage && (
        <View className="ml-15 mt-3">
          <View className="relative">
            <Image
              source={{ uri: selectedImage }}
              className="h-48 w-full rounded-2xl"
              resizeMode="cover"
            />
            <TouchableOpacity
              className="absolute right-2 top-2 h-8 w-8 items-center justify-center rounded-full bg-black/60"
              onPress={removeImage}
            >
              <Feather name="x" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View className="mt-3 flex-row items-center justify-between">
        <View className="flex-row">
          <TouchableOpacity className="mr-4" onPress={pickImageFromGallery}>
            <Feather name="image" size={20} color="#1DA1F2" />
          </TouchableOpacity>
          <TouchableOpacity className="mr-4" onPress={takePhoto}>
            <Feather name="camera" size={20} color="#1DA1F2" />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center">
          {content.length > 0 && (
            <Text
              className={`mr-3 text-sm ${content.length > 260 ? "text-red-500" : "text-gray-500"}`}
            >
              {280 - content.length}
            </Text>
          )}

          <TouchableOpacity
            className={`rounded-full px-6 py-2 ${content.trim() || selectedImage ? "bg-blue-500" : "bg-gray-300"}`}
            onPress={createPost}
            disabled={isCreating || !(content.trim() || selectedImage)}
          >
            {isCreating ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text
                className={`font-semibold ${content.trim() || selectedImage ? "text-white" : "text-gray-500"}`}
              >
                Post
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PostComposer;
