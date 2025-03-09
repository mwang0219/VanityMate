export const colors = {
  primary: '#FF6B6B',
  primaryGradient: ['#FF9A9E', '#FAD0C4'],
  danger: '#FF5252',
  success: '#4CAF50',
  warning: '#FF9800',
  text: {
    primary: '#2D4059',
    secondary: '#666666',
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F8F9FA',
  },
  border: '#EEEEEE',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  round: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
} as const; 