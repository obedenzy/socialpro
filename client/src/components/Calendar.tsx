import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { LocalStorage } from "@/lib/storage";
import type { CalendarEvent } from "@shared/schema";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const savedEvents = LocalStorage.getCalendarEvents();
    setEvents(savedEvents);
  }, []);

  const today = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  const calendarDays = [];
  const currentDateIter = new Date(startDate);

  while (currentDateIter <= lastDayOfMonth || currentDateIter.getDay() !== 0) {
    calendarDays.push(new Date(currentDateIter));
    currentDateIter.setDate(currentDateIter.getDate() + 1);
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.startDate.startsWith(dateStr));
  };

  const upcomingEvents = events
    .filter(event => new Date(event.startDate) >= today)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 5);

  const getEventColor = (type: CalendarEvent['type']) => {
    const colors = {
      meeting: 'bg-blue-600',
      task: 'bg-green-600',
      reminder: 'bg-yellow-600',
      event: 'bg-purple-600'
    };
    return colors[type] || colors.event;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-foreground">Calendar Management</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateMonth('next')}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS.map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, index) => {
                  const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                  const isToday = date.toDateString() === today.toDateString();
                  const dayEvents = getEventsForDate(date);

                  return (
                    <div
                      key={index}
                      className={`min-h-[60px] p-2 border border-border rounded-lg ${
                        isCurrentMonth ? 'bg-background' : 'bg-muted'
                      } ${isToday ? 'ring-2 ring-primary' : ''}`}
                    >
                      <div className={`text-sm font-medium ${
                        isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className={`w-2 h-2 rounded-full ${getEventColor(event.type)}`}
                            title={event.title}
                          />
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map(event => (
                  <div key={event.id} className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getEventColor(event.type)}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.startDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No upcoming events</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Events</span>
                <span className="text-sm font-medium text-foreground">{events.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">This Month</span>
                <span className="text-sm font-medium text-foreground">
                  {events.filter(event => {
                    const eventDate = new Date(event.startDate);
                    return eventDate.getMonth() === currentDate.getMonth() &&
                           eventDate.getFullYear() === currentDate.getFullYear();
                  }).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Upcoming</span>
                <span className="text-sm font-medium text-foreground">{upcomingEvents.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
