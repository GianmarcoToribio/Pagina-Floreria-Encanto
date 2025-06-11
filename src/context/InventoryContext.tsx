import React, { createContext, useContext, useState } from 'react';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  minStock: number;
  supplier: string;
  expiryDate?: string;
  image?: string;
}

interface Category {
  id: string;
  name: string;
}

interface InventoryContextType {
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
}

const InventoryContext = createContext<InventoryContextType>({
  products: [],
  categories: [],
  addProduct: () => {},
  updateProduct: () => {},
  deleteProduct: () => {},
  getProduct: () => undefined
});

export const useInventory = () => useContext(InventoryContext);

// Sample data
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Ramo de Rosas Rojas',
    sku: 'ROS-RED-001',
    category: 'ramos',
    description: 'Elegante ramo de 12 rosas rojas con follaje decorativo',
    price: 45.00,
    stock: 15,
    minStock: 10,
    supplier: 'sup1',
    expiryDate: '2023-07-20',
    image: 'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg'
  },
  {
    id: '2',
    name: 'Centro de Mesa Primaveral',
    sku: 'CEN-PRI-002',
    category: 'centros',
    description: 'Centro de mesa con flores variadas de temporada',
    price: 60.00,
    stock: 8,
    minStock: 5,
    supplier: 'sup2',
    image: 'https://cdn0.bodas.net/article-vendor/81341/original/1280/jpg/nr-105_1_81341-1560269146.jpeg'
  },
  {
    id: '3',
    name: 'Ramo de Girasoles',
    sku: 'RAM-GIR-003',
    category: 'ramos',
    description: 'Vibrante ramo con 8 girasoles y follaje verde',
    price: 42.00,
    stock: 12,
    minStock: 8,
    supplier: 'sup1',
    expiryDate: '2023-07-18',
    image: 'https://www.rosatel.pe/trujillo/22443/ramo-primaveral-girasoles.jpg'
  },
  {
    id: '4',
    name: 'Orquídea Phalaenopsis',
    sku: 'ORQ-PHA-004',
    category: 'plantas',
    description: 'Elegante orquídea en maceta decorativa',
    price: 65.00,
    stock: 6,
    minStock: 3,
    supplier: 'sup3',
    image: 'https://www.floresyplantas.net/wp-content/uploads/flor-de-phalaenopsis.jpg',
  },
  {
    id: '5',
    name: 'Corona Fúnebre',
    sku: 'COR-FUN-005',
    category: 'coronas',
    description: 'Corona fúnebre con flores blancas y moradas',
    price: 85.00,
    stock: 4,
    minStock: 2,
    supplier: 'sup2',
    image: 'https://w7.pngwing.com/pngs/744/863/png-transparent-funeral-home-cemetery-wreath-flower-funeral-miscellaneous-flower-arranging-white-thumbnail.png'
  },
  {
    id: '6',
    name: 'Arreglo Cumpleaños',
    sku: 'ARR-CUM-006',
    category: 'arreglos',
    description: 'Arreglo festivo con globos y flores coloridas',
    price: 55.00,
    stock: 10,
    minStock: 5,
    supplier: 'sup1',
    image: 'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg'
  }
];

const initialCategories: Category[] = [
  { id: 'ramos', name: 'Ramos' },
  { id: 'centros', name: 'Centros de Mesa' },
  { id: 'arreglos', name: 'Arreglos' },
  { id: 'plantas', name: 'Plantas' },
  { id: 'coronas', name: 'Coronas' },
  { id: 'accesorios', name: 'Accesorios' }
];

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories] = useState<Category[]>(initialCategories);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = {
      ...product,
      id: Date.now().toString()
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts(
      products.map(product => 
        product.id === id ? { ...product, ...updatedFields } : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const getProduct = (id: string) => {
    return products.find(product => product.id === id);
  };

  return (
    <InventoryContext.Provider
      value={{
        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};