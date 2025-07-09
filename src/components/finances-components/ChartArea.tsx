"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const description = "An interactive area chart"

const chartConfig = {
  capital: {
    label: "Capital",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

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

interface FinanceHistoryChartProps {
  transactions: Transaction[];
}

export function FinanceHistoryChart({ transactions }: FinanceHistoryChartProps) {
  const [timeRange, setTimeRange] = React.useState("AllTime")

  const filteredData = React.useMemo(() => {
    const now = new Date()
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    } else if (timeRange === "AllTime") {
      daysToSubtract = 2 * 365
    }

    const startDate = new Date(now)
    startDate.setDate(startDate.getDate() - daysToSubtract)

    const dataByDate = new Map<string, Transaction>()

    transactions
      .filter((item) => {
        const date = new Date(item.created_at)
        return date >= startDate
      })
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .forEach((item) => {
        const dateKey = new Date(item.created_at).toISOString().split("T")[0]
        dataByDate.set(dateKey, item)
      })

    return Array.from(dataByDate.values())
  }, [timeRange, transactions])


  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Finance History - Capital Over Time</CardTitle>
          <CardDescription>
            Showing capital changes over time based on financial transactions
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="AllTime" className="rounded-lg">
              All time
            </SelectItem>
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillCapital" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--primary)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--primary)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="created_at"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={true}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="capital"
              type="natural"
              fill="url(#fillCapital)"
              stroke="var(--primary)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default FinanceHistoryChart