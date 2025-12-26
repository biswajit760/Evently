import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className='border-t border-gray-100 bg-white dark:bg-black dark:border-zinc-800 transition-colors duration-300'>
      <div className='flex-center wrapper flex-between flex flex-col gap-4 p-5 text-center sm:flex-row'>
        <Link href='/'>
          <Image 
            src='/assets/images/logo.svg' 
            width={128} 
            height={38} 
            alt="Evently logo" 
            className="dark:invert" // Turns the black logo white in dark mode
          />
        </Link>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          © 2025 Evently. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer