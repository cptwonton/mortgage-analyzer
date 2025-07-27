# 🏠 Money Math

ok so i kept doing mortgage math in my head while looking at houses online and it was annoying so i built these

## 🚀 Live Demo

**[View Live Application](https://mortgage-analyzer-lac.vercel.app/)**

## 🛠️ What's Here

### 🏠 **Mortgage Analyzer**
so you want to buy a house to rent out? this tells you what rent you need to break even. also shows you what money you actually "burn" each month vs what builds equity. (important: principal payments aren't burned money - you get that back when you sell)

**Features:**
- shows what money you actually "burn" (hint: not the principal)
- tells you exactly what rent you need to not lose money
- breaks down where your payment actually goes
- amortization table because why not
- handles ARM loans with payment ranges
- saves your inputs so you don't lose them

### ⚖️ **Rent vs Buy Calculator** 
🚧 **Under Development**

the eternal question. should you keep throwing money at rent or buy something? this was gonna help figure out the break-even math but it's not ready yet.

## 🎯 Why I Built These

### 😴 **lazy**
was browsing zillow and kept trying to figure out payments in my head. got tired of it.

### 🎮 **for funsies**
wanted to mess around with some ui stuff and see what this "vibe coding" thing was about.

### ✨ **w0w**
actually ended up being pretty useful for real decisions. who knew.

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
