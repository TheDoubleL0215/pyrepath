// components/StatusBadge.tsx
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string | null | undefined
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  if (!status) {
    return (
      <Badge variant="outline" className={className}>
        No Status
      </Badge>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "offer declined":
        return "bg-red-500/50 text-white"
      case "wants further information":
        return "bg-yellow-500/50 text-white"
      case "appointment booked":
        return "bg-green-500/50 text-white"
      case "incorrect lead":
        return "bg-gray-500/50 text-white"
      case "unavailable at the moment":
        return "bg-blue-500/50 text-white"
      case "aktív":
        return "bg-blue-600/50 text-white"
      default:
        return "bg-gray-200/50 text-gray-800"
    }
  }

  return (
    <Badge
      className={cn(
        "border-transparent",
        getStatusColor(status),
        className
      )}
    >
      {status === "Aktív" ? "Active" : status}
    </Badge>
  )
}