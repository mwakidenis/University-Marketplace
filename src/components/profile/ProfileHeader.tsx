
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileHeaderProps {
  displayName: string;
  email: string | null;
  phone: string | null;
  joinedDate: string;
  university: string | null;
  avatarUrl: string | null;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  onSignOut: () => void;
}

const ProfileHeader = ({
  displayName,
  email,
  phone,
  joinedDate,
  university,
  avatarUrl,
  isEditing,
  setIsEditing,
  onSignOut
}: ProfileHeaderProps) => {
  const initialLetter = displayName.charAt(0).toUpperCase();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white dark:border-gray-700 dark:bg-gray-900"
    >
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={displayName} />
          ) : (
            <AvatarFallback className="bg-white text-marketplace-purple text-xl font-bold">
              {initialLetter}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <h1 className="text-3xl font-bold">{displayName}</h1>
            {university && <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-sm">✨ {university}</span>}
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-white/90">
            {email && (
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4 text-white" />
                <span>{email}</span>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4 text-white" />
                <span>{phone}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-white" />
              <span>Joined {joinedDate}</span>
            </div>
            {university && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-white" />
                <span>{university}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          {isEditing ? (
            <Button variant="secondary" onClick={() => setIsEditing(false)} className="font-medium">
              Cancel
            </Button>
          ) : (
            <Button variant="secondary" onClick={() => setIsEditing(true)} className="font-medium">
              ✏️ Edit Profile
            </Button>
          )}
          
          <Button variant="outline" onClick={onSignOut} className="bg-transparent border-white text-white hover:bg-white/10">
            🚪 Log Out
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;
