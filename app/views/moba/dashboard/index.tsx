import React from "react";
import { useContent } from "@moba/hooks/useContent";

type DashboardProps = {
  message: string;
};

export default function DashboardIndex() {
  const { message } = useContent<DashboardProps>();

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>
        Moba Admin Dashboard
      </h1>
      <p>{message}</p>
    </div>
  );
}
