
import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

const OnlineUsers = () => {
  const [onlineCount, setOnlineCount] = useState(1);

  useEffect(() => {
    // Simuler le nombre d'utilisateurs connectés avec une variation réaliste
    const updateOnlineCount = () => {
      const baseCount = Math.floor(Math.random() * 5) + 1; // 1-5 utilisateurs de base
      const timeVariation = Math.floor(Math.sin(Date.now() / 60000) * 3) + 3; // Variation selon l'heure
      setOnlineCount(Math.max(1, baseCount + timeVariation));
    };

    updateOnlineCount();
    const interval = setInterval(updateOnlineCount, 30000); // Mise à jour toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <Users size={14} />
      <span className="font-medium">{onlineCount}</span>
      <span className="hidden sm:inline">en ligne</span>
    </div>
  );
};

export default OnlineUsers;
