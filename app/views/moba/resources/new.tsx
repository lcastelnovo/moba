import React from "react";
import { useContent } from "@moba/hooks/useContent";
import { Layout } from "@moba/components/Layout";
import { ResourceForm } from "@moba/components/ResourceForm";

type ResourceNewProps = {
  resourceName: string;
  resourceKey: string;
  basePath: string;
  fields: any[];
  record: Record<string, any>;
  errors: Record<string, string[]>;
  belongsToOptions: Record<string, { id: number; label: string }[]>;
};

export default function ResourceNew() {
  const { resourceName, resourceKey, basePath, fields, record, errors, belongsToOptions } =
    useContent<ResourceNewProps>();

  return (
    <Layout>
      <ResourceForm
        resourceName={resourceName}
        resourceKey={resourceKey}
        fields={fields}
        record={record}
        errors={errors}
        belongsToOptions={belongsToOptions}
        method="post"
        action={`${basePath}/${resourceKey}`}
        backUrl={`${basePath}/${resourceKey}`}
      />
    </Layout>
  );
}
