"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-6", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-6 sm:space-x-6 sm:space-y-0",
        month: "space-y-6",
        caption: "flex justify-center pt-2 relative items-center mb-4",
        caption_label: "text-lg font-black uppercase text-black neo-border bg-yellow-400 px-4 py-2",
        nav: "space-x-2 flex items-center",
        nav_button: cn(
          "neo-border-thick bg-white hover:bg-black hover:text-white text-black font-black h-10 w-10 p-0 transform hover:scale-110 transition-all duration-300"
        ),
        nav_button_previous: "absolute left-2 hover:rotate-12",
        nav_button_next: "absolute right-2 hover:-rotate-12",
        table: "w-full border-collapse space-y-2",
        head_row: "flex mb-2",
        head_cell: "neo-border bg-purple-400 text-black font-black w-12 h-8 flex items-center justify-center text-sm uppercase",
        row: "flex w-full mt-2",
        cell: "h-12 w-12 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:bg-cyan-400 [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-cyan-400 first:[&:has([aria-selected])]:bg-cyan-400 last:[&:has([aria-selected])]:bg-cyan-400 focus-within:relative focus-within:z-20",
        day: cn(
          "neo-border bg-white hover:bg-black hover:text-white text-black font-black h-12 w-12 p-0 transition-all duration-200 transform hover:scale-110 hover:rotate-3"
        ),
        day_range_end: "day-range-end",
        day_selected: "bg-green-400 text-black hover:bg-green-500 hover:text-black focus:bg-green-400 focus:text-black font-black neo-border-thick transform scale-110 rotate-3",
        day_today: "bg-cyan-400 text-black font-black neo-border-thick",
        day_outside: "day-outside text-gray-400 opacity-50 aria-selected:bg-gray-200 aria-selected:text-gray-400",
        day_disabled: "text-gray-300 opacity-30 hover:bg-white hover:text-gray-300",
        day_range_middle: "aria-selected:bg-cyan-400 aria-selected:text-black",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-6 w-6", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-6 w-6", className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
