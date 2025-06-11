import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import { usePurchases } from '../../context/PurchasesContext';
import { X, Printer, CheckCircle, XCircle, Clock, Send } from 'lucide-react';

interface PurchaseDetailsModalProps {
  purchase: any;
  isOpen: boolean;
  onClose: () => void;
}

export const PurchaseDetailsModal: React.FC<PurchaseDetailsModalProps> = ({ purchase, isOpen, onClose }) => {
  const { products } = useInventory();
  const { suppliers, approvePurchase, rejectPurchase, receivePurchase } = usePurchases();

  if (!isOpen) return null;

  const supplier = suppliers.find(s => s.id === purchase.supplierId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="mr-1 h-3 w-3" />
            Pendiente
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            Aprobada
          </span>
        );
      case 'received':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Send className="mr-1 h-3 w-3" />
            Recibida
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="mr-1 h-3 w-3" />
            Rechazada
          </span>
        );
      default:
        return null;
    }
  };

  const handleApprove = () => {
    approvePurchase(purchase.id);
    onClose();
  };

  const handleReject = () => {
    rejectPurchase(purchase.id);
    onClose();
  };

  const handleReceive = () => {
    receivePurchase(purchase.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Orden de Compra #{purchase.id}</h2>
            <div className="flex items-center">
              <button
                className="mr-3 text-gray-600 hover:text-gray-900"
              >
                <Printer className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Información de la Orden</h3>
              <div className="bg-gray-50 rounded-md p-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Fecha de Creación</p>
                    <p className="text-sm">{new Date(purchase.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Estado</p>
                    <div className="mt-1">{getStatusBadge(purchase.status)}</div>
                  </div>
                  {purchase.expectedDelivery && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">Fecha Estimada de Entrega</p>
                      <p className="text-sm">{new Date(purchase.expectedDelivery).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Información del Proveedor</h3>
              <div className="bg-gray-50 rounded-md p-3">
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Nombre</p>
                    <p className="text-sm">{supplier?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Contacto</p>
                    <p className="text-sm">{supplier?.contact}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm">{supplier?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Teléfono</p>
                    <p className="text-sm">{supplier?.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-sm font-medium text-gray-500 mb-2">Productos</h3>
          <div className="border rounded-md overflow-hidden mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {purchase.items.map((item: any, index: number) => {
                  const product = products.find(p => p.id === item.productId);
                  return (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product?.name || `Producto ID: ${item.productId}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        ${item.subtotal.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-700">Total:</span>
                  <span className="text-base font-bold">${purchase.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {purchase.notes && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Notas</h3>
              <div className="bg-gray-50 rounded-md p-3">
                <p className="text-sm text-gray-700">{purchase.notes}</p>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            {purchase.status === 'pending' && (
              <>
                <button
                  onClick={handleReject}
                  className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Rechazar
                </button>
                <button
                  onClick={handleApprove}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Aprobar
                </button>
              </>
            )}
            
            {purchase.status === 'approved' && (
              <button
                onClick={handleReceive}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Send className="mr-2 h-4 w-4" />
                Marcar como Recibido
              </button>
            )}
            
            {(purchase.status === 'received' || purchase.status === 'rejected') && (
              <button
                onClick={onClose}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cerrar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};