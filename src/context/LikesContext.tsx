import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface LikesContextType {
  likedProducts: string[];
  toggleLike: (productId: string) => void;
  isLiked: (productId: string) => boolean;
}

const LikesContext = createContext<LikesContextType>({
  likedProducts: [],
  toggleLike: () => {},
  isLiked: () => false
});

export const useLikes = () => useContext(LikesContext);

export const LikesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [likedProducts, setLikedProducts] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      const userLikes = localStorage.getItem(`likes_${user.id}`);
      if (userLikes) {
        setLikedProducts(JSON.parse(userLikes));
      }
    } else {
      setLikedProducts([]);
    }
  }, [user]);

  const toggleLike = (productId: string) => {
    if (!user) return;

    const newLikedProducts = likedProducts.includes(productId)
      ? likedProducts.filter(id => id !== productId)
      : [...likedProducts, productId];

    setLikedProducts(newLikedProducts);
    localStorage.setItem(`likes_${user.id}`, JSON.stringify(newLikedProducts));
  };

  const isLiked = (productId: string) => {
    return likedProducts.includes(productId);
  };

  return (
    <LikesContext.Provider value={{ likedProducts, toggleLike, isLiked }}>
      {children}
    </LikesContext.Provider>
  );
};