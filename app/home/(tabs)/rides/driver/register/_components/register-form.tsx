"use client"

import React from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { MultiImageUpload } from '@/components/multi-image-upload'
import { MultiFileUpload } from '@/components/multi-file-upload'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { DotIcon, DotFilledIcon } from '@radix-ui/react-icons'
import { BeatLoader } from 'react-spinners'

const driverSchema = z.object({
  age: z.number().min(18, "You must be at least 18 years old"),
  yearsOfExperience: z.number().min(0),
  license: z.array(z.string()).min(1, "License document is required"),
  carImages: z.array(z.string()).min(1, "At least one car image is required"),
  carBrand: z.string().min(1, "Car brand is required"),
  carModel: z.string().min(1, "Car model is required"),
  mileage: z.number().min(0),
  plateNumber: z.string().min(1, "Plate number is required"),
  carStatus: z.enum(["NEW", "SECOND_HAND", "OLD"]),
  termsAccepted: z.boolean().refine(val => val, "You must accept the terms"),
  policyAgreement: z.boolean().refine(val => val, "You must agree to follow the policies"),
})

type RegistrationData = z.infer<typeof driverSchema>

export const RegistrationForm = ({ userId }: { userId: string }) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [step, setStep] = React.useState(1)
  const router = useRouter()
  const registerDriver = useMutation(api.driver.RegisterDriver)

  const form = useForm<RegistrationData>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      age: 18,
      yearsOfExperience: 0,
      license: [],
      carImages: [],
      carBrand: "",
      carModel: "",
      mileage: 0,
      plateNumber: "",
      carStatus: "NEW",
      termsAccepted: false,
      policyAgreement: false,
    },
  })

  const onSubmit = async (data: RegistrationData) => {
    try {
      setIsLoading(true)
      await registerDriver({
        userId,
        age: data.age,
        license: data.license[0], // Taking first license file
        yearsOfExperience: data.yearsOfExperience,
        carImages: data.carImages,
        carBrand: data.carBrand,
        carModel: data.carModel,
        mileage: data.mileage,
        plateNumber: data.plateNumber,
        carStatus: data.carStatus,
        availabilityStatus: "OFFLINE",
      })
      router.push("/home/rides")
    } catch (error) {
      console.error("Registration failed:")
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto my-20 bg-zinc-50 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardHeader>
              <CardTitle>Driver Registration</CardTitle>
              <CardDescription>
                {step === 1 && "Step 1: Personal Information"}
                {step === 2 && "Step 2: Vehicle Information"}
                {step === 3 && "Step 3: Terms & Agreements"}
              </CardDescription>
            </CardHeader>
            <CardContent>
            {step === 1 && (
              <div className="space-y-4">
                <div className='grid grid-cols-2 gap-3'>
                    <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                                <Input
                                type="number"
                                {...field}
                                onChange={e => field.onChange(parseInt(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="yearsOfExperience"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Years of Driving Experience</FormLabel>
                            <FormControl>
                                <Input
                                type="number"
                                {...field}
                                onChange={e => field.onChange(parseInt(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                  control={form.control}
                  name="license"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Driver's License</FormLabel>
                      <FormControl>
                        <MultiFileUpload
                          value={field.value}
                          onChange={field.onChange}
                          maxFiles={1}
                        />
                      </FormControl>
                      <FormDescription>
                        Upload your driver's license (PDF format)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className='grid grid-cols-2 gap-3'>
                    <FormField
                    control={form.control}
                    name="carBrand"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Car Brand</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="carModel"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Car Model</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <div className='grid grid-cols-5 gap-3 items-center'>
                    <FormField
                    control={form.control}
                    name="mileage"
                    render={({ field }) => (
                        <FormItem className='col-span-2'>
                        <FormLabel>Mileage</FormLabel>
                        <FormControl>
                            <Input
                            type="number"
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value))}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="plateNumber"
                    render={({ field }) => (
                        <FormItem className='col-span-2'>
                        <FormLabel>Plate Number</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="carStatus"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Car Status</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                        >
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select car status" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="NEW">New</SelectItem>
                            <SelectItem value="SECOND_HAND">Second Hand</SelectItem>
                            <SelectItem value="OLD">Old</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <FormField
                  control={form.control}
                  name="carImages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Car Images</FormLabel>
                      <FormControl>
                        <MultiImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          maxFiles={5}
                        />
                      </FormControl>
                      <FormDescription>
                        Upload up to 5 images of your car
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem 
                        className={cn(
                            "flex flex-row items-center space-x-3 space-y-0 px-4 py-3 border rounded-lg cursor-pointer transition-colors",
                            field.value ? "border-red-600 bg-red-600/10" : "border-zinc-300 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-700"
                        )}>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Terms of Service
                        </FormLabel>
                        <p className="text-muted-foreground text-sm">
                            By checking this box, you agree to our terms of service.
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="policyAgreement"
                  render={({ field }) => (
                    <FormItem
                        className={cn(
                            "flex flex-row items-center space-x-3 space-y-0 px-4 py-3 border rounded-lg cursor-pointer transition-colors",
                            field.value ? "border-red-600 bg-red-600/10" : "border-zinc-300 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-700"
                        )}>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Policies and Guidelines
                        </FormLabel>
                        <p className="text-muted-foreground text-sm">
                            By checking this box, you agree to our privacy policies and guidelines.
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
            >
              Previous
            </Button>
            <div className='flex items-center gap-2'>
                {Array.from({ length: 3 }, (_, index) => {
                  if (step === index + 1) {
                    return <DotFilledIcon key={index} className='h-6 w-6' />;
                  }
                  return <DotIcon key={index} />;
                })}
            </div>
            {step < 3 ? (
              <Button onClick={nextStep}>Next</Button>
            ) : (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <BeatLoader /> : "Submit"}
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}