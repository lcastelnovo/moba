import React, { useContext, useMemo, useState } from "react";
import { NavigationContext } from "@thoughtbot/superglue";
import { useContent } from "@moba/hooks/useContent";
import { Layout } from "@moba/components/Layout";
import { DataTable } from "@moba/components/DataTable";
import { Button } from "@moba/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2, Plus, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { TableFilters } from "@moba/components/TableFilters";
import { TablePagination } from "@moba/components/TablePagination";
import { DeleteConfirmDialog } from "@moba/components/DeleteConfirmDialog";
import { buildResourceUrl } from "@moba/lib/navigation";

type Field = {
  name: string;
  attribute: string;
  type: string;
  label: string;
  options?: string[];
  filterable?: boolean;
};

type PaginationData = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  perPage: number;
};

type ResourceIndexProps = {
  resourceName: string;
  resourceKey: string;
  singularName: string;
  basePath: string;
  fields: Field[];
  filters: Record<string, string>;
  sort: string | null;
  direction: string | null;
  pagination: PaginationData;
  records: Record<string, any>[];
};

export default function ResourceIndex() {
  const {
    resourceName,
    resourceKey,
    singularName,
    basePath,
    fields,
    filters,
    sort,
    direction,
    pagination,
    records,
  } = useContent<ResourceIndexProps>();
  const { visit } = useContext(NavigationContext);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const handleDelete = async () => {
    if (deleteTarget === null) return;
    try {
      await visit(`${basePath}/${resourceKey}/${deleteTarget}`, {
        method: "delete",
      });
    } catch (err) {
      console.error(err);
    }
    setDeleteTarget(null);
  };

  const handleSort = (fieldName: string) => {
    let newSort: string | undefined;
    let newDirection: string | undefined;

    if (sort !== fieldName) {
      newSort = fieldName;
      newDirection = "asc";
    } else if (direction === "asc") {
      newSort = fieldName;
      newDirection = "desc";
    } else {
      newSort = undefined;
      newDirection = undefined;
    }

    visit(
      buildResourceUrl(basePath, resourceKey, {
        filters,
        sort: newSort,
        direction: newDirection,
        page: 1,
      }),
      {}
    );
  };

  const SortIcon = ({ fieldName }: { fieldName: string }) => {
    if (sort !== fieldName) return <ArrowUpDown className="ml-1 size-3.5" />;
    if (direction === "asc") return <ArrowUp className="ml-1 size-3.5" />;
    return <ArrowDown className="ml-1 size-3.5" />;
  };

  const columns = useMemo<ColumnDef<Record<string, any>>[]>(() => {
    const fieldColumns: ColumnDef<Record<string, any>>[] = [
      {
        accessorKey: "id",
        header: () => (
          <button
            className="flex items-center hover:text-foreground"
            onClick={() => handleSort("id")}
          >
            ID
            <SortIcon fieldName="id" />
          </button>
        ),
      },
      ...fields
        .filter((f) => f.name !== "id")
        .slice(0, 5)
        .map(
          (field): ColumnDef<Record<string, any>> => ({
            accessorKey: field.name,
            header: () => (
              <button
                className="flex items-center hover:text-foreground"
                onClick={() => handleSort(field.attribute)}
              >
                {field.label}
                <SortIcon fieldName={field.attribute} />
              </button>
            ),
          })
        ),
    ];

    fieldColumns.push({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const record = row.original;
        return (
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" asChild>
              <a href={`${basePath}/${resourceKey}/${record.id}`} data-sg-visit>
                <Eye className="size-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href={`${basePath}/${resourceKey}/${record.id}/edit`} data-sg-visit>
                <Pencil className="size-4" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteTarget(record.id)}
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        );
      },
    });

    return fieldColumns;
  }, [fields, resourceKey, sort, direction]);

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{resourceName}</h1>
        <Button asChild>
          <a href={`${basePath}/${resourceKey}/new`} data-sg-visit>
            <Plus className="size-4" />
            New {singularName}
          </a>
        </Button>
      </div>
      <TableFilters
        fields={fields}
        filters={filters}
        basePath={basePath}
        resourceKey={resourceKey}
        sort={sort || undefined}
        direction={direction || undefined}
      />
      <DataTable columns={columns} data={records} />
      <TablePagination
        pagination={pagination}
        basePath={basePath}
        resourceKey={resourceKey}
        filters={filters}
        sort={sort || undefined}
        direction={direction || undefined}
      />
      <DeleteConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        singularName={singularName}
        onConfirm={handleDelete}
      />
    </Layout>
  );
}
