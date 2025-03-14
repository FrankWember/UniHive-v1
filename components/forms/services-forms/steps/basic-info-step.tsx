import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { CategorySelect } from '@/components/category-select'
import { SERVICE_CATEGORIES } from '@/constants/categories'
import { UseFormReturn } from "react-hook-form"
import * as z from 'zod'
import { ServiceSchema } from '@/constants/zod'

interface BasicInfoStepProps {
  form: UseFormReturn<z.infer<typeof ServiceSchema>>
}

export const BasicInfoStep = ({ form }: BasicInfoStepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Basic Information</h2>
        <p className="text-muted-foreground">
          Let's start with the essential details of your service.
        </p>
      </div>
      
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Service Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter service name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price ($)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="50.00" 
                {...field} 
                onChange={e => field.onChange(parseFloat(e.target.value))} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Categories</FormLabel>
            <FormControl>
              <CategorySelect 
                options={SERVICE_CATEGORIES}
                value={field.value} 
                onChange={(newValue) => {
                  field.onChange(newValue)
                }} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}