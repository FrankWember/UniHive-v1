import { JsonValue } from "@prisma/client/runtime/library"
import { parseBookingTime } from "./availability"

export const getTimeRange = (date: Date, time: JsonValue) => {
    const { startTime, endTime } = parseBookingTime(time) ?? {}
    const startDate = new Date(date)
    const endDate = new Date(date)
    const startTimeParts = startTime?.split('-')
    const endTimeParts = endTime?.split('-')
  
    startDate.setHours(parseInt(startTimeParts![0]), parseInt(startTimeParts![1]))
    endDate.setHours(parseInt(endTimeParts![0]), parseInt(endTimeParts![1]))
    return `${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }