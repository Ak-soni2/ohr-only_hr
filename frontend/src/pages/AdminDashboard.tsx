import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { TeamMemberManagement } from '../components/TeamMemberManagement';
import { ActivityManagement } from '../components/ActivityManagement';
import { useToast } from '../components/ui/use-toast';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { LogOut, Plus, Save, X } from 'lucide-react';  // icons for better buttons

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
  agenda: Array<{ time: string; description: string }>;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeTab, setActiveTab] = useState<'events' | 'team' | 'activities'>('events');

  const [formData, setFormData] = useState({
    name: '',
    type: 'monthly',
    speaker: { name: '', bio: '' },
    date: '',
    time: '',
    location: '',
    description: '',
    agenda: [{ time: '', description: '' }],
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchEvents();
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/events');
      const data = await response.json();
      if (response.ok) setEvents(data.data);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch events' });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const url = selectedEvent ? `http://localhost:8080/api/events/${selectedEvent._id}` : 'http://localhost:8080/api/events';
      const method = selectedEvent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({ title: 'Success', description: `Event ${selectedEvent ? 'updated' : 'created'} successfully` });
        resetForm();
        fetchEvents();
      } else {
        toast({ variant: 'destructive', title: 'Error', description: data.message || 'Failed to save event' });
      }
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to connect to server' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:8080/api/events/${eventId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast({ title: 'Success', description: 'Event deleted successfully' });
        fetchEvents();
      } else {
        const data = await response.json();
        toast({ variant: 'destructive', title: 'Error', description: data.message || 'Failed to delete event' });
      }
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to connect to server' });
    }
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setFormData({
      name: event.name,
      type: event.type,
      speaker: event.speaker,
      date: event.date.split('T')[0],
      time: event.time,
      location: event.location,
      description: event.description,
      agenda: event.agenda,
    });
  };

  const resetForm = () => {
    setSelectedEvent(null);
    setFormData({
      name: '',
      type: 'monthly',
      speaker: { name: '', bio: '' },
      date: '',
      time: '',
      location: '',
      description: '',
      agenda: [{ time: '', description: '' }],
    });
  };

  const addAgendaItem = () => {
    setFormData({ ...formData, agenda: [...formData.agenda, { time: '', description: '' }] });
  };

  const removeAgendaItem = (index: number) => {
    setFormData({ ...formData, agenda: formData.agenda.filter((_, i) => i !== index) });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  return (
    <div className="container mx-auto p-6 bg-green-50 min-h-screen rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-700">Admin Dashboard</h1>
        <Button onClick={handleLogout} variant="destructive" className="flex items-center gap-2">
          <LogOut size={18} /> Logout
        </Button>
      </div>

      <Card className="border-green-400">
        <CardContent>
          <Tabs defaultValue="events" onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
            <TabsList className="mb-4 bg-green-100">
              <TabsTrigger value="events" className="data-[state=active]:bg-green-400 data-[state=active]:text-white">
                Events
              </TabsTrigger>
              <TabsTrigger value="team" className="data-[state=active]:bg-green-400 data-[state=active]:text-white">
                Team
              </TabsTrigger>
              <TabsTrigger value="activities" className="data-[state=active]:bg-green-400 data-[state=active]:text-white">
                Activities
              </TabsTrigger>
            </TabsList>

            <TabsContent value="events">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-green-300">
                  <CardHeader>
                    <CardTitle>{selectedEvent ? 'Edit Event' : 'Create New Event'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <label className="block">
                        <span className="text-sm font-medium text-gray-700">Event Name</span>
                        <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                      </label>
                      <Select value={formData.type} onValueChange={(value: 'monthly' | 'foundation') => setFormData({ ...formData, type: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly Event</SelectItem>
                          <SelectItem value="foundation">Foundation Event</SelectItem>
                        </SelectContent>
                      </Select>
                      <label className="block">
                        <span className="text-sm font-medium text-gray-700">Speaker Name</span>
                        <Input value={formData.speaker.name} onChange={(e) => setFormData({ ...formData, speaker: { ...formData.speaker, name: e.target.value } })} required />
                      </label>
                      <Textarea value={formData.speaker.bio} onChange={(e) => setFormData({ ...formData, speaker: { ...formData.speaker, bio: e.target.value } })} required placeholder="Speaker Bio" />
                      <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                      <Input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} required />
                      <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required placeholder="Location" />
                      <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required placeholder="Description" />

                      {formData.agenda.map((item, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Input type="time" value={item.time} onChange={(e) => {
                            const newAgenda = [...formData.agenda];
                            newAgenda[index].time = e.target.value;
                            setFormData({ ...formData, agenda: newAgenda });
                          }} required />
                          <Input value={item.description} onChange={(e) => {
                            const newAgenda = [...formData.agenda];
                            newAgenda[index].description = e.target.value;
                            setFormData({ ...formData, agenda: newAgenda });
                          }} placeholder="Agenda description" required />
                          {formData.agenda.length > 1 && (
                            <Button type="button" variant="destructive" size="sm" onClick={() => removeAgendaItem(index)}>
                              <X size={16} />
                            </Button>
                          )}
                        </div>
                      ))}

                      <Button type="button" variant="outline" className="mt-2" onClick={addAgendaItem}>
                        <Plus size={16} className="mr-1" /> Add Agenda
                      </Button>

                      <div className="flex gap-3 mt-4">
                        <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white" disabled={isLoading}>
                          <Save size={16} className="mr-1" /> {isLoading ? 'Saving...' : selectedEvent ? 'Update Event' : 'Create Event'}
                        </Button>
                        {selectedEvent && (
                          <Button type="button" variant="outline" onClick={resetForm}>
                            Cancel
                          </Button>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <Card className="border-green-300">
                  <CardHeader>
                    <CardTitle>Existing Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {events.map((event) => (
                        <Card key={event._id} className="p-4 border border-green-200">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-green-700">{event.name}</h3>
                              <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()} at {event.time}</p>
                              <p className="text-sm text-muted-foreground">{event.location}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEdit(event)}>Edit</Button>
                              <Button variant="destructive" size="sm" onClick={() => handleDelete(event._id)}>Delete</Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="team">
              <TeamMemberManagement />
            </TabsContent>

            <TabsContent value="activities">
              <ActivityManagement />
            </TabsContent>

          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
