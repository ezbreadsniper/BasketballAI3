// Constants for skill levels
export const SKILL_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  ELITE: 'elite'
};

// Calculate player skill level based on attribute scores
export function calculateSkillLevel(attributeScore: number): string {
  if (attributeScore < 50) return SKILL_LEVELS.BEGINNER;
  if (attributeScore < 70) return SKILL_LEVELS.INTERMEDIATE;
  if (attributeScore < 90) return SKILL_LEVELS.ADVANCED;
  return SKILL_LEVELS.ELITE;
}

// Calculate a weighted score from multiple attributes
export function calculateWeightedScore(attributes: Record<string, number>, weights: Record<string, number>): number {
  let totalWeight = 0;
  let weightedSum = 0;

  for (const attr in weights) {
    if (attributes[attr] !== undefined) {
      weightedSum += attributes[attr] * weights[attr];
      totalWeight += weights[attr];
    }
  }

  return totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 10) / 10 : 0;
}

// Position-specific attribute weights
export const POSITION_ATTRIBUTE_WEIGHTS = {
  'point-guard': {
    speed: 0.9,
    ballHandling: 1.0,
    passing: 1.0,
    courtVision: 0.9,
    perimeter_defense: 0.8,
    shooting: 0.7,
    finishing: 0.6,
    strength: 0.5
  },
  'shooting-guard': {
    shooting: 1.0,
    ballHandling: 0.8,
    speed: 0.7,
    perimeter_defense: 0.7,
    finishing: 0.7,
    courtVision: 0.6,
    passing: 0.6,
    strength: 0.5
  },
  'small-forward': {
    finishing: 0.9,
    shooting: 0.8,
    perimeter_defense: 0.8,
    athleticism: 0.8,
    ballHandling: 0.7,
    speed: 0.7,
    strength: 0.7,
    post_moves: 0.6
  },
  'power-forward': {
    strength: 0.9,
    rebounding: 0.9,
    post_defense: 0.8,
    post_moves: 0.8,
    finishing: 0.8,
    athleticism: 0.7,
    shooting: 0.6,
    perimeter_defense: 0.5
  },
  'center': {
    rebounding: 1.0,
    post_defense: 1.0,
    strength: 0.9,
    post_moves: 0.9,
    finishing: 0.8,
    athleticism: 0.7,
    passing: 0.5,
    shooting: 0.4
  }
};

// Generate AI training recommendations based on player profile
export function generateTrainingRecommendations(
  playerProfile: any,
  position: string,
  skillLevel: string
): any[] {
  // This is a simplified mock implementation
  // In a real system, this would use a more sophisticated algorithm
  
  const recommendations = [];
  const attributes = playerProfile.attributes || {};
  
  // Find the weakest attributes for the position
  const positionWeights = POSITION_ATTRIBUTE_WEIGHTS[position as keyof typeof POSITION_ATTRIBUTE_WEIGHTS] || {};
  const attributeScores: [string, number][] = [];
  
  for (const attr in positionWeights) {
    if (attributes[attr]) {
      attributeScores.push([attr, attributes[attr] * positionWeights[attr]]);
    }
  }
  
  // Sort by weighted score (ascending)
  attributeScores.sort((a, b) => a[1] - b[1]);
  
  // Recommend training for the 3 weakest areas
  const weakestAttributes = attributeScores.slice(0, 3).map(item => item[0]);
  
  // Create recommendations based on the weakest attributes
  weakestAttributes.forEach(attr => {
    const recommendation = createRecommendationForAttribute(attr, attributes[attr], skillLevel);
    if (recommendation) {
      recommendations.push(recommendation);
    }
  });
  
  return recommendations;
}

// Helper function to create recommendations for specific attributes
function createRecommendationForAttribute(attribute: string, score: number, skillLevel: string): any {
  // This would be expanded in a real implementation with more detailed recommendations
  
  const recommendations: Record<string, any> = {
    'shooting': {
      title: 'Shooting Form Improvement',
      description: 'Focus on proper shooting mechanics and form to improve consistency.',
      duration: '30 minutes daily',
      priority: score < 5 ? 'High' : 'Medium',
      category: 'shooting',
      icon: 'clock'
    },
    'ballHandling': {
      title: 'Ball Handling Development',
      description: 'Incorporate advanced dribbling drills to improve control and confidence.',
      duration: '20 minutes daily',
      priority: score < 5 ? 'High' : 'Medium',
      category: 'dribbling',
      icon: 'code'
    },
    'speed': {
      title: 'Speed and Agility Training',
      description: 'Implement sprint and agility ladder drills to improve quickness on the court.',
      duration: '25 minutes, 3x weekly',
      priority: score < 5 ? 'High' : 'Medium',
      category: 'athletic',
      icon: 'award'
    },
    'strength': {
      title: 'Strength Development',
      description: 'Focus on resistance training to improve on-court physicality and durability.',
      duration: '40 minutes, 3x weekly',
      priority: score < 5 ? 'High' : 'Medium',
      category: 'athletic',
      icon: 'award'
    },
    'finishing': {
      title: 'Finishing at the Rim',
      description: 'Practice various layup techniques and contact finishing drills.',
      duration: '30 minutes, 3x weekly',
      priority: score < 5 ? 'High' : 'Medium',
      category: 'shooting',
      icon: 'clock'
    }
  };
  
  return recommendations[attribute] || null;
}
