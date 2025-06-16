import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowLeft, Star } from 'lucide-react';

interface Speaker {
  name: string;
  bio: string;
}

interface AgendaItem {
  time: string;
  description: string;
  _id: string;
}

interface Event {
  _id: string;
  name: string;
  type: string;
  date: string;
  time: string;
  location: string;
  description: string;
  speaker: Speaker;
  agenda: AgendaItem[];
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: Event;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=500&fit=crop';

export const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/events/${id}`);
        if (!response.ok) {
          throw new Error('Event not found');
        }
        const result: ApiResponse = await response.json();
        if (result.success) {
          setEvent(result.data);
        } else {
          throw new Error('Failed to fetch event data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch event');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
          <Link to="/events" className="text-primary hover:underline">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const paragraphs = event.description ? event.description.split('\n') : ['No description available'];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-primary/20 to-purple-600/20 overflow-hidden">
        <img
          src={event.image || DEFAULT_IMAGE}
          alt={event.name}
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-center w-full">
            <Link
              to="/events"
              className="inline-flex items-center text-primary hover:text-primary/80 mb-4 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Events
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              {event.name}
            </h1>
            <p className="text-xl text-muted-foreground">
              Speaker: {event.speaker.name}
            </p>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Event Info */}
              <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="flex items-center space-x-2">
                    <Calendar className="text-primary" size={20} />
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-semibold">{new Date(event.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="text-primary" size={20} />
                    <div>
                      <p className="text-sm text-muted-foreground">Time</p>
                      <p className="font-semibold">{event.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="text-primary" size={20} />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-semibold">{event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="text-primary" size={20} />
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="font-semibold capitalize">{event.type}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-8">
                  <h2 className="text-2xl font-bold mb-4 text-card-foreground">About This Event</h2>
                  <div className="prose prose-slate max-w-none">
                    {paragraphs.map((paragraph, index) => (
                      <p key={index} className="text-muted-foreground mb-4 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Speaker Bio */}
              <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
                <h2 className="text-2xl font-bold mb-4 text-card-foreground">About the Speaker</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {event.speaker.bio}
                </p>
              </div>

              {/* Agenda */}
              {event.agenda && event.agenda.length > 0 && (
                <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
                  <h2 className="text-2xl font-bold mb-6 text-card-foreground">Event Agenda</h2>
                  <div className="space-y-4">
                    {event.agenda.map((item) => (
                      <div key={item._id} className="flex items-center space-x-4 p-4 bg-accent/50 rounded-lg">
                        <div className="w-20 text-sm font-semibold text-primary">
                          {item.time}
                        </div>
                        <div className="flex-1 text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Registration Card */}
              <div className="bg-gradient-to-br from-primary to-purple-600 rounded-2xl p-8 text-white shadow-xl">
                <h3 className="text-2xl font-bold mb-4">Register Now</h3>
                <p className="mb-6 opacity-90">
                  Secure your spot for this amazing event. Limited seats available!
                </p>
                <button className="w-full bg-white text-primary font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">
                  Register for Event
                </button>
                <p className="text-center mt-4 text-sm opacity-75">
                  Free for OnlyHR members
                </p>
              </div>

              {/* Event Highlights */}
              <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
                <h3 className="text-xl font-bold mb-4 text-card-foreground">Event Highlights</h3>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-2">
                    <Star size={16} className="text-yellow-500" />
                    <span className="text-sm text-muted-foreground">Expert speaker presentation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Star size={16} className="text-yellow-500" />
                    <span className="text-sm text-muted-foreground">Interactive Q&A session</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Star size={16} className="text-yellow-500" />
                    <span className="text-sm text-muted-foreground">Networking opportunities</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Star size={16} className="text-yellow-500" />
                    <span className="text-sm text-muted-foreground">Resource materials included</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
