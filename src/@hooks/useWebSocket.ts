"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { WS_BASE_URL } from "@/@config";
import { ResponseData } from "@/types";

let socket: Socket | null = null;

export function useWebSocket(onNewResponse?: (response: ResponseData) => void) {
  const [connected, setConnected] = useState(false);
  const callbackRef = useRef(onNewResponse);

  // Update callback ref when it changes without triggering effect re-run
  useEffect(() => {
    callbackRef.current = onNewResponse;
  }, [onNewResponse]);

  useEffect(() => {
    // Create socket only once
    if (!socket) {
      socket = io(WS_BASE_URL, { 
        transports: ["websocket"], 
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });
    }

    const s = socket;
    
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onResponse = (payload: ResponseData) => {
      // Use the ref to get the latest callback without re-running effect
      callbackRef.current?.(payload);
    };
    const onError = () => setConnected(false);
    const onReconnect = () => setConnected(true);

    // Register event listeners
    s.on("connect", onConnect);
    s.on("disconnect", onDisconnect);
    s.on("newResponse", onResponse);
    s.io.on("error", onError);
    s.io.on("reconnect", onReconnect);

    // Set initial connection state
    if (s.connected) {
      setConnected(true);
    }

    return () => {
      // Clean up event listeners
      s.off("connect", onConnect);
      s.off("disconnect", onDisconnect);
      s.off("newResponse", onResponse);
      s.io.off("error", onError);
      s.io.off("reconnect", onReconnect);
    };
  }, []); // Empty dependency array - effect runs only once

  return { connected };
}

