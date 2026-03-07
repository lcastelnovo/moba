import React from "react";
import { useContent } from "@moba/hooks/useContent";
import { Layout } from "@moba/components/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@moba/components/ui/card";
import { Database } from "lucide-react";

type ResourceLink = {
  key: string;
  label: string;
};

type DashboardProps = {
  message: string;
  basePath: string;
  resources: ResourceLink[];
};

export default function DashboardIndex() {
  const { message, basePath, resources } = useContent<DashboardProps>();

  return (
    <Layout>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">{message}</p>

      {resources?.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <a
              key={resource.key}
              href={`${basePath}/${resource.key}`}
              data-sg-visit
              className="block"
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center gap-2">
                  <Database className="size-5 text-primary" />
                  <CardTitle>{resource.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Manage {resource.label.toLowerCase()}
                  </p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      )}
    </Layout>
  );
}
