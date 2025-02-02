import { Suspense } from 'react'
import { NewProductForm } from './_components/new-product-form'
import { BackButton } from '@/components/back-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RoleGate } from '@/components/role-gate'
import { UserRole } from '@prisma/client'

export default function NewProductPage() {
  return (
    <RoleGate allowedRoles={[UserRole.SELLER, UserRole.ADMIN]}>
      <div className="flex flex-col min-h-screen w-screen">
        {/* Header */}
        <div className="flex items-center justify-start gap-3 h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
          <BackButton />
          <h1 className="text-2xl font-bold">Create Product</h1>
        </div>

        {/* Content */}
        <div className="flex w-screen justify-center mt-5">
          <Card className='max-w-md h-fit my-20 mx-2'>
              <CardHeader>
              <CardTitle>Add New Product</CardTitle>
              <CardDescription>Fill in the details to list a new product in the marketplace.</CardDescription>
              </CardHeader>
              <CardContent>
              <Suspense fallback={<div>Loading form...</div>}>
                  <NewProductForm />
              </Suspense>
              </CardContent>
          </Card>
          </div>
      </div>
    </RoleGate>
  )
}