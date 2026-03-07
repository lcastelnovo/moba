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
};

export default function ResourceNew() {
  const { resourceName, resourceKey, basePath, fields, record, errors } =
    useContent<ResourceNewProps>();

  return (
    <Layout>
      <ResourceForm
        resourceName={resourceName}
        resourceKey={resourceKey}
        fields={fields}
        record={record}
        errors={errors}
        method="post"
        action={`${basePath}/${resourceKey}`}
        backUrl={`${basePath}/${resourceKey}`}
      />
    </Layout>
  );
}
