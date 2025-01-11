import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
    return {
        "name": "Unihive - Empowered Campus life",
        "short_name": "Unihive",
        "description": "A Progressive Web App built with Next.js",
        "start_url": "/home/services",
        "display": "standalone",
        "icons": [
            {
                "src": "/Unihive.png",
                "sizes": "500x500",
                "type": "image/png"
            }
        ]
    }
}