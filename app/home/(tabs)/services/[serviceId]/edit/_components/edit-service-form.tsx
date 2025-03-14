"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { updateService } from '@/actions/services'
import { ServiceSchema } from '@/constants/zod'
import * as z from 'zod'
import { Service } from '@prisma/client'
import { MultiStepServiceForm } from '@/components/forms/services-forms/multi-step-service-form'

interface EditServiceFormProps {
  service: Service
}

export const EditServiceForm: React.FC<EditServiceFormProps> = ({ service }) => {
  const router = useRouter()

  const handleSubmit = async (values: z.infer<typeof ServiceSchema>) => {
    await updateService(service.id, values)
    router.push(`/home/services/provider/${service.providerId}/my-services`)
  }

  return (
    <MultiStepServiceForm
      initialData={service}
      onSubmit={handleSubmit}
      submitButtonText="Update Service"
    />
  )
}