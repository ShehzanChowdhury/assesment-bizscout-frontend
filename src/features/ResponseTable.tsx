"use client";

import React, { useMemo, useState } from "react";
import { Table, TBody, TD, TH, THead, TR } from "@/@components/ui/Table";
import { StatusBadge } from "@/@components/ui/Badge";
import { ResponseData } from "@/types";
import { SortState, SortKey } from "@/types/table";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, Eye } from "lucide-react";
import * as Collapsible from "@radix-ui/react-collapsible";

type Props = {
  items: ResponseData[];
  sort: SortState;
  onSort: (key: SortKey) => void;
};

export default function ResponseTable({ items, sort, onSort }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sorted = useMemo(() => {
    const copy = [...items];
    copy.sort((a, b) => {
      let av: number = 0;
      let bv: number = 0;
      if (sort.key === "timestamp") {
        av = new Date(a.timestamp).getTime();
        bv = new Date(b.timestamp).getTime();
      } else if (sort.key === "status") {
        av = a.response.status;
        bv = b.response.status;
      } else {
        av = a.response.latency;
        bv = b.response.latency;
      }
      return sort.order === "asc" ? av - bv : bv - av;
    });
    return copy;
  }, [items, sort]);

  const header = (key: SortKey, label: string) => {
    const is = sort.key === key;
    const Icon = !is ? null : sort.order === "asc" ? ChevronUp : ChevronDown;
    return (
      <button 
        className="inline-flex items-center gap-1" 
        onClick={() => onSort(key)} 
        aria-label={`Sort by ${label}`}
      >
        <span>{label}</span>
        {Icon ? <Icon className="h-3 w-3" /> : null}
      </button>
    );
  };

  const getSortAttr = (key: SortKey) => {
    if (sort.key !== key) return "none";
    return sort.order === "asc" ? "ascending" : "descending";
  };

  if (sorted.length === 0) {
    return <div className="text-sm text-zinc-500">No responses yet.</div>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <THead>
          <TR>
            <TH aria-sort={getSortAttr("timestamp")}>{header("timestamp", "Timestamp")}</TH>
            <TH aria-sort={getSortAttr("status")}>{header("status", "Status")}</TH>
            <TH aria-sort={getSortAttr("latency")}>{header("latency", "Latency")}</TH>
            <TH>Request ID</TH>
            <TH>Actions</TH>
          </TR>
        </THead>
        <TBody>
          {sorted.map((r, index) => (
            <React.Fragment key={r._id || `response-${index}`}>
              <TR className="hover:bg-black/5 dark:hover:bg-white/5">
                <TD>
                  {(() => {
                    try {
                      return format(new Date(r.timestamp), "PPpp");
                    } catch {
                      return r.timestamp;
                    }
                  })()}
                </TD>
                <TD>
                  <StatusBadge status={r.response.status} />
                </TD>
                <TD>{r.response.latency} ms</TD>
                <TD className="font-mono text-xs">{r._id}</TD>
                <TD>
                  <Collapsible.Root open={expandedId === r._id} onOpenChange={(o) => setExpandedId(o ? r._id : null)}>
                    <Collapsible.Trigger className="text-xs underline inline-flex items-center gap-1">
                      <Eye className="h-3 w-3" /> Details
                    </Collapsible.Trigger>
                    <Collapsible.Content>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3">
                        <Panel title="Request Payload" data={r.requestPayload} />
                        <Panel title="Response Data" data={r.response.data} />
                        <Panel title="Response Headers" data={r.response.headers} />
                        {r.error ? <Panel title="Error" data={r.error} /> : null}
                      </div>
                    </Collapsible.Content>
                  </Collapsible.Root>
                </TD>
              </TR>
            </React.Fragment>
          ))}
        </TBody>
      </Table>
    </div>
  );
}

function Panel({ title, data }: { title: string; data: unknown }) {
  return (
    <div className="rounded border border-black/10 dark:border-white/10 p-2">
      <div className="text-xs font-medium mb-1 text-zinc-500">{title}</div>
      <pre className="text-xs whitespace-pre-wrap break-all">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

