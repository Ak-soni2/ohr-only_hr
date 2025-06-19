import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { TeamMemberManagement } from '../components/TeamMemberManagement';
import { ActivityManagement } from '../components/ActivityManagement';
import { EventManagement } from '../components/EventManagement';
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
              <EventManagement />
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
