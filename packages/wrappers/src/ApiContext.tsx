import React, { createContext, useContext, useRef } from "react";
import { MediaApiClient } from "@headless-media/core";

const ApiContext = createContext<MediaApiClient | null>(null);

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const clientRef = useRef<MediaApiClient | null>(null);
  if (!clientRef.current) clientRef.current = new MediaApiClient();
  return (
    <ApiContext.Provider value={clientRef.current}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApiClient(): MediaApiClient {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error("useApiClient must be used inside <ApiProvider>");
  return ctx;
}
