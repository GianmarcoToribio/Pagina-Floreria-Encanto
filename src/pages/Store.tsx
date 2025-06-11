// src/pages/store.tsx

import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { useLikes } from '../context/LikesContext';
import {
  ShoppingCart,
  Search,
  Filter,
  Heart,
  ShoppingBag,
  Eye,
  Flower,
  Menu,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Store: React.FC = () => {
  const { products, categories } = useInventory();
  const { user } = useAuth();
  const { toggleLike, isLiked } = useLikes();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filtrar productos por búsqueda, categoría, favoritos y stock
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    let matchesCategory = true;
    if (selectedCategory === 'liked') {
      matchesCategory = isLiked(product.id);
    } else if (selectedCategory !== 'all') {
      matchesCategory = product.category === selectedCategory;
    }
    return matchesSearch && matchesCategory && product.stock > 0;
  });

  // Carrito
  const addToCart = (product: any) => {
    const existing = cartItems.find((item) => item.id === product.id);
    if (existing) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };
  const removeFromCart = (id: string) =>
    setCartItems(cartItems.filter((item) => item.id !== id));
  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: qty } : item
      )
    );
  };

  // Favoritos
  const handleLikeClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (user) toggleLike(id);
  };

  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

  // Recomendaciones estáticas
  const recommendations = [
    {
      title: 'Ramo de Rosas Rojas',
      description: 'El clásico símbolo del amor y la pasión',
      image:
        'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg',
    },
    {
      title: 'Centro de Mesa Primaveral',
      description: 'Perfecto para eventos y celebraciones especiales',
      image:
        'https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg',
    },
    {
      title: 'Arreglo de Girasoles',
      description: 'Llena de alegría y luz cualquier espacio',
      image:
        'https://images.pexels.com/photos/1624076/pexels-photo-1624076.jpeg',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <Flower size={24} />
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">
                Florería Encanto
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#productos" className="text-gray-600 hover:text-gray-900">
                Productos
              </a>
              <a
                href="#recomendaciones"
                className="text-gray-600 hover:text-gray-900"
              >
                Recomendaciones
              </a>
              <Link to="/support" className="text-gray-600 hover:text-gray-900">
                Atención al Cliente
              </Link>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-gray-600 hover:text-gray-900"
              >
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {totalItems}
                  </span>
                )}
              </button>
              {user ? (
                <div className="flex items-center space-x-4">
                  {user.picture && (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <Link
                    to="/orders"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Mis Pedidos
                  </Link>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>

            {/* Mobile toggle */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#productos"
                className="block px-3 py-2 text-gray-600 hover:text-gray-900"
              >
                Productos
              </a>
              <a
                href="#recomendaciones"
                className="block px-3 py-2 text-gray-600 hover:text-gray-900"
              >
                Recomendaciones
              </a>
              <Link
                to="/support"
                className="block px-3 py-2 text-gray-600 hover:text-gray-900"
              >
                Atención al Cliente
              </Link>
              <button
                onClick={() => {
                  setIsCartOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900"
              >
                Carrito ({totalItems})
              </button>
              {user ? (
                <Link
                  to="/orders"
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900"
                >
                  Mis Pedidos
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="block px-3 py-2 text-green-600 hover:text-green-700 font-medium"
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
            Flores para cada momento especial
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-xl text-gray-500">
            Descubre nuestra selección de arreglos florales frescos y hermosos.
          </p>
        </div>
      </div>

      {/* Products */}
      <section
        id="productos"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Nuestros Productos
        </h2>

        {/* Filtros */}
        <div className="bg-white shadow-sm rounded-lg p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border rounded-md placeholder-gray-500 focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                <option value="all">Todas las categorías</option>
                {user && <option value="liked">❤️ Mis favoritos</option>}
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-48 w-full relative overflow-hidden bg-gray-200">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <Eye size={48} />
                  </div>
                )}
                {user && (
                  <button
                    onClick={(e) => handleLikeClick(product.id, e)}
                    className={`absolute top-2 right-2 p-1 rounded-full transition-colors ${
                      isLiked(product.id)
                        ? 'text-pink-500 bg-white shadow-md'
                        : 'text-gray-500 hover:text-pink-500 bg-white/80 hover:bg-white shadow-md'
                    }`}
                  >
                    <Heart
                      size={20}
                      fill={isLiked(product.id) ? 'currentColor' : 'none'}
                    />
                  </button>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 mb-2">
                  {
                    categories.find((c) => c.id === product.category)
                      ?.name
                  }
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="inline-flex items-center p-2 rounded-md bg-green-600 hover:bg-green-700 text-white focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <ShoppingBag className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                {selectedCategory === 'liked' ? (
                  <Heart size={48} className="mx-auto" />
                ) : (
                  <Eye size={48} className="mx-auto" />
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {selectedCategory === 'liked'
                  ? 'No tienes productos favoritos'
                  : 'No se encontraron productos'}
              </h3>
              <p className="text-gray-500">
                {selectedCategory === 'liked'
                  ? 'Agrega productos a tus favoritos haciendo clic en el corazón'
                  : 'Intenta con otros términos de búsqueda o categorías'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Recommendations */}
      <section
        id="recomendaciones"
        className="bg-white py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Recomendaciones
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recommendations.map((item, idx) => (
              <div
                key={idx}
                className="relative rounded-lg overflow-hidden"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-200 mt-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-gray-500 bg-opacity-75"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="relative w-screen max-w-md">
              <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
                <div className="flex items-center justify-between px-4 py-6 border-b">
                  <h2 className="text-lg font-medium text-gray-900">
                    Carrito de Compras
                  </h2>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Cerrar</span>
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="flex-1 px-4 py-6 sm:px-6">
                  {cartItems.length === 0 ? (
                    <div className="text-center py-10">
                      <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        Carrito vacío
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Agrega productos para continuar.
                      </p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {cartItems.map((item) => (
                        <li key={item.id} className="py-6 flex">
                          <div className="h-24 w-24 rounded-md border overflow-hidden bg-gray-200 flex items-center justify-center">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <Eye size={24} className="text-gray-400" />
                            )}
                          </div>
                          <div className="ml-4 flex-1 flex flex-col">
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3>{item.name}</h3>
                              <p className="ml-4">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              {
                                categories.find((c) => c.id === item.category)
                                  ?.name
                              }
                            </p>
                            <div className="mt-4 flex items-center justify-between text-sm">
                              <div className="flex items-center">
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity - 1)
                                  }
                                  className="text-gray-500"
                                >
                                  −
                                </button>
                                <span className="mx-2 text-gray-700">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
                                  className="text-gray-500"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="font-medium text-pink-600 hover:text-pink-500"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {cartItems.length > 0 && (
                  <div className="border-t px-4 py-6 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Subtotal</p>
                      <p>${totalPrice.toFixed(2)}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      Envío e impuestos calculados al finalizar.
                    </p>
                    <Link
                      to="/checkout"
                      onClick={() =>
                        localStorage.setItem(
                          'cartItems',
                          JSON.stringify(cartItems)
                        )
                      }
                      className="mt-6 w-full flex justify-center items-center px-6 py-3 bg-green-600 text-white rounded-md shadow hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Proceder al Pago
                    </Link>
                    <div className="mt-4 text-center text-sm">
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="text-green-600 hover:text-green-500 font-medium"
                      >
                        ← Continuar Comprando
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
