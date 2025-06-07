export const encouragementMessages = [
  "Que cette journée soit remplie de la paix de Dieu 🕊️",
  "N'oublie pas que Dieu a un plan merveilleux pour ta vie ✨",
  "Tu es précieux(se) aux yeux de Dieu 💎",
  "Prends un moment pour remercier Dieu aujourd'hui 🙏",
  "Que la joie du Seigneur soit ta force 💪",
  "Dieu est avec toi dans chaque épreuve 🤗",
  "Tes prières ont du pouvoir, continue à prier 🌟"
];

export const getRandomEncouragement = (): string => {
  return encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
};
