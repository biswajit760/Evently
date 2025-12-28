
import { CardSkeleton } from "@/components/shared/CardSkeleton";
import { Skeleton } from "@/components/shared/skeleton";

export default function Loading() {
  return (
    <>
      {/* HERO SECTION SKELETON */}
      <section className="bg-contain py-8 md:py-10">
        <div className="wrapper grid grid-cols-1 md:grid-cols-2 gap-8 2xl:gap-0">
          
          {/* LEFT COLUMN: Text Skeletons */}
          <div className="flex flex-col justify-center gap-8">
            {/* H1 Title Skeleton */}
            <div className="space-y-4">
               <Skeleton className="h-14 w-3/4 md:h-14" />
               <Skeleton className="h-14 w-2/3 md:h-14" />
               <Skeleton className="h-14 w-10/12 md:h-14" />
               <Skeleton className="h-14 w-2/4 md:h-14" />
            </div>

            {/* Paragraph Skeleton */}
            <div className="space-y-3">
               <Skeleton className="h-4 w-full max-w-lg" />
               <Skeleton className="h-4 w-full max-w-md" />
               <Skeleton className="h-4 w-full max-w-md" />
            </div>

            {/* Button Skeleton */}
            <Skeleton className="h-12 w-44 rounded-full" />
          </div>

          {/* RIGHT COLUMN: Hero Image Skeleton */}
          <div className="hidden md:flex justify-center items-center">
             <Skeleton className="h-[550px] w-full max-w-[500px] rounded-xl object-contain" />
          </div>
        </div>
      </section>

      {/* EVENTS SECTION SKELETON */}
      <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        
        {/* "Trusted by..." Heading Skeleton */}
        <div className="space-y-2">
           <Skeleton className="h-10 w-64 md:h-12" />
           <Skeleton className="h-10 w-48 md:h-12" />
        </div>

        {/* Search & Filter Row Skeleton */}
        <div className="flex w-full flex-col gap-5 md:flex-row">
           <Skeleton className="h-[54px] w-full md:w-1/2 rounded-full" />
           <Skeleton className="h-[54px] w-full md:w-1/2 rounded-full" />
        </div>

        {/* Event Cards Grid */}
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10">
            {[...Array(6)].map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
      </section>
    </>
  )
}