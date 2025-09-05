export interface FoodItem {
  id: string;
  name: string;
  category: string;
  commonSizes: string[];
}

export interface DrinkItem {
  id: string;
  name: string;
  category: string;
  commonSizes: string[];
}

export interface SupplementItem {
  id: string;
  name: string;
  commonDoses: string[];
}

export interface ExerciseActivity {
  id: string;
  name: string;
  category: string;
}

export const foodDatabase: FoodItem[] = [
  // Grains & Cereals
  { id: 'f1', name: 'White Bread', category: 'Grains', commonSizes: ['1 slice', '2 slices', '1 piece'] },
  { id: 'f2', name: 'Brown Bread', category: 'Grains', commonSizes: ['1 slice', '2 slices', '1 piece'] },
  { id: 'f3', name: 'Oatmeal', category: 'Grains', commonSizes: ['1/2 cup dry', '1 cup cooked', '1 bowl'] },
  { id: 'f4', name: 'White Rice', category: 'Grains', commonSizes: ['1/2 cup', '1 cup', '1 bowl'] },
  { id: 'f5', name: 'Brown Rice', category: 'Grains', commonSizes: ['1/2 cup', '1 cup', '1 bowl'] },
  { id: 'f6', name: 'Pasta', category: 'Grains', commonSizes: ['1/2 cup', '1 cup', '1 bowl'] },
  { id: 'f7', name: 'Quinoa', category: 'Grains', commonSizes: ['1/2 cup', '1 cup', '1 bowl'] },
  
  // Proteins
  { id: 'f8', name: 'Chicken Breast', category: 'Protein', commonSizes: ['3 oz', '4 oz', '1 piece'] },
  { id: 'f9', name: 'Ground Beef', category: 'Protein', commonSizes: ['3 oz', '4 oz', '1 patty'] },
  { id: 'f10', name: 'Salmon', category: 'Protein', commonSizes: ['3 oz', '4 oz', '1 fillet'] },
  { id: 'f11', name: 'Eggs', category: 'Protein', commonSizes: ['1 egg', '2 eggs', '3 eggs'] },
  { id: 'f12', name: 'Tofu', category: 'Protein', commonSizes: ['3 oz', '1/2 cup', '1 block'] },
  { id: 'f13', name: 'Black Beans', category: 'Protein', commonSizes: ['1/2 cup', '1 cup', '1 serving'] },
  { id: 'f14', name: 'Lentils', category: 'Protein', commonSizes: ['1/2 cup', '1 cup', '1 serving'] },
  
  // Dairy
  { id: 'f15', name: 'Milk (Whole)', category: 'Dairy', commonSizes: ['1 cup', '8 oz', '1 glass'] },
  { id: 'f16', name: 'Milk (Almond)', category: 'Dairy Alternative', commonSizes: ['1 cup', '8 oz', '1 glass'] },
  { id: 'f17', name: 'Yogurt (Greek)', category: 'Dairy', commonSizes: ['1 cup', '6 oz container', '1 serving'] },
  { id: 'f18', name: 'Cheese (Cheddar)', category: 'Dairy', commonSizes: ['1 oz', '1 slice', '1/4 cup shredded'] },
  { id: 'f19', name: 'Butter', category: 'Dairy', commonSizes: ['1 tsp', '1 tbsp', '1 pat'] },
  
  // Fruits
  { id: 'f20', name: 'Apple', category: 'Fruits', commonSizes: ['1 medium', '1 large', '1 small'] },
  { id: 'f21', name: 'Banana', category: 'Fruits', commonSizes: ['1 medium', '1 large', '1 small'] },
  { id: 'f22', name: 'Orange', category: 'Fruits', commonSizes: ['1 medium', '1 large', '1 small'] },
  { id: 'f23', name: 'Berries (Mixed)', category: 'Fruits', commonSizes: ['1/2 cup', '1 cup', '1 handful'] },
  { id: 'f24', name: 'Grapes', category: 'Fruits', commonSizes: ['1/2 cup', '1 cup', '1 bunch'] },
  
  // Vegetables
  { id: 'f25', name: 'Broccoli', category: 'Vegetables', commonSizes: ['1/2 cup', '1 cup', '1 head'] },
  { id: 'f26', name: 'Carrots', category: 'Vegetables', commonSizes: ['1 medium', '1/2 cup', '1 cup'] },
  { id: 'f27', name: 'Spinach', category: 'Vegetables', commonSizes: ['1 cup raw', '1/2 cup cooked', '1 handful'] },
  { id: 'f28', name: 'Tomatoes', category: 'Vegetables', commonSizes: ['1 medium', '1/2 cup', '1 slice'] },
  { id: 'f29', name: 'Onions', category: 'Vegetables', commonSizes: ['1 medium', '1/2 cup', '1/4 cup'] },
  { id: 'f30', name: 'Bell Peppers', category: 'Vegetables', commonSizes: ['1 medium', '1/2 cup', '1 pepper'] },
  
  // Snacks & Others
  { id: 'f31', name: 'Nuts (Mixed)', category: 'Snacks', commonSizes: ['1 oz', '1/4 cup', '1 handful'] },
  { id: 'f32', name: 'Potato Chips', category: 'Snacks', commonSizes: ['1 oz', '1 bag', '10-15 chips'] },
  { id: 'f33', name: 'Dark Chocolate', category: 'Snacks', commonSizes: ['1 square', '1 oz', '2 squares'] },
  { id: 'f34', name: 'Avocado', category: 'Fats', commonSizes: ['1/2 avocado', '1 avocado', '1/4 cup'] },
  { id: 'f35', name: 'Olive Oil', category: 'Fats', commonSizes: ['1 tsp', '1 tbsp', '2 tbsp'] }
];

export const drinkDatabase: DrinkItem[] = [
  // Caffeinated
  { id: 'd1', name: 'Coffee (Black)', category: 'Caffeinated', commonSizes: ['8 oz', '12 oz', '16 oz'] },
  { id: 'd2', name: 'Coffee with Milk', category: 'Caffeinated', commonSizes: ['8 oz', '12 oz', '16 oz'] },
  { id: 'd3', name: 'Espresso', category: 'Caffeinated', commonSizes: ['1 shot', '2 shots', '1 cup'] },
  { id: 'd4', name: 'Green Tea', category: 'Caffeinated', commonSizes: ['8 oz', '12 oz', '1 cup'] },
  { id: 'd5', name: 'Black Tea', category: 'Caffeinated', commonSizes: ['8 oz', '12 oz', '1 cup'] },
  
  // Non-Caffeinated
  { id: 'd6', name: 'Water', category: 'Non-Caffeinated', commonSizes: ['8 oz', '12 oz', '16 oz', '20 oz'] },
  { id: 'd7', name: 'Herbal Tea', category: 'Non-Caffeinated', commonSizes: ['8 oz', '12 oz', '1 cup'] },
  { id: 'd8', name: 'Sparkling Water', category: 'Non-Caffeinated', commonSizes: ['8 oz', '12 oz', '16 oz'] },
  
  // Juices
  { id: 'd9', name: 'Orange Juice', category: 'Juices', commonSizes: ['4 oz', '8 oz', '12 oz'] },
  { id: 'd10', name: 'Apple Juice', category: 'Juices', commonSizes: ['4 oz', '8 oz', '12 oz'] },
  { id: 'd11', name: 'Vegetable Juice', category: 'Juices', commonSizes: ['4 oz', '8 oz', '12 oz'] },
  
  // Alcoholic
  { id: 'd12', name: 'Beer', category: 'Alcoholic', commonSizes: ['12 oz', '16 oz', '1 bottle'] },
  { id: 'd13', name: 'Wine', category: 'Alcoholic', commonSizes: ['4 oz', '6 oz', '1 glass'] },
  
  // Dairy/Alternatives
  { id: 'd14', name: 'Milk (Whole)', category: 'Dairy', commonSizes: ['8 oz', '12 oz', '1 cup'] },
  { id: 'd15', name: 'Almond Milk', category: 'Dairy Alternative', commonSizes: ['8 oz', '12 oz', '1 cup'] },
  { id: 'd16', name: 'Oat Milk', category: 'Dairy Alternative', commonSizes: ['8 oz', '12 oz', '1 cup'] },
  { id: 'd17', name: 'Soy Milk', category: 'Dairy Alternative', commonSizes: ['8 oz', '12 oz', '1 cup'] }
];

export const supplementDatabase: SupplementItem[] = [
  { id: 's1', name: 'Multivitamin', commonDoses: ['1 tablet', '1 capsule', '2 tablets'] },
  { id: 's2', name: 'Probiotics', commonDoses: ['1 capsule', '2 capsules', '1 tablet'] },
  { id: 's3', name: 'Vitamin D', commonDoses: ['1000 IU', '2000 IU', '1 tablet'] },
  { id: 's4', name: 'Vitamin B12', commonDoses: ['1000 mcg', '2500 mcg', '1 tablet'] },
  { id: 's5', name: 'Iron', commonDoses: ['18mg', '25mg', '1 tablet'] },
  { id: 's6', name: 'Calcium', commonDoses: ['500mg', '1000mg', '1 tablet'] },
  { id: 's7', name: 'Magnesium', commonDoses: ['200mg', '400mg', '1 capsule'] },
  { id: 's8', name: 'Omega-3', commonDoses: ['1000mg', '1 capsule', '2 capsules'] },
  { id: 's9', name: 'Fiber Supplement', commonDoses: ['1 tsp', '1 tbsp', '1 packet'] },
  { id: 's10', name: 'Digestive Enzymes', commonDoses: ['1 capsule', '2 capsules', '1 tablet'] }
];

export const exerciseDatabase: ExerciseActivity[] = [
  // Cardio
  { id: 'e1', name: 'Walking', category: 'Cardio' },
  { id: 'e2', name: 'Running', category: 'Cardio' },
  { id: 'e3', name: 'Cycling', category: 'Cardio' },
  { id: 'e4', name: 'Swimming', category: 'Cardio' },
  { id: 'e5', name: 'Dancing', category: 'Cardio' },
  
  // Strength
  { id: 'e6', name: 'Weight Lifting', category: 'Strength' },
  { id: 'e7', name: 'Bodyweight Exercise', category: 'Strength' },
  { id: 'e8', name: 'Resistance Bands', category: 'Strength' },
  
  // Flexibility
  { id: 'e9', name: 'Yoga', category: 'Flexibility' },
  { id: 'e10', name: 'Stretching', category: 'Flexibility' },
  { id: 'e11', name: 'Pilates', category: 'Flexibility' },
  
  // Sports
  { id: 'e12', name: 'Tennis', category: 'Sports' },
  { id: 'e13', name: 'Basketball', category: 'Sports' },
  { id: 'e14', name: 'Soccer', category: 'Sports' },
  { id: 'e15', name: 'Golf', category: 'Sports' },
  
  // Low Impact
  { id: 'e16', name: 'Tai Chi', category: 'Low Impact' },
  { id: 'e17', name: 'Water Aerobics', category: 'Low Impact' },
  { id: 'e18', name: 'Gentle Stretching', category: 'Low Impact' }
];

export const searchFoods = (query: string, limit = 10): FoodItem[] => {
  if (!query.trim()) return foodDatabase.slice(0, limit);
  
  const filtered = foodDatabase.filter(food =>
    food.name.toLowerCase().includes(query.toLowerCase()) ||
    food.category.toLowerCase().includes(query.toLowerCase())
  );
  
  return filtered.slice(0, limit);
};

export const searchDrinks = (query: string, limit = 10): DrinkItem[] => {
  if (!query.trim()) return drinkDatabase.slice(0, limit);
  
  const filtered = drinkDatabase.filter(drink =>
    drink.name.toLowerCase().includes(query.toLowerCase()) ||
    drink.category.toLowerCase().includes(query.toLowerCase())
  );
  
  return filtered.slice(0, limit);
};

export const searchSupplements = (query: string, limit = 10): SupplementItem[] => {
  if (!query.trim()) return supplementDatabase.slice(0, limit);
  
  const filtered = supplementDatabase.filter(supplement =>
    supplement.name.toLowerCase().includes(query.toLowerCase())
  );
  
  return filtered.slice(0, limit);
};

export const searchExercises = (query: string, limit = 10): ExerciseActivity[] => {
  if (!query.trim()) return exerciseDatabase.slice(0, limit);
  
  const filtered = exerciseDatabase.filter(exercise =>
    exercise.name.toLowerCase().includes(query.toLowerCase()) ||
    exercise.category.toLowerCase().includes(query.toLowerCase())
  );
  
  return filtered.slice(0, limit);
};