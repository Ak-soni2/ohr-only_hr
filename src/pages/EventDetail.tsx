
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowLeft, Star } from 'lucide-react';

export const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Mock event data - in a real app, this would come from an API
  const events = {
    '1': {
      title: 'Future of Remote Work',
      speaker: 'Dr. Sarah Johnson',
      date: '2024-07-15',
      time: '2:00 PM - 4:00 PM',
      venue: 'Virtual Event',
      attendees: 150,
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=500&fit=crop',
      description: `Join us for an insightful exploration of the future of remote work and its impact on HR practices. Dr. Sarah Johnson, a renowned expert in organizational psychology, will share her research findings and practical strategies for managing remote teams effectively.

This comprehensive session will cover:
• Latest trends in remote work adoption
• Building strong remote team cultures
• Performance management in virtual environments
• Tools and technologies for remote collaboration
• Addressing challenges of hybrid work models
• Creating inclusive remote work policies

Whether you're an HR professional, team leader, or organizational decision-maker, this event will provide you with actionable insights to enhance your remote work strategies and create more engaged, productive remote teams.`,
      speakerBio: 'Dr. Sarah Johnson is a leading organizational psychologist with over 15 years of experience in remote work research. She has published numerous papers on virtual team dynamics and serves as a consultant for Fortune 500 companies.',
      agenda: [
        { time: '2:00 PM', item: 'Welcome & Introduction' },
        { time: '2:15 PM', item: 'The Evolution of Remote Work' },
        { time: '2:45 PM', item: 'Building Remote Team Culture' },
        { time: '3:15 PM', item: 'Q&A Session' },
        { time: '3:30 PM', item: 'Networking Break' },
        { time: '3:45 PM', item: 'Future Trends & Predictions' },
      ],
    },
    '2': {
      title: 'HR Analytics & Data Science',
      speaker: 'Michael Chen',
      date: '2024-07-22',
      time: '10:00 AM - 12:00 PM',
      venue: 'New York Conference Center',
      attendees: 120,
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=500&fit=crop',
      description: `Discover the power of data-driven HR decision making in this comprehensive workshop. Michael Chen, a data science expert, will demonstrate how to leverage analytics to improve recruitment, retention, and employee engagement.

Key topics include:
• Introduction to HR analytics fundamentals
• Data collection and visualization techniques
• Predictive modeling for talent acquisition
• Employee sentiment analysis
• ROI measurement for HR initiatives
• Ethical considerations in HR data usage

Participants will gain hands-on experience with popular analytics tools and learn to create compelling data stories that drive organizational change.`,
      speakerBio: 'Michael Chen is a Senior Data Scientist with expertise in HR analytics. He has helped numerous organizations implement data-driven HR strategies and is a frequent speaker at industry conferences.',
      agenda: [
        { time: '10:00 AM', item: 'Introduction to HR Analytics' },
        { time: '10:30 AM', item: 'Data Collection Strategies' },
        { time: '11:00 AM', item: 'Hands-on Analytics Workshop' },
        { time: '11:30 AM', item: 'Case Study Review' },
        { time: '12:00 PM', item: 'Closing & Next Steps' },
      ],
    },
    '3': {
      title: 'Employee Wellness Programs',
      speaker: 'Dr. Amanda White',
      date: '2024-08-05',
      time: '3:00 PM - 5:00 PM',
      venue: 'Wellness Center',
      attendees: 100,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop',
      description: `Learn how to design and implement effective employee wellness programs that boost engagement, reduce turnover, and improve overall workplace satisfaction. Dr. Amanda White will share evidence-based strategies for creating comprehensive wellness initiatives.`,
      speakerBio: 'Dr. Amanda White is a workplace wellness expert and licensed psychologist specializing in employee mental health and organizational well-being programs.',
      agenda: [
        { time: '3:00 PM', item: 'Wellness Program Fundamentals' },
        { time: '3:30 PM', item: 'Mental Health in the Workplace' },
        { time: '4:00 PM', item: 'Implementation Strategies' },
        { time: '4:30 PM', item: 'Measuring Success' },
        { time: '5:00 PM', item: 'Q&A and Wrap-up' },
      ],
    },
    '4': {
      title: 'Foundation Day Celebration',
      speaker: 'Leadership Team',
      date: '2024-08-01',
      time: '6:00 PM - 10:00 PM',
      venue: 'Grand Ballroom',
      attendees: 300,
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=500&fit=crop',
      description: `Join us for our annual Foundation Day celebration! This special evening brings together our entire OnlyHR community to celebrate our achievements, honor outstanding members, and network with fellow HR professionals.`,
      speakerBio: 'Our leadership team will be presenting the year in review and sharing exciting plans for the future of OnlyHR.',
      agenda: [
        { time: '6:00 PM', item: 'Registration & Welcome Reception' },
        { time: '7:00 PM', item: 'Opening Ceremony' },
        { time: '7:30 PM', item: 'Awards Presentation' },
        { time: '8:30 PM', item: 'Dinner & Networking' },
        { time: '9:30 PM', item: 'Entertainment & Dancing' },
      ],
    },
    '5': {
      title: 'Anniversary Gala Dinner',
      speaker: 'Special Guests',
      date: '2024-08-15',
      time: '7:00 PM - 11:00 PM',
      venue: 'Luxury Hotel Ballroom',
      attendees: 250,
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=500&fit=crop',
      description: `An elegant evening celebrating our achievements and honoring outstanding HR professionals. Join us for fine dining, entertainment, and networking in a luxurious setting.`,
      speakerBio: 'We will be hosting special guest speakers from the HR industry, including award-winning leaders and innovators.',
      agenda: [
        { time: '7:00 PM', item: 'Cocktail Reception' },
        { time: '8:00 PM', item: 'Welcome & Dinner Service' },
        { time: '9:00 PM', item: 'Keynote Presentations' },
        { time: '10:00 PM', item: 'Awards Ceremony' },
        { time: '10:30 PM', item: 'Dancing & Celebration' },
      ],
    },
  };

  const event = events[id as keyof typeof events];

  if (!event) {
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

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-primary/20 to-purple-600/20 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
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
              {event.title}
            </h1>
            <p className="text-xl text-muted-foreground">
              Speaker: {event.speaker}
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
                      <p className="text-sm text-muted-foreground">Venue</p>
                      <p className="font-semibold">{event.venue}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="text-primary" size={20} />
                    <div>
                      <p className="text-sm text-muted-foreground">Attendees</p>
                      <p className="font-semibold">{event.attendees}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-8">
                  <h2 className="text-2xl font-bold mb-4 text-card-foreground">About This Event</h2>
                  <div className="prose prose-slate max-w-none">
                    {event.description.split('\n').map((paragraph, index) => (
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
                <p className="text-muted-foreground leading-relaxed">{event.speakerBio}</p>
              </div>

              {/* Agenda */}
              <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
                <h2 className="text-2xl font-bold mb-6 text-card-foreground">Event Agenda</h2>
                <div className="space-y-4">
                  {event.agenda.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-accent/50 rounded-lg">
                      <div className="w-20 text-sm font-semibold text-primary">
                        {item.time}
                      </div>
                      <div className="flex-1 text-muted-foreground">
                        {item.item}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
