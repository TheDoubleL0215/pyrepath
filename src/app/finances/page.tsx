import { AppSidebar } from "@/components/app-sidebar";
import { FinanceHistoryChart } from "@/components/finances-components/ChartArea";
import { NewTransactionDialog } from "@/components/finances-components/NewTransactionDialog";
import { TransactionTable } from "@/components/finances-components/TransactionTable";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/client";

// Define TypeScript interface for your transaction data
interface Transaction {
  id: string;
  created_at: string;
  subject: string;
  amount: number;
  from: string;
  to: string;
  note?: string;
  capital: number;
}

export default async function OutreachPage() {
  const supabase = createClient(); // Nincs szükség await-re, hacsak a createClient nem aszinkron

  // Adatok lekérése részletes hibalogolással
  const { data: transactions, error } = await supabase
    .from("transaction")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase hiba:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw new Error("Nem sikerült lekérni a tranzakciókat");
  }

  const typedTransactions = (transactions as Transaction[]) || [];

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
            <div className="flex flex-col p-6 gap-4 md:gap-6">
              <div>
                <NewTransactionDialog />
              </div>
              <FinanceHistoryChart transactions={typedTransactions} />
              <TransactionTable transactions={typedTransactions} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}