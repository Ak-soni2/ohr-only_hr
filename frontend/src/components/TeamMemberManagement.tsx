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

interface TeamMember {
  _id: string;
  name: string;
  position: string;
  type: 'trustee' | 'executive';
  linkedIn: string;
  instagram: string;
  bio: string;
  image: string;
}

export function TeamMemberManagement() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    type: 'trustee',
    linkedIn: '',
    instagram: '',
    bio: '',
    image: ''
  });

  const getAuthToken = () => {
    return localStorage.getItem('adminToken');
  };

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/team');
      const data = await response.json();
      if (data.success) {
        setTeamMembers(data.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch team members",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value as 'trustee' | 'executive' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = getAuthToken();
    if (!token) {
      toast({
        title: "Error",
        description: "You must be logged in to perform this action",
        variant: "destructive"
      });
      return;
    }

    try {
      const method = selectedMember ? 'PUT' : 'POST';
      const url = selectedMember 
        ? `http://localhost:8080/api/team/${selectedMember._id}`
        : 'http://localhost:8080/api/team';

      console.log('Sending request with token:', token);  // Debug log
      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);  // Debug log

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error response:', errorData);  // Debug log
        throw new Error(errorData.message || 'Failed to process request');
      }

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: selectedMember 
            ? "Team member updated successfully" 
            : "Team member added successfully"
        });
        fetchTeamMembers();
        resetForm();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Request error:', error);  // Debug log
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return;

    const token = getAuthToken();
    if (!token) {
      toast({
        title: "Error",
        description: "You must be logged in to perform this action",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/team/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete team member');
      }

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Team member deleted successfully"
        });
        fetchTeamMembers();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Delete error:', error);  // Debug log
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete team member",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (member: TeamMember) => {
    setSelectedMember(member);
    setFormData({
      name: member.name,
      position: member.position,
      type: member.type,
      linkedIn: member.linkedIn || '',
      instagram: member.instagram || '',
      bio: member.bio || '',
      image: member.image || ''
    });
  };

  const resetForm = () => {
    setSelectedMember(null);
    setFormData({
      name: '',
      position: '',
      type: 'trustee',
      linkedIn: '',
      instagram: '',
      bio: '',
      image: ''
    });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{selectedMember ? 'Edit Team Member' : 'Add New Team Member'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
              />
              <Input
                name="position"
                placeholder="Position"
                value={formData.position}
                onChange={handleInputChange}
              />
              <Select
                value={formData.type}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trustee">Trustee</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                </SelectContent>
              </Select>
              <Input
                name="linkedIn"
                placeholder="LinkedIn URL"
                value={formData.linkedIn}
                onChange={handleInputChange}
              />
              <Input
                name="instagram"
                placeholder="Instagram URL"
                value={formData.instagram}
                onChange={handleInputChange}
              />
              <Input
                name="image"
                placeholder="Image URL"
                value={formData.image}
                onChange={handleInputChange}
              />
            </div>
            <Textarea
              name="bio"
              placeholder="Bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="min-h-[100px]"
            />
            <div className="flex justify-end space-x-2">
              {selectedMember && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit">
                {selectedMember ? 'Update' : 'Add'} Team Member
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map(member => (
              <Card key={member._id}>
                <CardContent className="p-4">
                  {member.image && (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-muted-foreground">{member.position}</p>
                  <p className="text-sm text-muted-foreground mt-1">Type: {member.type}</p>
                  <div className="mt-4 space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(member)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(member._id)}
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
