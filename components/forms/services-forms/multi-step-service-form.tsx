"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { ExclamationTriangleIcon, RocketIcon } from "@radix-ui/react-icons"
import { ServiceSchema } from '@/constants/zod'
import { BeatLoader } from 'react-spinners'
import { Service } from '@prisma/client'
import { BasicInfoStep } from './steps/basic-info-step'
import { ImagesStep } from './steps/images-step'
import { AdditionalDetailsStep } from './steps/additional-details-step'
import { motion, AnimatePresence } from 'framer-motion'
import { Progress } from '@/components/ui/progress'
import { combineAvailabilityTimeSlots, parseAvailability } from '@/utils/helpers/availability'

interface MultiStepServiceFormProps {
  initialData?: Service
  onSubmit: (values: z.infer<typeof ServiceSchema>) => Promise<void>
  submitButtonText: string
}

export const MultiStepServiceForm = ({ 
  initialData, 
  onSubmit,
  submitButtonText = "Submit"
}: MultiStepServiceFormProps) => {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  
  const totalSteps = 3
  const progress = (step / totalSteps) * 100

  const form = useForm<z.infer<typeof ServiceSchema>>({
    resolver: zodResolver(ServiceSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      price: initialData.price,
      category: initialData.category,
      images: initialData.images,
      defaultLocation: initialData.defaultLocation || "",
      isMobile: initialData.isMobileService,
      availability: combineAvailabilityTimeSlots(parseAvailability(initialData.availability)!),
      portfolio: initialData.portfolio
    } : {
      name: "",
      price: 0,
      category: [],
      images: [],
      defaultLocation: "",
      isMobile: false,
      availability: {},
      portfolio: []
    },
  })

  const handleNext = async () => {
    let fieldsToValidate: string[] = []
    
    // Determine which fields to validate based on current step
    if (step === 1) {
      fieldsToValidate = ['name', 'price', 'category']
    } else if (step === 2) {
      fieldsToValidate = ['images', 'portfolio']
    }
    
    // Validate only the fields for the current step
    const result = await form.trigger(fieldsToValidate as any)
    
    if (result) {
      setStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1))
  }

  const handleFormSubmit = async (values: z.infer<typeof ServiceSchema>) => {
    setError("")
    setSuccess("")
    setIsSubmitting(true)
    
    try {
      await onSubmit(values)
      setSuccess("Operation completed successfully!")
    } catch (error) {
      setError("Something went wrong. Please try again!")
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm font-medium">
            Step {step} of {totalSteps}: {step === 1 ? 'Basic Info' : step === 2 ? 'Images' : 'Additional Details'}
          </span>
          <span className="text-sm font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <BasicInfoStep form={form} />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <ImagesStep form={form} />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <AdditionalDetailsStep form={form} />
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-6 w-6" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert>
              <RocketIcon className="h-6 w-6"/>
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleBack}
              disabled={step === 1 || isSubmitting}
            >
              Back
            </Button>
            
            {step < totalSteps ? (
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <BeatLoader /> : submitButtonText}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}