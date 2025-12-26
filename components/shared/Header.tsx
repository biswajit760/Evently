import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { Button } from "../ui/button"
import NavItems from "./NavItems"
import MobileNav from "./MobileNav"

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex items-center justify-between">
        <Link href="/" className="w-36">
          <Image 
            src="/assets/images/logo.svg" width={128} height={38}
            alt="Evently logo" 
            className="dark:invert" 
          />
        </Link>

        <SignedIn>
          {/* APPLY CUSTOM CSS HERE: 
             This nav is hidden by default, becomes flex at 768px+ 
          */}
          <nav className="nav-desktop-wrapper">
            <NavItems />
          </nav>
        </SignedIn>

        <div className="flex w-32 justify-end gap-3">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
            
            {/* APPLY CUSTOM CSS HERE:
               This component is visible by default, becomes none at 768px+ 
            */}
            <div className="nav-mobile-trigger">
               <MobileNav />
            </div>
          </SignedIn>
          
          <SignedOut>
            <Button asChild className="rounded-full bg-purple-600 w-24 text-white" size="lg">
              <Link href="/sign-in">
                Login
              </Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}

export default Header