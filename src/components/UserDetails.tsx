import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const UserDetails: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const { updateUserDetails, getUserDetails } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const details = await getUserDetails();
      if (details) {
        setFirstName(details.firstName);
        setLastName(details.lastName);
        setNickname(details.nickname);
        setAvatar(details.avatar);
      }
    };
    fetchUserDetails();
  }, [getUserDetails]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserDetails({ firstName, lastName, nickname, avatar });
    navigate('/');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white">User Details</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center">
            <Avatar className="w-24 h-24 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              {avatar ? (
                <AvatarImage src={avatar} alt="User avatar" />
              ) : (
                <AvatarFallback>{nickname?.charAt(0) || 'U'}</AvatarFallback>
              )}
            </Avatar>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
            <Button type="button" variant="outline" size="sm" className="mt-2 bg-purple-500 text-white hover:bg-purple-600" onClick={() => fileInputRef.current?.click()}>
              Upload Avatar
            </Button>
          </div>
          <Input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Input
            type="text"
            placeholder="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button type="submit" className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md transition duration-200">
            Save Details
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UserDetails;