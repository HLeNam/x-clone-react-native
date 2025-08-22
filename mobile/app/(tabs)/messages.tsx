import { CONVERSATIONS, ConversationType } from "@/data/conversations";
import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const MessagesScreen = () => {
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState("");
  const [conversationsList, setConversationsList] = useState(CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationType | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const handleDeleteConversation = (conversationId: number) => {
    Alert.alert(
      "Delete Conversation",
      "Are you sure you want to delete this conversation?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setConversationsList((prev) => {
              return prev.filter(
                (conversation) => conversation.id !== conversationId,
              );
            });
          },
        },
      ],
    );
  };

  const handleOpenConversation = (conversation: ConversationType) => {
    setSelectedConversation(conversation);
    setIsChatOpen(true);
  };

  const handleCloseChatModal = () => {
    setIsChatOpen(false);
    setSelectedConversation(null);
    setNewMessage("");
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) {
      return;
    }

    setConversationsList((prev) => {
      return prev.map((conversation) => {
        return conversation.id === selectedConversation.id
          ? { ...conversation, lastMessage: newMessage, time: "now" }
          : conversation;
      });
    });

    setNewMessage("");

    Alert.alert(
      "Message Sent!",
      `Your message has been sent to ${selectedConversation?.user.name}.`,
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* HEADER */}
      <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-3">
        <Text className="text-xl font-bold text-gray-900">Messages</Text>
        <TouchableOpacity>
          <Feather name="edit" size={24} color={"#1DA1F2"} />
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View className="border-b border-gray-100 px-4 py-3">
        <View className="flex-row items-center rounded-full bg-gray-100 px-4 py-3">
          <Feather name="search" size={20} color={"#657786"} />
          <TextInput
            placeholder="Search for people and groups"
            className="ml-3 flex-1 py-0 text-base"
            placeholderTextColor={"#657786"}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* CONVERSATIONS LIST */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
      >
        {conversationsList.map((conversation) => {
          return (
            <TouchableOpacity
              key={conversation.id}
              className="flex-row items-center border-b border-gray-50 p-4 active:bg-gray-50"
              onPress={() => handleOpenConversation(conversation)}
              onLongPress={() => handleDeleteConversation(conversation.id)}
            >
              <Image
                source={{ uri: conversation.user.avatar }}
                className="mr-3 size-12 rounded-full"
              />

              <View className="flex-1">
                <View className="mb-1 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-1">
                    <Text className="font-semibold text-gray-900">
                      {conversation.user.name}
                    </Text>
                    {conversation.user.verified && (
                      <Feather
                        name="check-circle"
                        size={16}
                        color={"#1DA1F2"}
                        className="ml-1"
                      />
                    )}
                    <Text className="ml-1 text-sm text-gray-500">
                      {conversation.user.username}
                    </Text>
                  </View>
                  <Text className="text-sm text-gray-500">
                    {conversation.time}
                  </Text>
                </View>
                <Text className="text-sm text-gray-500" numberOfLines={1}>
                  {conversation.lastMessage}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* QUICK ACTIONS */}
      <View className="border-t border-gray-100 bg-gray-50 px-4 py-2">
        <Text className="text-center text-xs text-gray-500">
          Tap to open • Long press to delete
        </Text>
      </View>

      <Modal
        visible={isChatOpen}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        {selectedConversation && (
          <SafeAreaView className="flex-1">
            {/* CHAT HEADER */}
            <View className="flex-row items-center border-b border-gray-100 px-4 py-3">
              <TouchableOpacity onPress={handleCloseChatModal} className="mr-3">
                <Feather name="arrow-left" size={24} color={"#1DA1F2"} />
              </TouchableOpacity>
              <Image
                source={{ uri: selectedConversation.user.avatar }}
                className="mr-3 size-10 rounded-full"
              />
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Text className="mr-1 font-semibold text-gray-900">
                    {selectedConversation.user.name}
                  </Text>
                  {selectedConversation.user.verified && (
                    <Feather name="check-circle" size={16} color={"#1DA1F2"} />
                  )}
                </View>
                <Text className="text-sm text-gray-500">
                  @{selectedConversation.user.username}
                </Text>
              </View>
            </View>

            {/* CHAT MESSAGE AREA */}
            <ScrollView className="flex-1 px-4 py-4">
              <View className="mb-4">
                <Text className="mb-4 text-center text-sm text-gray-400">
                  This is the beginning of your conversation with{" "}
                  {selectedConversation.user.name}
                </Text>

                {/* CONVERSATION MESSAGES */}
                {selectedConversation.messages.map((message) => (
                  <View
                    key={message.id}
                    className={`mb-3 flex-row ${message.fromUser ? "justify-end" : ""}`}
                  >
                    {!message.fromUser && (
                      <Image
                        source={{ uri: selectedConversation.user.avatar }}
                        className="mr-2 size-8 rounded-full"
                      />
                    )}
                    <View
                      className={`flex-1 ${message.fromUser ? "items-end" : ""}`}
                    >
                      <View
                        className={`max-w-xs rounded-2xl px-4 py-3 ${
                          message.fromUser ? "bg-blue-500" : "bg-gray-100"
                        }`}
                      >
                        <Text
                          className={
                            message.fromUser ? "text-white" : "text-gray-900"
                          }
                        >
                          {message.text}
                        </Text>
                      </View>
                      <Text className="mt-1 text-xs text-gray-400">
                        {message.time}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>

            {/* Message Input */}
            <View className="flex-row items-center border-t border-gray-100 px-4 py-3">
              <View className="mr-3 flex-1 flex-row items-center rounded-full bg-gray-100 px-4 py-3">
                <TextInput
                  className="flex-1 py-0 text-base"
                  placeholder="Start a message..."
                  placeholderTextColor="#657786"
                  value={newMessage}
                  onChangeText={setNewMessage}
                  multiline
                />
              </View>
              <TouchableOpacity
                onPress={handleSendMessage}
                className={`size-10 items-center justify-center rounded-full ${
                  newMessage.trim() ? "bg-blue-500" : "bg-gray-300"
                }`}
                disabled={!newMessage.trim()}
              >
                <Feather name="send" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
};

export default MessagesScreen;
