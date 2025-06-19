import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from './ui/use-toast';
import { getImageUrl } from '../utils/image';

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

export const TeamMemberManagement: React.FC = () => {
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
  const [previewImage, setPreviewImage] = useState<string>('');  const fetchMembers = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/team`);
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
  }, [toast]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

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
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'image' && value) {
          formDataObj.append(key, value);
        }
      });
      
      // Add image if present
      if (formData.image) {
        formDataObj.append('image', formData.image);
      }

      // Get the admin token from localStorage
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        throw new Error('Authentication required');
      }

      const url = selectedMember
        ? `${import.meta.env.VITE_API_URL}/api/team/${selectedMember._id}`
        : `${import.meta.env.VITE_API_URL}/api/team`;

      const response = await fetch(url, {
        method: selectedMember ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        },
        body: formDataObj
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save team member');
      }

      toast({
        title: 'Success',
        description: selectedMember ? 'Team member updated' : 'Team member created',
      });

      // Refresh the list and reset the form
      await fetchMembers();
      resetForm();
      
    } catch (error) {
      console.error('Error saving team member:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save team member',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Team Member Management</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block mb-2">Name:</label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        
        <div>
          <label className="block mb-2">Position:</label>
          <Input
            type="text"
            value={formData.position}
            onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
            required
          />
        </div>
        
        <div>
          <label className="block mb-2">Type:</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'trustee' | 'executive' }))}
            className="w-full p-2 border rounded"
            required
          >
            <option value="trustee">Trustee</option>
            <option value="executive">Executive</option>
          </select>
        </div>
        
        <div>
          <label className="block mb-2">LinkedIn URL:</label>
          <Input
            type="url"
            value={formData.linkedIn}
            onChange={(e) => setFormData(prev => ({ ...prev, linkedIn: e.target.value }))}
          />
        </div>
        
        <div>
          <label className="block mb-2">Bio:</label>
          <Textarea
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            rows={4}
          />
        </div>
        
        <div>
          <label className="block mb-2">Image:</label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-2"
          />
          {(previewImage || selectedMember?.image) && (
            <img
              src={previewImage || getImageUrl(selectedMember?.image)}
              alt="Preview"
              className="w-32 h-32 object-cover rounded"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'Team Member')}&background=random`;
              }}
            />
          )}
        </div>
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : (selectedMember ? 'Update' : 'Create')}
        </Button>
        
        {selectedMember && (
          <Button type="button" variant="outline" onClick={resetForm} className="ml-2">
            Cancel Edit
          </Button>
        )}
      </form>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <div key={member._id} className="border p-4 rounded">
            <img
              src={getImageUrl(member.image) || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`}
              alt={member.name}
              className="w-full h-48 object-cover mb-4 rounded"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`;
              }}
            />
            <h3 className="font-bold">{member.name}</h3>
            <p className="text-gray-600">{member.position}</p>
            <p className="text-sm text-gray-500">{member.type}</p>
            
            <div className="mt-4 space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSelectedMember(member);
                  setFormData({
                    name: member.name,
                    position: member.position,
                    type: member.type,
                    linkedIn: member.linkedIn,
                    bio: member.bio
                  });
                  if (member.image) {
                    setPreviewImage(getImageUrl(member.image));
                  }
                }}
              >
                Edit
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={async () => {
                  if (!window.confirm('Are you sure you want to delete this team member?')) {
                    return;
                  }
                  
                  try {
                    const adminToken = localStorage.getItem('adminToken');
                    if (!adminToken) {
                      throw new Error('Authentication required');
                    }

                    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/team/${member._id}`, {
                      method: 'DELETE',
                      headers: {
                        'Authorization': `Bearer ${adminToken}`
                      }
                    });

                    if (!response.ok) {
                      throw new Error('Failed to delete team member');
                    }

                    toast({
                      title: 'Success',
                      description: 'Team member deleted',
                    });

                    await fetchMembers();
                  } catch (error) {
                    console.error('Error deleting team member:', error);
                    toast({
                      title: 'Error',
                      description: 'Failed to delete team member',
                      variant: 'destructive',
                    });
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
