'use client' // Essential for React hooks if you add them later, but works with form actions

import React, { useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'

import { IEvent } from '@/lib/database/models/event.model'
import { Button } from '../ui/button'
import { checkoutOrder } from '@/lib/actions/order.actions' // Import your server action

// Initialize client-side Stripe (safe to expose)
loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const Checkout = ({ event, userId }: { event: IEvent, userId: string }) => {
  
  // This function triggers the Server Action
  const onCheckout = async () => {
    const order = {
      eventTitle: event.title,
      eventId: event._id.toString(),
      price: event.price,
      isFree: event.isFree,
      buyerId: userId
    }

    await checkoutOrder(order);
  }

  return (
    <form action={onCheckout}>
      <Button type="submit" role="link" size="lg" className="button sm:w-fit">
        {event.isFree ? 'Get Ticket' : 'Buy Ticket'}
      </Button>
    </form>
  )
}

export default Checkout