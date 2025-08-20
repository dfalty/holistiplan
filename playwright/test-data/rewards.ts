export interface RewardData {
  index: number;
  title: string;
  points: number;
  description: string;
  requiredPoints: number; // How many +5 point clicks needed
}

export const REWARD_DATA: readonly RewardData[] = [
  {
    index: 0,
    title: 'Tote Bag of Holding',
    points: 2.75,
    description: 'Tote bag emblazoned with Django logo that magically expands to accommodate all the swag you collect.',
    requiredPoints: 1 // Add 5 points
  },
  {
    index: 1,
    title: 'Potion of Endless Coffee',
    points: 2.25,
    description: 'A tiny vial that, when opened, releases the invigorating aroma of freshly brewed coffee.',
    requiredPoints: 1 // Add 5 points
  },
  {
    index: 2,
    title: 'Wand of Presentation',
    points: 1.50,
    description: 'Wield to advance, pause, or rewind presentation slides.',
    requiredPoints: 1 // Add 5 points
  },
  {
    index: 3,
    title: 'Mimic Mouse Pad',
    points: 2.00,
    description: 'A perfectly ordinary mouse pad. Right...? It is just a mouse pad, isn\'t it?',
    requiredPoints: 1 // Add 5 points
  },
  {
    index: 4,
    title: 'Scroll of Infinite WiFi',
    points: 3.75,
    description: 'When unfurled, creates a area of super-fast secure WiFi for you and your companions.',
    requiredPoints: 2 // Add 10 points (2x +5)
  },
  {
    index: 5,
    title: 'T-Shirt +2',
    points: 2.00,
    description: 'Official DjangoCon 2023 T-shirt, +2 to Armor Class.',
    requiredPoints: 1 // Add 5 points
  }
] as const;

// Helper functions for working with reward data
export const getRewardByIndex = (index: number): RewardData => {
  const reward = REWARD_DATA.find(r => r.index === index);
  if (!reward) {
    throw new Error(`Reward with index ${index} not found`);
  }
  return reward;
};

export const getRewardByTitle = (title: string): RewardData => {
  const reward = REWARD_DATA.find(r => r.title === title);
  if (!reward) {
    throw new Error(`Reward with title "${title}" not found`);
  }
  return reward;
};

export const getTotalRewardCost = (): number => {
  return REWARD_DATA.reduce((total, reward) => total + reward.points, 0);
};

export const getTotalRequiredPoints = (): number => {
  return REWARD_DATA.reduce((total, reward) => total + reward.requiredPoints, 0);
};


