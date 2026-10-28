// Module declarations for untyped dependencies used by utils/aiPolyfills.ts
declare module "react-native/Libraries/Utilities/PolyfillFunctions" {
  export function polyfillGlobal(name: string, getter: () => unknown): void;
}

declare module "@ungap/structured-clone" {
  const structuredClone: (<T>(value: T) => T) & {
    default?: <T>(value: T) => T;
  };
  export default structuredClone;
}
