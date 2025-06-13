
import React, { useState } from 'react';
import { Lightbulb, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

export const ActivitiesSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'lectures' | 'csr'>('lectures');
  const [currentSlide, setCurrentSlide] = useState(0);

  const guestLectures = [
    {
      title: 'The Art of Leadership in Digital Age',
      speaker: 'John Smith, CEO of TechCorp',
      date: 'June 15, 2024',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop',
      description: 'Learn how to lead effectively in the digital transformation era with insights from industry leaders.',
    },
    {
      title: 'Building Inclusive Workplaces',
      speaker: 'Maria Rodriguez, Diversity Expert',
      date: 'June 22, 2024',
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop',
      description: 'Strategies for creating diverse and inclusive work environments that foster innovation and growth.',
    },
    {
      title: 'Mental Health in Corporate Settings',
      speaker: 'Dr. Lisa Chen, Psychologist',
      date: 'July 8, 2024',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop',
      description: 'Understanding and addressing mental health challenges in modern workplace environments.',
    },
  ];

  const csrActivities = [
    {
      title: 'Community Education Initiative',
      impact: '500+ students reached',
      date: 'May 2024',
      image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=600&h=400&fit=crop',
      description: 'Providing free career guidance and skill development workshops to underprivileged students.',
    },
    {
      title: 'Environmental Cleanup Drive',
      impact: '2000+ trees planted',
      date: 'April 2024',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop',
      description: 'Organizing community cleanup events and tree plantation drives for environmental conservation.',
    },
    {
      title: 'Senior Care Support Program',
      impact: '200+ seniors helped',
      date: 'March 2024',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop',
      description: 'Providing healthcare support and companionship to elderly community members.',
    },
  ];

  const currentData = activeCategory === 'lectures' ? guestLectures : csrActivities;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % currentData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + currentData.length) % currentData.length);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-primary bg-clip-text text-transparent">
            Our Activities
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our diverse range of activities including expert guest lectures and meaningful CSR initiatives that make a positive impact.
          </p>
        </div>

        {/* Category Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-accent/50 rounded-full p-1 flex">
            <button
              onClick={() => {
                setActiveCategory('lectures');
                setCurrentSlide(0);
              }}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center space-x-2 ${
                activeCategory === 'lectures'
                  ? 'bg-secondary text-white shadow-lg'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <Lightbulb size={20} />
              <span>Guest Lectures</span>
            </button>
            <button
              onClick={() => {
                setActiveCategory('csr');
                setCurrentSlide(0);
              }}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center space-x-2 ${
                activeCategory === 'csr'
                  ? 'bg-secondary text-white shadow-lg'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <Heart size={20} />
              <span>CSR Activities</span>
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {currentData.map((item, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="bg-card rounded-2xl overflow-hidden shadow-xl border border-border mx-4">
                    <div className="md:flex">
                      <div className="md:w-1/2">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-64 md:h-full object-cover"
                        />
                      </div>
                      <div className="md:w-1/2 p-8 flex flex-col justify-center">
                        <div className="mb-4">
                          <span className="text-sm text-primary font-semibold">
                            {activeCategory === 'lectures' ? 'Guest Lecture' : 'CSR Initiative'}
                          </span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-card-foreground">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                          {item.description}
                        </p>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            <span className="font-semibold">
                              {activeCategory === 'lectures' ? 'Speaker:' : 'Impact:'}
                            </span>{' '}
                            {activeCategory === 'lectures' ? (item as any).speaker : (item as any).impact}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-semibold">Date:</span> {item.date}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft size={24} className="text-primary" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronRight size={24} className="text-primary" />
          </button>

          {/* Pagination Dots */}
          <div className="flex justify-center space-x-2 mt-8">
            {currentData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">25+</div>
            <p className="text-muted-foreground">Expert Speakers</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">10,000+</div>
            <p className="text-muted-foreground">Lives Impacted</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-pink-600 mb-2">50+</div>
            <p className="text-muted-foreground">Community Projects</p>
          </div>
        </div>
      </div>
    </section>
  );
};
