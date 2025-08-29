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
    <div className="flex-1 flex flex-col md:flex-row p-4 gap-4">
      <div className="md:w-1/3 lg:w-1/4">
        <Calendar
          mode="single"
          selected={selectedDay}
          onSelect={handleSelectDay}
          className="rounded-md border"
           modifiers={{
            hasEvent: (group.events || []).map(e => e.startTime.toDate())
          }}
          modifiersStyles={{
            hasEvent: {
              border: "2px solid hsl(var(--primary))",
              borderRadius: '9999px'
            }
          }}
        />
        <Button className="w-full mt-4" onClick={handleAddEvent}>
          <Plus className="mr-2 h-4 w-4"/>
          Add New Event
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle>Events for {selectedDay ? format(selectedDay, 'PPP') : 'Today'}</CardTitle>
              <CardDescription>
                {dayEvents.length > 0 ? `You have ${dayEvents.length} event(s) scheduled.` : 'No events scheduled for this day.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dayEvents.map(event => {
                const createdByUser = usersById[event.createdBy];
                return (
                  <div key={event.id} className="p-4 border rounded-lg flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {format(event.startTime.toDate(), 'p')} - {format(event.endTime.toDate(), 'p')}
                      </p>
                      {createdByUser && (
                        <div className="flex items-center gap-2 mt-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={createdByUser.avatarUrl} />
                            <AvatarFallback>{createdByUser.name.slice(0,1)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">Created by {createdByUser.name}</span>
                        </div>
                      )}
                    </div>
                    {user?.id === event.createdBy && (
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditEvent(event)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the event.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteEvent(event.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{event ? 'Edit Event' : 'Create New Event'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={title} onChange={e => setTitle(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label>Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                "w-full justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="start-time">Start Time</Label>
                            <Input id="start-time" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="end-time">End Time</Label>
                            <Input id="end-time" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Event'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
