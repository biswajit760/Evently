'use client'

import { IEvent } from '@/lib/database/models/event.model'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import Checkout from './Checkout'

const CheckoutButton = ({ event, userId }: { event: IEvent, userId: string }) => {
  const hasEventFinished = new Date(event.endDateTime) < new Date();

  // 1. CHECK: Is the current user the organizer?
  // We use optional chaining (?.) to prevent crashes if organizer is missing
  const isEventCreator = userId === event.organizer?._id?.toString();

  // 3. Logic: If the user is the creator, hide everything
  if (isEventCreator) {
    return null; 
  }

  // 2. Logic: If the event is finished, show the closed message
  if (hasEventFinished) {
    return <p className="p-2 text-red-400">Sorry, tickets are no longer available.</p>;
  }

  

  return (
    <div className="flex items-center gap-3">
      {/* If we are here, the user is NOT the creator and the event is NOT finished */}
      
      <SignedOut>
        <Button asChild className="button bg-purple-600 rounded-full" size="lg">
          <Link href="/sign-in">
            Get Tickets
          </Link>
        </Button>
      </SignedOut>

      <SignedIn>
        <Checkout event={event} userId={userId} />
      </SignedIn>
    </div>
  )
}

export default CheckoutButton