export const typography = {
  // Font families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    light: 'System',
  },
  
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  // Line heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // Font weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  // Text styles (combinations)
  textStyles: {
    h1: {
      fontSize: 36,
      fontWeight: '700',
      lineHeight: 1.25,
    },
    h2: {
      fontSize: 30,
      fontWeight: '600',
      lineHeight: 1.25,
    },
    h3: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 1.25,
    },
    h4: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 1.5,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 1.5,
    },
    caption: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 1.5,
    },
    small: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 1.25,
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 1.25,
    },
  },
} as const;
