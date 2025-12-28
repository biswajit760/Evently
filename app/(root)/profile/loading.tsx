
import { CardSkeleton } from "@/components/shared/CardSkeleton";
import { Skeleton } from "@/components/shared/skeleton";

export default function Loading() {
  return (
    <>
      {/* SECTION 1: My Tickets Header Skeleton */}
      <section className="bg-purple-50 dark:bg-zinc-900 border-b border-purple-100 dark:border-zinc-800 py-5 md:py-10 transition-colors">
        <div className="wrapper flex items-center justify-between">
          {/* Title Placeholder */}
          <Skeleton className="h-10 w-40 md:w-52 bg-purple-200 dark:bg-zinc-800" />
          
          {/* Button Placeholder (Hidden on mobile, matches real button) */}
          <Skeleton className="hidden sm:flex h-12 w-48 rounded-full bg-purple-200 dark:bg-zinc-800" />
        </div>
      </section>

      {/* SECTION 1: My Tickets Collection Grid */}
      <section className="wrapper my-8">
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10">
           {/* Display 3 skeletons to match limit={3} */}
           {[...Array(3)].map((_, i) => (
              <CardSkeleton key={`tickets-${i}`} />
           ))}
        </div>
      </section>

      {/* SECTION 2: Events Organized Header Skeleton */}
      <section className="bg-purple-50 dark:bg-zinc-900 border-b border-purple-100 dark:border-zinc-800 py-5 md:py-10 transition-colors">
        <div className="wrapper flex items-center justify-between">
          {/* Title Placeholder */}
          <Skeleton className="h-10 w-52 md:w-64 bg-purple-200 dark:bg-zinc-800" />
          
          {/* Button Placeholder */}
          <Skeleton className="hidden sm:flex h-12 w-48 rounded-full bg-purple-200 dark:bg-zinc-800" />
        </div>
      </section>

      {/* SECTION 2: Events Organized Collection Grid */}
      <section className="wrapper my-8">
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10">
           {/* Display 3 skeletons to match limit={3} */}
           {[...Array(3)].map((_, i) => (
              <CardSkeleton key={`organized-${i}`} />
           ))}
        </div>
      </section>
    </>
  )
}