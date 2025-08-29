'use client';

import { useState, useEffect } from 'react';
import type { CalendarEvent, Group, User } from '@/lib/types';
import { addDays, format, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, Plus, Trash2, Edit, X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/use-auth';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { createGroupEvent, updateGroupEvent, deleteGroupEvent } from '@/lib/firebase-service';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface GroupCalendarProps {
  group: Group;
  members: User[];
}

export function GroupCalendar({ group, members }: GroupCalendarProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const usersById = Object.fromEntries(members.map(user => [user.id, user]));

  const dayEvents = (group.events || []).filter(event => 
    isSameDay(event.startTime.toDate(), selectedDay || new Date())
  ).sort((a, b) => a.startTime.toMillis() - b.startTime.toMillis());

  const handleSelectDay = (day: Date | undefined) => {
    setSelectedDay(day);
  };
  
  const handleAddEvent = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  }
  
  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  }

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteGroupEvent(group.id, eventId);
      toast({ title: "Event deleted" });
    } catch (e) {
      toast({ variant: 'destructive', title: "Failed to delete event" });
    }
  }

  return (
    <div className="w-full bg-gradient-to-br from-orange-400 via-pink-400 to-purple-400 relative overflow-hidden rounded-lg min-h-[80vh]">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 w-16 h-16 neo-border-thick bg-green-400 transform rotate-12"></div>
        <div className="absolute top-16 right-8 w-12 h-12 neo-border-thick bg-cyan-400 transform -rotate-45"></div>
        <div className="absolute bottom-8 left-1/4 w-14 h-14 neo-border-thick bg-yellow-400 transform rotate-30"></div>
        <div className="absolute bottom-16 right-1/3 w-10 h-10 neo-border-thick bg-purple-600 transform -rotate-12"></div>
      </div>

      <div className="relative z-10 p-4">
        <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
          
          {/* Calendar Section */}
          <div className="lg:w-1/2 space-y-4">
            {/* Calendar Header */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-400 neo-border-thick transform rotate-1"></div>
              <div className="relative neo-border-thick neo-shadow-lg bg-black p-4">
                <h2 className="text-2xl font-black uppercase text-white neo-text-shadow flex items-center gap-3">
                  <div className="neo-border bg-cyan-400 p-2">
                    <CalendarIcon className="h-6 w-6 text-black" />
                  </div>
                  GROUP CALENDAR
                </h2>
              </div>
            </div>

            {/* Calendar Widget */}
            <div className="relative transform hover:scale-105 transition-transform duration-300">
              <div className="absolute -inset-2 bg-gradient-to-br from-yellow-400 to-orange-400 neo-border-thick transform rotate-1"></div>
              <div className="relative neo-border-thick neo-shadow-lg bg-white p-4">
                <Calendar
                  mode="single"
                  selected={selectedDay}
                  onSelect={handleSelectDay}
                  className="w-full"
                  modifiers={{
                    hasEvent: (group.events || []).map(e => e.startTime.toDate())
                  }}
                  modifiersStyles={{
                    hasEvent: {
                      background: "#10b981",
                      color: "black",
                      fontWeight: "900",
                      transform: "scale(1.1) rotate(-2deg)",
                      border: "3px solid black"
                    }
                  }}
                />
              </div>
            </div>

            {/* Add Event Button */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-cyan-400 neo-border-thick transform rotate-2 group-hover:rotate-6 transition-transform duration-300"></div>
              <Button 
                onClick={handleAddEvent}
                className="relative w-full neo-border-thick bg-white text-black hover:bg-black hover:text-white font-black text-lg py-6 transform group-hover:-rotate-2 transition-all duration-300"
              >
                <Plus className="mr-3 h-6 w-6" />
                CREATE NEW EVENT
              </Button>
            </div>
          </div>

          {/* Events Section */}
          <div className="lg:w-1/2 space-y-6">
            {/* Events Header */}
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 to-pink-400 neo-border-thick transform -rotate-1"></div>
              <div className="relative neo-border-thick neo-shadow-lg bg-black p-6">
                <h3 className="text-2xl font-black uppercase text-white">
                  EVENTS FOR{' '}
                  <span className="text-yellow-400">
                    {selectedDay ? format(selectedDay, 'MMM dd') : 'TODAY'}
                  </span>
                </h3>
                <p className="text-cyan-400 font-bold mt-2">
                  {dayEvents.length > 0 
                    ? `${dayEvents.length} EVENT${dayEvents.length !== 1 ? 'S' : ''} SCHEDULED` 
                    : 'NO EVENTS TODAY'
                  }
                </p>
              </div>
            </div>

            {/* Events List */}
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {dayEvents.length === 0 ? (
                <div className="neo-border-thick bg-yellow-400 p-8 transform rotate-1">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📅</div>
                    <p className="font-black text-black text-lg uppercase">
                      NO EVENTS SCHEDULED
                    </p>
                    <p className="font-bold text-black mt-2">
                      Add your first event to get started!
                    </p>
                  </div>
                </div>
              ) : (
                dayEvents.map((event, index) => {
                  const createdByUser = usersById[event.createdBy];
                  const colors = ['bg-green-400', 'bg-cyan-400', 'bg-yellow-400', 'bg-purple-400', 'bg-pink-400'];
                  const rotations = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2'];
                  const bgColor = colors[index % colors.length];
                  const rotation = rotations[index % rotations.length];

                  return (
                    <div key={event.id} className={`relative group transform ${rotation} hover:scale-105 hover:rotate-0 transition-all duration-300`}>
                      <div className={`absolute -inset-2 ${bgColor} neo-border-thick transform rotate-3 group-hover:rotate-6 transition-transform duration-300`}></div>
                      <div className="relative neo-border-thick neo-shadow-lg bg-white p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`neo-border ${bgColor} p-2`}>
                                <span className="text-xl">📝</span>
                              </div>
                              <h4 className="font-black text-xl text-black uppercase">{event.title}</h4>
                            </div>
                            
                            <div className="neo-border bg-black p-3 mb-3">
                              <p className="text-white font-bold">{event.description}</p>
                            </div>
                            
                            <div className="flex items-center gap-4 mb-3">
                              <div className="neo-border bg-gray-100 px-3 py-1">
                                <span className="font-black text-black text-sm">
                                  {format(event.startTime.toDate(), 'h:mm a')} - {format(event.endTime.toDate(), 'h:mm a')}
                                </span>
                              </div>
                            </div>
                            
                            {createdByUser && (
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 neo-border">
                                  <AvatarImage src={createdByUser.avatarUrl} />
                                  <AvatarFallback className="font-black bg-purple-400 text-black">
                                    {createdByUser.name.slice(0,1)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-bold text-black">by {createdByUser.name}</span>
                              </div>
                            )}
                          </div>

                          {user?.id === event.createdBy && (
                            <div className="flex flex-col gap-2 ml-4">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleEditEvent(event)}
                                className="neo-border bg-blue-400 hover:bg-blue-500 text-black"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="destructive" 
                                    size="icon"
                                    className="neo-border bg-red-400 hover:bg-red-500 text-black"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="neo-border-thick bg-white">
                                  <AlertDialogHeader>
                                    <div className="neo-border bg-red-400 p-3 mb-4">
                                      <AlertDialogTitle className="font-black uppercase text-black">DELETE EVENT?</AlertDialogTitle>
                                    </div>
                                    <AlertDialogDescription className="font-bold text-black">
                                      This action cannot be undone. This will permanently delete the event.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="neo-border font-black">CANCEL</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDeleteEvent(event.id)}
                                      className="neo-border bg-red-400 hover:bg-red-500 text-black font-black"
                                    >
                                      DELETE
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <EventForm 
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        group={group}
        event={editingEvent}
        selectedDay={selectedDay || new Date()}
      />
    </div>
  );
}


function EventForm({ isOpen, setIsOpen, group, event, selectedDay }: { isOpen: boolean, setIsOpen: (open: boolean) => void, group: Group, event: CalendarEvent | null, selectedDay: Date }) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState<Date | undefined>(selectedDay);
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('10:00');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (event) {
            setTitle(event.title);
            setDescription(event.description);
            setDate(event.startTime.toDate());
            setStartTime(format(event.startTime.toDate(), 'HH:mm'));
            setEndTime(format(event.endTime.toDate(), 'HH:mm'));
        } else {
            setTitle('');
            setDescription('');
            setDate(selectedDay);
            setStartTime('09:00');
            setEndTime('10:00');
        }
    }, [event, isOpen, selectedDay]);


    const handleSubmit = async () => {
        if (!user || !date || !title) {
            toast({ variant: 'destructive', title: "Please fill in all required fields."});
            return;
        }
        setIsSaving(true);
        
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        
        const startTimestamp = new Date(date);
        startTimestamp.setHours(startHours, startMinutes);

        const endTimestamp = new Date(date);
        endTimestamp.setHours(endHours, endMinutes);

        if (startTimestamp >= endTimestamp) {
            toast({ variant: 'destructive', title: "End time must be after start time."});
            setIsSaving(false);
            return;
        }

        try {
            if (event) { // Update existing event
                const updatedEvent: CalendarEvent = {
                    ...event,
                    title,
                    description,
                    startTime: Timestamp.fromDate(startTimestamp),
                    endTime: Timestamp.fromDate(endTimestamp),
                };
                await updateGroupEvent(group.id, updatedEvent);
                toast({ title: 'Event updated successfully!' });
            } else { // Create new event
                const newEvent: Omit<CalendarEvent, 'id'> = {
                    title,
                    description,
                    startTime: Timestamp.fromDate(startTimestamp),
                    endTime: Timestamp.fromDate(endTimestamp),
                    createdBy: user.id
                };
                await createGroupEvent(group.id, newEvent);
                toast({ title: 'Event created successfully!' });
            }
            setIsOpen(false);
        } catch (e) {
            toast({ variant: 'destructive', title: "Failed to save event." });
        } finally {
            setIsSaving(false);
        }
    }


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="neo-border-thick bg-white max-w-2xl">
                <DialogHeader className="space-y-4">
                    <div className="relative">
                        <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 to-pink-400 neo-border-thick transform rotate-1"></div>
                        <div className="relative neo-border bg-black p-4">
                            <DialogTitle className="font-black uppercase text-white text-xl">
                                {event ? '✏️ EDIT EVENT' : '➕ CREATE NEW EVENT'}
                            </DialogTitle>
                        </div>
                    </div>
                </DialogHeader>
                
                <div className="space-y-6 py-6">
                    <div className="space-y-3">
                        <Label htmlFor="title" className="font-black uppercase text-black text-lg">📝 EVENT TITLE</Label>
                        <Input 
                            id="title" 
                            value={title} 
                            onChange={e => setTitle(e.target.value)}
                            className="neo-border-thick font-bold text-lg p-4"
                            placeholder="e.g., Study Session, Exam Prep..."
                        />
                    </div>
                    
                    <div className="space-y-3">
                        <Label htmlFor="description" className="font-black uppercase text-black text-lg">💬 DESCRIPTION</Label>
                        <Textarea 
                            id="description" 
                            value={description} 
                            onChange={e => setDescription(e.target.value)}
                            className="neo-border-thick font-bold min-h-[100px] p-4"
                            placeholder="Tell everyone what this event is about..."
                        />
                    </div>
                    
                    <div className="space-y-3">
                        <Label className="font-black uppercase text-black text-lg">📅 DATE</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-black neo-border-thick p-4 text-lg",
                                        !date && "text-gray-500"
                                    )}
                                >
                                    <CalendarIcon className="mr-3 h-6 w-6" />
                                    {date ? format(date, "EEEE, MMMM do, yyyy") : <span>PICK A DATE</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 neo-border-thick bg-white">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label htmlFor="start-time" className="font-black uppercase text-black">⏰ START TIME</Label>
                            <Input 
                                id="start-time" 
                                type="time" 
                                value={startTime} 
                                onChange={e => setStartTime(e.target.value)}
                                className="neo-border-thick font-bold text-lg p-4"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="end-time" className="font-black uppercase text-black">🏁 END TIME</Label>
                            <Input 
                                id="end-time" 
                                type="time" 
                                value={endTime} 
                                onChange={e => setEndTime(e.target.value)}
                                className="neo-border-thick font-bold text-lg p-4"
                            />
                        </div>
                    </div>
                </div>
                
                <DialogFooter className="gap-4 pt-4">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gray-400 neo-border transform rotate-1 group-hover:rotate-3 transition-transform duration-300"></div>
                        <Button 
                            variant="outline" 
                            onClick={() => setIsOpen(false)}
                            className="relative neo-border bg-white text-black font-black px-6 py-3 transform group-hover:-rotate-1 transition-transform duration-300"
                        >
                            CANCEL
                        </Button>
                    </div>
                    
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-cyan-400 neo-border transform -rotate-1 group-hover:-rotate-3 transition-transform duration-300"></div>
                        <Button 
                            onClick={handleSubmit} 
                            disabled={isSaving}
                            className="relative neo-border bg-green-400 hover:bg-green-500 text-black font-black px-6 py-3 transform group-hover:rotate-1 transition-transform duration-300"
                        >
                            {isSaving ? '⏳ SAVING...' : event ? '💾 UPDATE EVENT' : '🎉 CREATE EVENT'}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
