import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface UserListProps {
  onClose: () => void;
}

const UserList: React.FC<UserListProps> = ({ onClose }) => {
  const { users } = useAuth();

  return (
    <div className="fixed inset-0 bg-[#E2F1E7] overflow-y-auto">
      <Card className="w-full h-full max-w-3xl mx-auto p-6 bg-[#243642] text-[#E2F1E7]">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-3xl font-bold">Online Users</CardTitle>
          <Button onClick={onClose} variant="outline" size="lg" className="bg-[#387478] text-[#E2F1E7] hover:bg-[#629584]">Close</Button>
        </CardHeader>
        <CardContent className="mt-8">
          <ul className="space-y-4">
            {users.map((user, index) => (
              <li key={index} className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                <span className="text-lg">{user.username}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserList;