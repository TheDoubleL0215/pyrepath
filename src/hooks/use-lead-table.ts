import { useState } from "react"
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Lead } from "@/const/Lead"
import { leadColumns } from "@/components/outreach-components/LeadColumnDefinition"

export function useLeadTable(initialData: Lead[]) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [tableData, setTableData] = useState<Lead[]>(initialData)

  const table = useReactTable({
    data: tableData,
    columns: leadColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const refreshData = async () => {
    try {
      const response = await fetch("/api/nocodb")
      if (!response.ok) throw new Error("Failed to fetch data")
      const result = await response.json()
      if (result && Array.isArray(result.data)) {
        setTableData(result.data)
      }
    } catch (err) {
      console.error("Error refreshing data:", err)
    }
  }

  return {
    table,
    tableData,
    refreshData,
  }
}