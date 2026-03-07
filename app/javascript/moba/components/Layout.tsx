import React, { ReactNode, useEffect } from "react";
import { useAppSelector } from "@moba/store";
import { Toaster } from "./ui/sonner";
import { toast } from "sonner";
import { SidebarInset, SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { SiteHeader } from "./Header";

export const Layout = ({ children }: { children: ReactNode }) => {
  const flash = useAppSelector((state) => state.flash);

  useEffect(() => {
    if (flash.success) {
      toast.success(flash.success);
    }
    if (flash.error) {
      toast.error(flash.error);
    }
    if (flash.notice) {
      toast(flash.notice);
    }
  }, [flash]);

  return (
    <div>
      <Toaster richColors />
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="p-4">
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};
