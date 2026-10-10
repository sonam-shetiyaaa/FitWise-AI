/**
 * Mifflin–St Jeor Nutrition & Metabolic Calculator
 * Accurately computes BMR, TDEE, Calorie Targets, and Macro Splits
 */

export const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary', multiplier: 1.2, displayMul: '× 1.2' },
  { id: 'lightly_active', label: 'Lightly Active', multiplier: 1.375, displayMul: '× 1.375' },
  { id: 'moderately_active', label: 'Moderately Active', multiplier: 1.55, displayMul: '× 1.55' },
  { id: 'very_active', label: 'Very Active', multiplier: 1.725, displayMul: '× 1.725' },
];

export const GOALS = [
  { id: 'fat_loss', label: 'Fat Loss', offset: -400, displayOffset: '-400 kcal' },
  { id: 'muscle_hypertrophy', label: 'Muscle Hypertrophy', offset: 300, displayOffset: '+300 kcal' },
  { id: 'maintenance', label: 'Maintenance', offset: 0, displayOffset: '+0 kcal' },
];

export const DIET_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Non-Veg',
  'Lactose Intolerant',
  'Nut Allergy',
  'Gluten Free',
];

export function calculateTargets(profile) {
  const gender = profile.gender || 'Male';
  const age = Number(profile.age) || 20;
  const height = Number(profile.height) || 173; // cm
  const weight = Number(profile.weight) || 65; // kg
  const targetWeight = Number(profile.targetWeight) || 70; // kg

  // 1. Mifflin–St Jeor BMR
  // Men: BMR = 10 * weight + 6.25 * height - 5 * age + 5
  // Women: BMR = 10 * weight + 6.25 * height - 5 * age - 161
  let bmrRaw = (10 * weight) + (6.25 * height) - (5 * age);
  if (gender.toLowerCase() === 'female') {
    bmrRaw -= 161;
  } else {
    bmrRaw += 5;
  }
  const bmr = Math.round(bmrRaw);

  // 2. TDEE
  const actObj = ACTIVITY_LEVELS.find((a) => a.label.toLowerCase() === (profile.activityLevel || '').toLowerCase() || a.id === profile.activityLevelId) || ACTIVITY_LEVELS[2];
  const multiplier = actObj.multiplier;
  const tdeeRaw = bmrRaw * multiplier;
  const tdee = Math.round(tdeeRaw);

  // 3. Goal Adjustment & Calorie Target
  const goalObj = GOALS.find((g) => g.label.toLowerCase() === (profile.goal || profile.fitnessGoal || '').toLowerCase() || g.id === profile.goalId) || GOALS[1];
  const offset = goalObj.offset;
  const targetCaloriesRaw = Math.max(1200, tdeeRaw + offset);
  const targetCalories = Math.round(targetCaloriesRaw);

  // 4. Macro Splits
  // Protein: 2.0g per kg of bodyweight
  const proteinGrams = Math.round(weight * 2.0);
  const proteinCalories = proteinGrams * 4;
  const proteinPercent = Math.round((proteinCalories / targetCalories) * 100);

  // Fats: 25% of total calorie target
  const fatCalories = targetCalories * 0.25;
  const fatGrams = Math.round(fatCalories / 9);
  const fatPercent = 25;

  // Carbs: Remainder of calories
  const carbCalories = Math.max(0, targetCalories - proteinCalories - fatCalories);
  const carbsGrams = Math.round(carbCalories / 4);
  const carbsPercent = Math.max(0, 100 - proteinPercent - fatPercent);

  // Weight difference
  const toTargetWeight = targetWeight - weight;

  return {
    bmr,
    tdee,
    targetCalories,
    offset,
    goalLabel: goalObj.label,
    activityLabel: actObj.label,
    multiplier,
    protein: {
      grams: proteinGrams,
      percent: proteinPercent,
      perKg: '2g/kg',
    },
    carbs: {
      grams: carbsGrams,
      percent: carbsPercent,
      label: 'remainder',
    },
    fats: {
      grams: fatGrams,
      percent: fatPercent,
      label: 'of kcal',
    },
    weight,
    targetWeight,
    toTargetWeight: (toTargetWeight >= 0 ? `+${toTargetWeight.toFixed(1)}` : `${toTargetWeight.toFixed(1)}`) + ' kg',
  };
}
