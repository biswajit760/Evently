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
import LeafletMapWrapper from '@/components/shared/LeafletMapWrapper';

import {
  MapPin,
  BarChart3,
  Edit,
  Globe,
  CalendarDays,
  ExternalLink,
  ArrowRight,
  User,
} from 'lucide-react';

const EventDetails = async ({ params, searchParams }: SearchParamProps) => {
  const { id } = await params;
  const { page } = await searchParams;

  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;

  const event = await getEventById(id);
  const isOrganizer = userId === event.organizer._id.toString();

  const relatedEvents = await getRelatedEventsByCategory({
    categoryId: event.category._id,
    eventId: event._id,
    page: page as string,
  });
  
  const isOnline = !event.location || event.location.toLowerCase().trim() === 'online';

  // HELPER: Ensure ID is a string for URLs
  const eventId = event._id.toString();

  return (
    <>
      <ViewCounter eventId={eventId} />

      {/* HERO IMAGE SECTION */}
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-4 left-0 w-full px-4 md:px-12 md:bottom-6">
            <span className="inline-flex items-center rounded-full bg-gradient-to-br from-blue-500/60 via-indigo-500/60 to-pink-500/60 text-white px-5 py-2 text-sm font-bold shadow-md backdrop-blur-lg border border-white/30">
              {event.category.name}
            </span>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="bg-gray-50 dark:bg-black min-h-screen">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-10 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 md:gap-12 gap-6">
            
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="md:space-y-4 space-y-2">
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">
                  {event.title}
                </h1>
              </div>

              {/* HIGHLIGHTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 gap-2">
                {/* DATE CARD */}
                <div className="flex items-start gap-4 md:p-4 p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-col gap-1 text-sm md:text-base">
                      <div className="flex flex-wrap gap-1 font-medium text-gray-800 dark:text-gray-200">
                        <span className="w-16 text-gray-500 dark:text-gray-400 font-normal">Start:</span>
                        <span>{formatDateTime(event.startDateTime).dateOnly}</span>
                        <span className="text-gray-400">|</span>
                        <span>{formatDateTime(event.startDateTime).timeOnly}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 font-medium text-gray-800 dark:text-gray-200">
                        <span className="w-16 text-gray-500 dark:text-gray-400 font-normal">End:</span>
                        <span>{formatDateTime(event.endDateTime).dateOnly}</span>
                        <span className="text-gray-400">|</span>
                        <span>{formatDateTime(event.endDateTime).timeOnly}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* LOCATION CARD */}
                <div className="flex items-start gap-4 md:p-4 p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white">Location</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{event.location}</p>
                  </div>
                </div>
              </div>

              <div>
                {!isOnline && (
                    <LeafletMapWrapper locationName={event.location} />
                )}
              </div>

              {/* DESCRIPTION CARD */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-zinc-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-300 md:text-lg text-md md:leading-relaxed leading-normal whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              {/* ORGANIZER CARD */}
              <div className="bg-white dark:bg-zinc-900 rounded-3xl md:p-5 p-3 shadow-sm border border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 text-indigo-600 dark:text-indigo-300 flex items-center justify-center border-4 border-white dark:border-zinc-800 shadow-sm">
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Organized by</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{event.organizer.firstName} {event.organizer.lastName}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= SIDEBAR (Sticky) ================= */}
            <div className="relative lg:col-span-1">
              <div className="flex flex-col gap-6 lg:sticky lg:top-10">
                
                {/* ORGANIZER TOOLS */}
                {isOrganizer && (
                  <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-indigo-100 dark:border-zinc-800 p-6 shadow-sm">
                    <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-widest mb-4">Organizer Tools</h4>
                    <div className="flex flex-col gap-3">
                      
                      {/* FIXED LINKS: Uses eventId variable which is guaranteed to be a string */}
                      <Link href={`/events/${eventId}/analytics`} className="flex items-center gap-3 w-full bg-gray-50 dark:bg-zinc-950 border border-indigo-100 dark:border-zinc-700 hover:border-indigo-300 dark:hover:border-indigo-500 text-gray-700 dark:text-gray-200 px-4 py-3 rounded-xl transition-all shadow-sm group">
                        <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-sm font-semibold">View Analytics</span>
                        <ArrowRight className="w-4 h-4 ml-auto text-gray-300 group-hover:text-indigo-600 transition-colors" />
                      </Link>
                      
                      <Link href={`/events/${eventId}/update`} className="flex items-center gap-3 w-full bg-gray-50 dark:bg-zinc-950 border border-indigo-100 dark:border-zinc-700 hover:border-indigo-300 dark:hover:border-indigo-500 text-gray-700 dark:text-gray-200 px-4 py-3 rounded-xl transition-all shadow-sm group">
                        <Edit className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-sm font-semibold">Edit Event</span>
                        <ArrowRight className="w-4 h-4 ml-auto text-gray-300 group-hover:text-indigo-600 transition-colors" />
                      </Link>
                    </div>
                  </div>
                )}

                {/* REGISTRATION CARD */}
                {!isOrganizer && (
                  <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-xl shadow-gray-200/40 dark:shadow-none overflow-hidden transition-all">
                    <div className="p-8 pb-6 border-b border-gray-50 dark:border-zinc-800 bg-indigo-50/20 dark:bg-indigo-900/10">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Registration</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Secure your spot for this experience.</p>
                    </div>

                    <div className="p-8">
                      <div className="mb-8">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Price per person</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
                            {event.isFree ? 'Free' : `$${event.price}`}
                          </span>
                          {!event.isFree && <span className="text-gray-400 font-bold text-lg">USD</span>}
                        </div>
                      </div>

                      <div className="w-full transform transition-transform active:scale-95">
                        <CheckoutButton event={event} userId={userId} />
                      </div>

                      <div className="mt-8 pt-6 border-t border-dashed border-gray-200 dark:border-zinc-700 space-y-3">
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 font-medium">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          Instant confirmation via email
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 font-medium">
                          <div className="w-2 h-2 rounded-full bg-indigo-500" />
                          Official {event.category.name} event
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* QUICK LINKS */}
                <div className="flex flex-col gap-3">
                  {event.url && (
                    <Link href={event.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/50 transition-colors">
                          <Globe className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                        </div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">Official Website</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                    </Link>
                  )}
                  <ShareEventButton eventId={eventId} title={event.title} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* RELATED EVENTS */}
      <section className="bg-white dark:bg-black border-t border-gray-100 dark:border-zinc-900 py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">More events in {event.category.name}</h2>
          <Collection
            data={relatedEvents?.data || []}
            emptyTitle="No Related Events Found"
            emptyStateSubtext="Check back later"
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