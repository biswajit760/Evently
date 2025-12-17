'use client'

import React, { useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Ticket } from 'lucide-react' // <--- 1. Import the icon

import { IEvent } from '@/lib/database/models/event.model'
import { Button } from '../ui/button'
import { checkoutOrder } from '@/lib/actions/order.actions'

// Make sure this ENV variable is set in .env.local
loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const Checkout = ({ event, userId }: { event: IEvent, userId: string }) => {
  // Hook to check if payment was successful (Optional UI enhancement)
  useEffect(() => {
    // You can check URL query params here for ?success=true if you want to show a toast
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.');
    }
  }, []);

  const onCheckout = async () => {
    // SECURITY CHECK: If no user ID, don't proceed (prevents broken orders)
    if (!userId) {
      console.error("Error: User ID is missing. Cannot proceed to checkout.");
      return; 
    }

    const order = {
      eventTitle: event.title,
      eventId: event._id.toString(), // Fix: Ensure this is a string
      price: event.price,
      isFree: event.isFree,
      buyerId: userId
    }

    await checkoutOrder(order);
  }

  return (
    <form action={onCheckout}>
      <Button 
        type="submit" 
        role="link" 
        size="lg" 
        className="flex items-center justify-center gap-2 w-full py-6 text-white font-semibold rounded-lg bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all"
      >
        <Ticket className="w-5 h-5" />
        <span className="text-lg">
          {event.isFree ? 'Get Ticket' : 'Buy Ticket'}
        </span>
      </Button>
    </form>
  )
}

export default Checkout