'use client'
import { headerLinks } from '@/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const NavItems = () => {
    const pathname = usePathname();
    
  return (
    // Replaced Tailwind flex classes with 'custom-nav-list'
    <ul className="custom-nav-list">
         {headerLinks.map((link)=>{
            const isActive = pathname === link.route;
            return(
                <li key={link.route} className={`${
              isActive && 'text-purple-500'
            } flex-center p-medium-16 whitespace-nowrap`}
                >
                    <Link href={link.route}>{link.label}</Link>
                </li>
            )
         })}
    </ul>
  )
}

export default NavItems