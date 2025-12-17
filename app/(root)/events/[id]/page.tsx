import CheckoutButton from '@/components/shared/CheckoutButton';
import Collection from '@/components/shared/Collection';
import { getEventById, getRelatedEventsByCategory } from '@/lib/actions/event.actions';
import { formatDateTime } from '@/lib/utils';
import { SearchParamProps } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import ShareEventButton from '@/components/shared/ShareEventButton';
import ViewCounter from '@/components/shared/ViewCounter';

import {
  Calendar,
  MapPin,
  BarChart3,
  Edit,
  Globe,
  CalendarDays,
  ExternalLink,
  ArrowRight,
  User,
} from 'lucide-react';
// import {
//   CalendarDays,
//   MapPin,
//   BarChart3,
//   Edit,
//   ExternalLink,
//   Clock,
//   Ticket,
//   User,
// } from 'lucide-react';
// Helper for Date/Time parsing
  

const EventDetails = async ({ params, searchParams }: SearchParamProps) => {
  const { id } = await params;
  const { page } = await searchParams;

  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;

  const event = await getEventById(id);
  const isOrganizer = userId === event.organizer._id.toString();

  const { dateOnly, timeOnly } = formatDateTime(event.startDateTime);
  const { dateOnly: endDate, timeOnly: endTime } = formatDateTime(event.endDateTime);

  const relatedEvents = await getRelatedEventsByCategory({
    categoryId: event.category._id,
    eventId: event._id,
    page: page as string,
  });

  return (
    <>
      <ViewCounter eventId={id} />

      {/* ================= HERO IMAGE SECTION ================= */}
      <section className="relative w-full bg-gray-900">
        <div className="relative h-[300px] md:h-[500px] w-full overflow-hidden">
          <Image
            src={event.imageUrl}
            alt="Event image"
            fill
            priority
            sizes="100vw"
            quality={95}
            className="object-cover object-center"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Floating Category Badge */}
          <div className="absolute bottom-4 left-0 w-full px-4 md:px-12 md:bottom-6">
            <span className="inline-flex items-center rounded-full bg-gradient-to-br from-blue-500/60 via-indigo-500/60 to-pink-500/60 text-white px-5 py-2 text-sm font-bold shadow-md backdrop-blur-lg border border-white/30">
              {event.category.name}
            </span>
          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <section className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-10 md:py-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 md:gap-12 gap-6">
            
            {/* ================= LEFT COLUMN (Story & Info) ================= */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              
              {/* Header Group */}
              <div className="md:space-y-4 space-y-2">
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight">
                  {event.title}
                </h1>
                
                {/* <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center rounded-full px-4 py-1.5 text-base font-bold shadow-sm ring-1 ring-inset ${
                        event.isFree 
                        ? 'bg-green-50 text-green-700 ring-green-600/20' 
                        : 'bg-indigo-50 text-indigo-700 ring-indigo-600/20'
                    }`}>
                        {event.isFree ? 'FREE ENTRY' : `$${event.price} USD`}
                    </span>
                </div> */}
              </div>

              {/* HIGHLIGHTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 gap-2">
                <div className="flex items-start gap-4 md:p-4 p-2 rounded-xl bg-white border border-slate-100 shadow-sm">
                   <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                      <CalendarDays className="w-5 h-5" />
                   </div>
                   <div>
                      
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
                </div>

                <div className="flex items-start gap-4 md:p-4 p-2 rounded-xl bg-white border border-slate-100 shadow-sm">
                   <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                      <MapPin className="w-5 h-5" />
                   </div>
                   <div>
                      <p className="font-semibold text-slate-900">Location</p>
                      <p className="text-sm text-slate-600 mt-1">{event.location}</p>
                   </div>
                </div>
              </div>

              {/* Description Card */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    Description
                </h3>
                <p className="text-gray-600 md:text-lg text-md md:leading-relaxed leading-normal whitespace-pre-line">
                  {event.description}
                </p>
              </div>

               {/* Organizer Card */}
               <div className="bg-white rounded-3xl md:p-5 p-3 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 flex items-center justify-center border-4 border-white shadow-sm">
                        <User className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                            Organized by
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                            {event.organizer.firstName} {event.organizer.lastName}
                        </p>
                      </div>
                  </div>
               </div>
            </div>

           {/* ================= RIGHT COLUMN (Sticky Sidebar) ================= */}
            <div className="relative lg:col-span-1">
              <div className="flex flex-col gap-6 lg:sticky lg:top-10">

                {/* ================= ORGANIZER TOOLS (Only for Owner) ================= */}
                {isOrganizer && (
                  <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-wider">
                        Organizer Tools
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700">
                        ADMIN
                      </span>
                    </div>

                    <div className="flex flex-col gap-3">
                      <Link
                        href={`/events/${event._id}/analytics`}
                        className="flex items-center gap-3 w-full bg-white border border-indigo-100 hover:border-indigo-300 text-gray-700 px-4 py-2.5 rounded-lg transition-all shadow-sm group"
                      >
                        <BarChart3 className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-medium">View Analytics</span>
                        <ArrowRight className="w-4 h-4 ml-auto text-gray-300 group-hover:text-indigo-600 transition-colors" />
                      </Link>

                      <Link
                        href={`/events/${event._id}/update`}
                        className="flex items-center gap-3 w-full bg-white border border-indigo-100 hover:border-indigo-300 text-gray-700 px-4 py-2.5 rounded-lg transition-all shadow-sm group"
                      >
                        <Edit className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-medium">Edit Event</span>
                        <ArrowRight className="w-4 h-4 ml-auto text-gray-300 group-hover:text-indigo-600 transition-colors" />
                      </Link>
                    </div>
                  </div>
                )}

                {/* ================= TICKET / CHECKOUT CARD ================= */}
                {!isOrganizer && (
                  <div className="rounded-2xl bg-white border border-gray-200 shadow-xl shadow-gray-200/50 overflow-hidden">
                    
                    {/* Card Header */}
                    <div className="p-6 pb-4 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900">Registration</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Secure your spot for this event.
                      </p>
                    </div>

                    {/* Price & Action */}
                    <div className="p-6 pt-5 flex flex-col gap-5 ">
                      <div className="flex items-end gap-2 mb-12 ">
                         <span className="text-4xl font-black text-gray-900 tracking-tight">
                            {event.isFree ? 'Free' : `$${event.price}`}
                         </span>
                         {!event.isFree && (
                            <span className="text-gray-500 font-medium mb-1.5">/ person</span>
                         )}
                      </div>

                      {/* Checkout Button Wrapper */}
                      <div className="w-full mt-8">
                         <CheckoutButton event={event} userId={userId} />
                      </div>

                      {/* Micro-copy Trust Signals */}
                      <div className=" flex flex-col gap-2">
                        <div className="flex items-center justify-left gap-2 text-xs text-gray-500">
                           <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                           </svg>
                           <span>Instant confirmation</span>
                        </div>
                        <div className="flex items-center justify-left gap-2 text-xs text-gray-500">
                           <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                           </svg>
                           <span>Secure checkout powered by Stripe</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer: Date Countdown or Status */}
                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between">
                       <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Sales End
                       </span>
                       <span className="text-sm font-medium text-gray-900">
                          {formatDateTime(event.endDateTime).dateOnly}
                       </span>
                    </div>
                  </div>
                )}

                {/* ================= LINKS & SHARE ================= */}
                <div className="flex flex-col gap-3">
                  {event.url && (
                    <Link
                      href={event.url}
                      target="_blank"
                      className="flex items-center justify-between w-full p-4 rounded-xl bg-white border border-gray-200 hover:border-indigo-200 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                            <Globe className="w-5 h-5 text-gray-500 group-hover:text-indigo-600" />
                         </div>
                         <div>
                            <p className="text-sm font-semibold text-gray-900">Official Website</p>
                            <p className="text-xs text-gray-500 truncate max-w-[150px]">{event.url}</p>
                         </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </Link>
                  )}

                  <div className="w-full">
                     <ShareEventButton eventId={event._id} title={event.title} />
                  </div>
                </div>

              </div>
            </div>



          </div>
        </div>
      </section>

      {/* ================= RELATED EVENTS ================= */}
      <section className="bg-white border-t border-gray-100 py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
            More events in {event.category.name}
            </h2>

            <Collection
            data={relatedEvents?.data || []}
            emptyTitle="No Related Events Found"
            emptyStateSubtext="Check back later for more updates"
            collectionType="All_Events"
            limit={3}
            page={page as string | number}
            totalPages={relatedEvents?.totalPages}
            />
        </div>
      </section>
    </>
  );
};

export default EventDetails;