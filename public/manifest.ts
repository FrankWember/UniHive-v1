import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
    return {
        "name": "DormBiz - Empowered Campus life",
        "short_name": "DormBiz",
        "description": "Digitally empowered campus life. Enjoy your university experience!",
        "start_url": "/home/services",
        "display": "standalone",
        "icons": [
            {
                "src": "/DormBiz.png",
                "sizes": "500x500",
                "type": "image/png"
            }
        ]
    }
}