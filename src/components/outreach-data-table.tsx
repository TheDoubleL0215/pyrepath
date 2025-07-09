"use client"

import * as React from "react"
import { flexRender } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Lead } from "@/const/Lead"
import { useLeadTable } from "@/hooks/use-lead-table"
import { LeadDialog } from "@/components/outreach-components/LeadDialog"
import { TableControls } from "@/components/outreach-components/TableControls"
import { leadColumns } from "@/components/outreach-components/LeadColumnDefinition"

interface OutreachDataTableProps {
  data: Lead[]
}

export function OutreachDataTable({ data }: OutreachDataTableProps) {
  const { table, refreshData } = useLeadTable(data)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleRowClick = (lead: Lead) => {
    setSelectedLead(lead)
    setDialogOpen(true)
  }

  const handleSave = async (formData: {
    outcome: string
    progress: string[]
    notes: string
    callRating: number[]
  }) => {
    if (!selectedLead) return

    setIsLoading(true)

    try {
      const response = await fetch(`/api/nocodb?id=${selectedLead.Id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Note: formData.notes,
          id: selectedLead.Id,
          Status: formData.outcome,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update record')
      }

      const result = await response.json()

      if (result.success) {
        await refreshData()
        setDialogOpen(false)
        setSelectedLead(null)
      } else {
        console.error('Failed to update record:', result.error)
      }
    } catch (error) {
      console.error('Error updating record:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <TableControls table={table} />

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-secondary">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={leadColumns.length}
                  className="h-24 text-center"
                >
                  Not found!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2">
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} /{" "}
            {table.getFilteredRowModel().rows.length} rows selected.
          </div>
        )}

        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <LeadDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        lead={selectedLead}
        onSave={handleSave}
        isLoading={isLoading}
      />
    </div>
  )
}