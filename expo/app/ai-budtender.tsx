import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, RotateCcw, Send, Sparkles, Square } from "lucide-react-native";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { fetch as expoFetch } from "expo/fetch";
import Colors from "@/constants/colors";
import { getApiBaseUrl } from "@/lib/api";

const QUICK_PROMPTS = [
  "What's a good indica for sleep?",
  "Best edibles under $20?",
  "How do loyalty points work?",
  "Any deals right now?",
];

export default function AiBudtenderScreen() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${getApiBaseUrl()}/api/chat`,
        fetch: expoFetch as unknown as typeof globalThis.fetch,
      }),
    []
  );

  const { messages, sendMessage, status, error, stop, regenerate } = useChat({
    transport,
  });

  const isBusy = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isBusy) return;
      setInput("");
      void sendMessage({ text: trimmed });
    },
    [sendMessage, isBusy]
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ArrowLeft size={24} color={Colors.dark.text} />
        </Pressable>
        <View style={styles.headerIcon}>
          <Sparkles size={18} color={Colors.dark.text} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>Ask the Hawk</Text>
          <Text style={styles.subtitle}>AI budtender • Atlanta, GA</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 && !isBusy && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Sparkles size={28} color={Colors.dark.primary} />
            </View>
            <Text style={styles.emptyTitle}>Hey, welcome to the flock.</Text>
            <Text style={styles.emptyText}>
              I can recommend strains, break down our deals, or explain how
              delivery and loyalty points work. What are you feeling today?
            </Text>
          </View>
        )}

        {messages.map((message) =>
          message.parts
            .filter((part) => part.type === "text")
            .map((part, index) => (
              <View
                key={`${message.id}-${index}`}
                style={[
                  styles.bubbleRow,
                  message.role === "user" ? styles.userRow : styles.assistantRow,
                ]}
              >
                <View
                  style={[
                    styles.bubble,
                    message.role === "user" ? styles.userBubble : styles.assistantBubble,
                  ]}
                >
                  <Text
                    style={
                      message.role === "user" ? styles.userText : styles.assistantText
                    }
                  >
                    {part.text}
                  </Text>
                </View>
              </View>
            ))
        )}

        {status === "submitted" && (
          <View style={[styles.bubbleRow, styles.assistantRow]}>
            <View style={[styles.bubble, styles.assistantBubble]}>
              <Text style={styles.thinking}>The Hawk is thinking…</Text>
            </View>
          </View>
        )}

        {error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>
              Something went wrong getting a response. Please try again.
            </Text>
            <Pressable
              style={styles.retryButton}
              onPress={() => regenerate()}
              accessibilityRole="button"
            >
              <RotateCcw size={14} color={Colors.dark.text} />
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>

      {messages.length === 0 && !isBusy && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {QUICK_PROMPTS.map((prompt) => (
            <Pressable
              key={prompt}
              style={styles.chip}
              onPress={() => handleSend(prompt)}
            >
              <Text style={styles.chipText}>{prompt}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask about strains, deals, delivery…"
          placeholderTextColor={Colors.dark.subtext}
          multiline
          maxLength={500}
        />
        {isBusy ? (
          <Pressable
            style={[styles.sendButton, styles.stopButton]}
            onPress={() => stop()}
            accessibilityLabel="Stop generating"
            accessibilityRole="button"
          >
            <Square size={18} color={Colors.dark.text} fill={Colors.dark.text} />
          </Pressable>
        ) : (
          <Pressable
            style={[styles.sendButton, !input.trim() && styles.sendDisabled]}
            onPress={() => handleSend(input)}
            disabled={!input.trim()}
            accessibilityLabel="Send message"
            accessibilityRole="button"
          >
            <Send size={18} color={Colors.dark.text} />
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  backButton: {
    marginRight: 12,
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.dark.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.dark.text,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.dark.subtext,
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 24,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.dark.card,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.dark.text,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: Colors.dark.subtext,
    lineHeight: 20,
    textAlign: "center",
  },
  bubbleRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  userRow: {
    justifyContent: "flex-end",
  },
  assistantRow: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "85%",
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  userBubble: {
    backgroundColor: Colors.dark.primary,
    borderBottomRightRadius: 6,
  },
  assistantBubble: {
    backgroundColor: Colors.dark.card,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderBottomLeftRadius: 6,
  },
  userText: {
    fontSize: 15,
    color: Colors.dark.text,
    lineHeight: 21,
  },
  assistantText: {
    fontSize: 15,
    color: Colors.dark.text,
    lineHeight: 21,
  },
  thinking: {
    fontSize: 14,
    color: Colors.dark.subtext,
    fontStyle: "italic",
  },
  errorCard: {
    backgroundColor: "rgba(239, 68, 68, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.4)",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: "#EF4444",
    lineHeight: 18,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.dark.card,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  retryText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.dark.text,
  },
  chips: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    backgroundColor: Colors.dark.card,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 4,
  },
  chipText: {
    fontSize: 13,
    color: Colors.dark.text,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.dark.card,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    color: Colors.dark.text,
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.dark.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendDisabled: {
    opacity: 0.4,
  },
  stopButton: {
    backgroundColor: Colors.dark.card,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
});
