import { useState, useEffect } from 'react';
import { Button } from "./ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Badge } from "./ui/badge"
import { Loader2 } from "lucide-react"
import { useToast } from "../hooks/use-toast"
import { getImageUrl } from '../utils/image';

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
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    type: 'lecture' as const,
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
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:8080/api/activities', {
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

      const { success, data, message } = await response.json();
      if (!success) {
        throw new Error(message || 'Failed to fetch activities');
      }
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
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
      const token = localStorage.getItem('adminToken');
      const url = `http://localhost:8080/api/activities${selectedActivity ? `/${selectedActivity._id}` : ''}`;
      const method = selectedActivity ? 'PUT' : 'POST';

      // Create FormData object
      const form = new FormData();
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value) form.append(key, value);
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to save activity');
      }

      toast({
        title: "Success",
        description: result.message || `Activity ${selectedActivity ? 'updated' : 'created'} successfully`,
      });

      // Reset form
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
      setImageFile(null);
      setSelectedActivity(null);

      // Refresh activities list
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
      const response = await fetch(`http://localhost:8080/api/activities/${id}`, {
        method: 'DELETE',
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
          <CardTitle>{selectedActivity ? 'Edit Activity' : 'Create New Activity'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
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
                    <SelectItem value="lecture">Lecture</SelectItem>
                    <SelectItem value="csr">CSR</SelectItem>
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
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                  required={!selectedActivity}
                />
              </div>
              {formData.type === 'lecture' ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="speaker">Speaker</Label>
                    <Input
                      id="speaker"
                      name="speaker"
                      value={formData.speaker}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="impact">Impact</Label>
                  <Input
                    id="impact"
                    name="impact"
                    value={formData.impact}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}
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
            <div className="flex justify-end space-x-2">
              {selectedActivity && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedActivity(null);
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
                    setImageFile(null);
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : selectedActivity ? (
                  'Update Activity'
                ) : (
                  'Create Activity'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activities List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : activities.length === 0 ? (
            <p className="text-center text-muted-foreground">No activities found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activities.map((activity) => (
                <Card key={activity._id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{activity.title}</CardTitle>
                    <Badge>{activity.type}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="aspect-video relative overflow-hidden rounded-md">
                      <img
                        src={getImageUrl(activity.image)}
                        alt={activity.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-sm">Date: {activity.date}</p>
                    {activity.type === 'lecture' ? (
                      <>
                        <p className="text-sm">Speaker: {activity.speaker}</p>
                        <p className="text-sm">Position: {activity.position}</p>
                      </>
                    ) : (
                      <p className="text-sm">Impact: {activity.impact}</p>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
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
