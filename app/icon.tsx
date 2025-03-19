import Image from 'next/image'
import { ImageResponse } from 'next/og'
 
export const size = {
    width: 32,
    height: 32,
  }

export const contentType = 'image/png'
 
// Image generation
export default function Icon() {
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
                <img
                    src='https://6oop17dja4.ufs.sh/f/WzcpwnxBp1vSmDCMk4cBhpeS74YPAlR1G69cdbsrOWfMtqoy'
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                    alt="DormBiz"
                />
            </div>
        ),
        {
            ...size,
        }
    )
}