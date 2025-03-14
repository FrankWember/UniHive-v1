import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { LocationInput } from '@/components/location-input'
import { AvailabilityInput } from '@/components/availability-input'
import { UseFormReturn } from "react-hook-form"
import * as z from 'zod'
import { ServiceSchema } from '@/constants/zod'

interface AdditionalDetailsStepProps {
  form: UseFormReturn<z.infer<typeof ServiceSchema>>
}

export const AdditionalDetailsStep = ({ form }: AdditionalDetailsStepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Additional Details</h2>
        <p className="text-muted-foreground">
          Provide more information about your service availability and location.
        </p>
      </div>
      
      <FormField
        control={form.control}
        name="defaultLocation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Default Location</FormLabel>
            <FormControl>
              <LocationInput {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="availability"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Availability</FormLabel>
            <FormControl>
              <AvailabilityInput
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormDescription>
              Set your available time slots for each day
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="isMobile"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow">
            <div className="space-y-1 leading-none">
              <FormLabel>
                Set Mobility for delivering services
              </FormLabel>
              <FormDescription>
                If you accept this, you will offer your services to customers at their desired location if asked.
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  )
}