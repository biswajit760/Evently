import CheckoutButton from '@/components/shared/CheckoutButton';
import Collection from '@/components/shared/Collection';
import { getEventById, getRelatedEventsByCategory } from '@/lib/actions/event.actions';
import { formatDateTime } from '@/lib/utils';
import { SearchParamProps } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server'; // Import Clerk Server Auth
import ShareEventButton from '@/components/shared/ShareEventButton';

const EventDetails = async ({ params, searchParams }: SearchParamProps) => {
  // Await params for Next.js 15+ compatibility
  const { id } = await params;
  const { page } = await searchParams;

  const event = await getEventById(id);

  const relatedEvents = await getRelatedEventsByCategory({
    categoryId: event.category._id,
    eventId: event._id,
    page: page as string,
  });

  // CRITICAL FIX: Get User ID from Server Session
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;


  return (
    <>
      <section className="flex justify-center bg-gray-50 py-5 md:py-6 min-h-[70vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl bg-white shadow-xl rounded-3xl overflow-hidden mx-4 md:mx-auto border border-gray-100">
          
          {/* LEFT COLUMN: HERO IMAGE */}
          <div className="relative h-[300px] md:h-full min-h-[400px] w-full bg-gray-100">
            <Image 
              src={event.imageUrl}
              alt="hero image"
              fill
              className="object-cover object-center transition-transform hover:scale-105 duration-700"
              priority
            />
          </div>

          {/* RIGHT COLUMN: DETAILS */}
          <div className="flex w-full flex-col gap-6 p-6 md:p-8 lg:p-10">
            
            {/* HEADER SECTION */}
            <div className="flex flex-col gap-4">
              <h2 className='text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight'>
                {event.title}
              </h2>

              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-green-100 px-4 py-1.5 text-sm font-bold text-green-700 ring-1 ring-inset ring-green-600/20">
                  {event.isFree ? 'FREE' : `$${event.price}`}
                </span>
                <span className="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                  {event.category.name}
                </span>
                <p className="ml-2 text-sm text-gray-500">
                  by <span className="text-primary-500 font-semibold hover:underline cursor-pointer">{event.organizer.firstName} {event.organizer.lastName}</span>
                </p>
              </div>
            </div>

            {/* CHECKOUT BUTTON: Pass userId prop here */}
            <CheckoutButton event={event} userId={userId} />

            {/* LOGISTICS CARD */}
            <div className="grid grid-cols-1 gap-5 rounded-2xl bg-gray-50 p-5 border border-gray-100">
              
              {/* Date Row */}
              <div className='flex items-start gap-4'>
                <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                  <Image src="/assets/icons/calendar.svg" alt="calendar" width={24} height={24} className="opacity-75" />
                </div>
                <div className="flex flex-col gap-1 text-sm md:text-base">
                  <div className="flex flex-wrap gap-1 font-medium text-gray-800">
                    <span className="w-16 text-gray-500 font-normal">Start:</span>
                    <span>{formatDateTime(event.startDateTime).dateOnly}</span>
                    <span className="text-gray-400">|</span>
                    <span>{formatDateTime(event.startDateTime).timeOnly}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 font-medium text-gray-800">
                    <span className="w-16 text-gray-500 font-normal">End:</span>
                    <span>{formatDateTime(event.endDateTime).dateOnly}</span>
                    <span className="text-gray-400">|</span>
                    <span>{formatDateTime(event.endDateTime).timeOnly}</span>
                  </div>
                </div>
              </div>

              {/* Location Row */}
              <div className="flex items-start gap-4">
                 <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                   <Image src="/assets/icons/location.svg" alt="location" width={24} height={24} className="opacity-75" />
                 </div>
                 <div className="flex flex-col">
                    <p className="text-gray-500 text-sm">Location</p>
                    <p className="font-medium text-gray-800 text-base leading-relaxed">{event.location}</p>
                 </div>
              </div>
            </div>

            {/* DESCRIPTION SECTION */}
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">About this event</h3>
              <p className="text-base leading-7 text-gray-600">
                {event.description}
              </p>
              {event.url && (
                 <Link href={event.url} target="_blank" className="mt-2 flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium transition-colors">
                   <span>Visit Website</span>
                   <Image src="/assets/icons/arrow.svg" alt="link" width={10} height={10} className="-rotate-45" />
                 </Link>
              )}
            </div>
              <ShareEventButton eventId={event._id} title={event.title} />
          </div>
        </div>
      </section>

      {/* RELATED EVENTS SECTION */}
      <section className='wrapper my-8 flex flex-col gap-8 md:gap-12' >
        <h1 className='h2-bold' >Related events</h1>
          <Collection 
            data={relatedEvents?.data || []}
            emptyTitle="No Events Found"
            emptyStateSubtext="Come back later"
            collectionType="All_Events"
            limit={6}
            page={page as string | number}
            totalPages={relatedEvents?.totalPages}
          />
      </section>
    </>
  );
};

export default EventDetails;