"use client"

import Image from 'next/image';
import { useEffect, useState } from 'react'
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react'; 

const Search = ({ placeholder = 'Search title...' }: { placeholder?: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('query') || '');

  useEffect(() => {
    const currentQuery = searchParams.get('query') || '';
    if (query !== currentQuery) {
        setQuery(currentQuery);
    }
  }, [searchParams]);

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

  const handleClear = () => {
      setQuery('');
  }

  return (
    <div className="group flex-center h-[60px] w-full overflow-hidden rounded-full bg-gray-50 border border-gray-200 dark:bg-zinc-900 dark:border-zinc-800 px-4 py-2 transition-all focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 hover:bg-white hover:shadow-md dark:hover:bg-zinc-800/80 dark:hover:border-zinc-700">
      
      <Image 
        src="/assets/icons/search.svg" 
        alt="search" 
        width={28} 
        height={28} 
        className="opacity-60 group-focus-within:opacity-100 transition-opacity dark:invert dark:brightness-200"
      />
      
      <Input 
        type="text"
        placeholder={placeholder}
        onChange={(e) => setQuery(e.target.value)}
        value={query} 
        className="p-regular-18 border-none shadow-none bg-transparent outline-offset-0 ml-2 focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900 placeholder:text-gray-500 dark:text-white dark:placeholder:text-zinc-400"
      />

      {query && (
        <button 
            onClick={handleClear}
            className="p-1 rounded-full text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-zinc-700 dark:hover:text-gray-200"
        >
            <X size={18} />
        </button>
      )}
    </div>
  )
}

export default Search