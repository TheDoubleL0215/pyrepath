"use client"

import * as React from "react"
import { flexRender } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Lead } from "@/const/Lead"
import { useLeadTable } from "@/hooks/use-lead-table"
import { LeadDialog } from "@/components/outreach-components/LeadDialog"
import { TableControls } from "@/components/outreach-components/TableControls"
import { leadColumns } from "@/components/outreach-components/LeadColumnDefinition"
import { LeadDetailsModal } from "./outreach-components/LeadDetailsModal"
import { IconPhoneOutgoing } from "@tabler/icons-react"

interface OutreachDataTableProps {
  data: Lead[]
}

// Modal component to display and edit all lead details

export function OutreachDataTable({ data }: OutreachDataTableProps) {
  const { table, refreshData } = useLeadTable(data)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  // State for the expand modal
  const [expandModalOpen, setExpandModalOpen] = React.useState(false)
  const [expandedLead, setExpandedLead] = React.useState<Lead | null>(null)

  const handleRowClick = (lead: Lead) => {
    setSelectedLead(lead)
    setDialogOpen(true)
  }

  const handleExpandClickRow = (lead: Lead) => {
    setExpandedLead(lead)
    setExpandModalOpen(true)
  }


  const handleExpandClick = (e: React.MouseEvent, lead: Lead) => {
    e.stopPropagation() // Prevent row click
    setExpandedLead(lead)
    setExpandModalOpen(true)
  }

  const handleExpandSave = async (updatedLead: Lead & { createdAt?: string; updatedAt?: string }) => {
    setIsLoading(true)

    const { CreatedAt, UpdatedAt, ...sanitizedLead } = updatedLead

    try {
      const response = await fetch(`/api/nocodb?id=${updatedLead.Id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedLead),
      })

      if (!response.ok) {
        throw new Error('Failed to update record')
      }

      const result = await response.json()

      if (result.success) {
        await refreshData()
        setExpandModalOpen(false)
        setExpandedLead(null)
      } else {
        console.error('Failed to update record:', result.error)
        throw new Error(result.error || 'Failed to update record')
      }
    } catch (error) {
      console.error('Error updating record:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
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
        <table className="w-full">
          <thead className="bg-secondary">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-2 text-left">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </th>
                ))}
                {/* Move expand column header to end */}
                <th className="w-[50px] px-4 py-2 text-left" />
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-muted/50 border-b"
                  onClick={() => handleExpandClickRow(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                  {/* Move expand button to end */}
                  <td className="w-[50px] px-4 py-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRowClick(row.original)
                      }}

                      className="h-8 w-8 p-0"
                    >
                      <IconPhoneOutgoing className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={leadColumns.length + 1}
                  className="h-24 text-center px-4 py-2"
                >
                  Not found!
                </td>
              </tr>
            )}
          </tbody>

        </table>
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

      {/* Existing edit dialog */}
      <LeadDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        lead={selectedLead}
        onSave={handleSave}
        isLoading={isLoading}
      />

      {/* New expand modal */}
      <LeadDetailsModal
        lead={expandedLead}
        open={expandModalOpen}
        onOpenChange={setExpandModalOpen}
        onSave={handleExpandSave}
      />
    </div>
  )
}