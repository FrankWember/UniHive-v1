import Image from 'next/image'
import { ImageResponse } from 'next/og'
 
export const size = {
    width: 32,
    height: 32,
  }

export const contentType = 'image/png'
 
// Image generation
export default function AppleIcon() {
    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    width: '100%',
                    borderRadius: '20%'
                }}
            >
                <Image
                    src="/Unihive.png"
                    width={500}
                    height={500}
                    alt="Unihive"
                />
            </div>
        ),
        {
            ...size,
        }
    )
}