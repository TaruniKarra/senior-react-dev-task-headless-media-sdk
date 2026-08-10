import React from "react";

interface AuthPanelProps {
  authType: "none" | "bearer" | "apiKey";
  apiKey: string;
  onAuthTypeChange: (type: "none" | "bearer" | "apiKey") => void;
  onApiKeyChange: (key: string) => void;
}

export function AuthPanel({
  authType,
  apiKey,
  onAuthTypeChange,
  onApiKeyChange,
}: AuthPanelProps) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.12)" }}
    >
      <p className="text-xs mb-3 font-semibold uppercase tracking-widest" style={{ color: "rgba(167,139,250,0.5)" }}>
        Auth Config
      </p>
      <div className="flex gap-2 mb-3">
        {(["none", "bearer", "apiKey"] as const).map((type) => (
          <button
            key={type}
            onClick={() => onAuthTypeChange(type)}
            className="text-xs px-4 py-1.5 rounded-full transition font-medium"
            style={
              authType === type
                ? { background: "linear-gradient(135deg, #7c3aed, #db2777)", color: "#fff" }
                : { background: "rgba(139,92,246,0.1)", color: "rgba(167,139,250,0.7)", border: "1px solid rgba(139,92,246,0.2)" }
            }
          >
            {type === "none" ? "No Auth" : type === "bearer" ? "Bearer Token" : "API Key"}
          </button>
        ))}
      </div>
      {authType !== "none" && (
        <input
          type="text"
          placeholder={authType === "bearer" ? "Enter bearer token" : "Enter API key"}
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          className="w-full text-xs px-3 py-2 rounded-lg outline-none transition"
          style={{
            background: "rgba(139,92,246,0.07)",
            color: "rgba(255,255,255,0.8)",
            border: "1px solid rgba(139,92,246,0.25)",
          }}
        />
      )}
      {authType === "bearer" && apiKey && (
        <p className="text-xs mt-1" style={{ color: "rgba(167,139,250,0.5)" }}>
          Adds: <code style={{ color: "#34d399" }}>Authorization: Bearer ***</code>
        </p>
      )}
      {authType === "apiKey" && apiKey && (
        <p className="text-xs mt-1" style={{ color: "rgba(167,139,250,0.5)" }}>
          Appends: <code style={{ color: "#34d399" }}>?api_key=***</code> to media URL
        </p>
      )}
    </div>
  );
}
