"use client"

import { parseBookingTime } from "@/utils/helpers/availability"
import {
  Calendar,
  CalendarCurrentDate,
  CalendarDayView,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  CalendarWeekView,
  CalendarYearView,
  monthEventVariants
} from '@/components/ui/full-calendar';
import { VariantProps } from "class-variance-authority";
import { useState, useEffect } from "react"
import { Calendar as MobileCalendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react"
import { format, isSameDay } from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { BookingStatus, Service, ServiceBooking, ServiceOffer, User } from "@prisma/client"
import { getTimeRange } from "@/utils/helpers/time"
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

// Define the booking type based on your Prisma model
type Booking = ServiceBooking & {
  offer: ServiceOffer & {
    service: Service
  }
  customer: User
}

// Status badge component
const StatusBadge = ({ status }: { status: BookingStatus }) => {
  return (
    <Badge
      variant={
        status === "PENDING"
          ? "warning"
          : status === "ACCEPTED"
            ? "success"
            : status === "CANCELLED"
              ? "secondary"
              : status === "REJECTED"
                ? "destructive"
                : "default"
      }
    >
      {status}
    </Badge>
  )
}

const calendarStyles = {
  fullWidth: "w-full",
  dayWrapper: "w-full aspect-square flex items-center justify-center relative",
}


export default function BookingsCalendar({ bookings }: { bookings: Booking[] }) {
  const isMobile = useIsMobile()
  const [date, setDate] = useState<Date>(new Date())
  const [view, setView] = useState<"month" | "day">("month")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "ALL">("ALL")

  // Filter bookings based on selected date and status
  useEffect(() => {
    let filtered = bookings

    if (view === "day") {
      filtered = bookings.filter((booking) => isSameDay(new Date(booking.date), selectedDate))
    }

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((booking) => booking.status === statusFilter)
    }

    setFilteredBookings(filtered)
  }, [bookings, selectedDate, statusFilter, view])

  // Function to render bookings as calendar day modifiers
  const getDayBookings = (day: Date) => {
    return bookings.filter((booking) => isSameDay(new Date(booking.date), day))
  }

  // Custom day rendering for the calendar
  const renderDay = (day: Date) => {
    const dayBookings = getDayBookings(day)
    const hasBookings = dayBookings.length > 0

    return (
      <div className={cn(calendarStyles.dayWrapper, "cursor-pointer")} onClick={() => {setSelectedDate(day); setView("day")}}>
        <div className={`text-center ${hasBookings ? "font-bold" : ""}`}>{format(day, "d")}</div>
        {hasBookings && (
          <div className="absolute bottom-1 left-0 right-0 flex justify-center">
            <div className="flex gap-0.5">
              {dayBookings.length > 3 ? (
                <Badge variant="outline" className="text-xs px-1 py-0">
                  {dayBookings.length}
                </Badge>
              ) : (
                dayBookings.slice(0, 3).map((_, i) => <div key={i} className="w-1 h-1 rounded-full bg-primary" />)
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  const events = bookings.map(booking => {
    const { startTime, endTime } = parseBookingTime(booking.time) ?? {}
    const color = booking.status==="ACCEPTED"?"green":
      booking.status==="PENDING"?"yellow"
      :"purple" 
    return {
        id: booking.id,
        date: booking.date,
        startTime: startTime!,
        stopTime: endTime!,
        title: booking.offer.title,
        color: color as VariantProps<typeof monthEventVariants>['variant']
    }
  })

  if (isMobile) return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings Calendar</h1>
          <p className="text-muted-foreground">Manage and view all your service bookings in one place.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as BookingStatus | "ALL")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="ACCEPTED">Accepted</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Tabs value={view} onValueChange={(v) => setView(v as "month" | "day")}>
            <TabsList>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="day">Day</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="px-5 pt-5 pb-0">
            <div className="flex items-center justify-between">
              <CardTitle>{format(date, "MMMM yyyy")}</CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const newDate = new Date(date)
                    newDate.setMonth(date.getMonth() - 1)
                    setDate(newDate)
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const newDate = new Date(date)
                    newDate.setMonth(date.getMonth() + 1)
                    setDate(newDate)
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDate(new Date())
                    setSelectedDate(new Date())
                  }}
                >
                  Today
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-4 h-full">
            <MobileCalendar
              mode="single"
              selected={selectedDate}
              onSelect={(day) => {
                if (day) {
                  setSelectedDate(day)
                  if (view === "month") {
                    setView("day")
                  }
                }
              }}
              month={date}
              onMonthChange={setDate}
              className="rounded-md w-full h-full"
              classNames={{
                month: "w-full",
                table: "w-full border-collapse",
                row: "w-full flex",
                head_row: "flex w-full mt-4",
                head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem] cursor-pointer",
                cell: "h-10 w-full p-0 text-center relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-10 w-full p-0 flex items-center justify-center aria-selected:opacity-100",
                day_range_end: "day-range-end",
                day_selected:
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              }}
              components={{
                Day: ({ date: dayDate }) => renderDay(dayDate),
              }}
              disabled={(date) => {
                const dayHasBookings = bookings.find((booking) => isSameDay(new Date(booking.date), date))
                return !dayHasBookings
              }}
            />
          </CardContent>
        </Card>

        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle>
              {view === "day" ? `Bookings for ${format(selectedDate, "MMMM d, yyyy")}` : "All Bookings"}
            </CardTitle>
            <CardDescription>
              {filteredBookings.length} booking{filteredBookings.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <Card key={booking.id} className="overflow-hidden">
                      <div
                        className={`h-1 ${
                          booking.status === "ACCEPTED"
                            ? "bg-green-500"
                            : booking.status === "PENDING"
                              ? "bg-yellow-500"
                              : booking.status === "CANCELLED"
                                ? "bg-red-500"
                                : "bg-purple-500"
                        }`}
                      />
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">{booking.offer.service.name}</div>
                          <StatusBadge status={booking.status} />
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {booking.offer.title} - ${booking.offer.price}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {format(new Date(booking.date), "MMM d, yyyy")} at{" "}
                            {getTimeRange(booking.date, booking.time)}
                          </span>
                        </div>
                        {booking.location && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{booking.location}</span>
                          </div>
                        )}
                        <div className="mt-3 pt-3 border-t flex items-center gap-2">
                          <div className="">
                            {booking.customer.image ? (
                              <div className="h-8 w-8 rounded-full overflow-hidden">
                                <img
                                  src={booking.customer.image || "/placeholder.svg"}
                                  alt={booking.customer.name ?? booking.customer.email}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                <span className="text-xs font-medium">
                                  {booking.customer.name?.charAt(0) ?? booking.customer.email?.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{booking.customer.name}</div>
                            <div className="text-xs text-muted-foreground">{booking.customer.email}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-center">
                    <div className="text-muted-foreground mb-2">No bookings found</div>
                    <p className="text-sm text-muted-foreground">
                      {view === "day"
                        ? `There are no bookings for ${format(selectedDate, "MMMM d, yyyy")}`
                        : "No bookings match your current filters"}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )

    return (
      <Calendar 
        events={events}
      >
        <div className="h-dvh p-14 flex flex-col">
          <div className="flex px-6 items-center gap-2 mb-6">
            <CalendarViewTrigger
              className="aria-[current=true]:bg-accent"
              view="day"
            >
              Day
            </CalendarViewTrigger>
            <CalendarViewTrigger
              view="week"
              className="aria-[current=true]:bg-accent"
            >
              Week
            </CalendarViewTrigger>
            <CalendarViewTrigger
              view="month"
              className="aria-[current=true]:bg-accent"
            >
              Month
            </CalendarViewTrigger>
            <CalendarViewTrigger
              view="year"
              className="aria-[current=true]:bg-accent"
            >
              Year
            </CalendarViewTrigger>

            <span className="flex-1" />

            <CalendarCurrentDate />

            <CalendarPrevTrigger>
              <ChevronLeft size={20} />
              <span className="sr-only">Previous</span>
            </CalendarPrevTrigger>

            <CalendarTodayTrigger>Today</CalendarTodayTrigger>

            <CalendarNextTrigger>
              <ChevronRight size={20} />
              <span className="sr-only">Next</span>
            </CalendarNextTrigger>
          </div>

          <div className="flex-1 px-6 overflow-hidden">
            <CalendarDayView />
            <CalendarWeekView />
            <CalendarMonthView />
            <CalendarYearView />
          </div>
        </div>
      </Calendar>
  )
}

