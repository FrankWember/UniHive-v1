import { ImageResponse } from 'next/og'
import { getProductById } from '@/utils/data/products'
 
export const runtime = 'edge'
 
export const alt = 'Product Details'
export const size = {
  width: 1200,
  height: 630,
}
 
export const contentType = 'image/png'
 
export default async function Image({ params }: { params: { productId: string } }) {
  const product = await getProductById(params.productId)
  
  if (!product) {
    return new ImageResponse(<div>Product not found</div>)
  }

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {product.images && product.images.length > 0 && (
            <img
              src="/Unihive.svg"
              alt={product.name}
              style={{ width: '300px', height: '300px', objectFit: 'cover', marginBottom: '20px' }}
            />
          )}
          <div style={{ fontWeight: 'bold' }}>{product.name}</div>
          <div style={{ fontSize: '24px', color: '#666' }}>{product.brand}</div>
          <div style={{ fontSize: '36px', color: '#4CAF50' }}>${product.price.toFixed(2)}</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}