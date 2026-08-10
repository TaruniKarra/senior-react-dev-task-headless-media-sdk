/**
 * @headless-media/native
 *
 * React Native wrapper for @headless-media/core.
 * Mirrors the exact public API of @headless-media/wrappers — swap the import
 * and everything else in your screen code stays the same.
 *
 * Requirements: react-native >=0.73, react-native-video >=6.0
 *
 * Usage:
 *   import { ApiProvider, MediaProvider, useMediaPlayer, useCurated } from "@headless-media/native";
 */

export { ApiProvider, useApiClient } from "./ApiContext.native.js";
export { MediaProvider, useMediaContext } from "./MediaContext.native.js";
export { useMediaPlayer } from "./useMediaPlayer.native.js";
export { useCurated } from "./useCurated.native.js";
export { useSearch } from "./useSearch.native.js";

export type {
  MediaState, MediaStatus, MediaOptions, MediaError,
  AuthConfig, MediaPhoto, MediaVideo, MediaPage,
} from "@headless-media/core";
