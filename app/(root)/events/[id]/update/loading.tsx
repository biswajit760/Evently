import { Skeleton } from "@/components/shared/skeleton";


export default function Loading() {
  return (
    <div className="flex flex-col gap-4 space-y-12 pb-10">
      
      {/* SECTION 1: GENERAL INFO SKELETON */}
      <div className="flex flex-col gap-8 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-8 md:p-10 shadow-xl shadow-slate-100/50 dark:shadow-none">
        
        {/* Section Header */}
        <div className="border-b border-slate-100 dark:border-zinc-800 pb-4 space-y-2">
          <Skeleton className="h-8 w-48 bg-slate-200 dark:bg-zinc-800" />
          <Skeleton className="h-4 w-64 bg-slate-200 dark:bg-zinc-800" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Title Input */}
          <div className="col-span-2 md:col-span-1 space-y-2">
             <Skeleton className="h-5 w-24" />
             <Skeleton className="h-12 w-full rounded-md" />
          </div>

          {/* Category Dropdown */}
          <div className="col-span-2 md:col-span-1 space-y-2">
             <Skeleton className="h-5 w-24" />
             <Skeleton className="h-12 w-full rounded-md" />
          </div>

          {/* Description Textarea */}
          <div className="col-span-2 space-y-2">
             <Skeleton className="h-5 w-24" />
             <Skeleton className="h-40 w-full rounded-md" />
          </div>

          {/* Image Uploader */}
          <div className="col-span-2 space-y-2">
             <Skeleton className="h-5 w-32" />
             <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>

      {/* SECTION 2: LOGISTICS SKELETON */}
      <div className="flex flex-col gap-8 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-8 md:p-10 shadow-xl shadow-slate-100/50 dark:shadow-none">
        
        {/* Section Header */}
        <div className="border-b border-slate-100 dark:border-zinc-800 pb-4 space-y-2">
          <Skeleton className="h-8 w-40 bg-slate-200 dark:bg-zinc-800" />
          <Skeleton className="h-4 w-56 bg-slate-200 dark:bg-zinc-800" />
        </div>

        <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Location */}
                <div className="col-span-2 md:col-span-1 space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-12 w-full rounded-md" />
                </div>

                {/* URL */}
                <div className="col-span-2 md:col-span-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-12 w-full rounded-md" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Start Date */}
                <div className="w-full space-y-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-12 w-full rounded-md" />
                </div>

                {/* End Date */}
                <div className="w-full space-y-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-12 w-full rounded-md" />
                </div>
            </div>
        </div>
      </div>

      {/* SECTION 3: TICKETING SKELETON */}
      <div className="flex flex-col gap-8 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-8 md:p-10 shadow-xl shadow-slate-100/50 dark:shadow-none">
         
         {/* Section Header */}
         <div className="border-b border-slate-100 dark:border-zinc-800 pb-4 space-y-2">
            <Skeleton className="h-8 w-32 bg-slate-200 dark:bg-zinc-800" />
            <Skeleton className="h-4 w-48 bg-slate-200 dark:bg-zinc-800" />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
             {/* Price Input */}
             <div className="w-full space-y-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-12 w-full rounded-md" />
             </div>

             {/* Free Ticket Checkbox */}
             <div className="w-full space-y-2 pt-7">
                <Skeleton className="h-12 w-full rounded-md" />
             </div>
         </div>
      </div>

      {/* Submit Button Skeleton */}
      <div className="flex justify-center">
         <Skeleton className="h-12 w-full md:w-48 rounded-md bg-indigo-200 dark:bg-indigo-900" />
      </div>

    </div>
  )
}