import React, { useState, useEffect } from 'react';
import { Instagram, Linkedin } from 'lucide-react';
import { getImageUrl } from '../utils/image';

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

export const TeamSection: React.FC = () => {
  const [activeTeam, setActiveTeam] = useState<'trustee' | 'executive'>('trustee');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/team');
      const data = await response.json();
      if (data.success) {
        setTeamMembers(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentTeam = teamMembers.filter(member => member.type === activeTeam);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p>Loading team members...</p>
      </div>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-primary bg-clip-text text-transparent">
           About Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            OHR is primarily an informal Self Help Group of and for HR professionals including those in IR and allied professions as well as researchers who have passion to do better all the time.
Indian industry has the capability and potential to make a huge contribution in building better India. OHR believes that now HR professionals need to be ready to help industry achieve this goal.
          </p>  
        </div>
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-primary bg-clip-text text-transparent">
            Meet Our Team
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get to know the passionate individuals who make OnlyHR a thriving community for HR professionals worldwide.
          </p>
        </div>

        {/* Team Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-accent/50 rounded-full p-1 flex">
            <button
              onClick={() => setActiveTeam('trustee')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTeam === 'trustee'
                  ? 'bg-secondary text-white shadow-lg'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Trustees
            </button>
            <button
              onClick={() => setActiveTeam('executive')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTeam === 'executive'
                  ? 'bg-secondary text-white shadow-lg'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Executive Team
            </button>
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentTeam.map((member, index) => (
            <div
              key={member._id}
              className="group bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={getImageUrl(member.image) || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`}
                  alt={member.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // Prevent infinite loop
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex space-x-2">
                    {member.instagram && (
                      <a
                        href={member.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                      >
                        <Instagram size={16} className="text-white" />
                      </a>
                    )}
                    {member.linkedIn && (
                      <a
                        href={member.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                      >
                        <Linkedin size={16} className="text-white" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-1 text-card-foreground">{member.name}</h3>
                <p className="text-primary font-medium mb-2">{member.position}</p>
                <p className="text-muted-foreground text-sm line-clamp-2">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
