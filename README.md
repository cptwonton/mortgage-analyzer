# 🏠 wut?

mortgage math in your head was annoying so i built this

## 🚀 Live Demo

**[View Live Application](https://mortgage-analyzer-lac.vercel.app/)**

## 🛠️ What's Here

### 🏠 **Mortgage Analyzer**
figure out what rent you need to break even on an investment property. shows what money you actually "burn" vs what builds equity.

**Features:**
- what money you actually "burn" (not the principal)
- break-even rent calculation  
- payment breakdown
- amortization table
- handles ARM loans
- saves your inputs

## 🎯 Why I Built This

was browsing zillow and kept trying to figure out payments in my head. got tired of it.

## 🔧 Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety (when it matters)
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Vercel** - Deployment

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/cptwonton/mortgage-analyzer.git
cd mortgage-analyzer

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see it in action.

## 📊 Key Concepts

### 🔥 **Burnable Money**
This is money you "burn" each month - you never get it back. Includes:
- Interest payments
- Property taxes
- Insurance
- Maintenance/repairs
- PMI (if down payment < 20%)

### 💎 **Equity Building**
Principal payments aren't "burned" - they build equity. When you sell the house, you get this money back (minus transaction costs).

### ⚖️ **Break-Even Analysis**
- **Burnable Money Break-Even**: Rent covers all the money you "burn"
- **Full Break-Even**: Rent covers everything including principal
- **Investment Viable**: Rent covers everything plus vacancy/management buffer

## 🎨 Design Philosophy

- **Authentic voice** - sounds like actual thoughts, not marketing copy
- **Educational** - explains the "why" behind the numbers
- **Practical** - solves real problems people have
- **No bullshit** - direct and honest about what it does

## 📝 Development Notes

- TypeScript/ESLint checks disabled for faster iteration
- Focus on functionality over perfect code
- Vibe coding approach - build what feels right
- Personal project, not trying to be a startup

## 🤝 Contributing

This is a personal learning project, but if you find bugs or have ideas, feel free to open an issue or PR.

## 📄 License

MIT License - do whatever you want with it.

---

*Built with ☕ and late-night Zillow browsing sessions*
