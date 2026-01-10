"use client";

import { useEffect } from "react";
import { logger } from "@/lib/logger";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error(error, "Global Error Boundary Caught Error");
  }, [error]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: "1rem",
      }}
    >
      <h2>Something went wrong!</h2>
      <p style={{ color: "red" }}>
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={() => reset()}
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#171717",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </div>
  );
}
