import { Skeleton } from "@/components/shared/skeleton";


export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
       {/* Hero Image Skeleton */}
       <Skeleton className="h-[300px] md:h-[500px] w-full rounded-none bg-gray-300 dark:bg-zinc-800" />

       <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-10 md:py-8">
           <div className="grid grid-cols-1 lg:grid-cols-3 md:gap-12 gap-6">
               
               {/* Main Content Skeleton */}
               <div className="lg:col-span-2 space-y-8">
                    {/* Title */}
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-6 w-1/4" />
                    </div>

                    {/* Highlight Cards (Date/Location) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Skeleton className="h-24 w-full rounded-xl" />
                        <Skeleton className="h-24 w-full rounded-xl" />
                    </div>
                    
                    {/* Description Text */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
               </div>

               {/* Sidebar Skeleton (Ticket Card) */}
               <div className="lg:col-span-1">
                   <Skeleton className="h-[400px] w-full rounded-3xl" />
               </div>
           </div>
       </div>
    </div>
  )
}