import { IEvent } from '@/lib/database/models/event.model'
import { formatDateTime } from '@/lib/utils'
import { auth } from '@clerk/nextjs/server'
import Image from 'next/image'
import Link from 'next/link'
import { DeleteConfirmation } from './DeleteConfirmation'

type CardProps = {
  event: IEvent,
  hasOrderLink?: boolean,
  hidePrice?: boolean
}

const Card = async ({ event, hasOrderLink, hidePrice }: CardProps) => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId; 
  const isEventCreator = userId ? userId === event.organizer._id.toString() : false;

  return (
    <div
      className="group relative flex w-full max-w-[400px] flex-col overflow-hidden rounded-2xl
      bg-linear-to-b from-white to-gray-100
      shadow-[0_6px_20px_rgba(0,0,0,0.08)]
      border border-gray-200 transition-all duration-300
      hover:shadow-[0_12px_30px_rgba(0,0,0,0.15)] hover:-translate-y-2 hover:border-gray-300"
    >
      {/* IMAGE */}
      <Link 
        href={`/events/${event._id}`}
        className="relative flex-center h-48 w-full overflow-hidden bg-gray-100"
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
        <div className="absolute right-2 top-2 z-10 flex flex-col gap-4 rounded-full bg-white/90 p-2 shadow-md backdrop-blur-sm transition-all hover:scale-105">
          <Link href={`/events/${event._id}/update`}>
            <Image src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
          </Link>
          <DeleteConfirmation eventId={event._id.toString()} />
        </div>
      )}

      {/* CONTENT */}
      <div className="flex flex-col gap-3 p-5 md:gap-4">

        {/* BADGES */}
        {!hidePrice && (
          <div className="flex gap-2">
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700 ring-1 ring-green-500/30">
              {event.isFree ? 'FREE' : `$${event.price}`}
            </span>
            <p className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 line-clamp-1">
              {(event.category as any)?.name ?? String(event.category)}
            </p>
          </div>
        )}

        {/* DATE + TITLE */}
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {formatDateTime(event.startDateTime).dateTime}
          </p>

          <Link href={`/events/${event._id}`}>
            <h3 className="font-bold text-lg text-gray-900 line-clamp-2 hover:text-purple-600 transition-colors">
              {event.title}
            </h3>
          </Link>
        </div>

        {/* FOOTER */}
        <div className="flex-between w-full pt-3 mt-auto border-t border-gray-200">
          <p className="text-sm text-gray-600 flex items-center gap-1">
            By <span className="font-semibold text-gray-800">{(event.organizer as any).firstName} {(event.organizer as any).lastName}</span>
          </p>

          {hasOrderLink && (
            <Link href={`/orders?eventId=${event._id}`} className="flex gap-1 items-center group/link pl-2">
              <p className="text-purple-600 text-sm font-bold group-hover/link:underline">Details</p>
              <Image
                src="/assets/icons/arrow.svg"
                alt="arrow"
                width={10}
                height={10}
                className="transition-transform group-hover/link:translate-x-1"
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Card
