import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  TruckIcon, 
  BarChart3, 
  Store as StoreIcon,
  LogOut,
  X,
  Users,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();

  const getNavigation = () => {
    const adminNav = [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Usuarios', href: '/users', icon: Users },
      { name: 'Inventario', href: '/inventory', icon: Package },
      { name: 'Ventas', href: '/sales', icon: ShoppingCart },
      { name: 'Compras', href: '/purchases', icon: TruckIcon },
      { name: 'Reportes', href: '/reports', icon: BarChart3 },
      { name: 'Tienda Online', href: '/store', icon: StoreIcon },
      { name: 'Atención al Cliente', href: '/support', icon: MessageSquare }
    ];

    const supervisorNav = [
      { name: 'Inventario', href: '/inventory', icon: Package },
      { name: 'Ventas', href: '/sales', icon: ShoppingCart },
      { name: 'Compras', href: '/purchases', icon: TruckIcon },
      { name: 'Atención al Cliente', href: '/support', icon: MessageSquare }
    ];

    return user?.role === 'admin' ? adminNav : supervisorNav;
  };

  const navigation = getNavigation();

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden"
          onClick={() => setSidebarOpen?.(false)}
        ></div>
      )}

      <aside
        className={`fixed top-0 left-0 z-30 h-full w-64 transform bg-white shadow-lg transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-screen ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-green-700">Florería Encanto</span>
          </div>
          <button
            onClick={() => setSidebarOpen?.(false)}
            className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-4 px-2">
          <div className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                {item.name}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t">
          <button
            onClick={logout}
            className="flex w-full items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
          >
            <LogOut className="mr-3 h-5 w-5" aria-hidden="true" />
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
};