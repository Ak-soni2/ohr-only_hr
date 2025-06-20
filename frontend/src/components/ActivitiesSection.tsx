import React, { useState, useEffect } from 'react';
import { Lightbulb, Heart, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { getImageUrl } from '../utils/image';

interface Activity {
  _id: string;
  title: string;
  type: 'lecture' | 'csr';
  description: string;
  date: string;
  image: string;
  speaker?: string;
  position?: string;
  impact?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const ActivitiesSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'lectures' | 'csr'>('lectures');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching activities...');

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/activities`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        console.log('Response status:', response.status);
        const contentType = response.headers.get("content-type");
        console.log('Content-Type:', contentType);

        if (!response.ok) {
          throw new Error(`Failed to fetch activities: ${response.status}`);
        }

        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received non-JSON response from server");
        }

        const responseText = await response.text();
        console.log('Raw response:', responseText);

        const result = JSON.parse(responseText);
        console.log('Parsed response:', result);

        if (!result.success) {
          throw new Error(result.message || 'Failed to fetch activities');
        }

        const activities = Array.isArray(result.data) ? result.data : [];
        console.log('Setting activities:', activities);
        setActivities(activities);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const currentData = activities.filter(activity => 
    activeCategory === 'lectures' ? activity.type === 'lecture' : activity.type === 'csr'
  );

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % currentData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + currentData.length) % currentData.length);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-background to-accent/20">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading activities...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-b from-background to-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

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
            {currentData.length === 0 ? (
              <div className="bg-card rounded-2xl overflow-hidden shadow-xl border border-border p-8 text-center">
                <p className="text-muted-foreground">
                  No {activeCategory === 'lectures' ? 'guest lectures' : 'CSR activities'} available at the moment.
                </p>
              </div>
            ) : (
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {currentData.map((item) => (
                  <div key={item._id} className="w-full flex-shrink-0">
                    <div className="bg-card rounded-2xl overflow-hidden shadow-xl border border-border mx-4">
                      <div className="md:flex">
                        <div className="md:w-1/2">
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.title}
                            className="w-full h-64 md:h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder.svg';
                            }}
                          />
                        </div>
                        <div className="md:w-1/2 p-8 flex flex-col justify-center">
                          <div className="mb-4">
                            <span className="text-sm text-primary font-semibold">
                              {item.type === 'lecture' ? 'Guest Lecture' : 'CSR Initiative'}
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
                                {item.type === 'lecture' ? 'Speaker:' : 'Impact:'}
                              </span>{' '}
                              {item.type === 'lecture' ? item.speaker : item.impact}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-semibold">Date:</span>{' '}
                              {new Date(item.date).toLocaleDateString('en-US', { 
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {currentData.length > 1 && (
            <>
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
            </>
          )}
        </div>

        {/* Statistics */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
              {activities.filter(a => a.type === 'lecture').length}+
            </div>
            <p className="text-muted-foreground">Expert Speakers</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">              {activities.filter(a => a.type === 'csr').reduce((sum, activity) => {
                const impactNumber = parseInt(activity.impact || '0');
                return sum + impactNumber;
              }, 0)}+
            </div>
            <p className="text-muted-foreground">Lives Impacted</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
              {activities.length}+
            </div>
            <p className="text-muted-foreground">Total Activities</p>
          </div>
        </div>
      </div>
    </section>
  );
};
