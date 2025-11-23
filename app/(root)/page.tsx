import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <>
      <section className='bg-purple-50 bg-contain py-5 md:py-10' >
        <div className='wrapper grid grid-cols-1 flex-col-reverse gap-5 md:grid-cols-2 2xl:gap-0'  >
          <div className="flex flex-col justify-center gap-8">
            <h1 className="text-6xl font-bold">Host, Connect, Celebrate: Your Events, Our Platform!</h1>
            <p className=" px-5 text-xl">Book and learn helpful tips from 3,168+ mentors in world-class companies with our global community.</p>
            <Button size="lg" asChild className="button w-full sm:w-fit bg-purple-700 hover:bg-purple-800 text-white">
              <Link href="#events">
                Explore Now
              </Link>
            </Button>
          </div>
          <Image 
            src="/assets/images/hero.png"
            alt="hero"
            width={1100}
            height={1100}
            className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"
          />
        </div>
      </section>
    </>
  )
}

export default page