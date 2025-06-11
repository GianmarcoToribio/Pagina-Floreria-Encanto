import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Package, ShoppingCart, CreditCard, Truck } from 'lucide-react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('today');

  const getDashboardData = (range: string) => {
    switch (range) {
      case 'today':
        return {
          sales: 12540,
          orders: 64,
          inventory: 142,
          pendingPurchases: 8,
          salesTrend: 12,
          ordersTrend: 8,
          inventoryTrend: -5,
          chartData: {
            labels: ['8am', '10am', '12pm', '2pm', '4pm', '6pm'],
            values: [1200, 1900, 3000, 2500, 2200, 1740]
          }
        };
      case 'week':
        return {
          sales: 85400,
          orders: 428,
          inventory: 156,
          pendingPurchases: 12,
          salesTrend: 15,
          ordersTrend: 10,
          inventoryTrend: -3,
          chartData: {
            labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
            values: [12500, 14200, 13800, 15400, 16200, 8500, 4800]
          }
        };
      case 'month':
        return {
          sales: 324500,
          orders: 1642,
          inventory: 168,
          pendingPurchases: 15,
          salesTrend: 18,
          ordersTrend: 12,
          inventoryTrend: -2,
          chartData: {
            labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
            values: [85400, 78900, 82400, 77800]
          }
        };
      default:
        return {
          sales: 12540,
          orders: 64,
          inventory: 142,
          pendingPurchases: 8,
          salesTrend: 12,
          ordersTrend: 8,
          inventoryTrend: -5,
          chartData: {
            labels: ['8am', '10am', '12pm', '2pm', '4pm', '6pm'],
            values: [1200, 1900, 3000, 2500, 2200, 1740]
          }
        };
    }
  };

  const data = getDashboardData(timeRange);

  const salesChartData = {
    labels: data.chartData.labels,
    datasets: [
      {
        label: 'Ventas',
        data: data.chartData.values,
        fill: false,
        borderColor: 'rgb(34, 197, 94)',
        tension: 0.1
      }
    ]
  };

  const categoryData = {
    labels: ['Ramos', 'Arreglos', 'Centros de Mesa', 'Coronas', 'Otros'],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          'rgba(34, 197, 94, 0.6)',
          'rgba(99, 102, 241, 0.6)',
          'rgba(244, 63, 94, 0.6)',
          'rgba(234, 179, 8, 0.6)',
          'rgba(107, 114, 128, 0.6)'
        ]
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="mt-4 md:mt-0">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md focus:z-10 focus:outline-none focus:ring-1 focus:ring-green-500 ${
                timeRange === 'today'
                  ? 'text-white bg-green-600 hover:bg-green-700'
                  : 'text-green-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Hoy
            </button>
            <button
              onClick={() => setTimeRange('week')}
              className={`px-4 py-2 text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-green-500 ${
                timeRange === 'week'
                  ? 'text-white bg-green-600 hover:bg-green-700'
                  : 'text-green-700 bg-white border-t border-b border-gray-300 hover:bg-gray-50'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md focus:z-10 focus:outline-none focus:ring-1 focus:ring-green-500 ${
                timeRange === 'month'
                  ? 'text-white bg-green-600 hover:bg-green-700'
                  : 'text-green-700 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Mes
            </button>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Ventas Totales</p>
              <p className="text-2xl font-semibold mt-1">${data.sales.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <ShoppingCart size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 flex items-center">
              <TrendingUp size={16} className="mr-1" />
              {data.salesTrend}%
            </span>
            <span className="text-gray-500 ml-2">vs periodo anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Órdenes Nuevas</p>
              <p className="text-2xl font-semibold mt-1">{data.orders}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
              <CreditCard size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 flex items-center">
              <TrendingUp size={16} className="mr-1" />
              {data.ordersTrend}%
            </span>
            <span className="text-gray-500 ml-2">vs periodo anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Inventario</p>
              <p className="text-2xl font-semibold mt-1">{data.inventory} productos</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Package size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-red-600 flex items-center">
              <TrendingDown size={16} className="mr-1" />
              {Math.abs(data.inventoryTrend)}%
            </span>
            <span className="text-gray-500 ml-2">productos por agotarse</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Compras Pendientes</p>
              <p className="text-2xl font-semibold mt-1">{data.pendingPurchases} órdenes</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <Truck size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">2 requieren aprobación</span>
          </div>
        </div>
      </div>

      {/* Charts and tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Ventas Recientes</h2>
          <div className="h-80">
            <Line
              data={salesChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  title: {
                    display: true,
                    text: 'Tendencia de Ventas'
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Ventas por Categoría</h2>
          <div className="h-80">
            <Pie
              data={categoryData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};