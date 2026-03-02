import React from "react";
import { createRoot } from "react-dom/client";
import { Application, VisitResponse } from "@thoughtbot/superglue";
import { store } from "./store";
import { pageToPageMapping } from "./page_to_page_mapping";
import { buildVisitAndRemote } from "./application_visit";

declare global {
  interface Window {
    SUPERGLUE_INITIAL_PAGE_STATE: VisitResponse;
  }
}

if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () {
    const appEl = document.getElementById("app");
    const location = window.location;

    if (!appEl) {
      throw new Error("Root element #app not found");
    }

    const root = createRoot(appEl);

    root.render(
      <Application
        baseUrl={location.origin}
        initialPage={window.SUPERGLUE_INITIAL_PAGE_STATE}
        path={location.pathname + location.search + location.hash}
        buildVisitAndRemote={buildVisitAndRemote}
        store={store}
        mapping={pageToPageMapping}
      />
    );
  });
}
