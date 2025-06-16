
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Calendar, Star } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-pink-500/10 dark:from-primary/20 dark:via-purple-500/10 dark:to-pink-500/20" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="space-y-8 animate-fade-in">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            <span className="bg-primary  bg-clip-text text-transparent">
              OnlyHR
            </span>
            <br />
            <span className="text-secondary">Events & Beyond</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Empowering HR professionals through innovative events, networking opportunities, 
            and career development programs that shape the future of human resources.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 py-8">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Users className="text-primary" size={24} />
              <span className="text-lg font-semibold">500+ Members</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Calendar className="text-purple-600" size={24} />
              <span className="text-lg font-semibold">50+ Events</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Star className="text-yellow-500" size={24} />
              <span className="text-lg font-semibold">4.9 Rating</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/membership"
              className="group bg-primary text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/25 flex items-center space-x-2"
            >
              <span>Become a Member</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/events"
              className="group border-2 border-primary text-primary px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-primary hover:text-white hover:scale-105 flex items-center space-x-2"
            >
              <span>View Events</span>
              <Calendar size={20} className="group-hover:rotate-12 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
