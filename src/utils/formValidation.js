// Form validation utilities

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {Object} {isValid: boolean, error: string}
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }
  return { isValid: true, error: '' };
};

/**
 * Validate phone number (Indian format)
 * @param {string} phone - Phone number to validate
 * @returns {Object} {isValid: boolean, error: string}
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phone) {
    return { isValid: false, error: 'Phone number is required' };
  }
  const cleanPhone = phone.replace(/[\s()-]/g, '');
  if (!phoneRegex.test(cleanPhone)) {
    return { isValid: false, error: 'Invalid phone number (10 digits starting with 6-9)' };
  }
  return { isValid: true, error: '' };
};

/**
 * Validate ISBN format (ISBN-10 or ISBN-13)
 * @param {string} isbn - ISBN to validate
 * @returns {Object} {isValid: boolean, error: string}
 */
export const validateISBN = (isbn) => {
  if (!isbn) {
    return { isValid: false, error: 'ISBN is required' };
  }
  
  const cleanISBN = isbn.replace(/[\s-]/g, '');
  
  // ISBN-10 or ISBN-13
  const isbn10Regex = /^\d{9}[\dX]$/;
  const isbn13Regex = /^(978|979)\d{10}$/;
  
  if (!isbn10Regex.test(cleanISBN) && !isbn13Regex.test(cleanISBN)) {
    return { isValid: false, error: 'Invalid ISBN format (use ISBN-10 or ISBN-13)' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {Object} {isValid: boolean, error: string}
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  if (typeof value === 'string' && value.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true, error: '' };
};

/**
 * Validate minimum length
 * @param {string} value - Value to validate
 * @param {number} minLength - Minimum length
 * @param {string} fieldName - Name of the field for error message
 * @returns {Object} {isValid: boolean, error: string}
 */
export const validateMinLength = (value, minLength, fieldName = 'This field') => {
  if (!value || value.length < minLength) {
    return { isValid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }
  return { isValid: true, error: '' };
};

/**
 * Validate maximum length
 * @param {string} value - Value to validate
 * @param {number} maxLength - Maximum length
 * @param {string} fieldName - Name of the field for error message
 * @returns {Object} {isValid: boolean, error: string}
 */
export const validateMaxLength = (value, maxLength, fieldName = 'This field') => {
  if (value && value.length > maxLength) {
    return { isValid: false, error: `${fieldName} must not exceed ${maxLength} characters` };
  }
  return { isValid: true, error: '' };
};

/**
 * Validate number range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {string} fieldName - Name of the field for error message
 * @returns {Object} {isValid: boolean, error: string}
 */
export const validateNumberRange = (value, min, max, fieldName = 'This field') => {
  const num = Number(value);
  if (Number.isNaN(num)) {
    return { isValid: false, error: `${fieldName} must be a number` };
  }
  if (num < min || num > max) {
    return { isValid: false, error: `${fieldName} must be between ${min} and ${max}` };
  }
  return { isValid: true, error: '' };
};

/**
 * Validate date is not in the past
 * @param {string|Date} date - Date to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {Object} {isValid: boolean, error: string}
 */
export const validateFutureDate = (date, fieldName = 'Date') => {
  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (inputDate < today) {
    return { isValid: false, error: `${fieldName} cannot be in the past` };
  }
  return { isValid: true, error: '' };
};

/**
 * Validate RFID tag format
 * @param {string} rfid - RFID tag to validate
 * @returns {Object} {isValid: boolean, error: string}
 */
export const validateRFID = (rfid) => {
  if (!rfid) {
    return { isValid: false, error: 'RFID tag is required' };
  }
  
  const rfidRegex = /^[A-Z0-9]{6,20}$/;
  const cleanRFID = rfid.replace(/[\s-]/g, '');
  
  if (!rfidRegex.test(cleanRFID)) {
    return { isValid: false, error: 'Invalid RFID format (6-20 alphanumeric characters)' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} {isValid: boolean, error: string, strength: string}
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, error: 'Password is required', strength: 'none' };
  }
  
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters', strength: 'weak' };
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const strengthScore = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
  
  let strength = 'weak';
  if (strengthScore >= 3 && password.length >= 8) {
    strength = 'strong';
  } else if (strengthScore >= 2 && password.length >= 6) {
    strength = 'medium';
  }
  
  return { isValid: true, error: '', strength };
};

/**
 * Validate form object with multiple fields
 * @param {Object} formData - Form data object
 * @param {Object} validationRules - Validation rules object
 * @returns {Object} {isValid: boolean, errors: Object}
 */
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  Object.keys(validationRules).forEach(field => {
    const rules = validationRules[field];
    const value = formData[field];

    for (let i = 0; i < rules.length; i += 1) {
      const rule = rules[i];
      const result = rule(value);
      
      if (!result.isValid) {
        errors[field] = result.error;
        isValid = false;
        break; // Stop at first error for this field
      }
    }
  });

  return { isValid, errors };
};
