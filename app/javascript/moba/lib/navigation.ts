type BuildResourceUrlOptions = {
  filters?: Record<string, string>;
  sort?: string;
  direction?: string;
  page?: number;
};

export function buildResourceUrl(
  basePath: string,
  resourceKey: string,
  options: BuildResourceUrlOptions = {}
): string {
  const params = new URLSearchParams();

  if (options.filters) {
    Object.entries(options.filters).forEach(([k, v]) => {
      if (v) params.append(`filters[${k}]`, v);
    });
  }

  if (options.sort && options.direction) {
    params.append("sort", options.sort);
    params.append("direction", options.direction);
  }

  if (options.page && options.page > 1) {
    params.append("page", String(options.page));
  }

  const query = params.toString();
  return `${basePath}/${resourceKey}${query ? `?${query}` : ""}`;
}
