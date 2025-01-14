import { ImageResponse } from 'next/og'
import { getServiceById } from '@/utils/data/services'
 
export const runtime = 'edge'
 
export const alt = 'Service Details'
export const size = {
  width: 1200,
  height: 630,
}
 
export const contentType = 'image/png'
 
export default async function Image({ params }: { params: { serviceId: string } }) {
  const service = await getServiceById(params.serviceId)
  
  if (!service) {
    return new ImageResponse(<div>Service not found</div>)
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
          {service.portfolio && service.portfolio.length > 0 && (
            <img
              src="/Unihive.svg"
              alt={service.name}
              style={{ width: '300px', height: '300px', objectFit: 'cover', marginBottom: '20px' }}
            />
          )}
          <div style={{ fontWeight: 'bold' }}>{service.name}</div>
          <div style={{ fontSize: '24px', color: '#666' }}>by {service.provider.name}</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}