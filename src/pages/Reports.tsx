import React, { useState, useEffect } from 'react';
import { Calendar, Download, BarChart, LineChart, PieChart, TrendingUp, Users, Package } from 'lucide-react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { useSales } from '../context/SalesContext';
import { useInventory } from '../context/InventoryContext';
import { usePurchases } from '../context/PurchasesContext';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const Reports: React.FC = () => {
  const { sales } = useSales();
  const { products, categories } = useInventory();
  const { purchases, suppliers } = usePurchases();
  const [reportType, setReportType] = useState('inventory');
  const [dateRange, setDateRange] = useState('month');
  const [salesData, setSalesData] = useState<any>(null);
  const [categoryData, setCategoryData] = useState<any>(null);
  const [purchasesData, setPurchasesData] = useState<any>(null);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [inventoryData, setInventoryData] = useState<any>(null);
  const [lowStockData, setLowStockData] = useState<any[]>([]);

  useEffect(() => {
    // Prepare sales data
    const dates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const salesByDate = dates.map(date => {
      const daySales = sales.filter(sale => 
        sale.date.split('T')[0] === date
      );
      return {
        date,
        total: daySales.reduce((sum, sale) => sum + sale.total, 0),
        count: daySales.length
      };
    });

    setSalesData({
      labels: salesByDate.map(d => new Date(d.date).toLocaleDateString()),
      datasets: [{
        label: 'Ventas Diarias ($)',
        data: salesByDate.map(d => d.total),
        fill: false,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.1
      }, {
        label: 'Número de Ventas',
        data: salesByDate.map(d => d.count),
        fill: false,
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.1,
        yAxisID: 'y1'
      }]
    });

    // Prepare category sales data
    const salesByCategory = categories.map(category => {
      const categorySales = sales.filter(sale => 
        sale.items.some(item => {
          const product = products.find(p => p.id === item.productId);
          return product?.category === category.id;
        })
      );
      const totalRevenue = categorySales.reduce((sum, sale) => {
        return sum + sale.items.reduce((itemSum, item) => {
          const product = products.find(p => p.id === item.productId);
          return product?.category === category.id ? itemSum + item.subtotal : itemSum;
        }, 0);
      }, 0);
      
      return {
        category: category.name,
        revenue: totalRevenue,
        sales: categorySales.length
      };
    });

    setCategoryData({
      labels: salesByCategory.map(c => c.category),
      datasets: [{
        label: 'Ingresos por Categoría',
        data: salesByCategory.map(c => c.revenue),
        backgroundColor: [
          'rgba(34, 197, 94, 0.6)',
          'rgba(99, 102, 241, 0.6)',
          'rgba(244, 63, 94, 0.6)',
          'rgba(234, 179, 8, 0.6)',
          'rgba(107, 114, 128, 0.6)',
          'rgba(168, 85, 247, 0.6)'
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(99, 102, 241)',
          'rgb(244, 63, 94)',
          'rgb(234, 179, 8)',
          'rgb(107, 114, 128)',
          'rgb(168, 85, 247)'
        ],
        borderWidth: 1
      }]
    });

    // Prepare purchases data
    const purchasesBySupplier = suppliers.map(supplier => {
      const supplierPurchases = purchases.filter(p => p.supplierId === supplier.id);
      const totalSpent = supplierPurchases.reduce((sum, purchase) => sum + purchase.total, 0);
      const totalOrders = supplierPurchases.length;
      
      return {
        supplier: supplier.name,
        spent: totalSpent,
        orders: totalOrders
      };
    });

    setPurchasesData({
      labels: purchasesBySupplier.map(s => s.supplier),
      datasets: [{
        label: 'Gasto Total ($)',
        data: purchasesBySupplier.map(s => s.spent),
        backgroundColor: 'rgba(168, 85, 247, 0.6)',
        borderColor: 'rgb(168, 85, 247)',
        borderWidth: 1
      }, {
        label: 'Número de Órdenes',
        data: purchasesBySupplier.map(s => s.orders),
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1
      }]
    });

    // Prepare performance data (mock data for demonstration)
    const performanceMetrics = [
      { name: 'Ana García', sales: 15, revenue: 2450 },
      { name: 'Carlos López', sales: 12, revenue: 1980 },
      { name: 'María Rodríguez', sales: 18, revenue: 3200 },
      { name: 'Juan Pérez', sales: 9, revenue: 1650 }
    ];

    setPerformanceData({
      labels: performanceMetrics.map(p => p.name),
      datasets: [{
        label: 'Ingresos Generados ($)',
        data: performanceMetrics.map(p => p.revenue),
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1
      }, {
        label: 'Número de Ventas',
        data: performanceMetrics.map(p => p.sales),
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1
      }]
    });

    // Prepare inventory data
    const stockByCategory = categories.map(category => {
      const categoryProducts = products.filter(p => p.category === category.id);
      const totalStock = categoryProducts.reduce((sum, product) => sum + product.stock, 0);
      const totalValue = categoryProducts.reduce((sum, product) => sum + (product.stock * product.price), 0);
      
      return {
        category: category.name,
        stock: totalStock,
        value: totalValue
      };
    });

    setInventoryData({
      labels: stockByCategory.map(c => c.category),
      datasets: [
        {
          label: 'Valor del Inventario ($)',
          data: stockByCategory.map(c => c.value),
          backgroundColor: 'rgba(34, 197, 94, 0.6)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 1
        },
        {
          label: 'Cantidad en Stock',
          data: stockByCategory.map(c => c.stock),
          backgroundColor: 'rgba(99, 102, 241, 0.6)',
          borderColor: 'rgb(99, 102, 241)',
          borderWidth: 1
        }
      ]
    });

    // Prepare low stock data
    const lowStockItems = products
      .filter(product => product.stock <= product.minStock)
      .map(product => ({
        name: product.name,
        currentStock: product.stock,
        minStock: product.minStock,
        category: categories.find(c => c.id === product.category)?.name || product.category
      }))
      .sort((a, b) => a.currentStock - b.minStock);

    setLowStockData(lowStockItems);
  }, [sales, products, categories, purchases, suppliers]);

  const handleExport = () => {
    const reportData = {
      reportType,
      dateRange,
      inventoryData,
      lowStockData,
      salesData,
      categoryData,
      purchasesData,
      performanceData,
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte-${reportType}-${dateRange}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderReportContent = () => {
    switch (reportType) {
      case 'inventory':
        return inventoryData && (
          <div>
            <h2 className="text-lg font-medium text-gray-800 mb-4">Reporte de Inventario</h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Estado del Inventario por Categoría</h3>
                <div className="h-80">
                  <Bar 
                    data={inventoryData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top' as const
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {lowStockData.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Productos con Stock Bajo</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Producto
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Categoría
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stock Actual
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stock Mínimo
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {lowStockData.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                              {item.currentStock}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.minStock}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'sales':
        return salesData && categoryData && (
          <div>
            <h2 className="text-lg font-medium text-gray-800 mb-4">Reporte de Ventas</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Tendencia de Ventas (Últimos 7 días)</h3>
                <div className="h-80">
                  <Line 
                    data={salesData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top' as const
                        }
                      },
                      scales: {
                        y: {
                          type: 'linear',
                          display: true,
                          position: 'left',
                          beginAtZero: true
                        },
                        y1: {
                          type: 'linear',
                          display: true,
                          position: 'right',
                          beginAtZero: true,
                          grid: {
                            drawOnChartArea: false,
                          },
                        }
                      }
                    }}
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Ingresos por Categoría</h3>
                <div className="h-80">
                  <Pie 
                    data={categoryData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom' as const
                        }
                      }
                    }}
                  />
                </div>
              </div>

              <div className="lg:col-span-2 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Resumen de Ventas</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      ${sales.reduce((sum, sale) => sum + sale.total, 0).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">Ingresos Totales</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{sales.length}</div>
                    <div className="text-sm text-gray-500">Total de Ventas</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      ${sales.length > 0 ? (sales.reduce((sum, sale) => sum + sale.total, 0) / sales.length).toFixed(2) : '0.00'}
                    </div>
                    <div className="text-sm text-gray-500">Venta Promedio</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {sales.reduce((sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0)}
                    </div>
                    <div className="text-sm text-gray-500">Productos Vendidos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'purchases':
        return purchasesData && (
          <div>
            <h2 className="text-lg font-medium text-gray-800 mb-4">Reporte de Compras</h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Compras por Proveedor</h3>
                <div className="h-80">
                  <Bar 
                    data={purchasesData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top' as const
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Resumen de Compras</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      ${purchases.reduce((sum, purchase) => sum + purchase.total, 0).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">Gasto Total</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{purchases.length}</div>
                    <div className="text-sm text-gray-500">Órdenes de Compra</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {purchases.filter(p => p.status === 'received').length}
                    </div>
                    <div className="text-sm text-gray-500">Órdenes Recibidas</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {purchases.filter(p => p.status === 'pending').length}
                    </div>
                    <div className="text-sm text-gray-500">Órdenes Pendientes</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Estado de Órdenes de Compra</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          # Orden
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Proveedor
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {purchases.map((purchase) => (
                        <tr key={purchase.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{purchase.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {suppliers.find(s => s.id === purchase.supplierId)?.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${purchase.total.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              purchase.status === 'received' ? 'bg-green-100 text-green-800' :
                              purchase.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                              purchase.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {purchase.status === 'received' ? 'Recibida' :
                               purchase.status === 'approved' ? 'Aprobada' :
                               purchase.status === 'pending' ? 'Pendiente' : 'Rechazada'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

      case 'performance':
        return performanceData && (
          <div>
            <h2 className="text-lg font-medium text-gray-800 mb-4">Desempeño de Vendedores</h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Rendimiento por Vendedor</h3>
                <div className="h-80">
                  <Bar 
                    data={performanceData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top' as const
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Ranking de Vendedores</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Posición
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vendedor
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ventas
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ingresos
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Promedio por Venta
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[
                        { name: 'María Rodríguez', sales: 18, revenue: 3200 },
                        { name: 'Ana García', sales: 15, revenue: 2450 },
                        { name: 'Carlos López', sales: 12, revenue: 1980 },
                        { name: 'Juan Pérez', sales: 9, revenue: 1650 }
                      ].map((seller, index) => (
                        <tr key={seller.name} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {seller.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {seller.sales}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${seller.revenue.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${(seller.revenue / seller.sales).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <BarChart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Selecciona un tipo de reporte</h3>
            <p className="mt-1 text-sm text-gray-500">
              Elige una opción arriba para ver los datos del reporte.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold text-gray-800">Reportes</h1>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="today">Hoy</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
              <option value="quarter">Este trimestre</option>
              <option value="year">Este año</option>
            </select>
          </div>
          <button 
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { id: 'inventory', name: 'Reporte de Inventario', icon: Package },
          { id: 'sales', name: 'Reporte de Ventas', icon: BarChart },
          { id: 'purchases', name: 'Reporte de Compras', icon: LineChart },
          { id: 'performance', name: 'Desempeño de Vendedores', icon: Users }
        ].map((report) => (
          <button
            key={report.id}
            className={`p-4 rounded-lg shadow-sm border-2 transition-all ${
              reportType === report.id
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
            onClick={() => setReportType(report.id)}
          >
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  reportType === report.id
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                <report.icon size={24} />
              </div>
              <span className="mt-2 text-sm font-medium">{report.name}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        {renderReportContent()}
      </div>
    </div>
  );
};