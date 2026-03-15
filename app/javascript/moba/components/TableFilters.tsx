import React, { useCallback, useContext, useRef } from "react";
import { NavigationContext } from "@thoughtbot/superglue";
import { Input } from "@moba/components/ui/input";
import { Label } from "@moba/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@moba/components/ui/select";
import { buildResourceUrl } from "@moba/lib/navigation";

type Field = {
  name: string;
  attribute: string;
  type: string;
  label: string;
  options?: string[];
  filterable?: boolean;
};

type TableFiltersProps = {
  fields: Field[];
  filters: Record<string, string>;
  basePath: string;
  resourceKey: string;
  sort?: string;
  direction?: string;
};

const ALL_VALUE = "__all__";

export function TableFilters({
  fields,
  filters,
  basePath,
  resourceKey,
  sort,
  direction,
}: TableFiltersProps) {
  const { visit } = useContext(NavigationContext);
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>(
    {}
  );

  const navigateWithFilters = useCallback(
    (newFilters: Record<string, string>) => {
      const url = buildResourceUrl(basePath, resourceKey, {
        filters: newFilters,
        sort: sort || undefined,
        direction: direction || undefined,
        page: 1,
      });
      visit(url, {});
    },
    [visit, basePath, resourceKey, sort, direction]
  );

  const applyFilter = useCallback(
    (fieldAttribute: string, value: string) => {
      const newFilters = { ...filters, [fieldAttribute]: value };
      if (!value) delete newFilters[fieldAttribute];
      navigateWithFilters(newFilters);
    },
    [filters, navigateWithFilters]
  );

  const applyFilterDebounced = useCallback(
    (fieldAttribute: string, value: string) => {
      if (debounceTimers.current[fieldAttribute]) {
        clearTimeout(debounceTimers.current[fieldAttribute]);
      }
      debounceTimers.current[fieldAttribute] = setTimeout(() => {
        applyFilter(fieldAttribute, value);
      }, 300);
    },
    [applyFilter]
  );

  const filterableFields = fields.filter((f) => f.filterable);

  if (filterableFields.length === 0) return null;

  return (
    <div className="flex gap-4 flex-wrap items-end">
      {filterableFields.map((field) => (
        <div key={field.attribute} className="flex flex-col gap-1.5">
          <Label>{field.label}</Label>
          {field.options ? (
            <Select
              value={filters[field.attribute] || ALL_VALUE}
              onValueChange={(v) =>
                applyFilter(field.attribute, v === ALL_VALUE ? "" : v)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>All</SelectItem>
                {field.options.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              className="w-[180px]"
              placeholder={`Filter ${field.label.toLowerCase()}...`}
              defaultValue={filters[field.attribute] || ""}
              onChange={(e) =>
                applyFilterDebounced(field.attribute, e.target.value)
              }
            />
          )}
        </div>
      ))}
    </div>
  );
}
