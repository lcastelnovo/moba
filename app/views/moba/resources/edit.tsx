import React from "react";
import { useContent } from "@moba/hooks/useContent";
import { Layout } from "@moba/components/Layout";
import { ResourceForm } from "@moba/components/ResourceForm";

type ResourceEditProps = {
  resourceName: string;
  resourceKey: string;
  basePath: string;
  fields: any[];
  record: Record<string, any>;
  errors: Record<string, string[]>;
};

export default function ResourceEdit() {
  const { resourceName, resourceKey, basePath, fields, record, errors } =
    useContent<ResourceEditProps>();

  return (
    <Layout>
      <ResourceForm
        resourceName={resourceName}
        resourceKey={resourceKey}
        fields={fields}
        record={record}
        errors={errors}
        method="patch"
        action={`${basePath}/${resourceKey}/${record.id}`}
        backUrl={`${basePath}/${resourceKey}`}
      />
    </Layout>
  );
}
