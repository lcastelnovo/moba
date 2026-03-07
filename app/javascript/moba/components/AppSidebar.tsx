import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { useContent } from "@moba/hooks/useContent";
import { Home, Database } from "lucide-react";

type ResourceLink = {
  key: string;
  label: string;
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { basePath, resources } = useContent<{ basePath: string; resources: ResourceLink[] }>();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href={`${basePath}/`} data-sg-visit>
                <Database className="!size-5" />
                <span className="text-base font-semibold">Moba Admin</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Dashboard" asChild>
              <a href={`${basePath}/`} data-sg-visit>
                <Home />
                <span>Dashboard</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {resources?.map((resource) => (
            <SidebarMenuItem key={resource.key}>
              <SidebarMenuButton tooltip={resource.label} asChild>
                <a href={`${basePath}/${resource.key}`} data-sg-visit>
                  <Database />
                  <span>{resource.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
