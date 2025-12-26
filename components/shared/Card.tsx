import { IEvent } from '@/lib/database/models/event.model'
import { formatDateTime } from '@/lib/utils'
import { auth } from '@clerk/nextjs/server'
import Image from 'next/image'
import Link from 'next/link'
import { DeleteConfirmation } from './DeleteConfirmation'
import { ArrowRight, CalendarDays } from "lucide-react";
import { getUserById } from '@/lib/actions/user.actions'



type CardProps = {
  event: IEvent,
  hasOrderLink?: boolean,
  hidePrice?: boolean
}

const Card = async ({ event, hasOrderLink, hidePrice }: CardProps) => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;
  const isEventCreator = userId ? userId === event.organizer._id.toString() : false;

  const organizer = event.organizer._id.toString()
  const user = await getUserById(organizer);
  console.log(user.photo)
  

  return (
    <div
      className="group relative flex w-full max-w-[400px] flex-col overflow-hidden rounded-2xl
      bg-white dark:bg-zinc-900 
      border border-gray-200 dark:border-zinc-800
      shadow-[0_6px_20px_rgba(0,0,0,0.08)] 
      transition-all duration-300
      hover:shadow-[0_12px_30px_rgba(0,0,0,0.15)] 
      dark:hover:shadow-[0_10px_30px_rgba(255,255,255,0.05)]
      hover:-translate-y-2 
      hover:border-gray-300 dark:hover:border-zinc-700"
    >
      {/* IMAGE */}
      <Link 
        href={`/events/${event._id}`}
        className="relative flex-center h-48 w-full overflow-hidden bg-gray-100 dark:bg-zinc-800"
      >
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          className="object-cover object-center transition duration-500 group-hover:scale-105"
        />
      </Link>

      {/* EDIT BTN */}
      {isEventCreator && !hidePrice && (
        <div className="absolute right-2 top-2 z-10 flex flex-col gap-4 rounded-full bg-white/90 dark:bg-zinc-900/90 p-2 shadow-md backdrop-blur-sm transition-all hover:scale-105 border border-transparent dark:border-zinc-700">
          <Link href={`/events/${event._id}/update`}>
            {/* Using a filter class to handle the dark mode icon color if needed, 
                or relying on the background contrast */}
            <Image 
                src="/assets/icons/edit.svg" 
                alt="edit" 
                width={20} 
                height={20}
                className="dark:invert" 
            />
          </Link>
          <DeleteConfirmation eventId={event._id.toString()} />
        </div>
      )}

      {/* CONTENT */}
      <div className="flex flex-col  gap-3 p-5 md:gap-4 ">

        {/* BADGES */}
        {!hidePrice && (
          <div className="flex gap-2">
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700 ring-1 ring-green-500/30 
                             dark:bg-green-900/20 dark:text-green-400 dark:ring-green-500/50">
              {event.isFree ? 'FREE' : `$${event.price}`}
            </span>
            <p className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 line-clamp-1
                          dark:bg-zinc-800 dark:text-zinc-300">
              {(event.category as any)?.name ?? String(event.category)}
            </p>
          </div>
        )}

        {/* DATE + TITLE */}
        <div className="flex flex-col gap-1">
          <div className="flex   items-center gap-2" >
            <CalendarDays className="h-4 w-4 text-gray-500" />

            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {formatDateTime(event.startDateTime).dateTime}
          </p>
          </div>

          <Link href={`/events/${event._id}`}>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              {event.title}
            </h3>
          </Link>
        </div>

        {/* 4. FOOTER */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-zinc-800">
          {/* Organizer */}
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-purple-100 dark:ring-zinc-800">
              <Image
                src={user.photo}
                alt="organizer"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                Organizer
              </p>
              <p className="text-xs font-semibold text-gray-700 dark:text-zinc-300">
                {(event.organizer as any).firstName}{" "}
                {(event.organizer as any).lastName}
              </p>
            </div>
          </div>

          {/* Details / Order Link */}
          {hasOrderLink && (
            <Link
              href={`/orders?eventId=${event._id}`}
              className="flex items-center gap-1 group/btn"
            >
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                Details
              </span>
              <ArrowRight className="h-4 w-4 text-purple-600 transition-transform group-hover/btn:translate-x-1 dark:text-purple-400" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Card