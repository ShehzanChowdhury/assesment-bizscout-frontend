"use client";

import useSWR from "swr";
import { useCallback, useState } from "react";
import { DEFAULT_PAGE_SIZE } from "@/@config";
import { fetchResponses, fetchStats } from "@/@services/http";
import StatsSection from "@/features/dashboard/StatsSection";
import ResponseTableSection from "@/features/dashboard/ResponseTableSection";
import ConnectionStatus from "@/@components/common/ConnectionStatus";
import Header from "@/@components/common/Header";
import Footer from "@/@components/common/Footer";
import { useWebSocket } from "@/@hooks/useWebSocket";
import { ResponseData, Stats } from "@/types";

type SortKey = "timestamp" | "status" | "latency";
type SortOrder = "asc" | "desc";

interface DashboardClientProps {
  initialStats: Stats | null;
}

export default function DashboardClient({ initialStats }: DashboardClientProps) {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<{ key: SortKey; order: SortOrder }>({
    key: "timestamp",
    order: "desc",
  });
  const [newResponses, setNewResponses] = useState<ResponseData[]>([]);

  const { data: responsesData } = useSWR(
    ["responses", page, DEFAULT_PAGE_SIZE],
    () => fetchResponses(page, DEFAULT_PAGE_SIZE),
    { revalidateOnFocus: false }
  );

  const { data: statsData, mutate: mutateStats } = useSWR(
    ["stats"],
    () => fetchStats(),
    { 
      revalidateOnFocus: false,
      fallbackData: initialStats ?? undefined
    }
  );

  const handleNewResponse = useCallback((incoming: Partial<ResponseData> & { id?: string }) => {
    const _id = incoming?._id ?? incoming?.id;
    if (!_id || !incoming.timestamp || !incoming.response) return;
    
    const normalized: ResponseData = {
      _id,
      timestamp: incoming.timestamp,
      requestPayload: incoming.requestPayload ?? {},
      response: incoming.response,
      error: incoming.error,
      createdAt: incoming.createdAt ?? new Date().toISOString(),
      updatedAt: incoming.updatedAt ?? new Date().toISOString(),
    };
    setNewResponses((prev) => [normalized, ...prev].slice(0, DEFAULT_PAGE_SIZE));
    mutateStats();
  }, [mutateStats]);

  const { connected } = useWebSocket(handleNewResponse);

  // Merge new responses with fetched data
  const items = newResponses.length > 0 && page === 1
    ? [...newResponses, ...(responsesData?.items || [])].slice(0, DEFAULT_PAGE_SIZE)
    : responsesData?.items || [];

  const meta = responsesData?.meta;
  const stats = statsData ?? initialStats;
  const isLoadingResponses = !responsesData;

  const onSort = (key: SortKey) => {
    const isSame = sort.key === key;
    const order = isSame && sort.order === "desc" ? "asc" : "desc";
    setSort({ key, order });
  };

  const onPrev = () => {
    if (meta) {
      setPage(Math.max(1, meta.page - 1));
      setNewResponses([]); // Clear new responses when changing pages
    }
  };

  const onNext = () => {
    if (meta) {
      setPage(Math.min(meta.totalPages, meta.page + 1));
      setNewResponses([]); // Clear new responses when changing pages
    }
  };

  return (
    <div className="min-h-dvh">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Overview</h2>
          <ConnectionStatus connected={connected} />
        </div>
        
        <StatsSection stats={stats} />

        <ResponseTableSection
          items={items}
          meta={meta}
          sort={sort}
          onSort={onSort}
          onPrev={onPrev}
          onNext={onNext}
          isLoading={isLoadingResponses}
        />
      </main>
      <Footer />
    </div>
  );
}

