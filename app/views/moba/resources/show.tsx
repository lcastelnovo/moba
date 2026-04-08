import React from "react";
import { useContent } from "@moba/hooks/useContent";
import { Layout } from "@moba/components/Layout";
import { Button } from "@moba/components/ui/button";
import { Badge } from "@moba/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@moba/components/ui/card";
import { ArrowLeft, Pencil } from "lucide-react";

type BelongsToOption = { id: number; label: string };

type Field = {
  name: string;
  type: string;
  label: string;
};

type ResourceShowProps = {
  resourceName: string;
  resourceKey: string;
  basePath: string;
  fields: Field[];
  record: Record<string, any>;
  belongsToOptions: Record<string, BelongsToOption[]>;
};

export default function ResourceShow() {
  const { resourceName, resourceKey, basePath, fields, record, belongsToOptions } =
    useContent<ResourceShowProps>();

  const formatValue = (field: Field, value: any) => {
    if (value == null) return "\u2014";
    if (field.type === "boolean") {
      return <Badge variant={value ? "default" : "secondary"}>{value ? "Yes" : "No"}</Badge>;
    }
    if (field.type === "date" && value) {
      return new Date(value).toLocaleDateString();
    }
    if (field.type === "belongs_to") {
      const opts = belongsToOptions[field.name] || [];
      const match = opts.find((o) => o.id === value);
      return match ? match.label : String(value);
    }
    return String(value);
  };

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {resourceName} #{record.id}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href={`${basePath}/${resourceKey}`} data-sg-visit>
              <ArrowLeft className="size-4" />
              Back
            </a>
          </Button>
          <Button asChild>
            <a href={`${basePath}/${resourceKey}/${record.id}/edit`} data-sg-visit>
              <Pencil className="size-4" />
              Edit
            </a>
          </Button>
        </div>
      </div>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{resourceName} Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">ID</dt>
              <dd className="text-sm">{record.id}</dd>
            </div>
            {fields.map((field) => (
              <div key={field.name}>
                <dt className="text-sm font-medium text-muted-foreground">
                  {field.label}
                </dt>
                <dd className="text-sm">
                  {formatValue(field, record[field.name])}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </Layout>
  );
}
