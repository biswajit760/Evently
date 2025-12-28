import { Skeleton } from "./skeleton"


export const CardSkeleton = () => {
  return (
    <div className="flex w-full max-w-[400px] flex-col overflow-hidden rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        {/* Image Placeholder */}
        <Skeleton className="h-48 w-full bg-gray-200 dark:bg-zinc-800" />
        
        <div className="flex flex-col gap-3 p-5">
            {/* Badges Placeholder */}
            <div className="flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
            </div>

            {/* Date Placeholder */}
            <Skeleton className="h-4 w-24 mt-1" />

            {/* Title Placeholder */}
            <Skeleton className="h-6 w-3/4" />

            {/* Footer / Organizer Placeholder */}
            <div className="flex items-center justify-between w-full pt-3 mt-auto border-t border-gray-200 dark:border-zinc-800">
                 <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-20" />
                 </div>
                 <Skeleton className="h-4 w-12" />
            </div>
        </div>
    </div>
  )
}