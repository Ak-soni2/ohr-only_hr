
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';

export const FeaturedEvents: React.FC = () => {
  const events = [
    {
      id: 1,
      title: 'Future of Remote Work',
      speaker: 'Dr. Sarah Johnson',
      date: '2024-07-15',
      time: '2:00 PM - 4:00 PM',
      venue: 'Virtual Event',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=300&fit=crop',
      category: 'Monthly Event',
    },
    {
      id: 2,
      title: 'HR Analytics & Data Science',
      speaker: 'Michael Chen',
      date: '2024-07-22',
      time: '10:00 AM - 12:00 PM',
      venue: 'New York Conference Center',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=300&fit=crop',
      category: 'Workshop',
    },
    {
      id: 3,
      title: 'Foundation Day Celebration',
      speaker: 'Leadership Team',
      date: '2024-08-01',
      time: '6:00 PM - 10:00 PM',
      venue: 'Grand Ballroom',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&h=300&fit=crop',
      category: 'Foundation Day',
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Events</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join our upcoming events and connect with fellow HR professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border"
            >
              <div className="relative overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                    {event.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-card-foreground group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                <p className="text-muted-foreground mb-4">Speaker: {event.speaker}</p>

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
                    {event.venue}
                  </div>
                </div>

                <Link
                  to={`/events/${event.id}`}
                  className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors group/link"
                >
                  Learn More
                  <ArrowRight size={16} className="ml-1 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
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
