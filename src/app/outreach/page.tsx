"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Lead } from "@/const/Lead";
import { OutreachDataTable } from "@/components/outreach-data-table";

export default function OutreachPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await fetch("/api/nocodb");
        const json = await res.json();
        if (json.success) {
          setLeads(json.data);
        } else {
          setError("Adatok betöltése sikertelen");
        }
      } catch (err) {
        console.error(err);
        setError("Hiba történt a betöltés során");
      } finally {
        setLoading(false);
      }
    }

    fetchLeads();
  }, []);

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 md:gap-6">
              {loading && <p className="px-6">Loading...</p>}
              {error && <p className="px-6 text-red-600">{error}</p>}
              {!loading && !error && (
                <div className="rounded-lg border bg-card m-4 p-4 md:m-6">
                  <OutreachDataTable data={leads} />
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
