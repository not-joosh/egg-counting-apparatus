import { Bell, Users, QrCode, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

interface BottomNavProps {
  user: UserType;
  onScanQR: () => void;
}

interface UserType {
  id: string;
  displayName: string;
  role: 'manager' | 'worker';
  avatarUrl?: string;
}

const dummyUsers: UserType[] = [
  {
    id: 'user001',
    displayName: 'John Doe',
    role: 'manager',
    avatarUrl: '/placeholder.svg?height=32&width=32',
  },
  {
    id: 'user002',
    displayName: 'Jane Smith',
    role: 'worker',
    avatarUrl: '/placeholder.svg?height=32&width=32',
  },
  {
    id: 'user003',
    displayName: 'Bob Johnson',
    role: 'worker',
  },
  {
    id: 'user004',
    displayName: 'Alice Williams',
    role: 'manager',
    avatarUrl: '/placeholder.svg?height=32&width=32',
  },
  {
    id: 'user005',
    displayName: 'Charlie Brown',
    role: 'worker',
    avatarUrl: '/placeholder.svg?height=32&width=32',
  },
];

const getCurrentUser = (): UserType => {
  // In a real app, this would fetch the current user from an authentication system
  // For now, we'll just return the first user in our dummy data
  return dummyUsers[0];
};

export const BottomNav = ({ user, onScanQR }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2">
      <div className="flex justify-between items-center max-w-md mx-auto">
        <Link to="/notifications">
          <Button variant="ghost" size="icon" className="flex-col">
            <Bell className="h-6 w-6" />
            <span className="sr-only">Notifications</span>
          </Button>
        </Link>
        <Link to="/members">
          <Button variant="ghost" size="icon" className="flex-col">
            <Users className="h-6 w-6" />
            <span className="sr-only">Members</span>
          </Button>
        </Link>
        <Button variant="default" size="icon" className="rounded-full" onClick={onScanQR}>
          <QrCode className="h-6 w-6" />
          <span className="sr-only">Scan QR</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="flex-col">
              <Avatar className="h-8 w-8">
                {user.avatarUrl ? (
                  <AvatarImage src={user.avatarUrl} alt={user.displayName} />
                ) : (
                  <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
              <span className="sr-only">User Profile</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user.displayName}</span>
                <span className="text-xs text-muted-foreground">ID: {user.id}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>{user.role === 'manager' ? 'Manager' : 'Worker'}</span>
            </DropdownMenuItem>
            <Link to="/profile">
              <DropdownMenuItem>View Profile</DropdownMenuItem>
            </Link>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};