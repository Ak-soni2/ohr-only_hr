import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowLeft, Star, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { getImageUrl } from '../utils/image';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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

const registrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  designation: z.string().min(2, "Designation must be at least 2 characters"),
  phoneNumber: z.string().regex(/^\+?[\d\s-]{8,}$/, "Please enter a valid phone number")
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      companyName: "",
      designation: "",
      phoneNumber: ""
    }
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/events/${id}`);
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

  const handleRegistration = async (data: RegistrationFormData) => {
    if (!event?._id) return;
    setIsRegistering(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/registrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          eventId: event._id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register for the event');
      }

      toast({
        title: "Success!",
        description: "You have successfully registered for this event.",
      });
      setDialogOpen(false);
      form.reset();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to register for the event',
      });
    } finally {
      setIsRegistering(false);
    }
  };

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
          src={getImageUrl(event.image)}
          alt={event.name}
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
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
              <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
                <h2 className="text-2xl font-semibold mb-6">Event Description</h2>
                {paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>

              {event.agenda && event.agenda.length > 0 && (
                <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
                  <h2 className="text-2xl font-semibold mb-6">Event Agenda</h2>
                  <div className="space-y-6">
                    {event.agenda.map((item) => (
                      <div key={item._id} className="flex gap-4">
                        <div className="w-24 flex-shrink-0">
                          <span className="text-primary font-medium">{item.time}</span>
                        </div>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
                <h3 className="text-lg font-semibold mb-4">Event Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="w-5 h-5 mr-3 text-primary" />
                    <span>{format(new Date(event.date), 'MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="w-5 h-5 mr-3 text-primary" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-5 h-5 mr-3 text-primary" />
                    <span>{event.location}</span>
                  </div>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full mt-4">Register Now</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Register for {event.name}</DialogTitle>
                        <DialogDescription>
                          Fill out the form below to register for this event.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleRegistration)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="john@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Company Ltd." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="designation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Designation</FormLabel>
                                <FormControl>
                                  <Input placeholder="Software Engineer" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="+1234567890" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" className="w-full" disabled={isRegistering}>
                            {isRegistering ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Registering...
                              </>
                            ) : (
                              'Register'
                            )}
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
                <h3 className="text-lg font-semibold mb-4">About the Speaker</h3>
                <div className="space-y-4">
                  <h4 className="font-medium">{event.speaker.name}</h4>
                  <p className="text-sm text-muted-foreground">{event.speaker.bio}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};