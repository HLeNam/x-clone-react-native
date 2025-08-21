import { useSSO } from "@clerk/clerk-expo";
import { OAuthStrategy } from "@clerk/types";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

export const useSocialAuth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { startSSOFlow } = useSSO();

  const handleSocialAuth = async (
    strategy: Extract<OAuthStrategy, "oauth_google" | "oauth_apple">,
  ) => {
    setIsLoading(true);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
      });

      if (createdSessionId && setActive) {
        await setActive({
          session: createdSessionId,
        });
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.log("🚀 ~ handleSocialAuth ~ error:", error);

      const provider = strategy === "oauth_google" ? "Google" : "Apple";
      Alert.alert(
        "Authentication Error",
        `Failed to sign in with ${provider}. Please try again later.`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSocialAuth,
  };
};
