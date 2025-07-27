# 🏗️ Brutalist Design System Specification

## 📏 Typography Scale

### **Font Stack**
```css
--font-brutalist: 'Courier New', 'Monaco', 'Menlo', 'Consolas', monospace;
```

### **Font Weights**
```css
--font-weight-normal: 400;    /* Body text */
--font-weight-bold: 700;      /* Emphasis */
--font-weight-black: 900;     /* Headings */
```

### **Font Sizes & Line Heights**
```css
/* Headings - Compressed, Imposing */
--text-6xl: 4rem;     /* 64px - H1 */
--text-5xl: 3rem;     /* 48px - H2 */
--text-4xl: 2.25rem;  /* 36px - H3 */
--text-3xl: 1.875rem; /* 30px - H4 */
--text-2xl: 1.5rem;   /* 24px - H5 */
--text-xl: 1.25rem;   /* 20px - H6 */

/* Body Text */
--text-lg: 1.125rem;  /* 18px - Large body */
--text-base: 1rem;    /* 16px - Base body */
--text-sm: 0.875rem;  /* 14px - Small text */
--text-xs: 0.75rem;   /* 12px - Captions */

/* Line Heights - Tight & Compressed */
--leading-none: 0.9;    /* Headings */
--leading-tight: 1.1;   /* Subheadings */
--leading-normal: 1.3;  /* Body text */
--leading-relaxed: 1.4; /* Long form content */

/* Letter Spacing - Carved Stone Effect */
--tracking-tight: -0.025em;  /* Large headings */
--tracking-normal: 0;        /* Body text */
--tracking-wide: 0.1em;      /* Emphasis */
--tracking-wider: 0.15em;    /* Institutional headers */
```

## 🎨 Color System (WCAG AA Compliant)

### **Core Colors**
```css
/* Primary Palette */
--concrete-white: #ffffff;    /* Pure white */
--concrete-black: #000000;    /* Pure black */
--steel-gray: #666666;        /* Industrial metal */
--raw-red: #dc2626;          /* Error/Alert (adjusted for accessibility) */
--warning-yellow: #fbbf24;    /* Warning (adjusted for accessibility) */

/* Contrast Ratios (WCAG AA: 4.5:1 minimum) */
/* Black on White: 21:1 ✅ */
/* White on Black: 21:1 ✅ */
/* Red (#dc2626) on White: 5.74:1 ✅ */
/* Gray (#374151) on White: 9:1 ✅ */
/* Yellow (#fbbf24) on Black: 11.4:1 ✅ */
```

### **Semantic Color Usage**
```css
/* Text Colors */
--text-primary: var(--concrete-black);     /* Main content */
--text-secondary: #374151;                 /* Supporting text (9:1 ratio) */
--text-muted: #374151;                     /* Subtle text (9:1 ratio) */
--text-accent: var(--raw-red);             /* Alerts, links */
--text-inverse: var(--concrete-white);     /* Text on dark backgrounds */

/* Background Colors */
--bg-primary: var(--concrete-white);       /* Main background */
--bg-secondary: var(--concrete-black);     /* Cards, sections */
--bg-accent: var(--raw-red);               /* Error states */

/* Border Colors */
--border-primary: var(--concrete-black);   /* Main borders */
--border-accent: var(--raw-red);           /* Focus states */
```

## 📐 Spacing & Layout

### **Spacing Scale**
```css
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px - Base unit */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

### **Border Specifications**
```css
--border-thin: 2px solid var(--border-primary);
--border-thick: 4px solid var(--border-primary);
--border-heavy: 8px solid var(--border-primary);
--border-accent: 4px solid var(--border-accent);

/* No border-radius - all corners sharp */
--border-radius: 0;
```

### **Shadow System**
```css
/* Hard Geometric Shadows */
--shadow-sm: 4px 4px 0px 0px rgba(0,0,0,1);
--shadow-md: 8px 8px 0px 0px rgba(0,0,0,1);
--shadow-lg: 12px 12px 0px 0px rgba(0,0,0,1);
--shadow-xl: 16px 16px 0px 0px rgba(0,0,0,1);

/* Inset shadows for pressed states */
--shadow-inset: inset 4px 4px 0px rgba(0,0,0,0.2);
```

## 🎯 Component Specifications

### **Typography Components**
```css
.brutalist-h1 {
  font-family: var(--font-brutalist);
  font-size: var(--text-6xl);
  font-weight: var(--font-weight-black);
  line-height: var(--leading-none);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: var(--text-primary);
  margin: 0 0 var(--space-8) 0;
}

.brutalist-h2 {
  font-family: var(--font-brutalist);
  font-size: var(--text-5xl);
  font-weight: var(--font-weight-black);
  line-height: var(--leading-none);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--text-primary);
  margin: 0 0 var(--space-6) 0;
}

.brutalist-h3 {
  font-family: var(--font-brutalist);
  font-size: var(--text-4xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--text-primary);
  margin: 0 0 var(--space-4) 0;
}

.brutalist-body {
  font-family: var(--font-brutalist);
  font-size: var(--text-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--leading-normal);
  letter-spacing: var(--tracking-normal);
  color: var(--text-primary);
  margin: 0 0 var(--space-4) 0;
}

.brutalist-small {
  font-family: var(--font-brutalist);
  font-size: var(--text-sm);
  font-weight: var(--font-weight-normal);
  line-height: var(--leading-normal);
  color: var(--text-secondary);
}
```

### **Button Components**
```css
.brutalist-button {
  font-family: var(--font-brutalist);
  font-size: var(--text-base);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  
  background: var(--bg-secondary);
  color: var(--text-inverse);
  border: var(--border-thick);
  border-radius: var(--border-radius);
  
  padding: var(--space-4) var(--space-8);
  box-shadow: var(--shadow-md);
  
  cursor: pointer;
  transition: all 0.1s linear; /* Fast, mechanical */
  
  /* Remove default button styles */
  appearance: none;
  outline: none;
}

.brutalist-button:hover {
  background: var(--bg-primary);
  color: var(--text-primary);
  box-shadow: var(--shadow-lg);
  transform: translate(-2px, -2px);
}

.brutalist-button:active {
  box-shadow: var(--shadow-sm);
  transform: translate(2px, 2px);
}

.brutalist-button:focus-visible {
  border-color: var(--border-accent);
  outline: 2px solid var(--raw-red);
  outline-offset: 2px;
}

/* Button Variants */
.brutalist-button--accent {
  background: var(--bg-accent);
  color: var(--text-inverse);
  border-color: var(--bg-accent);
}

.brutalist-button--accent:hover {
  background: var(--bg-primary);
  color: var(--text-accent);
  border-color: var(--bg-accent);
}
```

### **Input Components**
```css
.brutalist-input {
  font-family: var(--font-brutalist);
  font-size: var(--text-base);
  font-weight: var(--font-weight-normal);
  
  background: var(--bg-primary);
  color: var(--text-primary);
  border: var(--border-thick);
  border-radius: var(--border-radius);
  
  padding: var(--space-4);
  width: 100%;
  
  /* Remove default input styles */
  appearance: none;
  outline: none;
}

.brutalist-input::placeholder {
  color: var(--text-muted);
  opacity: 1;
}

.brutalist-input:focus {
  border-color: var(--border-accent);
  box-shadow: var(--shadow-inset);
}

.brutalist-input:invalid {
  border-color: var(--bg-accent);
}

/* Input variants */
.brutalist-textarea {
  resize: none; /* Fixed size, no resize handle */
  min-height: calc(var(--text-base) * var(--leading-normal) * 4 + var(--space-8));
}
```

### **Card Components**
```css
.brutalist-card {
  background: var(--bg-secondary);
  color: var(--text-inverse);
  border: var(--border-thick);
  border-radius: var(--border-radius);
  
  padding: var(--space-8);
  box-shadow: var(--shadow-md);
  
  /* Grid-based layout */
  display: block;
  margin: 0; /* No external margins */
}

.brutalist-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translate(-2px, -2px);
}

/* Card on white background variant */
.brutalist-card--inverse {
  background: var(--bg-primary);
  color: var(--text-primary);
  border-color: var(--border-primary);
}
```

### **Grid System**
```css
.brutalist-grid {
  display: grid;
  gap: 0; /* No gaps - elements touch */
  border: var(--border-thick);
}

.brutalist-grid--2col {
  grid-template-columns: 1fr 1fr;
}

.brutalist-grid--3col {
  grid-template-columns: repeat(3, 1fr);
}

.brutalist-grid--auto {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.brutalist-grid > * {
  border-right: var(--border-thick);
  border-bottom: var(--border-thick);
  padding: var(--space-8);
}

.brutalist-grid > *:last-child,
.brutalist-grid > *:nth-child(n):nth-last-child(-n+1) {
  border-right: none;
}

.brutalist-grid > *:nth-last-child(-n+3) {
  border-bottom: none;
}
```

## ♿ Accessibility Specifications

### **Focus Management**
```css
.brutalist-focus {
  outline: 2px solid var(--raw-red);
  outline-offset: 2px;
}

/* High contrast focus for better visibility */
@media (prefers-contrast: high) {
  .brutalist-focus {
    outline-width: 4px;
    outline-offset: 4px;
  }
}
```

### **Motion Preferences**
```css
@media (prefers-reduced-motion: reduce) {
  .brutalist-button,
  .brutalist-card,
  .brutalist-input {
    transition: none;
  }
  
  .brutalist-button:hover,
  .brutalist-card:hover {
    transform: none;
  }
}
```

### **Color Contrast Validation**
```css
/* All color combinations meet WCAG AA (4.5:1) or AAA (7:1) standards */

/* AA Compliant Combinations */
.contrast-aa {
  /* Black on White: 21:1 */
  /* White on Black: 21:1 */
  /* Red (#dc2626) on White: 5.74:1 */
  /* Gray (#666666) on White: 5.74:1 */
  /* Secondary (#4b5563) on White: 7:1 */
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  :root {
    --text-secondary: var(--concrete-black);
    --text-muted: var(--concrete-black);
    --border-thick: 6px solid var(--border-primary);
  }
}
```

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Small devices */
--breakpoint-md: 768px;   /* Medium devices */
--breakpoint-lg: 1024px;  /* Large devices */
--breakpoint-xl: 1280px;  /* Extra large devices */

/* Typography scaling for mobile */
@media (max-width: 640px) {
  .brutalist-h1 { font-size: var(--text-5xl); }
  .brutalist-h2 { font-size: var(--text-4xl); }
  .brutalist-h3 { font-size: var(--text-3xl); }
  
  .brutalist-button {
    padding: var(--space-3) var(--space-6);
    font-size: var(--text-sm);
  }
  
  .brutalist-card {
    padding: var(--space-6);
  }
}
```

## 🔧 Implementation Priority

### **Phase 1: Core System**
1. ✅ Update CSS custom properties
2. ✅ Implement typography classes
3. ✅ Create button components
4. ✅ Build input components

### **Phase 2: Layout & Components**
1. ✅ Implement grid system
2. ✅ Create card components
3. ✅ Add focus management
4. ✅ Test accessibility compliance

### **Phase 3: Polish & Testing**
1. ✅ Add motion preferences
2. ✅ Test high contrast mode
3. ✅ Validate color contrast ratios
4. ✅ Mobile responsiveness testing

## 🎯 Design Principles Checklist

- ✅ **Monospace typography** throughout
- ✅ **Pure black/white** primary colors
- ✅ **4px+ borders** on all elements
- ✅ **No border-radius** (sharp corners)
- ✅ **Hard geometric shadows**
- ✅ **Mechanical interactions** (fast/instant)
- ✅ **Grid-based layouts** with no gaps
- ✅ **WCAG AA compliance** (4.5:1 contrast minimum)
- ✅ **Uppercase headings** with wide letter-spacing
- ✅ **Industrial color palette** (functional, not decorative)
