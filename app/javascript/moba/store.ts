import { configureStore } from "@reduxjs/toolkit";
import {
  beforeVisit,
  beforeFetch,
  beforeRemote,
  rootReducer,
} from "@thoughtbot/superglue";

const { pages, superglue } = rootReducer;

export const store = configureStore({
  reducer: {
    superglue,
    pages,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [beforeFetch.type, beforeVisit.type, beforeRemote.type],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
