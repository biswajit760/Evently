'use client'

import { IEvent } from '@/lib/database/models/event.model'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import Checkout from './Checkout'
import { Ticket } from 'lucide-react';

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
    <div className="flex items-center gap-3 mt-8">
      {/* If we are here, the user is NOT the creator and the event is NOT finished */}
      
      <SignedOut>
        
        <button className=" mt-5 flex items-center justify-center gap-2 w-full py-3 px-6 text-white font-semibold rounded-md bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all">
  <Ticket className="w-5 h-5" />
  <span>Buy Ticket</span>
</button>
      </SignedOut>

      <SignedIn>
        <Checkout event={event} userId={userId} />
      </SignedIn>
    </div>
  )
}

export default CheckoutButton