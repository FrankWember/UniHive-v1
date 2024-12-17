"use client"
import { Skeleton } from "@/components/ui/skeleton"

export function ChatListSkeleton() {
    return (
      <>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="p-4 border-b">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-grow">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          </div>
        ))}
      </>
    )
  }