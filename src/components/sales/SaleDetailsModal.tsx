import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import { X, Printer, Check, Clock, DollarSign, CreditCard } from 'lucide-react';

interface SaleDetailsModalProps {
  sale: any;
  isOpen: boolean;
  onClose: () => void;
}

export const SaleDetailsModal: React.FC<SaleDetailsModalProps> = ({ sale, isOpen, onClose }) => {
  const { products } = useInventory();

  if (!isOpen) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="mr-1 h-3 w-3" />
            Completada
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="mr-1 h-3 w-3" />
            Pendiente
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Detalle de Venta #{sale.id}</h2>
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
              <h3 className="text-sm font-medium text-gray-500 mb-2">Información de la Venta</h3>
              <div className="bg-gray-50 rounded-md p-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Fecha</p>
                    <p className="text-sm">{new Date(sale.date).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Estado</p>
                    <div className="mt-1">{getStatusBadge(sale.status)}</div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Tipo de Comprobante</p>
                    <p className="text-sm capitalize">{sale.invoiceType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Método de Pago</p>
                    <p className="text-sm flex items-center">
                      {sale.paymentMethod === 'cash' ? (
                        <>
                          <DollarSign className="mr-1 h-4 w-4" />
                          Efectivo
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-1 h-4 w-4" />
                          Tarjeta
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Información del Cliente</h3>
              <div className="bg-gray-50 rounded-md p-3">
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Cliente</p>
                    <p className="text-sm">{sale.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm">{sale.customer.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Teléfono</p>
                    <p className="text-sm">{sale.customer.phone}</p>
                  </div>
                  {sale.customer.ruc && (
                    <div>
                      <p className="text-xs text-gray-500">RUC</p>
                      <p className="text-sm">{sale.customer.ruc}</p>
                    </div>
                  )}
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
                {sale.items.map((item: any, index: number) => {
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
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Subtotal:</span>
                  <span className="text-sm font-medium">${sale.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">IGV (18%):</span>
                  <span className="text-sm font-medium">${sale.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-700">Total:</span>
                  <span className="text-base font-bold">${sale.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {sale.notes && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Notas</h3>
              <div className="bg-gray-50 rounded-md p-3">
                <p className="text-sm text-gray-700">{sale.notes}</p>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};