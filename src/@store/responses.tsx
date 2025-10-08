"use client";

import React, { createContext, useContext, useMemo, useReducer } from "react";
import { PaginationMeta, ResponseData, Stats } from "@/types";

export type SortKey = "timestamp" | "status" | "latency";
export type SortOrder = "asc" | "desc";

export interface ResponsesState {
  items: ResponseData[];
  meta: PaginationMeta | null;
  stats: Stats | null;
  connected: boolean;
  sort: { key: SortKey; order: SortOrder };
}

type Action =
  | { type: "SET_INITIAL"; payload: { items: ResponseData[]; meta: PaginationMeta | null; stats: Stats | null } }
  | { type: "ADD_RESPONSE"; payload: ResponseData }
  | { type: "SET_CONNECTED"; payload: boolean }
  | { type: "SET_SORT"; payload: { key: SortKey; order: SortOrder } }
  | { type: "SET_PAGE"; payload: PaginationMeta };

const initialState: ResponsesState = {
  items: [],
  meta: null,
  stats: null,
  connected: false,
  sort: { key: "timestamp", order: "desc" },
};

function responsesReducer(state: ResponsesState, action: Action): ResponsesState {
  switch (action.type) {
    case "SET_INITIAL": {
      return { ...state, items: action.payload.items, meta: action.payload.meta, stats: action.payload.stats };
    }
    case "ADD_RESPONSE": {
      // Prepend new response; keep within page size if meta exists
      const pageSize = state.meta?.pageSize ?? 50;
      const nextItems = [action.payload, ...state.items].slice(0, pageSize);
      return { ...state, items: nextItems };
    }
    case "SET_CONNECTED": {
      return { ...state, connected: action.payload };
    }
    case "SET_SORT": {
      return { ...state, sort: action.payload };
    }
    case "SET_PAGE": {
      return { ...state, meta: action.payload };
    }
    default:
      return state;
  }
}

const ResponsesContext = createContext<{
  state: ResponsesState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function ResponsesProvider({ children, initial }: { children: React.ReactNode; initial?: Partial<ResponsesState> }) {
  const [state, dispatch] = useReducer(responsesReducer, { ...initialState, ...initial });
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <ResponsesContext.Provider value={value}>{children}</ResponsesContext.Provider>;
}

export function useResponses() {
  const ctx = useContext(ResponsesContext);
  if (!ctx) throw new Error("useResponses must be used within ResponsesProvider");
  return ctx;
}

