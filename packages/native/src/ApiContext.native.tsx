// @ts-ignore — react-native not installed in web workspace
import React, { createContext, useContext, useRef } from "react";
import { MediaApiClient } from "@headless-media/core";

const ApiContext = createContext<MediaApiClient | null>(null);

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const ref = useRef<MediaApiClient | null>(null);
  if (!ref.current) ref.current = new MediaApiClient();
  return <ApiContext.Provider value={ref.current}>{children}</ApiContext.Provider>;
}

export function useApiClient(): MediaApiClient {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error("useApiClient must be inside <ApiProvider>");
  return ctx;
}
