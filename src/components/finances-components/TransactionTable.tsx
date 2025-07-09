'use client'

import * as React from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'

// Define Transaction interface
interface Transaction {
  id: string
  created_at: string
  subject: string
  amount: number
  from: string
  to: string
  note?: string
  capital: number
}

interface Props {
  transactions: Transaction[]
  onRowClick?: (transaction: Transaction) => void
}

// Define table columns
const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-muted-foreground"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Dátum
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.created_at)
      return date.toLocaleDateString('hu-HU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },
  },
  {
    accessorKey: 'subject',
    header: 'Subject',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) =>
      row.original.amount.toLocaleString('hu-HU', {
        style: 'currency',
        currency: 'HUF',
        maximumFractionDigits: 0,
      }),
  },
  {
    accessorKey: 'from',
    header: 'From',
  },
  {
    accessorKey: 'to',
    header: 'To',
  },
  {
    accessorKey: 'capital',
    header: 'Capital',
    cell: ({ row }) =>
      row.original.capital.toLocaleString('hu-HU', {
        style: 'currency',
        currency: 'HUF',
        maximumFractionDigits: 0,
      }),
  },
]

export function TransactionTable({ transactions, onRowClick }: Props) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const table = useReactTable({
    data: transactions,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Optional table controls go here */}
      {/* <TableControls table={table} /> */}

      <div className="rounded-md border border-muted">
        <Table>
          <TableHeader className="bg-secondary">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="text-muted-foreground">
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
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nincs adat!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-end space-x-2">
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
    </div>
  )
}
