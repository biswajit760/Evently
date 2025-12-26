import CategoryFilter from "@/components/shared/CategoryFilter";
import Collection from "@/components/shared/Collection";
import Search from "@/components/shared/Search";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/lib/actions/event.actions";
import { SearchParamProps } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = async ({ searchParams }: SearchParamProps) => {
  const resolvedSearchParams = await searchParams;

  const page = Number(resolvedSearchParams?.page) || 1;
  const searchText = (resolvedSearchParams?.query as string) || "";
  const category = (resolvedSearchParams?.category as string) || "";

  const events = await getAllEvents({
    query: searchText,
    category,
    page,
    limit: 6,
  });

  return (
    <>
      <section className="bg-contain py-8 md:py-10">
        <div className="wrapper grid grid-cols-1 md:grid-cols-2 gap-8 2xl:gap-0">
          {/* LEFT — TEXT */}
          <div className="flex flex-col justify-center gap-8">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white">
              Host, Connect, Celebrate:
              <br />
              <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-600 via-purple-500 to-pink-500">
                Your Events, Our Platform!
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-xl ">
              Book sessions and learn valuable skills from
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {" "}
                3,168+ expert mentors
              </span>{" "}
              working at world-class companies. Join our global learning
              community for industry insights and proven tips to help you grow
              faster in your professional journey.
            </p>

            <Button
              size="lg"
              asChild
              className="w-full sm:w-fit rounded-full bg-linear-to-r from-purple-600 to-pink-500 hover:brightness-110 text-white font-semibold transition-all px-8 h-12"
            >
              <Link href="#events">Explore Now</Link>
            </Button>
          </div>

          {/* RIGHT — IMAGE */}
          <Image
            src="/assets/images/hero.png"
            alt="hero"
            width={1000}
            height={1000}
            className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"
          />
        </div>
      </section>

      <section
        id="events"
        className="wrapper my-8 flex flex-col gap-8 md:gap-12"
      >
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Trusted by <br />
          <span className="bg-linear-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
            Thousands of Events
          </span>
        </h2>

        {/* SEARCH & FILTER ROW - Updated Layout */}
        <div className="flex w-full flex-col gap-5 md:flex-row">
           <div className="w-full md:w-1/2 ">
             <Search />
           </div>
           <div className="w-full md:w-1/2 ">
            <CategoryFilter />
           </div>
        </div>

        <Collection
          data={events?.data || []}
          emptyTitle="No Events Found"
          emptyStateSubtext="Come back later"
          collectionType="All_Events"
          limit={6}
          page={page}
          totalPages={events?.totalPages}
        />
      </section>
    </>
  );
};

export default page;