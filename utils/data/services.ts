"server only"

import { prisma } from "@/prisma/connection"
import { auth } from "@/auth"
import { uploadToUploadThing, deleteFromUploadThing } from '@/lib/cloud-storage';
import { currentUser } from "@/lib/auth";
import { revalidatePath } from 'next/cache'
import { Service } from "@prisma/client";

export async function getServiceById(serviceId: string) {
  return await prisma.service.findUnique({
    where: { id: serviceId },
    include: { 
      provider: {
        include: {
          services: {
            select: {
              offers: {
                select: {
                  bookings: {
                    select: {
                      customer: {
                        select: {
                          id: true
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      offers: {
        include: {
          bookings: {
            select: {
              date: true,
              time: true,
              customer: {
                select: {
                  image: true
                }
              }
            }
          }
        }
      },
      // offers: true
    }
  })
}

export async function getRelatedServices (service: Service) {
  const relatedServices = await prisma.service.findMany({
    where: {
      category: {
        hasSome: service.category
      },
      NOT: {
        id: service.id
      }
    },
    include: {
      offers: {
        select: {
          bookings: {
            select: {
              customer: {
                select: {
                  image: true
                }
              }
            }
          }
        }
      },
      provider: true,
      reviews: true
    }
  })
  return relatedServices
}

export async function getBookedServiceById(bookedServiceId: string) {
    return await prisma.serviceBooking.findUnique({
      where: { id: bookedServiceId },
      include: { offer: {include: {service: true}} }
    })
}

export async function getAllServices () {
    return await prisma.service.findMany({
      include: {
        provider: true
      }
    })
}


export async function getProviderById(id: string) {
    const provider = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phone: true,
        isOnboarded: true,
        createdAt: true
      },
    })
    return provider
}

export async function getProviderServices(providerId: string) {
    const services = await prisma.service.findMany({
      where: { providerId },
      include: {
        offers: {
          select: {
            bookings: {
              select: {
                customer: {
                  select: {
                    image: true
                  }
                }
              }
            }
          }
        },
        provider: true,
        reviews: true
      },
    })
    return services
}

export async function getMatchedServices(searchParams: { [key: string]: string | string[] | undefined }) {
    const user = await currentUser()
    const userId = user?.id
  
    let query: any = {}
  
    if (searchParams.category) {
      query.category = {
        has: searchParams.category as string
      }
    }
  
    if (searchParams.mine === 'true' && userId) {
      query.providerId = userId
    }

    if (searchParams.favourites === 'true' && userId) {
      return await prisma.service.findMany({
        where: {
          likes: {
            some: {
              userId
            }
          }
        },
        include: {
          offers: {
            select: {
              bookings: {
                select: {
                  customer: {
                    select: {
                      image: true
                    }
                  }
                }
              }
            }
          },
          provider: true,
          reviews: true
        }
      })
    }
  
    const services = await prisma.service.findMany({
      where: query,
      include: {
        offers: {
          select: {
            bookings: {
              select: {
                customer: {
                  select: {
                    image: true
                  }
                }
              }
            }
          }
        },
        provider: true,
        reviews: true
      }
    })
  
    return services
}
  


export async function getServiceReviews (serviceId: string) {
    return await prisma.serviceReview.findMany({
        where: {serviceId: serviceId},
        include: {reviewer: true}
    })
}

export async function getServiceOfferById (offerId: string) {
    return await prisma.serviceOffer.findUnique({
        where: {id: offerId},
    })
}

export async function getServiceOffers (serviceId: string) {
    return await prisma.serviceOffer.findMany({
        where: {serviceId: serviceId},
    })
}

export async function getBookingById (bookingId: string) {
    return await prisma.serviceBooking.findUnique({
        where: {id: bookingId},
        include: {
            offer: {
                include: {
                    service: true
                }
            },
            customer: true
        }
    })
}

export async function getBookingsByServiceId (serviceId: string) {
    return await prisma.serviceBooking.findMany({
        where: {
          offer: {
            serviceId: serviceId
          }
        },
        include: {
            offer: {
                include: {
                    service: true
                }
            },
            customer: true
        }
    })
}

export async function getBookingsByUserId (userId: string) {
    return await prisma.serviceBooking.findMany({
        where: {
          customerId: userId
        },
        include: {
            offer: {
                include: {
                    service: true
                }
            },
            customer: true
        }
    })
}