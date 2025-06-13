
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';

export const EventsTimeline: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'monthly' | 'foundation'>('monthly');

  const monthlyEvents = [
    {
      id: 1,
      title: 'Future of Remote Work',
      speaker: 'Dr. Sarah Johnson',
      date: '2024-07-15',
      time: '2:00 PM - 4:00 PM',
      venue: 'Virtual Event',
      attendees: 150,
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop',
      description: 'Explore the latest trends in remote work and how HR can adapt to the changing landscape.',
    },
    {
      id: 2,
      title: 'HR Analytics & Data Science',
      speaker: 'Michael Chen',
      date: '2024-07-22',
      time: '10:00 AM - 12:00 PM',
      venue: 'New York Conference Center',
      attendees: 120,
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop',
      description: 'Learn how to leverage data analytics to make informed HR decisions and improve employee engagement.',
    },
    {
      id: 3,
      title: 'Employee Wellness Programs',
      speaker: 'Dr. Amanda White',
      date: '2024-08-05',
      time: '3:00 PM - 5:00 PM',
      venue: 'Wellness Center',
      attendees: 100,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
      description: 'Discover innovative approaches to employee wellness and mental health in the workplace.',
    },
  ];

  const foundationEvents = [
    {
      id: 4,
      title: 'Foundation Day Celebration',
      speaker: 'Leadership Team',
      date: '2024-08-01',
      time: '6:00 PM - 10:00 PM',
      venue: 'Grand Ballroom',
      attendees: 300,
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop',
      description: 'Join us for our annual foundation day celebration with networking, awards, and entertainment.',
    },
    {
      id: 5,
      title: 'Anniversary Gala Dinner',
      speaker: 'Special Guests',
      date: '2024-08-15',
      time: '7:00 PM - 11:00 PM',
      venue: 'Luxury Hotel Ballroom',
      attendees: 250,
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop',
      description: 'An elegant evening celebrating our achievements and honoring outstanding HR professionals.',
    },
  ];

  const currentEvents = activeCategory === 'monthly' ? monthlyEvents : foundationEvents;

  return (
    <section className="py-20 bg-gradient-to-b from-background to-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-primary bg-clip-text text-transparent">
            Our Events
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover our comprehensive timeline of events designed to elevate your HR career and expand your professional network.
          </p>
        </div>

        {/* Category Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-accent/50 rounded-full p-1 flex">
            <button
              onClick={() => setActiveCategory('monthly')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === 'monthly'
                  ? 'bg-secondary text-white shadow-lg'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Monthly Events
            </button>
            <button
              onClick={() => setActiveCategory('foundation')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === 'foundation'
                  ? 'bg-secondary text-white shadow-lg'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Foundation Day Events
            </button>
          </div>
        </div>

        {/* Events Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-purple-600" />

          <div className="space-y-12">
            {currentEvents.map((event, index) => (
              <div
                key={event.id}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-2 md:left-1/2 md:transform md:-translate-x-1/2 w-4 h-4 bg-gradient-to-r from-primary to-purple-600 rounded-full border-4 border-background z-10" />

                {/* Event Card */}
                <div className={`w-full md:w-5/12 ml-12 md:ml-0 ${index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                  <div className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border">
                    <div className="relative overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                          {activeCategory === 'monthly' ? 'Monthly' : 'Foundation Day'}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-card-foreground group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">Speaker: {event.speaker}</p>
                      <p className="text-sm text-muted-foreground mb-4">{event.description}</p>

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
                          {event.venue}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users size={16} className="mr-2 text-primary" />
                          {event.attendees} attendees
                        </div>
                      </div>

                      <Link
                        to={`/events/${event.id}`}
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
          </div>
        </div>
      </div>
    </section>
  );
};
