import React from "react";
import { useContent } from "@moba/hooks/useContent";
import { Layout } from "@moba/components/Layout";
import { Button } from "@moba/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@moba/components/ui/card";
import { ArrowLeft, Pencil } from "lucide-react";

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
};

export default function ResourceShow() {
  const { resourceName, resourceKey, basePath, fields, record } =
    useContent<ResourceShowProps>();

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
                  {record[field.name] != null
                    ? String(record[field.name])
                    : "—"}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </Layout>
  );
}
