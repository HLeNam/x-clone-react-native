import Feather from "@expo/vector-icons/Feather";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TRENDING_TOPICS = [
  {
    topic: "#ReactNative",
    tweets: "125k",
  },
  {
    topic: "#TypeScript",
    tweets: "89k",
  },
  {
    topic: "#WebDevelopment",
    tweets: "234k",
  },
  {
    topic: "#AI",
    tweets: "567k",
  },
  {
    topic: "#TechNews",
    tweets: "98k",
  },
];

const SearchScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* HEADER */}
      <View className="border-b border-gray-100 px-4 py-3">
        <View className="flex-row items-center rounded-full bg-gray-100 px-4 py-3">
          <Feather name="search" size={20} color={"#657786"} />
          <TextInput
            placeholder="Search Twitter"
            className="ml-3 flex-1 py-0 text-base"
            placeholderTextColor={"#657786"}
          />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          <Text className="mb-4 text-xl font-bold text-gray-900">
            Trending for you
          </Text>
          {TRENDING_TOPICS.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                className="border-b border-gray-100 py-3"
              >
                <Text className="text-sm text-gray-500">
                  Trending in Technology
                </Text>
                <Text className="text-lg font-bold text-gray-900">
                  {item.topic}
                </Text>
                <Text className="text-sm text-gray-500">
                  {item.tweets} Tweets
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;
