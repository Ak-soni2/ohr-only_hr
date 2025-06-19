import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight, Users } from 'lucide-react';
import { format } from 'date-fns';
import { getImageUrl } from '../utils/image';

interface Event {
  _id: string;
  name: string;
  type: 'monthly' | 'foundation';
  speaker: {
    name: string;
    bio: string;
  };
  date: string;
  time: string;
  location: string;
  description: string;
  image?: string;
  registrationCount?: number;
}

export const EventsTimeline: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'monthly' | 'foundation'>('monthly');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/events');
      const data = await response.json();
      if (response.ok) {
        const sortedEvents = data.data.sort((a: Event, b: Event) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;  // Latest first
        });
        setEvents(sortedEvents);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => event.type === activeCategory);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 4);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-primary bg-clip-text text-transparent">
            Our Events
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover our comprehensive timeline of events designed to elevate your HR career and expand your professional network.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="bg-accent/50 rounded-full p-1 flex">
            <button
              onClick={() => { setActiveCategory('monthly'); setVisibleCount(4); }}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === 'monthly' ? 'bg-secondary text-white shadow-lg' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Monthly Events
            </button>
            <button
              onClick={() => { setActiveCategory('foundation'); setVisibleCount(4); }}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === 'foundation' ? 'bg-secondary text-white shadow-lg' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Foundation Day Events
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-purple-600" />

          <div className="space-y-12 mb-5">
            {filteredEvents.slice(0, visibleCount).map((event, index) => (
              <div
                key={event._id}
                className={`flex flex-col md:flex-row gap-8 items-center md:items-start ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className="w-full md:w-1/2 flex justify-center">
                  <div className="relative w-full max-w-md">
                    <div className="aspect-video rounded-xl overflow-hidden border-2 border-primary/20 shadow-xl">
                      <img
                        src={getImageUrl(event.image) || '/placeholder.svg'}
                        alt={event.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-1/2 bg-card p-6 rounded-xl border shadow-lg relative">
                  <div className="absolute top-6 -left-3 md:left-auto md:right-auto md:top-auto w-6 h-6 rounded-full bg-primary" />
                  
                  <Link 
                    to={`/events/${event._id}`}
                    className="block hover:no-underline"
                  >
                    <h3 className="text-2xl font-bold mb-3 hover:text-primary transition-colors">
                      {event.name}
                    </h3>
                  </Link>

                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {event.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      {format(new Date(event.date), 'MMMM d, yyyy')}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                    {typeof event.registrationCount === 'number' && (
                      <div className="flex items-center text-muted-foreground">
                        <Users className="w-4 h-4 mr-2" />
                        {event.registrationCount} {event.registrationCount === 1 ? 'person' : 'people'} registered
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">Speaker</p>
                      <p className="text-sm text-muted-foreground">{event.speaker.name}</p>
                    </div>
                    <Link
                      to={`/events/${event._id}`}
                      className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {visibleCount < filteredEvents.length && (
            <div className="flex justify-center mt-14">
              <button
                onClick={handleLoadMore}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
