
import React, { useState } from 'react';
import { Mail, Instagram } from 'lucide-react';

export const TeamSection: React.FC = () => {
  const [activeTeam, setActiveTeam] = useState<'turtles' | 'executives'>('turtles');

  const turtlesTeam = [
    {
      name: 'Alex Rivera',
      role: 'Lead Developer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      email: 'alex@onlyhr.com',
      social: '@alexrivera',
    },
    {
      name: 'Sarah Kim',
      role: 'UX Designer',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
      email: 'sarah@onlyhr.com',
      social: '@sarahkim',
    },
    {
      name: 'Michael Chen',
      role: 'Backend Engineer',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      email: 'michael@onlyhr.com',
      social: '@michaelchen',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Frontend Developer',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      email: 'emily@onlyhr.com',
      social: '@emilyrod',
    },
  ];

  const executivesTeam = [
    {
      name: 'Dr. Jennifer Walsh',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face',
      email: 'jennifer@onlyhr.com',
      social: '@jenwalsh',
    },
    {
      name: 'David Thompson',
      role: 'Chief Technology Officer',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
      email: 'david@onlyhr.com',
      social: '@davidtech',
    },
    {
      name: 'Lisa Anderson',
      role: 'VP of Operations',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face',
      email: 'lisa@onlyhr.com',
      social: '@lisaops',
    },
    {
      name: 'Robert Johnson',
      role: 'Head of Marketing',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face',
      email: 'robert@onlyhr.com',
      social: '@robmarketing',
    },
  ];

  const currentTeam = activeTeam === 'turtles' ? turtlesTeam : executivesTeam;

  return (
    <section className="py-20 bg-gradient-to-b from-background to-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-primary bg-clip-text text-transparent">
            Meet Our Team
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get to know the passionate individuals who make OnlyHR a thriving community for HR professionals worldwide.
          </p>
        </div>

        {/* Team Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-accent/50 rounded-full p-1 flex">
            <button
              onClick={() => setActiveTeam('turtles')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTeam === 'turtles'
                  ? 'bg-secondary text-white shadow-lg'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Trusties
            </button>
            <button
              onClick={() => setActiveTeam('executives')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTeam === 'executives'
                  ? 'bg-secondary text-white shadow-lg'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Executives Team
            </button>
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentTeam.map((member, index) => (
            <div
              key={`${activeTeam}-${index}`}
              className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex space-x-2">
                    <a
                      href={`mailto:${member.email}`}
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                    >
                      <Mail size={16} className="text-white" />
                    </a>
                    <a
                      href="#"
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                    >
                      <Instagram size={16} className="text-white" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-1 text-card-foreground">{member.name}</h3>
                <p className="text-primary font-medium mb-2">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.social}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
