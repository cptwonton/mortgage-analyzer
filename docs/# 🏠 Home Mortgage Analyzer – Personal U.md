# 🏠 Home Mortgage Analyzer – Personal UI/UX Project

## 🎯 Purpose
Build an interactive tool that visually breaks down a home's monthly mortgage payment into:
- **Principal**
- **Interest**
- **Property tax**
- **Insurance**
- **Maintenance**

Then compare this against **rental income** to classify the property’s cash flow health using a **color-coded zone system**.

---

## 🔧 Key Features

### 1. Input Panel
- Purchase price
- Down payment (percent or absolute)
- Loan term (years)
- Interest rate
- Property tax rate
- Monthly insurance estimate
- Monthly maintenance estimate
- Monthly rental income
- HOA or miscellaneous fees (optional)
- Tax write-off estimate (optional/future)

### 2. Mortgage Breakdown Calculations
- Monthly payment split into:
  - Principal
  - Interest
- Add monthly:
  - Property tax
  - Insurance
  - Maintenance
- Track % of monthly payment going toward equity vs. “burned”

### 3. Cash Flow Zone Logic

| Zone     | Logic                                                                 |
|----------|-----------------------------------------------------------------------|
| 🔴 Red   | Rental income < interest + tax + maintenance (all "burnable" money)   |
| 🟠 Orange| Covers “burnables” but little principal                              |
| 🟡 Yellow| Covers all payments but tight margin; vulnerable to maintenance/taxes |
| 🟢 Green | Covers everything and cash flows positive                             |

### 4. Visualizations
- Pie chart: Mortgage breakdown (principal, interest, taxes, etc.)
- Bar chart: Rental income vs. burnable vs. principal
- Timeline or meter: Zone color per month or overall snapshot

---

## 🧱 Suggested Tech Stack

| Layer         | Tool / Library                       |
|---------------|--------------------------------------|
| Framework     | `React` or `Next.js`                 |
| Styling       | `Tailwind CSS` + `shadcn/ui`         |
| Animation     | `Framer Motion`                      |
| Charts        | `Recharts` or `Chart.js`             |
| State         | `Zustand` or React `useState`        |
| Hosting       | `Vercel` (free, simple CI/CD)        |

---

## 🧠 UX Concept

> “I enter my property and rental info, and instantly see a color-coded breakdown of how much I’m losing or gaining monthly — both in cash and equity.”

---

## 🧪 MVP Feature Set

- Input panel with real-time feedback
- Mortgage calculation logic (amortization)
- Color-coded zone indicator
- Basic visualizations:
  - Pie chart (payment breakdown)
  - Bar chart (cash in vs. out)
- Export button for summary

---

## 🖼 UI Layout Concept

+-----------------------------------------------------------+
| Home Mortgage Analyzer |
+----------------------+------------------------------------+
Input Panel	Graph + Breakdown
[Purchase Price ]	🔵 Pie Chart: Payment breakdown
[Down Payment % ]	🟧 Monthly Timeline (zone color)
[Interest Rate ]	🟢 Net Monthly Cashflow Graph
[Rental Income ]	
[Loan Term]	
+----------------------+------------------------------------+


---

## ✅ Next Steps

- [ ] Scaffold with `create-next-app` or `Vite + React`
- [ ] Implement input form + state
- [ ] Build mortgage calculation engine (use amortization formula)
- [ ] Define zone logic & thresholds
- [ ] Integrate chart library
- [ ] Add Tailwind styling + animations
