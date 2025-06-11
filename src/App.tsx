import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { Sales } from './pages/Sales';
import { Purchases } from './pages/Purchases';
import { Reports } from './pages/Reports';
import { Store } from './pages/Store';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Orders } from './pages/Orders';
import { Checkout } from './pages/Checkout';
import { CustomerSupport } from './pages/CustomerSupport';
import { Users } from './pages/Users';
import { AuthProvider } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import { SalesProvider } from './context/SalesContext';
import { PurchasesProvider } from './context/PurchasesContext';
import { LikesProvider } from './context/LikesContext';
import { useAuth } from './context/AuthContext';

const PrivateRoute: React.FC<{ 
  element: React.ReactElement, 
  allowedRoles?: string[] 
}> = ({ element, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/store" />;
  }

  return element;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Store />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/support" element={<CustomerSupport />} />
      
      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={<PrivateRoute element={<Dashboard />} allowedRoles={['admin']} />}
      />
      <Route
        path="/users"
        element={<PrivateRoute element={<Users />} allowedRoles={['admin']} />}
      />
      <Route
        path="/inventory"
        element={<PrivateRoute element={<Inventory />} allowedRoles={['admin', 'supervisor']} />}
      />
      <Route
        path="/sales"
        element={<PrivateRoute element={<Sales />} allowedRoles={['admin', 'supervisor']} />}
      />
      <Route
        path="/purchases"
        element={<PrivateRoute element={<Purchases />} allowedRoles={['admin', 'supervisor']} />}
      />
      <Route
        path="/reports"
        element={<PrivateRoute element={<Reports />} allowedRoles={['admin']} />}
      />
      <Route
        path="/orders"
        element={<PrivateRoute element={<Orders />} allowedRoles={['customer']} />}
      />
      <Route path="/store/*" element={<Store />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LikesProvider>
          <InventoryProvider>
            <SalesProvider>
              <PurchasesProvider>
                <AppContent />
              </PurchasesProvider>
            </SalesProvider>
          </InventoryProvider>
        </LikesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

const AppContent = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return user ? (
    <div className="min-h-screen bg-gray-50">
      {user.role !== 'customer' ? (
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      ) : (
        <Header />
      )}
      <div className="flex">
        {user.role !== 'customer' && <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
        <main className={`flex-1 p-4 lg:p-6 pt-16 ${user.role === 'customer' ? '' : 'lg:ml-64'}`}>
          <AppRoutes />
        </main>
      </div>
    </div>
  ) : (
    <AppRoutes />
  );
};

export default App;