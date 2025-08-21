import { useSocialAuth } from "@/hooks/useSocialAuth";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const { isLoading, handleSocialAuth } = useSocialAuth();

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 justify-center px-8">
        <View className="flex-1 justify-center">
          {/* DEMO IMAGE */}
          <View className="items-center">
            <Image
              source={require("@/assets/images/auth2.png")}
              className="size-96"
              resizeMode="contain"
            />
          </View>

          <View className="flex-col gap-2">
            {/* GOOGLE SIGN IN BUTTON */}
            <TouchableOpacity
              className="flex-row items-center justify-center rounded-full border border-gray-300 bg-white px-6 py-3"
              onPress={() => {
                handleSocialAuth("oauth_google");
              }}
              disabled={isLoading}
              style={{
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <View className="flex-row items-center justify-center">
                {isLoading ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <>
                    <Image
                      source={require("@/assets/images/google.png")}
                      className="mr-3 size-10"
                      resizeMode="contain"
                    />
                    <Text className="text-base font-medium text-black">
                      Continue with Google
                    </Text>
                  </>
                )}
              </View>
            </TouchableOpacity>

            {/* APPLE SIGN IN BUTTON */}
            <TouchableOpacity
              className="flex-row items-center justify-center rounded-full border border-gray-300 bg-white px-6 py-3"
              onPress={() => {
                handleSocialAuth("oauth_apple");
              }}
              disabled={isLoading}
              style={{
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <View className="flex-row items-center justify-center">
                {isLoading ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <>
                    <Image
                      source={require("@/assets/images/apple.png")}
                      className="mr-3 size-8"
                      resizeMode="contain"
                    />
                    <Text className="text-base font-medium text-black">
                      Continue with Apple
                    </Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* TERMS AND PRIVACY */}
          <Text className="mt-6 px-2 text-center text-xs leading-4 text-gray-500">
            By signing up, you agree to our{" "}
            <Text className="text-blue-500">Terms</Text>
            {", "}
            <Text className="text-blue-500">Privacy Policy</Text>
            {", and "}
            <Text className="text-blue-500">Cookie Use</Text>.
          </Text>
        </View>
      </View>
    </View>
  );
}
