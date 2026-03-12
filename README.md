<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MUI-7-007FFF?style=for-the-badge&logo=mui&logoColor=white" alt="MUI 7" />
  <img src="https://img.shields.io/badge/Zod-4-3E67B1?style=for-the-badge&logo=zod&logoColor=white" alt="Zod 4" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
</p>

<h1 align="center">
  🥗 NutriPlan
</h1>

<p align="center">
  <strong>Nutritional Plan Management Platform</strong><br/>
  Create, calculate, and manage personalized nutritional plans for your patients.
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-features">Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-domain-model">Domain</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-roadmap">Roadmap</a>
</p>

---

## ⚡ Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/estebandiazm/nutrition-calculator-web.git
cd nutrition-calculator-web

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local with your MongoDB Atlas connection string

# 4. Start in development mode
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start creating nutritional plans.

### Environment Variables

| Variable       | Description                          | Example                                                                     |
| -------------- | ------------------------------------ | --------------------------------------------------------------------------- |
| `MONGODB_URI`  | MongoDB Atlas connection string      | `mongodb+srv://user:pass@cluster.mongodb.net/nutriplan?retryWrites=true&w=majority` |

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 📋 Client Management
- Dashboard with patient list
- Profiles with target weight and associated plans
- Plan history per client

</td>
<td width="50%">

### 🧮 Calculation Engine (DietEngine)
- Automatic proportional calculation of portions
- Equivalencies between foods in the same block
- Support for bases, side dishes, fats, and fruits

</td>
</tr>
<tr>
<td width="50%">

### 🍽️ Plan Creator
- Meal composition with typed blocks
- Snacks section with numbered options
- General recommendations per plan

</td>
<td width="50%">

### 👁️ Plan Viewer
- Clean and patient-optimized view
- Glassmorphism design with a premium dark theme
- Responsive for mobile inquiries

</td>
</tr>
</table>

---

## 🏗️ Architecture

The project follows a **Feature-First Monolith** architecture with Next.js App Router, boasting a clear separation between pure domain, infrastructure, and interface.

```
src/
├── app/                    # Routes & Server Actions (Next.js App Router)
│   ├── actions/            # Server Actions (clientActions, nutritionistActions)
│   ├── clients/[id]/       # Client details
│   ├── creator/            # Plan creator
│   └── viewer/             # Plan viewer
│
├── components/             # UI Components (feature-scoped)
│   ├── creator/            # Creator, PlanCard, SavePlanModal
│   ├── food-list/          # FoodList
│   ├── food-table/         # FoodTable
│   ├── menu/               # Navigation Menu
│   └── viewer/             # Viewer
│
├── domain/                 # 💎 Pure Business Logic (zero dependencies)
│   ├── types/              # Entities & Schemas (Zod + TypeScript)
│   │   ├── Client.ts
│   │   ├── DietPlan.ts     # FoodOption → MealBlock → Meal → DietPlan
│   │   ├── Food.ts
│   │   └── Nutritionist.ts
│   ├── data/
│   │   └── foods.ts        # Food catalog data
│   └── services/
│       ├── DietEngine.ts   # Portion calculator & plan generator
│       └── FoodDatabase.ts # Food catalog abstraction
│
├── lib/                    # Infrastructure & Utilities
│   ├── db/mongodb.ts       # MongoDB Atlas connection
│   └── models/             # Mongoose models
│
├── context/                # React Context (client state)
└── themes/                 # MUI Theme (dark & light)
```

### Dependency Rule

```mermaid
graph TD
    A[app/] --> B[components/]
    A --> C[domain/]
    A --> D[lib/]
    B --> C
    D --> C
    C -.->|❌ NEVER imports| A
    C -.->|❌ NEVER imports| B
    C -.->|❌ NEVER imports| D

    style C fill:#1a5c2e,stroke:#4ade80,color:#ffffff
    style A fill:#1e3a5f,stroke:#60a5fa,color:#ffffff
    style B fill:#5c1a5c,stroke:#c084fc,color:#ffffff
    style D fill:#5c4a1a,stroke:#fbbf24,color:#ffffff
```

> **Golden Rule:** `domain/` is pure — it never imports from `app/`, `components/`, or `lib/`. It must work without Next.js, without MongoDB, and without anything external.

---

## 🧬 Domain Model

The model reflects the real structure of a professional nutritional plan:

```mermaid
erDiagram
    NUTRITIONIST ||--o{ CLIENT : manages
    CLIENT ||--o{ DIET_PLAN : has
    DIET_PLAN ||--|{ MEAL : contains
    DIET_PLAN ||--o{ SNACK_OPTION : includes
    MEAL ||--|{ MEAL_BLOCK : "composed of"
    MEAL_BLOCK ||--|{ FOOD_OPTION : offers

    CLIENT {
        string name
        number targetWeight
        string nutritionistId
    }
    DIET_PLAN {
        string label
        string days
        string recommendations
    }
    MEAL {
        string mealName
    }
    MEAL_BLOCK {
        enum blockType "BASE | SIDE_DISH | FAT | FRUIT"
    }
    FOOD_OPTION {
        string foodName
        number grams
        string measureUnit
    }
    SNACK_OPTION {
        number optionNumber
        string description
    }
```

### Meal Blocks

Each meal is composed of typed blocks reflecting the nutritional equivalency system:

| Type                | Purpose                                    | Example                          |
| ------------------- | ------------------------------------------ | -------------------------------- |
| `BASE`              | Primary source of macronutrients           | Rice, chicken, potato            |
| `SIDE_DISH`         | Complement to the meal                     | Salad, cooked vegetables         |
| `FAT`               | Source of healthy fats                     | Avocado, olive oil               |
| `FRUIT`             | Fruit portion with equivalencies           | Banana, apple, grapes            |

---

## 🛠️ Tech Stack

| Layer            | Technology                  | Role                                                 |
| ---------------- | --------------------------- | ---------------------------------------------------- |
| **Framework**    | Next.js 15 (App Router)     | Full-stack: SSR, Server Actions, routing             |
| **UI**           | React 19 + MUI 7            | Server Components + Component Library                |
| **Language**     | TypeScript (strict)         | Type safety across the entire codebase               |
| **Validation**   | Zod 4                       | Entity schemas + data contracts                      |
| **Database**     | MongoDB Atlas + Mongoose    | Cloud persistence with ODM                           |
| **CI/CD**        | GitHub Actions              | Automated build & deploy                             |

---

## 📜 Available Scripts

```bash
npm run dev       # Development server (http://localhost:3000)
npm run build     # Production build
npm run start     # Production server
npm run lint      # Linting with ESLint
```

---

## 🗺️ Roadmap

NutriPlan evolves in progressive phases:

```mermaid
timeline
    title NutriPlan Evolution
    MVP (current) : Personal calculator
                  : 1 nutritionist, 1 client
                  : DietEngine calculation engine
    V1            : Multi-client
                  : Management of N clients
                  : Progress tracking
                  : Plan history
    V2            : SaaS Multi-nutritionist
                  : Multi-tenant platform
                  : Auth + onboarding
                  : AI plan generation
    V3            : Gyms + Nutrition
                  : Schedule management
                  : Training programs
                  : CrossFit integration
```

---

## 🤝 Development

The project follows **AI-native** principles — optimized for AI-assisted development:

- 📐 **Clean Code** — Small functions, descriptive names, no side effects
- 🧪 **Domain-first** — Pure and testable business logic in `domain/`
- 📋 **OpenSpec** — Change management with formal specs (`openspec/`)
- 🔀 **Git flow** — 1 change = 1 branch = 1 PR with walkthrough

---

<p align="center">
  <sub>Made with 💚 for nutritionists who want to digitize their plans.</sub>
</p>
