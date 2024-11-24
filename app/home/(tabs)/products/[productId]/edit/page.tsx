import { Suspense } from 'react'
import { getProductById } from '@/utils/data/products'
import { EditProductForm } from './_components/edit-product-form'
import { notFound, redirect } from 'next/navigation'
import { BackButton } from '@/components/back-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'


interface EditProductPageProps {
    params: {
        productId: string
    }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const product = await getProductById(params.productId)

    if (!product) {
        notFound()
    }

    return (
        <div className="flex flex-col min-h-screen w-screen">
            {/* Header */}
            <div className="flex items-center justify-start gap-3 h-14 w-full border-b py-2 px-6 fixed top-0 backdrop-blur-sm z-50 bg-background/80">
                <BackButton />
                <h1 className="text-2xl font-bold">Edit Product</h1>
            </div>

            {/* Content */}
            <div className="flex w-screen justify-center mt-5">
                <Card className='max-w-md h-fit my-20 mx-2'>
                    <CardHeader>
                        <CardTitle>Edit Product: {product.name}</CardTitle>
                        <CardDescription>Make changes to your product details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Suspense fallback={<div>Loading form...</div>}>
                            <EditProductForm product={product} />
                        </Suspense>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
