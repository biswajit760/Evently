"use client"

import Image from 'next/image';
import { useEffect, useState } from 'react'
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react'; // Make sure you have lucide-react or use an image

const Search = ({ placeholder = 'Search title...' }: { placeholder?: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('query') || '');

  // SYNC: Ensure state matches URL if URL changes externally (e.g. back button)
  useEffect(() => {
    const currentQuery = searchParams.get('query') || '';
    if (query !== currentQuery) {
        setQuery(currentQuery);
    }
  }, [searchParams]);

  // DEBOUNCE LOGIC
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const currentQuery = searchParams.get('query') || '';
      
      if (currentQuery === query) return;

      let newUrl = '';
      if(query) {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'query',
          value: query
        })
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ['query']
        })
      }

      router.push(newUrl, { scroll: false });
    }, 300)

    return () => clearTimeout(delayDebounceFn);
  }, [query, searchParams, router])

  // NEW: Handle Manual Clear
  const handleClear = () => {
      setQuery('');
  }

  return (
    <div className="group flex-center h-[60px] w-full overflow-hidden rounded-full bg-gray-200 border border-gray-400 px-4 py-2 transition-all focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 hover:bg-white hover:shadow-md">
      
      {/* Search Icon - slightly transparent, darkens on hover/focus */}
      <Image 
        src="/assets/icons/search.svg" 
        alt="search" 
        width={28} 
        height={28} 
        className="opacity-100 group-focus-within:opacity-100 transition-opacity"
      />
      
      <Input 
        type="text"
        placeholder={placeholder}
        onChange={(e) => setQuery(e.target.value)}
        value={query} 
        // KEY CHANGE: border-none, shadow-none, bg-transparent. 
        // We let the Parent Div handle the visuals.
        className="p-regular-18 border-none shadow-none bg-transparent outline-offset-0 placeholder:text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0 ml-2"
      />

      {/* Clear Button - Only shows when there is text */}
      {query && (
        <button 
            onClick={handleClear}
            className="p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
        >
            <X size={18} />
        </button>
      )}
    </div>
  )
}

export default Search