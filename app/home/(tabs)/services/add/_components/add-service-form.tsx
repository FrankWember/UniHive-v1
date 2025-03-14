"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { createService } from '@/actions/services'
import { ServiceSchema } from '@/constants/zod'
import * as z from 'zod'
import { useCurrentUser } from '@/hooks/use-current-user'
import { MultiStepServiceForm } from '@/components/forms/services-forms/multi-step-service-form'

export const AddServiceForm = () => {
  const router = useRouter()
  const user = useCurrentUser()

  const handleSubmit = async (values: z.infer<typeof ServiceSchema>) => {
    await createService(values)
    router.push(`/home/services/provider/${user?.id}/my-services`)
  }

  return (
    <MultiStepServiceForm
      onSubmit={handleSubmit}
      submitButtonText="Create Service"
    />
  )
}