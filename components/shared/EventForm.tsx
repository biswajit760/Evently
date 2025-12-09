"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { eventFormSchema } from "@/lib/validator";
import { eventDefaultValues } from "@/constants";
import Dropdown from "./Dropdown";
import { Textarea } from "../ui/textarea";
import { FileUploader } from "./FileUpload";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Checkbox } from "../ui/checkbox";
import { useRouter } from "next/navigation";
import { createEvent, updateEvent } from "@/lib/actions/event.actions";
import { useUploadThing } from "@/lib/uploadthing";
import { IEvent } from "@/lib/database/models/event.model";
import { toast } from "sonner";

import {
  CalendarIcon,
  MapPin,
  DollarSign,
  Link as LinkIcon,
  Type,
  Layers,
  FileText,
} from "lucide-react";

type EventFormProps = {
  userId: string;
  type: "Create" | "Update";
  event?: IEvent;
  eventId?: string;
};

const EventForm = ({ userId, type, event, eventId }: EventFormProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();

  const { startUpload } = useUploadThing("imageUploader");

  const initialValues =
    event && type === "Update"
      ? {
          ...event,
          price: event.price?.toString(),
          startDateTime: new Date(event.startDateTime),
          endDateTime: new Date(event.endDateTime),
        }
      : eventDefaultValues;

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values: z.infer<typeof eventFormSchema>) {
    let uploadedImageUrl = values.imageUrl;

    if (files.length > 0) {
      const uploaded = await startUpload(files);
      if (!uploaded) {
        toast.error("Failed to upload image. Please try again.");
        return;
      }
      uploadedImageUrl = uploaded[0].url;
    }
    if (type === "Create") {
      try {
        const newEvent = await createEvent({
          event: { ...values, imageUrl: uploadedImageUrl, price: Number(values.price) },
          userId,
          path: "/profile",
        });

        if (newEvent) {
          toast.success("Event created successfully 🎉");
          form.reset();
          setTimeout(() => router.push(`/events/${newEvent._id}`), 300);
        }
      } catch (error: any) {
        toast.error(error?.message || "Failed to create event");
        form.setError("root", { message: error?.message });
      }
    }

    if (type === "Update") {
      try {
        const updatedEvent = await updateEvent({
          userId,
          event: {
            ...values,
            imageUrl: uploadedImageUrl,
            _id: eventId!,
            price: Number(values.price),
          },
          path: `/events/${eventId}`,
        });

        if (updatedEvent) {
          toast.success("Event updated successfully ✨");
          form.reset();
          setTimeout(() => router.push(`/events/${updatedEvent._id}`), 300);
        }
      } catch (error: any) {
        toast.error(error?.message || "Failed to update event");
        form.setError("root", { message: error?.message });
      }
    }
  }

  // FIX 1: Added 'relative' here. 
  // This ensures the absolute icon is positioned relative to THIS box, not the page.
  const inputStyles = "h-12 bg-slate-50 border border-slate-200 rounded-md focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all duration-200 flex items-center relative";
  
  const iconStyles = "absolute left-4 top-3.5 h-5 w-5 text-gray-600 z-10";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 space-y-12 animate-fade-in pb-10">
        
        {/* SECTION: GENERAL INFO */}
        <div className="flex flex-col gap-8 bg-white border border-slate-500 rounded-xl p-8 md:p-10 shadow-xl shadow-slate-100/50">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Event Details</h2>
            <p className="text-slate-500 text-sm mt-1">The core information about your event.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel className="text-slate-700 font-semibold">Event Title</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Type className={iconStyles} />
                      <Input 
                        {...field} 
                        placeholder="e.g. Next.js World Conference" 
                        className="pl-12 h-12 bg-slate-50 border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 font-medium placeholder:text-slate-400" 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel className="text-slate-700 font-semibold">Category</FormLabel>
                  <FormControl>
                    <div className="relative">
                       <Layers className={iconStyles} />
                       <div className="pl-12 h-12 flex items-center bg-slate-50 border border-slate-200 rounded-md focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                          <Dropdown value={field.value} onChangeHandler={field.onChange} />
                       </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="text-slate-700 font-semibold">Description</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute top-0 left-0 right-0 h-10 bg-slate-50 border-b border-slate-200 rounded-t-md flex items-center gap-2 px-4 space-x-2 z-10">
                         <FileText className="w-4 h-4 text-gray-500" />
                         <span className=" text-xs text-slate-400 font-medium">Write something amazing...</span>
                      </div>
                      <Textarea
                        {...field}
                        placeholder="Describe event agenda, speakers, goals, etc."
                        className="min-h-40 pt-12 resize-none bg-white border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 rounded-b-md"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="text-slate-700 font-semibold">Event Banner</FormLabel>
                  <FormControl>
                    <div className="group border-2 border-dashed border-slate-200 hover:border-indigo-500/50 hover:bg-slate-50/50 rounded-xl p-6 transition-all duration-200 text-center">
                      <FileUploader
                        onFieldChange={field.onChange}
                        imageUrl={field.value}
                        setFiles={setFiles}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* SECTION: LOGISTICS */}
        <div className="flex flex-col gap-8 bg-white border border-slate-500 rounded-xl p-8 md:p-10 shadow-xl shadow-slate-100/50">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Time & Place</h2>
            <p className="text-slate-500 text-sm mt-1">Help attendees find their way.</p>
          </div>

          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel className="text-slate-700 font-semibold">Location</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className={iconStyles} />
                        <Input
                          {...field}
                          placeholder="City, venue, or online link..."
                          className="pl-12 h-12 bg-slate-50 border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 font-medium"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* URL */}
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel className="text-slate-700 font-semibold">
                      Important Link <span className="text-slate-400 font-normal text-xs">(Optional)</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <LinkIcon className={iconStyles} />
                        <Input
                          {...field}
                          placeholder="https://..."
                          className="pl-12 h-12 bg-slate-50 border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 font-medium"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* DATE PICKERS - Fixed for Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Start Date */}
              <FormField
                control={form.control}
                name="startDateTime"
                render={({ field }) => (
                  <FormItem className="w-full relative z-20"> 
                    <FormLabel className="text-slate-700 font-semibold">Start</FormLabel>
                    <FormControl>
                      <div className={inputStyles}>
                        <CalendarIcon className="absolute left-4 top-3.5 h-5 w-5 text-indigo-500 z-10" />
                        {/* Added flex-1 and w-full to ensure it fills the parent container */}
                        <div className="flex-1 w-full"> 
                          <DatePicker
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            showTimeSelect
                            dateFormat="MMMM d, yyyy - h:mm aa"
                            wrapperClassName="w-full datePickerWrapper" // Helper class
                            className="w-full pl-12 bg-transparent outline-none text-slate-700 placeholder:text-slate-400 font-medium cursor-pointer h-12 py-3"
                          />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* End Date */}
              <FormField
                control={form.control}
                name="endDateTime"
                render={({ field }) => (
                  <FormItem className="w-full relative z-10">
                    <FormLabel className="text-slate-700 font-semibold">End</FormLabel>
                    <FormControl>
                      <div className={inputStyles}>
                        <CalendarIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-600 z-10" />
                         {/* Added flex-1 and w-full here as well */}
                        <div className="flex-1 w-full">
                          <DatePicker
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            showTimeSelect
                            dateFormat="MMMM d, yyyy - h:mm aa"
                            wrapperClassName="w-full datePickerWrapper" 
                            className="w-full pl-12 bg-transparent outline-none text-slate-700 placeholder:text-slate-400 font-medium cursor-pointer h-12 py-3"
                          />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* SECTION: TICKETING */}
        <div className="flex flex-col gap-8 bg-white border border-slate-500 rounded-xl p-8 md:p-10 shadow-xl shadow-slate-100/50">
          <div className="border-b border-slate-100 pb-4">
             <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Ticketing</h2>
             <p className="text-slate-500 text-sm mt-1">Set your price and availability.</p>
          </div>

          {/* FIX 2: Changed to Grid for perfect alignment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-slate-700 font-semibold">Price</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className={iconStyles} />
                      <Input
                        type="number"
                        placeholder="0.00"
                        disabled={form.watch("isFree")}
                        {...field}
                        className="pl-12 h-12 bg-slate-50 border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 font-medium"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Free Ticket */}
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="w-full">
                   {/* This invisible label forces the checkbox down to align PERFECTLY with the Price input */}
                   <FormLabel className="opacity-0 font-semibold">Free Ticket</FormLabel>
                   <div className="flex gap-5 items-center h-12 px-4 border border-slate-200 rounded-md bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          if (checked) form.setValue("price", "0");
                        }}
                        className="mr-3 h-5 w-5 border-2 border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                      />
                    </FormControl>
                    <FormLabel className="font-medium text-slate-700 cursor-pointer w-full">
                      This is a Free Ticket
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className=" p-4 bg-white border-t border-slate-200 flex justify-center md:static md:bg-transparent md:border-none md:p-0 z-50">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="mt-5 h-12 px-10 rounded-md bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg shadow-lg hover:shadow-indigo-500/30 transition-all w-full md:w-auto"
          >
            {form.formState.isSubmitting ? "Saving..." : `${type === "Create" ? "Create Event" : "Save Changes"}`}
          </Button>
        </div>

      </form>
    </Form>
  );
};

export default EventForm;