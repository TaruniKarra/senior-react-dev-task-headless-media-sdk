export { MediaProvider } from "./MediaContext.js";
export { useMediaContext } from "./MediaContext.js";
export { useMediaPlayer } from "./useMediaPlayer.js";
export { useMediaEvent } from "./useMediaEvent.js";
export { ApiProvider, useApiClient } from "./ApiContext.js";
export { useCurated } from "./useCurated.js";
export { useSearch } from "./useSearch.js";
export { useVideos } from "./useVideos.js";

// Re-export core types so consumers only need one import
export type {
  MediaState,
  MediaStatus,
  MediaOptions,
  MediaError,
  AuthConfig,
  MediaEventKey,
  MediaEventHandler,
  MediaPhoto,
  MediaVideo,
  MediaPage,
} from "@headless-media/core";
