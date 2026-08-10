import { useMemo } from "react";
import type { MediaVideo } from "@headless-media/core";
import { useApiClient } from "./ApiContext.js";

export interface UseVideosReturn {
  videos: MediaVideo[];
}

export function useVideos(): UseVideosReturn {
  const client = useApiClient();
  const videos = useMemo(() => client.getVideos(), [client]);
  return { videos };
}
