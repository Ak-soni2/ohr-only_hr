import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from './ui/use-toast';

interface TeamMember {
  _id: string;
  name: string;
  position: string;
  type: 'trustee' | 'executive';
  linkedIn: string;
  bio: string;
  image: string;
}

interface TeamMemberFormData {
  name: string;
  position: string;
  type: 'trustee' | 'executive';
  linkedIn: string;
  bio: string;
  image?: File;
}

export const TeamManagement: React.FC = () => {
  const { toast } = useToast();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<TeamMemberFormData>({
    name: '',
    position: '',
    type: 'trustee',
    linkedIn: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/team');
      const data = await response.json();
      if (data.success) {
        setMembers(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch team members:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch team members',
        variant: 'destructive',
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      type: 'trustee',
      linkedIn: '',
      bio: '',
    });
    setPreviewImage('');
    setSelectedMember(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'image') {
          formDataObj.append(key, value as string);
        }
      });

      if (formData.image) {
        formDataObj.append('image', formData.image);
      }

      const url = selectedMember
        ? `http://localhost:8080/api/team/${selectedMember._id}`
        : 'http://localhost:8080/api/team';

      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        method: selectedMember ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataObj,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save team member');
      }

      toast({
        title: `Team member ${selectedMember ? 'updated' : 'added'} successfully!`,
      });

      fetchMembers();
      resetForm();
    } catch (error) {
      console.error('Error saving team member:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setSelectedMember(member);
    setFormData({
      name: member.name,
      position: member.position,
      type: member.type,
      linkedIn: member.linkedIn,
      bio: member.bio,
    });
    setPreviewImage(member.image);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/team/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete team member');
      }

      toast({
        title: 'Team member deleted successfully!',
      });

      fetchMembers();
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete team member',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        {selectedMember ? 'Edit Team Member' : 'Add New Team Member'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Position</label>
          <Input
            required
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'trustee' | 'executive' })}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="trustee">Trustee</option>
            <option value="executive">Executive</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
          <Input
            type="url"
            value={formData.linkedIn}
            onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <Textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="mt-2 max-w-xs h-40 object-cover rounded-md"
            />
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Saving...' : selectedMember ? 'Update' : 'Add'}
          </Button>
        </div>
      </form>

      <div className="mt-12">
        <h3 className="text-xl font-bold mb-4">Team Members</h3>
        <div className="space-y-4">
          {members.map((member) => (
            <div
              key={member._id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center space-x-4">
                {member.image && (
                  <img
                    src={`http://localhost:8080${member.image}`}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <h4 className="font-semibold">{member.name}</h4>
                  <p className="text-sm text-muted-foreground">{member.position}</p>
                </div>
              </div>
              <div className="space-x-2">
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
