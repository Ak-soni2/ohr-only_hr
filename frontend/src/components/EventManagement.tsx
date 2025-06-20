import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useToast } from "../hooks/use-toast";
import { getImageUrl } from '../utils/image';

interface AgendaItem {
  time: string;
  description: string;
}

interface Event {
  _id: string;
  name: string;
  type: 'monthly' | 'foundation';
  speaker: {
    name: string;
    bio: string;
  };
  date: string;
  time: string;
  location: string;
  description: string;
  agenda: AgendaItem[];
  image?: string;
}

export function EventManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'monthly' as 'monthly' | 'foundation',
    speaker: {
      name: '',
      bio: ''
    },
    date: '',
    time: '',
    location: '',
    description: '',
    agenda: [] as AgendaItem[],
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/events`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setEvents(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch events');
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch events",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('speaker.')) {
      const speakerField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        speaker: {
          ...prev.speaker,
          [speakerField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      type: value as 'monthly' | 'foundation'
    }));
  };

  const handleAgendaChange = (index: number, field: keyof AgendaItem, value: string) => {
    setFormData(prev => ({
      ...prev,
      agenda: prev.agenda.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addAgendaItem = () => {
    setFormData(prev => ({
      ...prev,
      agenda: [...prev.agenda, { time: '', description: '' }]
    }));
  };

  const removeAgendaItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      agenda: prev.agenda.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const url = `${import.meta.env.VITE_API_URL}/api/events${selectedEvent ? `/${selectedEvent._id}` : ''}`;
      const method = selectedEvent ? 'PUT' : 'POST';

      // Create FormData object
      const form = new FormData();
      
      // Format date for backend
      const formattedDate = new Date(formData.date).toISOString();

      // Add all form fields
      const dataToSend = {
        ...formData,
        date: formattedDate
      };

      // Add each field to FormData
      Object.entries(dataToSend).forEach(([key, value]) => {
        if (key === 'agenda' || key === 'speaker') {
          // Convert objects to JSON strings
          form.append(key, JSON.stringify(value));
        } else {
          form.append(key, value.toString());
        }
      });

      // Add image if selected
      if (imageFile) {
        form.append('image', imageFile);
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: form
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to save event');
      }

      toast({
        title: "Success",
        description: `Event ${selectedEvent ? 'updated' : 'created'} successfully`,
      });

      // Reset form
      setFormData({
        name: '',
        type: 'monthly',
        speaker: {
          name: '',
          bio: ''
        },
        date: '',
        time: '',
        location: '',
        description: '',
        agenda: [],
      });
      setImageFile(null);
      setSelectedEvent(null);

      // Refresh events list
      fetchEvents();
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save event",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setFormData({
      name: event.name,
      type: event.type,
      speaker: event.speaker,
      date: event.date.split('T')[0], // Format date for input
      time: event.time,
      location: event.location,
      description: event.description,
      agenda: event.agenda || [],
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to delete event');
      }

      toast({
        title: "Success",
        description: "Event deleted successfully",
      });

      // Refresh events list
      fetchEvents();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete event",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{selectedEvent ? 'Edit Event' : 'Create New Event'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Event Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={handleTypeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly Event</SelectItem>
                    <SelectItem value="foundation">Foundation Day Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Event Image</Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                  required={!selectedEvent}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="speaker.name">Speaker Name</Label>
                <Input
                  id="speaker.name"
                  name="speaker.name"
                  value={formData.speaker.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="speaker.bio">Speaker Bio</Label>
                <Input
                  id="speaker.bio"
                  name="speaker.bio"
                  value={formData.speaker.bio}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Agenda Items</Label>
                <Button type="button" variant="outline" onClick={addAgendaItem}>
                  Add Agenda Item
                </Button>
              </div>
              {formData.agenda.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor={`agenda-time-${index}`}>Time</Label>
                    <Input
                      id={`agenda-time-${index}`}
                      value={item.time}
                      onChange={(e) => handleAgendaChange(index, 'time', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`agenda-description-${index}`}>Description</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`agenda-description-${index}`}
                        value={item.description}
                        onChange={(e) => handleAgendaChange(index, 'description', e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeAgendaItem(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-2">
              {selectedEvent && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedEvent(null);
                    setFormData({
                      name: '',
                      type: 'monthly',
                      speaker: {
                        name: '',
                        bio: ''
                      },
                      date: '',
                      time: '',
                      location: '',
                      description: '',
                      agenda: [],
                    });
                    setImageFile(null);
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : selectedEvent ? (
                  'Update Event'
                ) : (
                  'Create Event'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Events List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : events.length === 0 ? (
            <p className="text-center text-muted-foreground">No events found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event) => (
                <Card key={event._id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{event.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="aspect-video relative overflow-hidden rounded-md">
                      <img
                        src={getImageUrl(event.image)}
                        alt={event.name}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                    <p className="text-sm">Date: {format(new Date(event.date), 'MMMM d, yyyy')}</p>
                    <p className="text-sm">Time: {event.time}</p>
                    <p className="text-sm">Location: {event.location}</p>
                    <p className="text-sm">Speaker: {event.speaker.name}</p>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(event)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(event._id)}
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
