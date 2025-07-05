import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 1)); // July 2025

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const startOfMonth = new Date(currentYear, currentMonth, 1);
  const startOfWeek = new Date(startOfMonth);
  startOfWeek.setDate(startOfMonth.getDate() - startOfMonth.getDay());

  const getDaysInMonth = () => {
    const days = [];
    const date = new Date(startOfWeek);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    
    return days;
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentMonth - 1);
    } else {
      newDate.setMonth(currentMonth + 1);
    }
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth;
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = getDaysInMonth();

  // Mock upcoming events based on the image
  const upcomingEvents = [
    {
      id: '1',
      title: 'World Braille Day',
      date: '4 Jan 2025',
      time: '',
      type: 'awareness',
      color: 'bg-blue-500'
    },
    {
      id: '2', 
      title: 'World Leprosy Day',
      date: '26 Jan 2025',
      time: '',
      type: 'awareness',
      color: 'bg-green-500'
    },
    {
      id: '3',
      title: 'International Mother Language Day',
      date: '21 Feb 2025',
      time: '',
      type: 'awareness',
      color: 'bg-purple-500'
    },
    {
      id: '4',
      title: 'World Thinking Day',
      date: '22 Feb 2025',
      time: '',
      type: 'awareness',
      color: 'bg-yellow-500'
    }
  ];

  return (
    <div className="flex h-full bg-background">
      {/* Left Sidebar */}
      <div className="w-80 bg-card border-r border-border p-4 overflow-y-auto">
        {/* Create New Event Button */}
        <Button className="w-full mb-6 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Create New Event
        </Button>

        {/* Mini Calendar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <Button variant="ghost" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h3 className="text-sm font-medium">{formatMonth(currentDate)}</h3>
            <Button variant="ghost" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-xs">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
              <div key={day} className="p-1 text-center text-muted-foreground font-medium">
                {day}
              </div>
            ))}
            {days.map((day, index) => (
              <div
                key={index}
                className={`p-1 text-center text-xs cursor-pointer hover:bg-accent rounded ${
                  isToday(day) ? 'bg-primary text-primary-foreground' :
                  isCurrentMonth(day) ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {day.getDate()}
              </div>
            ))}
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6 space-y-2">
          <Button variant="outline" className="w-full justify-start text-sm">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            Meeting
          </Button>
          <Button variant="outline" className="w-full justify-start text-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            Personal
          </Button>
          <Button variant="outline" className="w-full justify-start text-sm">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
            Work
          </Button>
          <Button variant="outline" className="w-full justify-start text-sm">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            Other
          </Button>
        </div>

        {/* Upcoming Events */}
        <div>
          <h3 className="text-sm font-medium mb-3">Upcoming Events</h3>
          <p className="text-xs text-muted-foreground mb-4">Don't miss scheduled events</p>
          
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full ${event.color} mt-2`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">👋</span>
            </div>
            <span className="text-sm font-medium">Welcome to your Calendar!</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Great first connection! here you can active history. Click on create to 
            add your first scheduled event.
          </p>
        </div>
      </div>

      {/* Main Calendar */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">JULY 2025</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">Month</Button>
            <Button variant="outline" size="sm">Week</Button>
            <Button variant="outline" size="sm">Day</Button>
            <Button variant="outline" size="sm">List</Button>
          </div>
        </div>

        <div className="bg-card rounded-lg overflow-hidden">
          {/* Calendar Header */}
          <div className="grid grid-cols-7 bg-muted/50">
            {weekDays.map((day) => (
              <div key={day} className="p-4 text-center text-sm font-medium text-muted-foreground border-r border-border last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {days.map((day, index) => {
              const isCurrentMonthDay = isCurrentMonth(day);
              
              return (
                <div
                  key={index}
                  className={`min-h-32 p-2 border-r border-b border-border last:border-r-0 ${
                    isCurrentMonthDay ? 'bg-card' : 'bg-muted/20'
                  }`}
                >
                  <div className={`text-sm font-medium mb-2 ${
                    isToday(day) ? 'w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center' :
                    isCurrentMonthDay ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {day.getDate()}
                  </div>
                  
                  {/* Sample Events */}
                  {day.getDate() === 1 && isCurrentMonthDay && (
                    <div className="text-xs bg-green-100 text-green-800 p-1 rounded mb-1">
                      Meeting with Manager
                    </div>
                  )}
                  {day.getDate() === 2 && isCurrentMonthDay && (
                    <div className="text-xs bg-blue-100 text-blue-800 p-1 rounded mb-1">
                      All Day Event
                    </div>
                  )}
                  {day.getDate() === 8 && isCurrentMonthDay && (
                    <div className="text-xs bg-purple-100 text-purple-800 p-1 rounded mb-1">
                      Important Event
                    </div>
                  )}
                  {day.getDate() === 15 && isCurrentMonthDay && (
                    <div className="text-xs bg-orange-100 text-orange-800 p-1 rounded mb-1">
                      Weekly Meeting Planning
                    </div>
                  )}
                  {day.getDate() === 28 && isCurrentMonthDay && (
                    <div className="text-xs bg-red-100 text-red-800 p-1 rounded mb-1">
                      Client Meeting with Aston
                    </div>
                  )}
                  {day.getDate() === 30 && isCurrentMonthDay && (
                    <div className="text-xs bg-pink-100 text-pink-800 p-1 rounded mb-1">
                      Click for Google
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}