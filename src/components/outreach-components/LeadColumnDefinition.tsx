import { ColumnDef } from "@tanstack/react-table"
import { Lead } from "@/const/Lead"
import { StatusBadge } from "./StatusBadgeColor"

export const leadColumns: ColumnDef<Lead>[] = [
  {
    accessorKey: "Company",
    header: "Company",
    cell: ({ row }) => <div className="font-medium">{row.getValue("Company")}</div>,
  },
  {
    accessorKey: "Adress",
    header: "Adress",
    cell: ({ row }) => <div>{row.getValue("Adress")}</div>,
  },
  {
    accessorKey: "Phone",
    header: "Phone",
    cell: ({ row }) => <div>{row.getValue("Phone")}</div>,
  },
  {
    accessorKey: "Website",
    header: "Website",
    cell: ({ row }) => <div>{row.getValue("Website")}</div>,
  },
  {
    accessorKey: "Status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("Status") as string
      return <StatusBadge status={status} />
    },
  },
]