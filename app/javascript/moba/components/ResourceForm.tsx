import React, { useContext } from "react";
import { NavigationContext } from "@thoughtbot/superglue";
import { Button } from "@moba/components/ui/button";
import { Input } from "@moba/components/ui/input";
import { Label } from "@moba/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@moba/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@moba/components/ui/card";

type Field = {
  name: string;
  attribute: string;
  type: string;
  label: string;
  required?: boolean;
  readonly?: boolean;
  options?: string[];
};

type ResourceFormProps = {
  resourceName: string;
  resourceKey: string;
  fields: Field[];
  record: Record<string, any>;
  errors: Record<string, string[]>;
  method: "post" | "patch";
  action: string;
  backUrl: string;
};

export function ResourceForm({
  resourceName,
  resourceKey,
  fields,
  record,
  errors,
  method,
  action,
  backUrl,
}: ResourceFormProps) {
  const { visit } = useContext(NavigationContext);
  const [formData, setFormData] = React.useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    fields.forEach((field) => {
      if (!field.readonly) {
        initial[field.name] = record[field.name] ?? "";
      }
    });
    return initial;
  });
  const [submitting, setSubmitting] = React.useState(false);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const body: Record<string, any> = {};
    fields.forEach((field) => {
      if (!field.readonly) {
        body[field.attribute] = formData[field.name];
      }
    });

    try {
      await visit(action, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ record: body }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: Field) => {
    if (field.readonly) return null;

    const fieldErrors = errors[field.name];
    const value = formData[field.name] ?? "";

    return (
      <div key={field.name} className="space-y-2">
        <Label htmlFor={field.name}>
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>

        {field.type === "select" && field.options ? (
          <Select
            value={String(value)}
            onValueChange={(val) => handleChange(field.name, val)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : field.type === "textarea" ? (
          <textarea
            id={field.name}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50"
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
          />
        ) : (
          <Input
            id={field.name}
            type={field.type === "number" ? "number" : field.type === "email" ? "email" : "text"}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
          />
        )}

        {fieldErrors && (
          <p className="text-sm text-destructive">{fieldErrors.join(", ")}</p>
        )}
      </div>
    );
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>
          {method === "post" ? `New ${resourceName}` : `Edit ${resourceName}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(renderField)}
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <a href={backUrl} data-sg-visit>
                Cancel
              </a>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
