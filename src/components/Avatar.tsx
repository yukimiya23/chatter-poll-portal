import React from 'react';

interface AvatarProps {
  username: string;
}

const Avatar: React.FC<AvatarProps> = ({ username }) => {
  const initials = username.slice(0, 2).toUpperCase();
  const color = `hsl(${username.charCodeAt(0) * 10}, 70%, 50%)`;

  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold mx-2"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
};

export default Avatar;