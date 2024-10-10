import React from 'react';

interface AvatarProps {
  username: string;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ username, size = 8 }) => {
  const avatarUrl = `https://api.dicebear.com/6.x/initials/svg?seed=${username}`;

  return (
    <img
      src={avatarUrl}
      alt={username}
      className={`w-${size} h-${size} rounded-full`}
    />
  );
};

export default Avatar;