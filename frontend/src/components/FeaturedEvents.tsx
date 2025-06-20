
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { getImageUrl } from '../utils/image';

interface Event {
  _id: string;
  name: string;
  type: string;
  speaker: {
    name: string;
    bio: string;
  };
  date: string;
  time: string;
  location: string;
  description: string;
  image?: string;
}

export const FeaturedEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/events?type=monthly`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data.data.slice(0, 3));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch events');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Events</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join our upcoming events and connect with fellow HR professionals.
          </p>
        </div>        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-3 flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="col-span-3 text-center py-12 text-red-500">
              {error}
            </div>
          ) : events.length === 0 ? (
            <div className="col-span-3 text-center py-12 text-muted-foreground">
              No upcoming events found.
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event._id}
                className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={getImageUrl(event.image) || '/placeholder.svg'}
                    alt={event.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)} Event
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-card-foreground group-hover:text-primary transition-colors">
                    {event.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">Speaker: {event.speaker.name}</p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar size={16} className="mr-2 text-primary" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock size={16} className="mr-2 text-primary" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin size={16} className="mr-2 text-primary" />
                      {event.location}
                    </div>
                  </div>

                  <Link
                    to={`/events/${event._id}`}
                    className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors group/link"
                  >
                    Learn More
                    <ArrowRight size={16} className="ml-1 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/events"
            className="inline-flex items-center bg-secondary text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-secondary/25"
          >
            View All Events
            <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};
