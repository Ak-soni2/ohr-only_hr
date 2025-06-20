
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Instagram, Twitter, Send } from 'lucide-react';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', message: '' });

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-primary bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions about our events or membership? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-card rounded-2xl p-8 shadow-xl border border-border">
            <h2 className="text-2xl font-bold mb-6 text-card-foreground">Send us a Message</h2>

            {isSubmitted && (
              <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg">
                <p className="text-green-700 dark:text-green-300 font-medium">
                  Thank you for your message! We'll get back to you soon.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-card-foreground mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground transition-colors"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-card-foreground mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground transition-colors resize-vertical"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-secondary text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="bg-card rounded-2xl p-8 shadow-xl border border-border">
              <h2 className="text-2xl font-bold mb-6 text-card-foreground">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-secondary to-blue-900 rounded-lg flex items-center justify-center">
                    <Mail size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">Email</h3>
                    <p className="text-muted-foreground">info@onlyhr.org</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Phone size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">Phone</h3>
                    <p className="text-muted-foreground"> •	JITENDRA PENDSE - 9049995970 </p>
                    <p className="text-muted-foreground"> •	PRASHANT ITHAPE - 9657002289 </p>
                    <p className="text-muted-foreground"> •	PRADEEP TUPE - 9158988263  </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                    <MapPin size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">Address</h3>
                    <p className="text-muted-foreground">Flat No. H2, Suyog Nagar,
                      Off Senapati Bapat Raod,
                      <br />Shivajinagar, Pune – 411016.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-card rounded-2xl p-8 shadow-xl border border-border">
              <h2 className="text-2xl font-bold mb-6 text-card-foreground">Follow Us</h2>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="group w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Instagram size={24} className="text-white" />
                </a>
                <a
                  href="#"
                  className="group w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Twitter size={24} className="text-white" />
                </a>
              </div>
              <p className="text-muted-foreground mt-4 text-sm">
                Stay updated with our latest events and activities by following us on social media.
              </p>
            </div>

            {/* Office Hours */}
            <div className="bg-card rounded-2xl p-8 shadow-xl border border-border">
              <h2 className="text-2xl font-bold mb-6 text-card-foreground">Office Hours</h2>
              <div className="space-y-2 text-muted-foreground">
                <p><span className="font-semibold">Monday - Friday:</span> 9:00 AM - 6:00 PM</p>
                <p><span className="font-semibold">Saturday:</span> 10:00 AM - 4:00 PM</p>
                <p><span className="font-semibold">Sunday:</span> Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
