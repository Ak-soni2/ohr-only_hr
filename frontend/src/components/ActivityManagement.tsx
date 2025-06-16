import { useState, useEffect } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface Activity {
  _id: string;
  title: string;
  type: 'lecture' | 'csr';
  description: string;
  image: string;
  date: string;
  speaker?: string;
  position?: string;
  impact?: string;
}

export function ActivityManagement() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    type: 'lecture',
    description: '',
    image: '',
    date: '',
    speaker: '',
    position: '',
    impact: ''
  });

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');      const response = await fetch('http://localhost:8080/api/activities', {
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
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response from server");
      }

      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch activities",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      type: value as 'lecture' | 'csr',
      // Reset type-specific fields
      speaker: '',
      position: '',
      impact: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');      const url = `http://localhost:8080/api/activities${selectedActivity ? `/${selectedActivity._id}` : ''}`;
      const method = selectedActivity ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response from server");
      }

      await response.json();
      
      toast({
        title: "Success",
        description: `Activity ${selectedActivity ? 'updated' : 'created'} successfully`,
      });

      // Reset form and refresh activities
      setFormData({
        title: '',
        type: 'lecture',
        description: '',
        image: '',
        date: '',
        speaker: '',
        position: '',
        impact: ''
      });
      setSelectedActivity(null);
      fetchActivities();
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save activity",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (activity: Activity) => {
    setSelectedActivity(activity);
    setFormData({
      title: activity.title,
      type: activity.type,
      description: activity.description,
      image: activity.image,
      date: activity.date,
      speaker: activity.speaker || '',
      position: activity.position || '',
      impact: activity.impact || ''
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:8081/api/activities/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Success",
        description: "Activity deleted successfully",
      });

      fetchActivities();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete activity",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{selectedActivity ? 'Edit Activity' : 'Add New Activity'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="title"
                placeholder="Activity Title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              <Select
                value={formData.type}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lecture">Guest Lecture</SelectItem>
                  <SelectItem value="csr">CSR Activity</SelectItem>
                </SelectContent>
              </Select>
              <Input
                name="image"
                placeholder="Image URL"
                value={formData.image}
                onChange={handleInputChange}
                required
              />
              <Input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
              {formData.type === 'lecture' && (
                <>
                  <Input
                    name="speaker"
                    placeholder="Speaker Name"
                    value={formData.speaker}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="position"
                    placeholder="Speaker Position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                  />
                </>
              )}
              {formData.type === 'csr' && (
                <Input
                  name="impact"
                  placeholder="Impact (e.g., '500+ students reached')"
                  value={formData.impact}
                  onChange={handleInputChange}
                  required
                />
              )}
            </div>
            <Textarea
              name="description"
              placeholder="Activity Description (max 50 words)"
              value={formData.description}
              onChange={handleInputChange}
              className="min-h-[100px]"
              required
              maxLength={300}
            />
            <div className="flex justify-end space-x-2">
              {selectedActivity && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedActivity(null)}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : selectedActivity ? 'Update' : 'Add'} Activity
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities.map(activity => (
              <Card key={activity._id}>
                <CardContent className="p-4">
                  {activity.image && (
                    <img
                      src={activity.image}
                      alt={activity.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="font-semibold text-lg">{activity.title}</h3>
                  <p className="text-primary font-medium">{activity.type === 'lecture' ? 'Guest Lecture' : 'CSR Activity'}</p>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{activity.description}</p>
                  {activity.type === 'lecture' && activity.speaker && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Speaker: {activity.speaker}</p>
                      <p className="text-sm text-muted-foreground">{activity.position}</p>
                    </div>
                  )}
                  {activity.type === 'csr' && activity.impact && (
                    <p className="text-sm font-medium mt-2">Impact: {activity.impact}</p>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">
                    Date: {new Date(activity.date).toLocaleDateString()}
                  </p>
                  <div className="mt-4 space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(activity)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(activity._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
