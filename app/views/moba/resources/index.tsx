import React, { useContext, useMemo } from "react";
import { NavigationContext } from "@thoughtbot/superglue";
import { useContent } from "@moba/hooks/useContent";
import { Layout } from "@moba/components/Layout";
import { DataTable } from "@moba/components/DataTable";
import { Button } from "@moba/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";

type Field = {
  name: string;
  type: string;
  label: string;
};

type ResourceIndexProps = {
  resourceName: string;
  resourceKey: string;
  singularName: string;
  basePath: string;
  fields: Field[];
  records: Record<string, any>[];
};

export default function ResourceIndex() {
  const { resourceName, resourceKey, singularName, basePath, fields, records } =
    useContent<ResourceIndexProps>();
  const { visit } = useContext(NavigationContext);

  const handleDelete = async (id: number) => {
    if (!confirm(`Are you sure you want to delete this ${singularName}?`)) return;
    try {
      await visit(`${basePath}/${resourceKey}/${id}`, {
        method: "delete",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const columns = useMemo<ColumnDef<Record<string, any>>[]>(() => {
    const fieldColumns: ColumnDef<Record<string, any>>[] = [
      {
        accessorKey: "id",
        header: "ID",
      },
      ...fields
        .filter((f) => f.name !== "id")
        .slice(0, 5)
        .map((field) => ({
          accessorKey: field.name,
          header: field.label,
        })),
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
              onClick={() => handleDelete(record.id)}
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        );
      },
    });

    return fieldColumns;
  }, [fields, resourceKey]);

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
      <DataTable columns={columns} data={records} />
    </Layout>
  );
}
