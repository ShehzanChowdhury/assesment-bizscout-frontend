"use client";

import { Card, CardContent, CardHeader } from "@/@components/ui/Card";
import { Skeleton } from "@/@components/ui/Skeleton";
import ResponseTable from "@/features/ResponseTable";
import { ResponseData } from "@/types";
import { PaginationMeta } from "@/types";
import { SortState, SortKey } from "@/types/table";

interface ResponseTableSectionProps {
  items: ResponseData[];
  meta: PaginationMeta | undefined;
  sort: SortState;
  onSort: (key: SortKey) => void;
  onPrev: () => void;
  onNext: () => void;
  isLoading?: boolean;
}

export default function ResponseTableSection({
  items,
  meta,
  sort,
  onSort,
  onPrev,
  onNext,
  isLoading = false,
}: ResponseTableSectionProps) {
  if (isLoading) {
    return <ResponseTableSkeleton />;
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <span className="text-sm font-medium">Recent Responses</span>
        {meta ? (
          <span className="text-xs text-zinc-500">
            Page {meta.page} / {meta.totalPages}
          </span>
        ) : null}
      </CardHeader>
      <CardContent>
        <ResponseTable items={items} sort={sort} onSort={onSort} />
        {meta ? (
          <div className="flex items-center justify-between mt-4">
            <button
              className="text-xs underline disabled:opacity-50"
              onClick={onPrev}
              disabled={meta.page <= 1}
              aria-label="Previous page"
            >
              Previous
            </button>
            <button
              className="text-xs underline disabled:opacity-50"
              onClick={onNext}
              disabled={meta.page >= meta.totalPages}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function ResponseTableSkeleton() {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}
