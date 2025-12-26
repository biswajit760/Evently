"use client"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import NavItems from "./NavItems"
import { Separator } from "../ui/separator"
import Image from "next/image"

const MobileNav = () => {
  return (
    // Removed 'md:hidden' because the parent div in Header handles visibility now
    <nav> 
      <Sheet>
        <SheetTrigger className="align-middle">
          <Image 
            src="/assets/icons/menu.svg"
            alt="menu"
            width={26}
            height={26}
            className="cursor-pointer dark:invert" 
          />
        </SheetTrigger>

        <SheetContent className="flex flex-col gap-6 bg-white md:hidden pl-2">
          <SheetHeader>
            <VisuallyHidden>
              <SheetTitle>Mobile Navigation</SheetTitle>
            </VisuallyHidden>
          </SheetHeader>

          <Image 
            src="/assets/images/logo.svg"
            alt="logo"
            width={128}
            height={38}
            className="dark:invert"
          />
          <Separator className="border border-gray-200 " />
          <NavItems />
        </SheetContent>
      </Sheet>
    </nav>
  )
}

export default MobileNav