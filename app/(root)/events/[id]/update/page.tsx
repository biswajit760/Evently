import EventForm from '@/components/shared/EventForm'
import { getEventById } from '@/lib/actions/event.actions'
import { auth } from '@clerk/nextjs/server'
import React from 'react'

console.log('Update Page');

const UpdateEvent = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { sessionClaims } = await auth();
  const { id } = await params;
  
  const event = await getEventById(id);
  const userId = sessionClaims?.userId as string;

  return (
    <>
      <section className="bg-purple-50 dark:bg-zinc-900 py-5 md:py-10 text-center border-b border-purple-100 dark:border-zinc-800">
        <h3 className="wrapper h3-bold text-center text-slate-900 dark:text-white">
          Update Event
        </h3>
      </section>

      <div className="wrapper my-8">
        <EventForm 
          userId={userId} 
          type="Update" 
          event={event} 
          eventId={event._id} 
        />
      </div>
    </>
  )
}

export default UpdateEvent