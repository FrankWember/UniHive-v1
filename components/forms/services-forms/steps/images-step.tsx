import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { MultiImageUpload } from '@/components/multi-image-upload'
import { UseFormReturn } from "react-hook-form"
import * as z from 'zod'
import { ServiceSchema } from '@/constants/zod'

interface ImagesStepProps {
  form: UseFormReturn<z.infer<typeof ServiceSchema>>
}

export const ImagesStep = ({ form }: ImagesStepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Service Images</h2>
        <p className="text-muted-foreground">
          Upload images that showcase your service. High-quality images help attract more customers.
        </p>
      </div>
      
      <FormField
        control={form.control}
        name="images"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Service Images</FormLabel>
            <FormControl>
              <MultiImageUpload
                value={field.value}
                onChange={field.onChange}
                maxFiles={5}
              />
            </FormControl>
            <FormDescription>Upload up to 5 images for your service. The first image will be used as the cover.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="portfolio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Portfolio Images (Optional)</FormLabel>
            <FormControl>
              <MultiImageUpload
                value={field.value!}
                onChange={field.onChange}
                maxFiles={5}
              />
            </FormControl>
            <FormDescription>Upload additional portfolio images to showcase your previous work.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}