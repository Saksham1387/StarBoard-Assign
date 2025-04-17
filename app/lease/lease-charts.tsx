"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  generateRentScheduleData,
  generateMarketComparisonData,
  generateRecoveryBreakdownData,
  generateLeaseTimelineData,
  leaseData,
} from "./lease-data"

import { type ChartConfig, ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type RecoveryType = 'CAM' | 'Taxes' | 'Insurance';

const RECOVERY_COLORS: Record<RecoveryType, string> = {
  CAM: "#0088FE",
  Taxes: "#00C49F",
  Insurance: "#FFBB28",
}

export default function LeaseCharts() {
  const rentScheduleData = generateRentScheduleData()
  const marketComparisonData = generateMarketComparisonData()
  const recoveryBreakdownData = generateRecoveryBreakdownData()
  const leaseTimelineData = generateLeaseTimelineData()

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: "Mobile",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rent Escalation Chart */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Rent Escalation</CardTitle>
            <CardDescription>
              Annual rent PSF over lease term with {leaseData.escalations.rate} escalation
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[300px] sm:h-[400px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={rentScheduleData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `$${value}`} domain={[20, 40]} />
                    <Tooltip
                      formatter={(value) => [`$${value}`, "Rent PSF"]}
                      labelFormatter={(label) => `Year: ${label}`}
                    />
                    <Line type="monotone" dataKey="Rent PSF" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Market Comparison Chart */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Market Rent Comparison</CardTitle>
            <CardDescription>Comparing lease rate to market comps ($ PSF)</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[300px] sm:h-[400px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={marketComparisonData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 30,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={70}
                      interval={0}
                    />
                    <YAxis tickFormatter={(value) => `$${value}`} domain={[0, 30]} />
                    <Tooltip formatter={(value) => [`$${value}`, "Rent PSF"]} />
                    <Bar dataKey="value" name="Rent PSF">
                      {marketComparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.name === "280 Richards" ? "#8884d8" : "#82ca9d"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recovery Breakdown Chart */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Recovery Breakdown</CardTitle>
            <CardDescription>Distribution of recovery costs by category</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[300px] sm:h-[400px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={recoveryBreakdownData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {recoveryBreakdownData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={RECOVERY_COLORS[entry.name as RecoveryType]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                    <ChartLegend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Lease Timeline Chart */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Lease Timeline</CardTitle>
            <CardDescription>Key dates and events in the lease lifecycle</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[300px] sm:h-[400px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={leaseTimelineData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 30,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis hide />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-4 border rounded shadow-sm">
                              <p className="font-bold">{payload[0].payload.event}</p>
                              <p>{payload[0].payload.description}</p>
                              <p className="text-sm text-gray-500">Year: {payload[0].payload.year}</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Area type="monotone" dataKey="year" stroke="#8884d8" fill="#8884d8" opacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rent Schedule Table */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Rent Schedule</CardTitle>
          <CardDescription>Detailed annual rent schedule over the lease term</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border px-4 py-2 text-left">Year</th>
                  <th className="border px-4 py-2 text-left">Rent PSF</th>
                  <th className="border px-4 py-2 text-left">Annual Rent</th>
                  <th className="border px-4 py-2 text-left">Monthly Rent</th>
                  <th className="border px-4 py-2 text-left">Escalation</th>
                </tr>
              </thead>
              <tbody>
                {leaseData.rentSchedule.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="border px-4 py-2">{item.year}</td>
                    <td className="border px-4 py-2">${item.rentPSF.toFixed(2)}</td>
                    <td className="border px-4 py-2">${item.annualRent.toLocaleString()}</td>
                    <td className="border px-4 py-2">
                      ${(item.annualRent / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                    <td className="border px-4 py-2">
                      {index > 0
                        ? `${((item.rentPSF / leaseData.rentSchedule[index - 1].rentPSF - 1) * 100).toFixed(1)}%`
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
