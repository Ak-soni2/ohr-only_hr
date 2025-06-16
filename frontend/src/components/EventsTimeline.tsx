import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';

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
  attendees?: number;
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
          const dateA = parseInt(a._id.substring(0, 8), 16);
          const dateB = parseInt(b._id.substring(0, 8), 16);
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
                className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className="absolute left-2 md:left-1/2 md:transform md:-translate-x-1/2 w-4 h-4 bg-gradient-to-r from-primary to-purple-600 rounded-full border-4 border-background z-10" />

                <div className={`w-full md:w-5/12 ml-12 md:ml-0 ${index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                  <div className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border">
                    <div className="relative overflow-hidden">
                      <img
                        src={event.image || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=500&fit=crop'}
                        alt={event.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                          {event.type === 'monthly' ? 'Monthly' : 'Foundation Day'}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-card-foreground group-hover:text-primary transition-colors">
                        {event.name}
                      </h3>
                      <p className="text-muted-foreground mb-4">Speaker: {event.speaker.name}</p>
                      <p className="text-sm text-muted-foreground mb-4">{event.speaker.bio}</p>

                      <div className="grid grid-cols-2 gap-4 mb-6">
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
                        className="inline-flex items-center bg-secondary text-white px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      >
                        View Details
                        <ArrowRight size={16} className="ml-2" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div >

          {visibleCount < filteredEvents.length && (
            <div className="flex justify-center mt-14">
              <button
                onClick={handleLoadMore}
                className="bg-primary text-white px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-transform hover:scale-105"
              >
                View More Events
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
