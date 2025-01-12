import { ImageResponse } from 'next/og'
import { getEventById } from '@/actions/events'
 
export const runtime = 'edge'
 
export const alt = 'Event Details'
export const size = {
  width: 1200,
  height: 630,
}
 
export const contentType = 'image/png'
 
export default async function Image({ params }: { params: { eventId: string } }) {
  const event = await getEventById(params.eventId)
  
  if (!event) {
    return new ImageResponse(<div>Event not found</div>)
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
          {event.images && event.images.length > 0 && (
            <img
              src={event.images[0]}
              alt={event.title}
              style={{ width: '100%', height: '300px', objectFit: 'cover', marginBottom: '20px' }}
            />
          )}
          <div style={{ fontWeight: 'bold' }}>{event.title}</div>
          <div style={{ fontSize: '24px', color: '#666' }}>
            {new Date(event.dateTime).toLocaleDateString()}
          </div>
          <div style={{ fontSize: '20px', color: '#4CAF50' }}>{event.location}</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}