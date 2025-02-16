import React from 'react';
    import { NavLink } from 'react-router-dom';
    import { 
      LayoutDashboard, 
      Building2, 
      Users, 
      CreditCard,
      HelpCircle,
      UserCircle,
      DollarSign, // Import the new icon for Expenses
      LogOut // Import the logout icon
    } from 'lucide-react';
    import { useAuth } from '../contexts/AuthContext';

    const navigation = [
      { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
      { name: 'Companies', to: '/companies', icon: Building2 },
      { name: 'Employees', to: '/employees', icon: Users },
      { name: 'Expenses', to: '/expenses', icon: DollarSign }, // Add the new Expenses link
      { name: 'Plans', to: '/plans', icon: CreditCard },
      { name: 'Support', to: '/support', icon: HelpCircle },
      { name: 'Profile', to: '/profile', icon: UserCircle },
    ];

    export function Sidebar() {
      const { signOut } = useAuth();

      const handleLogout = async () => {
        try {
          await signOut();
        } catch (error) {
          console.error('Logout error:', error);
        }
      };

      return (
        <aside className="w-64 min-h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <nav className="mt-5 px-2">
            <div className="space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </button>
            </div>
          </nav>
        </aside>
      );
    }
