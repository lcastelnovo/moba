import React, { useContext } from "react";
import { NavigationContext } from "@thoughtbot/superglue";
import { Button } from "@moba/components/ui/button";
import { buildResourceUrl } from "@moba/lib/navigation";

type PaginationData = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  perPage: number;
};

type TablePaginationProps = {
  pagination: PaginationData;
  basePath: string;
  resourceKey: string;
  filters: Record<string, string>;
  sort?: string;
  direction?: string;
  q?: string;
};

export function TablePagination({
  pagination,
  basePath,
  resourceKey,
  filters,
  sort,
  direction,
  q,
}: TablePaginationProps) {
  const { visit } = useContext(NavigationContext);
  const { currentPage, totalPages, totalCount, perPage } = pagination;

  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    visit(buildResourceUrl(basePath, resourceKey, { filters, sort, direction, q, page }), {});
  };

  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, totalCount);

  const pageNumbers = () => {
    const pages: (number | "...")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let rangeStart = Math.max(2, currentPage - 1);
      let rangeEnd = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        rangeEnd = Math.min(maxVisible, totalPages - 1);
      } else if (currentPage >= totalPages - 2) {
        rangeStart = Math.max(totalPages - maxVisible + 1, 2);
      }

      if (rangeStart > 2) pages.push("...");
      for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
      if (rangeEnd < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {start}-{end} of {totalCount}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => goToPage(currentPage - 1)}
        >
          Previous
        </Button>
        {pageNumbers().map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-sm text-muted-foreground">
              ...
            </span>
          ) : (
            <Button
              key={p}
              variant={p === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => goToPage(p)}
            >
              {p}
            </Button>
          )
        )}
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => goToPage(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
