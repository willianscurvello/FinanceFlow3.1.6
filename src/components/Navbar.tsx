import React from 'react';
    import { Bell, Sun, Moon } from 'lucide-react';
    import { useTheme } from '../contexts/ThemeContext';
    import { useAuth } from '../contexts/AuthContext';
    import { useNavigate } from 'react-router-dom';

    export function Navbar() {
      const { theme, toggleTheme } = useTheme();
      const { user } = useAuth();
      const navigate = useNavigate();

      const handleProfileClick = () => {
        navigate('/profile');
      };

      return (
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">FinanceFlow</h1>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleTheme}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <Bell size={20} />
                </button>
                
                {user && (
                  <div className="flex items-center cursor-pointer" onClick={handleProfileClick}>
                    <img
                      className="h-8 w-8 rounded-full"
                      src={`https://ui-avatars.com/api/?name=${user.email}&background=0D8ABC&color=fff`}
                      alt="User avatar"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      );
    }
