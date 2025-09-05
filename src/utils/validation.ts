export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class ValidationService {
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    
    if (!email || email.trim() === '') {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Please enter a valid email address');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateAccessCode(code: string): ValidationResult {
    const errors: string[] = [];
    
    if (!code || code.trim() === '') {
      errors.push('Access code is required');
    } else if (code.length !== 6) {
      errors.push('Access code must be 6 characters long');
    } else if (!/^[A-Z0-9]+$/.test(code)) {
      errors.push('Access code must contain only letters and numbers');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateFoodEntry(data: any): ValidationResult {
    const errors: string[] = [];

    if (!data.foodItem || data.foodItem.trim() === '') {
      errors.push('Food item is required');
    }

    if (!data.portion || data.portion.trim() === '') {
      errors.push('Portion size is required');
    }

    if (!data.mealType) {
      errors.push('Meal type is required');
    }

    if (!data.timestamp) {
      errors.push('Date and time are required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateDrinkEntry(data: any): ValidationResult {
    const errors: string[] = [];

    if (!data.drinkItem || data.drinkItem.trim() === '') {
      errors.push('Drink item is required');
    }

    if (!data.amount || data.amount.trim() === '') {
      errors.push('Amount is required');
    }

    if (!data.timestamp) {
      errors.push('Date and time are required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateSymptomEntry(data: any): ValidationResult {
    const errors: string[] = [];

    if (!data.symptomType) {
      errors.push('Symptom type is required');
    }

    if (data.symptomType === 'other' && (!data.customSymptom || data.customSymptom.trim() === '')) {
      errors.push('Custom symptom description is required');
    }

    if (!data.severity || data.severity < 1 || data.severity > 10) {
      errors.push('Severity must be between 1 and 10');
    }

    if (!data.timestamp) {
      errors.push('Date and time are required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateSupplementEntry(data: any): ValidationResult {
    const errors: string[] = [];

    if (!data.supplementName || data.supplementName.trim() === '') {
      errors.push('Supplement name is required');
    }

    if (!data.dose || data.dose.trim() === '') {
      errors.push('Dose is required');
    }

    if (!data.timestamp) {
      errors.push('Date and time are required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateExerciseEntry(data: any): ValidationResult {
    const errors: string[] = [];

    if (!data.activityType || data.activityType.trim() === '') {
      errors.push('Activity type is required');
    }

    if (!data.duration || data.duration < 1) {
      errors.push('Duration must be at least 1 minute');
    }

    if (!data.timestamp) {
      errors.push('Date and time are required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateWellnessEntry(data: any): ValidationResult {
    const errors: string[] = [];

    if (!data.type) {
      errors.push('Wellness type is required');
    }

    if (!data.rating || data.rating < 1 || data.rating > 10) {
      errors.push('Rating must be between 1 and 10');
    }

    if (!data.timestamp) {
      errors.push('Date and time are required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateBowelMovementEntry(data: any): ValidationResult {
    const errors: string[] = [];

    if (!data.bristolType || data.bristolType < 1 || data.bristolType > 7) {
      errors.push('Bristol stool type is required (1-7)');
    }

    if (!data.timestamp) {
      errors.push('Date and time are required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateEntry(type: string, data: any): ValidationResult {
    switch (type) {
      case 'food':
        return this.validateFoodEntry(data);
      case 'drink':
        return this.validateDrinkEntry(data);
      case 'symptom':
        return this.validateSymptomEntry(data);
      case 'supplement':
        return this.validateSupplementEntry(data);
      case 'exercise':
        return this.validateExerciseEntry(data);
      case 'wellness':
        return this.validateWellnessEntry(data);
      case 'bowel_movement':
        return this.validateBowelMovementEntry(data);
      default:
        return {
          isValid: false,
          errors: ['Invalid entry type']
        };
    }
  }

  static sanitizeString(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  static isValidDate(date: any): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  static isWithinReasonableTimeframe(date: Date): boolean {
    const now = new Date();
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(now.getFullYear() - 2);
    
    const oneDayFromNow = new Date();
    oneDayFromNow.setDate(now.getDate() + 1);

    return date >= twoYearsAgo && date <= oneDayFromNow;
  }
}