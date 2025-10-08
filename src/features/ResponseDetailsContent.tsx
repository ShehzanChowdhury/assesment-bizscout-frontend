"use client";

import { ResponseData } from "@/types";

interface ResponseDetailsContentProps {
  response: ResponseData;
  showMetadata?: boolean;
}

export default function ResponseDetailsContent({ 
  response, 
  showMetadata = false 
}: ResponseDetailsContentProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* Metadata section */}
      {showMetadata && (
        <>
          <DetailPanel title="Request ID" data={response._id} />
          <DetailPanel title="Latency" data={`${response.response.latency} ms`} />
        </>
      )}
      
      {/* Request/Response data */}
      <DetailPanel title="Request Payload" data={response.requestPayload} />
      <DetailPanel title="Response Data" data={response.response.data} />
      <DetailPanel title="Response Headers" data={response.response.headers} />
      
      {/* Error section (if exists) */}
      {response.error && <DetailPanel title="Error" data={response.error} />}
    </div>
  );
}

interface DetailPanelProps {
  title: string;
  data: unknown;
}

export function DetailPanel({ title, data }: DetailPanelProps) {
  const isString = typeof data === "string";
  
  return (
    <div className="rounded border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50 dark:bg-zinc-900/50">
      <div className="text-xs font-semibold mb-2 text-zinc-700 dark:text-zinc-300">
        {title}
      </div>
      {isString ? (
        <div className="text-xs break-all font-mono text-zinc-900 dark:text-zinc-100">
          {data}
        </div>
      ) : (
        <pre className="text-xs whitespace-pre-wrap break-all text-zinc-900 dark:text-zinc-100 overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
