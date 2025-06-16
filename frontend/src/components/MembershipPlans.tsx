
import React from 'react';
import { Check, Star, Crown } from 'lucide-react';

export const MembershipPlans: React.FC = () => {
  const yearlyFeatures = [
    'Access to all monthly events',
    'Networking opportunities',
    'Resource library access',
    'Monthly newsletters',
    'Community forum access',
    'Event recordings',
    'Certificate of participation',
  ];

  const lifetimeFeatures = [
    'All yearly plan benefits',
    'Priority event registration',
    'Exclusive member events',
    'One-on-one mentorship sessions',
    'Career development workshops',
    'Direct access to speakers',
    'Lifetime community access',
    'Guest lecture opportunities',
    'CSR activity participation',
    'Annual gala dinner invitation',
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-primary bg-clip-text text-transparent">
            Membership Plans
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the perfect plan to accelerate your HR career and connect with like-minded professionals.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Yearly Plan */}
          <div className="bg-card rounded-3xl p-8 shadow-xl border border-border hover:shadow-2xl transition-shadow duration-300">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-4">
                <Star size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-card-foreground">Yearly Pass</h3>
              <p className="text-muted-foreground mb-4">Perfect for growing professionals</p>
              <div className="text-4xl font-bold text-card-foreground mb-2">$299</div>
              <p className="text-muted-foreground">per year</p>
            </div>

            <ul className="space-y-4 mb-8">
              {yearlyFeatures.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <Check size={20} className="text-green-500 flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <button className="w-full bg-secondary text-white py-4 px-6 rounded-full font-semibold text-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              Choose Yearly Plan
            </button>
          </div>

          {/* Lifetime Plan */}
          <div className="relative bg-secondary rounded-3xl p-8 shadow-xl text-white hover:shadow-2xl transition-shadow duration-300">
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full text-sm font-bold">
                Most Popular
              </span>
            </div>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <Crown size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Lifetime Pass</h3>
              <p className="text-white/80 mb-4">For serious HR professionals</p>
              <div className="text-4xl font-bold mb-2">$899</div>
              <p className="text-white/80">one-time payment</p>
              <div className="mt-2">
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  Save $1,500+ over 5 years
                </span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {lifetimeFeatures.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <Check size={20} className="text-green-300 flex-shrink-0" />
                  <span className="text-white/90">{feature}</span>
                </li>
              ))}
            </ul>

            <button className="w-full bg-white text-primary py-4 px-6 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              Choose Lifetime Plan
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
              <h3 className="text-lg font-semibold mb-2 text-card-foreground">
                Can I upgrade from yearly to lifetime membership?
              </h3>
              <p className="text-muted-foreground">
                Yes! You can upgrade at any time. We'll credit your remaining yearly membership value towards the lifetime plan.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
              <h3 className="text-lg font-semibold mb-2 text-card-foreground">
                What happens if I miss an event?
              </h3>
              <p className="text-muted-foreground">
                All events are recorded and made available to members. You'll have access to our complete library of past events.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
              <h3 className="text-lg font-semibold mb-2 text-card-foreground">
                Is there a refund policy?
              </h3>
              <p className="text-muted-foreground">
                We offer a 30-day money-back guarantee for both plans. If you're not satisfied, we'll provide a full refund.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
