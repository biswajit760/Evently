import EventForm from '@/components/shared/EventForm'
import { auth } from '@clerk/nextjs/server'


const CreateEvent = async () => {
    const { sessionClaims } = await auth();
    const userId = sessionClaims?.userId as string;

  return (
    <>
    <section className='bg-purple-50 py-5 md:py-2 text-center dark:bg-zinc-900' >
        <h3 className='wrapper h3-bold text-center ' >Create Event</h3>
    </section>
    <div className="wrapper my-8">
        <EventForm userId={userId} type='Create' />
    </div>

    </>
  )
}

export default CreateEvent