
import React from 'react';
import { Target, Users, Globe, Lightbulb } from 'lucide-react';

export const Mission: React.FC = () => {
  const features = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To connect, educate, and empower HR professionals through world-class events and networking opportunities.',
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'Building a strong community of HR professionals who support and learn from each other.',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Connecting HR professionals from around the world to share best practices and innovations.',
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Staying ahead of HR trends and bringing cutting-edge insights to our community.',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-secondary bg-clip-text text-transparent">
            Why Choose OnlyHR?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're more than just an event organizer - we're your partners in HR excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 bg-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border"
            >
              <div className="w-12 h-12 bg-primary  rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
