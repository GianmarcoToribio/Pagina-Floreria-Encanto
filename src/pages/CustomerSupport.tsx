import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface Message {
  id: number;
  userId: string;
  customerName: string;
  customerEmail: string;
  message: string;
  date: string;
  isUser: boolean;
  status: 'pending' | 'answered';
  respondedBy?: string;
}

export const CustomerSupport: React.FC = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [tickets, setTickets] = useState<Message[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [response, setResponse] = useState('');

  useEffect(() => {
    // Load messages from localStorage
    const savedMessages = localStorage.getItem('supportMessages');
    if (savedMessages) {
      setTickets(JSON.parse(savedMessages));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    const newMessage: Message = {
      id: Date.now(),
      userId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      message: message.trim(),
      date: new Date().toISOString().split('T')[0],
      isUser: true,
      status: 'pending'
    };

    const updatedTickets = [...tickets, newMessage];
    setTickets(updatedTickets);
    localStorage.setItem('supportMessages', JSON.stringify(updatedTickets));
    setMessage('');
  };

  const handleResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!response.trim() || !user || !selectedTicket) return;

    const responseMessage: Message = {
      id: Date.now(),
      userId: selectedTicket,
      customerName: user.name,
      customerEmail: user.email,
      message: response.trim(),
      date: new Date().toISOString().split('T')[0],
      isUser: false,
      status: 'answered',
      respondedBy: user.role === 'admin' ? 'Administrador' : 'Supervisor'
    };

    // Update all pending tickets for this user to answered
    const updatedTickets = tickets.map(ticket => 
      ticket.userId === selectedTicket && ticket.status === 'pending'
        ? { ...ticket, status: 'answered' }
        : ticket
    );
    updatedTickets.push(responseMessage);

    setTickets(updatedTickets);
    localStorage.setItem('supportMessages', JSON.stringify(updatedTickets));
    setResponse('');
    setSelectedTicket(null);
  };

  // Group tickets by user ID for admin/supervisor view
  const groupedTickets = tickets.reduce((acc: { [key: string]: Message[] }, ticket) => {
    if (!acc[ticket.userId]) {
      acc[ticket.userId] = [];
    }
    acc[ticket.userId].push(ticket);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Atención al Cliente</h1>
        {user?.role === 'customer' && (
          <Link
            to="/store"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la Tienda
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {user?.role !== 'customer' ? (
            // Admin/Supervisor view
            <div className="space-y-6">
              {Object.entries(groupedTickets).map(([userId, userTickets]) => {
                const hasPendingTickets = userTickets.some(t => t.status === 'pending');
                const customerTicket = userTickets.find(t => t.customerName);
                
                return (
                  <div 
                    key={userId} 
                    className={`bg-white shadow-sm rounded-lg p-6 ${
                      hasPendingTickets ? 'border-2 border-yellow-400' : ''
                    }`}
                  >
                    <div className="mb-4 border-b pb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {customerTicket?.customerName || 'Cliente'}
                      </h3>
                      <p className="text-sm text-gray-500">{customerTicket?.customerEmail}</p>
                      {hasPendingTickets && (
                        <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Requiere atención
                        </span>
                      )}
                    </div>

                    <div className="space-y-4 mb-4">
                      {userTickets.map((ticket) => (
                        <div
                          key={ticket.id}
                          className={`flex ${ticket.isUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`rounded-lg p-4 max-w-md ${
                              ticket.isUser ? 'bg-green-50' : 'bg-gray-50'
                            }`}
                          >
                            <p className="text-sm text-gray-900">{ticket.message}</p>
                            <div className="flex justify-between items-center mt-2">
                              <p className="text-xs text-gray-500">{ticket.date}</p>
                              {ticket.status === 'pending' && (
                                <span className="text-xs text-yellow-600">Pendiente</span>
                              )}
                              {ticket.status === 'answered' && (
                                <span className="text-xs text-green-600">
                                  Respondido por {ticket.respondedBy}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {hasPendingTickets && (
                      <form onSubmit={handleResponse} className="mt-4">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={response}
                            onChange={(e) => {
                              setResponse(e.target.value);
                              setSelectedTicket(userId);
                            }}
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                            placeholder="Escribir respuesta..."
                          />
                          <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            // Customer view
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="space-y-4">
                {tickets
                  .filter(ticket => ticket.userId === user.id)
                  .map((ticket) => (
                    <div
                      key={ticket.id}
                      className={`flex ${ticket.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`rounded-lg p-4 max-w-md ${
                          ticket.isUser ? 'bg-green-50' : 'bg-gray-50'
                        }`}
                      >
                        <p className="text-sm text-gray-900">{ticket.message}</p>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-xs text-gray-500">{ticket.date}</p>
                          {ticket.status === 'pending' && (
                            <span className="text-xs text-yellow-600">Pendiente</span>
                          )}
                          {ticket.status === 'answered' && (
                            <span className="text-xs text-green-600">
                              Respondido por {ticket.respondedBy}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    placeholder="Escribir mensaje..."
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6 h-fit">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Información de Contacto</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Horario de Atención</h3>
              <p className="text-sm text-gray-500">Lunes a Viernes: 9:00 AM - 6:00 PM</p>
              <p className="text-sm text-gray-500">Sábados: 9:00 AM - 1:00 PM</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Teléfono</h3>
              <p className="text-sm text-gray-500">+51 123 456 789</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Email</h3>
              <p className="text-sm text-gray-500">soporte@floreria.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};