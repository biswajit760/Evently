'use client'
import React from 'react'
import { Button } from '../ui/button'
import { formUrlQuery } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type PaginationProps = {
  page: number | string,
  totalPages: number,
  urlParamName?: string,
}

const Pagination = ({ urlParamName, page, totalPages }: PaginationProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const onClick = (btnType: string) => {
    const pageValue = btnType === 'next' 
      ? Number(page) + 1 
      : Number(page) - 1

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || 'page',
      value: pageValue.toString(),
    })

    router.push(newUrl, { scroll: false })
  }

  return (
    // Container: 
    // Light Mode: White background, gray border, shadow
    // Dark Mode: Transparent black, white border opacity, glass effect
    <div className="flex items-center gap-2 p-1.5 
      bg-white border border-gray-200 shadow-sm rounded-full 
      dark:bg-black/20 dark:border-white/10 dark:backdrop-blur-md dark:shadow-lg 
      w-fit mx-auto transition-colors duration-200">
      
      {/* Previous Button */}
      <Button
        size="icon"
        variant="ghost"
        className="h-9 w-9 rounded-full 
          text-gray-600 hover:bg-gray-100 hover:text-black
          dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white
          disabled:opacity-30 transition-all cursor-pointer"
        onClick={() => onClick('prev')}
        disabled={Number(page) <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous</span>
      </Button>

      {/* Page Indicator */}
      <div className="px-4 text-sm font-medium font-mono 
        text-gray-500 
        dark:text-slate-400">
        <span className="text-black dark:text-white">{page}</span> / {totalPages}
      </div>

      {/* Next Button */}
      <Button
        size="icon"
        variant="ghost" 
        className="h-9 w-9 rounded-full 
          text-gray-600 hover:bg-gray-100 hover:text-black
          dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white
          disabled:opacity-30 transition-all cursor-pointer"
        onClick={() => onClick('next')}
        disabled={Number(page) >= totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next</span>
      </Button>

    </div>
  )
}

export default Pagination