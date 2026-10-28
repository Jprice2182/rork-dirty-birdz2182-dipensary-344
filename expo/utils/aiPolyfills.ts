import { Platform } from "react-native";

/**
 * Streaming polyfills for the AI SDK on native platforms
 * (TextEncoderStream / TextDecoderStream / structuredClone).
 * Must run before any AI SDK module is imported — the root layout
 * imports this file first.
 */
if (Platform.OS !== "web") {
  const setupPolyfills = async () => {
    const { polyfillGlobal } = await import(
      "react-native/Libraries/Utilities/PolyfillFunctions"
    );
    const { TextEncoderStream, TextDecoderStream } = await import(
      "@stardazed/streams-text-encoding"
    );

    if (!("structuredClone" in global)) {
      const structuredClone = (await import("@ungap/structured-clone")).default;
      polyfillGlobal("structuredClone", () => structuredClone);
    }

    polyfillGlobal("TextEncoderStream", () => TextEncoderStream);
    polyfillGlobal("TextDecoderStream", () => TextDecoderStream);
  };

  void setupPolyfills();
}

export {};
