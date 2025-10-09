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
import { SortState } from "@/types/table";
import { normalizeResponse } from "@/@utils/normalize";

interface DashboardClientProps {
  initialStats: Stats | null;
}

export default function DashboardClient({ initialStats }: DashboardClientProps) {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortState>({
    key: "timestamp",
    order: "desc",
  });
  const [newResponses, setNewResponses] = useState<ResponseData[]>([]);

  const { 
    data: responsesData, 
    error: responsesError, 
    isLoading: isLoadingResponses 
  } = useSWR(
    ["responses", page, DEFAULT_PAGE_SIZE],
    () => fetchResponses(page, DEFAULT_PAGE_SIZE),
    { 
      revalidateOnFocus: false,
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      dedupingInterval: 2000,
    }
  );

  const { mutate: mutateStats } = useSWR(
    ["stats"],
    () => fetchStats(),
    { 
      revalidateOnFocus: false,
      revalidateOnMount: false, // Don't fetch on mount since we have initialStats
      fallbackData: initialStats ?? undefined,
    }
  );

  const handleNewResponse = useCallback((incoming: Partial<ResponseData> & { id?: string }) => {
    const normalized = normalizeResponse(incoming);
    if (normalized) {
      setNewResponses((prev) => [normalized, ...prev].slice(0, DEFAULT_PAGE_SIZE));
      mutateStats();
    }
  }, [mutateStats]);

  const { connected } = useWebSocket(handleNewResponse);

  // Merge new responses with fetched data
  const items = newResponses.length > 0 && page === 1
    ? [...newResponses, ...(responsesData?.items || [])].slice(0, DEFAULT_PAGE_SIZE)
    : responsesData?.items || [];

  const meta = responsesData?.meta;
  const stats = initialStats;

  const onSort = (key: SortState['key']) => {
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
        
        {responsesError && (
          <div className="text-sm text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-800">
            Failed to load responses: {responsesError.message}
          </div>
        )}

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

