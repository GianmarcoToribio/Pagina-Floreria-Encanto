import React, { createContext, useContext, useState } from 'react';
import { useInventory } from './InventoryContext';

interface PurchaseItem {
  productId: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
}

interface Purchase {
  id: string;
  supplierId: string;
  items: PurchaseItem[];
  total: number;
  date: string;
  expectedDelivery?: string;
  status: 'pending' | 'approved' | 'rejected' | 'received';
  notes?: string;
}

interface PurchasesContextType {
  purchases: Purchase[];
  suppliers: Supplier[];
  createPurchase: (purchase: Omit<Purchase, 'id'>) => string;
  updatePurchase: (id: string, purchase: Partial<Purchase>) => void;
  approvePurchase: (id: string) => void;
  rejectPurchase: (id: string) => void;
  receivePurchase: (id: string) => void;
  getPurchase: (id: string) => Purchase | undefined;
  getSupplier: (id: string) => Supplier | undefined;
}

const PurchasesContext = createContext<PurchasesContextType>({
  purchases: [],
  suppliers: [],
  createPurchase: () => '',
  updatePurchase: () => {},
  approvePurchase: () => {},
  rejectPurchase: () => {},
  receivePurchase: () => {},
  getPurchase: () => undefined,
  getSupplier: () => undefined
});

export const usePurchases = () => useContext(PurchasesContext);

// Sample data
const initialSuppliers: Supplier[] = [
  {
    id: 'sup1',
    name: 'Floricultura Nacional',
    contact: 'Pedro Sánchez',
    email: 'pedro@florinacional.com',
    phone: '555-7890',
    address: 'Av. Las Flores 123'
  },
  {
    id: 'sup2',
    name: 'Importadora Floral',
    contact: 'Ana Gómez',
    email: 'ana@importadorafloral.com',
    phone: '555-2345',
    address: 'Jr. Los Jazmines 456'
  },
  {
    id: 'sup3',
    name: 'Viveros Unidos',
    contact: 'Javier Torres',
    email: 'javier@viverosunidos.com',
    phone: '555-6789',
    address: 'Calle Las Orquídeas 789'
  }
];

const initialPurchases: Purchase[] = [
  {
    id: 'PO-001',
    supplierId: 'sup1',
    items: [
      { productId: '1', quantity: 50, price: 30.00, subtotal: 1500.00 },
      { productId: '3', quantity: 30, price: 25.00, subtotal: 750.00 }
    ],
    total: 2250.00,
    date: '2023-07-10T09:00:00',
    expectedDelivery: '2023-07-17T09:00:00',
    status: 'received'
  },
  {
    id: 'PO-002',
    supplierId: 'sup2',
    items: [
      { productId: '2', quantity: 20, price: 40.00, subtotal: 800.00 },
      { productId: '5', quantity: 15, price: 60.00, subtotal: 900.00 }
    ],
    total: 1700.00,
    date: '2023-07-12T11:30:00',
    expectedDelivery: '2023-07-19T11:30:00',
    status: 'approved'
  },
  {
    id: 'PO-003',
    supplierId: 'sup3',
    items: [
      { productId: '4', quantity: 10, price: 45.00, subtotal: 450.00 }
    ],
    total: 450.00,
    date: '2023-07-14T15:00:00',
    expectedDelivery: '2023-07-21T15:00:00',
    status: 'pending'
  },
  {
    id: 'PO-004',
    supplierId: 'sup1',
    items: [
      { productId: '1', quantity: 30, price: 30.00, subtotal: 900.00 },
      { productId: '6', quantity: 25, price: 35.00, subtotal: 875.00 }
    ],
    total: 1775.00,
    date: '2023-07-15T10:15:00',
    expectedDelivery: '2023-07-22T10:15:00',
    status: 'pending'
  }
];

export const PurchasesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases);
  const [suppliers] = useState<Supplier[]>(initialSuppliers);
  const { updateProduct } = useInventory();

  const createPurchase = (purchase: Omit<Purchase, 'id'>) => {
    const newId = `PO-${(purchases.length + 1).toString().padStart(3, '0')}`;
    const newPurchase = { ...purchase, id: newId };
    
    setPurchases([newPurchase, ...purchases]);
    return newId;
  };

  const updatePurchase = (id: string, updatedFields: Partial<Purchase>) => {
    setPurchases(
      purchases.map(purchase => 
        purchase.id === id ? { ...purchase, ...updatedFields } : purchase
      )
    );
  };

  const approvePurchase = (id: string) => {
    updatePurchase(id, { status: 'approved' });
  };

  const rejectPurchase = (id: string) => {
    updatePurchase(id, { status: 'rejected' });
  };

  const receivePurchase = (id: string) => {
    const purchase = purchases.find(p => p.id === id);
    
    if (purchase && purchase.status === 'approved') {
      // Update purchase status
      updatePurchase(id, { status: 'received' });
      
      // Add items to inventory
      purchase.items.forEach(item => {
        updateProduct(item.productId, {
          stock: (prev: number) => prev + item.quantity
        } as any);
      });
    }
  };

  const getPurchase = (id: string) => {
    return purchases.find(purchase => purchase.id === id);
  };

  const getSupplier = (id: string) => {
    return suppliers.find(supplier => supplier.id === id);
  };

  return (
    <PurchasesContext.Provider
      value={{
        purchases,
        suppliers,
        createPurchase,
        updatePurchase,
        approvePurchase,
        rejectPurchase,
        receivePurchase,
        getPurchase,
        getSupplier
      }}
    >
      {children}
    </PurchasesContext.Provider>
  );
};