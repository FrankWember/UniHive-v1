"use client"

import { useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Define the interface for the ratings data
interface CombinedServiceRating {
  serviceId: string
  serviceName: string
  numberOfReviews: number
  overall: number
  cleanliness: number
  accuracy: number
  checkIn: number
  communication: number
  location: number
  value: number
}

// Props interface for the Insights component
interface InsightsProps {
  ratingsList: CombinedServiceRating[]
}

export default function Insights({ ratingsList }: InsightsProps) {
  const [activeTab, setActiveTab] = useState(ratingsList[0]?.serviceId || "")

  // Function to transform the rating data for the chart
  const transformRatingData = (rating: CombinedServiceRating) => {
    return [
      { category: "Overall", value: rating.overall },
      { category: "Cleanliness", value: rating.cleanliness },
      { category: "Accuracy", value: rating.accuracy },
      { category: "Check-in", value: rating.checkIn },
      { category: "Communication", value: rating.communication },
      { category: "Location", value: rating.location },
      { category: "Value", value: rating.value },
    ]
  }

  // Chart configuration
  const chartConfig = {
    value: {
      label: "Rating",
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 w-full justify-start overflow-x-auto">
          {ratingsList.map((rating) => (
            <TabsTrigger key={rating.serviceId} value={rating.serviceId}>
              {rating.serviceName}
            </TabsTrigger>
          ))}
        </TabsList>

        {ratingsList.map((rating) => (
          <TabsContent key={rating.serviceId} value={rating.serviceId}>
            <Card>
              <CardHeader>
                <CardTitle>Service Ratings</CardTitle>
                <CardDescription>Based on {rating.numberOfReviews} reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                  <BarChart
                    data={transformRatingData(rating)}
                    margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                    accessibilityLayer
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="category"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis domain={[0, 5]} tickCount={6} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                    <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} maxBarSize={50} />
                    <ChartTooltip content={<ChartTooltipContent formatter={(value) => [`${value}/5`, "Rating"]} />} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

