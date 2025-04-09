/**
 * Player attribute measurement and analysis system
 * Based on standardized NBA-inspired attribute recording methodology
 */

// Define all measurable attributes with their positions-specific weightings
export const PLAYER_ATTRIBUTES = {
  // Physical Attributes
  height: { name: "Height", category: "physical" },
  weight: { name: "Weight", category: "physical" },
  wingspan: { name: "Wingspan", category: "physical" },
  speed: { name: "Speed", category: "physical" },
  acceleration: { name: "Acceleration", category: "physical" },
  agility: { name: "Agility", category: "physical" },
  verticalJump: { name: "Vertical Jump", category: "physical" },
  strength: { name: "Strength", category: "physical" },
  
  // Technical Attributes
  shooting: { name: "Shooting", category: "technical" },
  freeThrows: { name: "Free Throws", category: "technical" },
  ballHandling: { name: "Ball Handling", category: "technical" },
  passing: { name: "Passing", category: "technical" },
  finishing: { name: "Finishing", category: "technical" },
  postMoves: { name: "Post Moves", category: "technical" },
  offBallMovement: { name: "Off-Ball Movement", category: "technical" },
  
  // Defensive Attributes
  perimeterDefense: { name: "Perimeter Defense", category: "defensive" },
  interiorDefense: { name: "Interior Defense", category: "defensive" },
  helpDefense: { name: "Help Defense", category: "defensive" },
  rebounding: { name: "Rebounding", category: "defensive" },
  shotBlocking: { name: "Shot Blocking", category: "defensive" },
  stealing: { name: "Stealing", category: "defensive" },
  
  // Mental/Cognitive Attributes
  basketballIQ: { name: "Basketball IQ", category: "mental" },
  decisionMaking: { name: "Decision Making", category: "mental" },
  leadership: { name: "Leadership", category: "mental" },
  composure: { name: "Composure", category: "mental" },
  workEthic: { name: "Work Ethic", category: "mental" },
  coachability: { name: "Coachability", category: "mental" },
};

export type AttributeKey = keyof typeof PLAYER_ATTRIBUTES;
export type AttributeCategory = "physical" | "technical" | "defensive" | "mental";

// Position-specific attribute weightings (values add up to 100%)
export const POSITION_WEIGHTINGS: Record<Position, Partial<Record<AttributeKey, number>>> = {
  "PG": { // Point Guard
    ballHandling: 0.15,
    passing: 0.15,
    speed: 0.10,
    acceleration: 0.05,
    basketballIQ: 0.12,
    decisionMaking: 0.08,
    shooting: 0.15,
    perimeterDefense: 0.08,
    agility: 0.05,
    composure: 0.07,
  },
  "SG": { // Shooting Guard
    shooting: 0.20,
    offBallMovement: 0.15,
    speed: 0.08,
    acceleration: 0.07,
    finishing: 0.10,
    ballHandling: 0.10,
    perimeterDefense: 0.12,
    agility: 0.08,
    decisionMaking: 0.05,
    basketballIQ: 0.05,
  },
  "SF": { // Small Forward
    shooting: 0.15,
    agility: 0.07,
    speed: 0.07,
    strength: 0.06,
    verticalJump: 0.05,
    perimeterDefense: 0.10,
    finishing: 0.10,
    ballHandling: 0.08,
    passing: 0.07,
    rebounding: 0.08,
    offBallMovement: 0.09,
    basketballIQ: 0.09,
  },
  "PF": { // Power Forward
    strength: 0.15,
    rebounding: 0.15,
    interiorDefense: 0.10,
    finishing: 0.10,
    postMoves: 0.08,
    shooting: 0.07,
    verticalJump: 0.08,
    helpDefense: 0.10,
    shotBlocking: 0.07,
    basketballIQ: 0.05,
    offBallMovement: 0.05,
  },
  "C": { // Center
    height: 0.08,
    wingspan: 0.07,
    strength: 0.15,
    rebounding: 0.15,
    interiorDefense: 0.15,
    shotBlocking: 0.10,
    postMoves: 0.08,
    finishing: 0.10,
    helpDefense: 0.07,
    basketballIQ: 0.05,
  }
};

export type Position = "PG" | "SG" | "SF" | "PF" | "C";

/**
 * Player attribute scoring system
 * Scores are on a 0-20 scale where:
 * 0-4: Substantially below standard
 * 5-9: Basic competency
 * 10-14: Average to above-average 
 * 15-19: High-level performance
 * 20: Elite/exceptional (top 1%)
 */

export const SKILL_LEVEL_DESCRIPTIONS: Record<string, string> = {
  "foundation": "Foundational Stage (Needs significant development)",
  "developing": "Developmental Stage (Actively improving)",
  "advanced": "Advanced Stage (Strong competency)",
  "elite": "Elite Stage (Exceptional ability)"
};

export interface AttributeScore {
  value: number;
  potential: number;
}

export interface PlayerAttributes {
  [key: string]: AttributeScore;
}

/**
 * Calculate skill level description based on attribute score
 */
export function getSkillLevelFromScore(score: number): string {
  if (score >= 0 && score <= 5) return SKILL_LEVEL_DESCRIPTIONS.foundation;
  if (score > 5 && score <= 10) return SKILL_LEVEL_DESCRIPTIONS.developing;
  if (score > 10 && score <= 15) return SKILL_LEVEL_DESCRIPTIONS.advanced;
  if (score > 15) return SKILL_LEVEL_DESCRIPTIONS.elite;
  return "Unknown";
}

/**
 * Get CSS class for attribute score visualization
 */
export function getAttributeScoreClass(score: number): string {
  if (score >= 16) return "bg-green-600 text-white"; // Excellent
  if (score >= 11) return "bg-blue-600 text-white";  // Good
  if (score >= 6) return "bg-amber-600 text-white"; // Average
  return "bg-red-600 text-white"; // Poor
}

/**
 * Calculate overall player rating based on attributes and position
 * @param attributes Player attribute scores
 * @param position Player position
 * @returns Rating on 0-100 scale
 */
export function calculateOverallRating(
  attributes: PlayerAttributes,
  position: Position
): number {
  const positionWeights = POSITION_WEIGHTINGS[position];
  let weightedSum = 0;
  let weightTotal = 0;
  
  // Calculate weighted sum of attributes
  for (const [attr, weight] of Object.entries(positionWeights)) {
    if (attributes[attr]) {
      weightedSum += attributes[attr].value * weight;
      weightTotal += weight;
    }
  }
  
  // Normalize to ensure weights add up to 1
  const normalizedScore = weightedSum / weightTotal;
  
  // Convert to 0-100 scale
  return Math.round(normalizedScore * 5);
}

/**
 * Convert 0-100 rating to star rating (1-5 stars)
 */
export function convertRatingToStars(rating: number): number {
  if (rating >= 80) return 5;
  if (rating >= 60) return 4;
  if (rating >= 40) return 3;
  if (rating >= 20) return 2;
  return 1;
}

/**
 * Generate training recommendations based on attribute scores and position
 */
export function generateTrainingRecommendations(
  attributes: PlayerAttributes,
  position: Position
): TrainingRecommendation[] {
  const recommendations: TrainingRecommendation[] = [];
  const positionWeights = POSITION_WEIGHTINGS[position];
  
  // Sort attributes by positional importance and current score
  const prioritizedAttributes = Object.entries(attributes)
    .filter(([attr]) => attr in positionWeights)
    .sort((a, b) => {
      const weightA = positionWeights[a[0] as AttributeKey] || 0;
      const weightB = positionWeights[b[0] as AttributeKey] || 0;
      
      // Calculate priority score (higher weight and lower current score = higher priority)
      const priorityA = weightA * (1 - (a[1].value / 20));
      const priorityB = weightB * (1 - (b[1].value / 20));
      
      return priorityB - priorityA;
    });
    
  // Get top attributes to focus on
  const topAttributes = prioritizedAttributes.slice(0, 5);
  
  // Generate recommendations for each high priority attribute
  topAttributes.forEach(([attrKey, score]) => {
    const attr = attrKey as AttributeKey;
    const attrName = PLAYER_ATTRIBUTES[attr]?.name || attr;
    const currentScore = score.value;
    
    // Generate recommendation based on current score level
    let recommendation: TrainingRecommendation;
    
    if (currentScore <= 5) {
      // Foundation stage
      recommendation = {
        id: Math.random(),
        title: `Focus on ${attrName} Fundamentals`,
        description: `Establish solid foundation in ${attrName.toLowerCase()} with basic drills and technique development.`,
        duration: "30-45 min daily",
        priority: "High",
        category: PLAYER_ATTRIBUTES[attr]?.category || "technical",
        icon: getIconForAttribute(attr)
      };
    } else if (currentScore <= 10) {
      // Development stage
      recommendation = {
        id: Math.random(),
        title: `Develop ${attrName} Consistency`,
        description: `Build on fundamentals with increased volume and variety of ${attrName.toLowerCase()} training.`,
        duration: "25-35 min daily",
        priority: "Medium-High",
        category: PLAYER_ATTRIBUTES[attr]?.category || "technical",
        icon: getIconForAttribute(attr)
      };
    } else if (currentScore <= 15) {
      // Advanced stage
      recommendation = {
        id: Math.random(),
        title: `Advanced ${attrName} Development`,
        description: `Implement game-situation training focused on applying ${attrName.toLowerCase()} skills under pressure.`,
        duration: "20-30 min daily",
        priority: "Medium",
        category: PLAYER_ATTRIBUTES[attr]?.category || "technical",
        icon: getIconForAttribute(attr)
      };
    } else {
      // Elite/maintenance stage
      recommendation = {
        id: Math.random(),
        title: `Elite ${attrName} Refinement`,
        description: `Maintain excellence with specialized ${attrName.toLowerCase()} training and edge-case development.`,
        duration: "15-20 min daily",
        priority: "Maintenance",
        category: PLAYER_ATTRIBUTES[attr]?.category || "technical",
        icon: getIconForAttribute(attr)
      };
    }
    
    recommendations.push(recommendation);
  });
  
  return recommendations;
}

export interface TrainingRecommendation {
  id: number;
  title: string;
  description: string;
  duration: string;
  priority: string;
  category: string;
  icon: string;
}

// Helper to get icon for attribute type
function getIconForAttribute(attr: AttributeKey): string {
  const iconMap: Partial<Record<AttributeKey, string>> = {
    shooting: "target",
    freeThrows: "bullseye",
    ballHandling: "dribble",
    passing: "exchange",
    finishing: "basketball",
    speed: "runner",
    agility: "movement",
    strength: "dumbbell",
    verticalJump: "trending-up",
    basketballIQ: "brain",
    decisionMaking: "git-branch",
    rebounding: "box",
    perimeterDefense: "shield",
    interiorDefense: "shield-alert",
    composure: "heart",
    workEthic: "flame",
  };
  
  return iconMap[attr] || "activity";
}