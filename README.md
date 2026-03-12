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
  <strong>Plataforma de gestión de planes nutricionales</strong><br/>
  Crea, calcula y administra planes alimenticios personalizados para tus pacientes.
</p>

<p align="center">
  <a href="#-inicio-rápido">Inicio Rápido</a> •
  <a href="#-características">Características</a> •
  <a href="#-arquitectura">Arquitectura</a> •
  <a href="#-modelo-de-dominio">Dominio</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-roadmap">Roadmap</a>
</p>

---

## ⚡ Inicio Rápido

```bash
# 1. Clonar el repositorio
git clone https://github.com/estebandiazm/nutrition-calculator-web.git
cd nutrition-calculator-web

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tu connection string de MongoDB Atlas

# 4. Iniciar en modo desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) y comienza a crear planes nutricionales.

### Variables de Entorno

| Variable       | Descripción                          | Ejemplo                                                                     |
| -------------- | ------------------------------------ | --------------------------------------------------------------------------- |
| `MONGODB_URI`  | Connection string de MongoDB Atlas   | `mongodb+srv://user:pass@cluster.mongodb.net/nutriplan?retryWrites=true&w=majority` |

---

## ✨ Características

<table>
<tr>
<td width="50%">

### 📋 Gestión de Clientes
- Dashboard con listado de pacientes
- Perfiles con peso objetivo y planes asociados
- Historial de planes por cliente

</td>
<td width="50%">

### 🧮 Motor de Cálculo (DietEngine)
- Cálculo proporcional automático de porciones
- Equivalencias entre alimentos del mismo bloque
- Soporte para bases, acompañamientos, grasas y frutas

</td>
</tr>
<tr>
<td width="50%">

### 🍽️ Creador de Planes
- Composición de comidas con bloques tipados
- Sección de snacks con opciones numeradas
- Recomendaciones generales por plan

</td>
<td width="50%">

### 👁️ Visor de Planes
- Vista limpia y optimizada para el paciente
- Diseño glassmorphism con tema oscuro premium
- Responsivo para consultas desde el móvil

</td>
</tr>
</table>

---

## 🏗️ Arquitectura

El proyecto sigue una arquitectura **Feature-First Monolith** con Next.js App Router, con separación clara entre dominio puro, infraestructura e interfaz.

```
src/
├── app/                    # Routes & Server Actions (Next.js App Router)
│   ├── actions/            # Server Actions (clientActions, nutritionistActions)
│   ├── clients/[id]/       # Detalle de cliente
│   ├── creator/            # Creador de planes
│   └── viewer/             # Visor de planes
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

### Regla de Dependencias

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

> **Regla de oro:** `domain/` es puro — nunca importa de `app/`, `components/`, ni `lib/`. Debe funcionar sin Next.js, sin MongoDB, sin nada externo.

---

## 🧬 Modelo de Dominio

El modelo refleja la estructura real de un plan nutricional profesional:

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
        enum blockType "BASE | ACOMPAÑAMIENTO | GRASA | FRUTA"
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

### Bloques de Comida

Cada comida se compone de bloques tipados que reflejan el sistema de equivalencias nutricionales:

| Tipo                | Propósito                                  | Ejemplo                          |
| ------------------- | ------------------------------------------ | -------------------------------- |
| `BASE`              | Fuente principal de macros                 | Arroz, pollo, papa               |
| `ACOMPAÑAMIENTO`    | Complemento del plato                      | Ensalada, vegetales cocidos      |
| `GRASA`             | Fuente de grasas saludables                | Aguacate, aceite de oliva        |
| `FRUTA`             | Porción de fruta con equivalencias         | Banano, manzana, uvas            |

---

## 🛠️ Tech Stack

| Capa             | Tecnología                  | Rol                                                  |
| ---------------- | --------------------------- | ---------------------------------------------------- |
| **Framework**    | Next.js 15 (App Router)     | Full-stack: SSR, Server Actions, routing              |
| **UI**           | React 19 + MUI 7            | Server Components + Component Library                 |
| **Lenguaje**     | TypeScript (strict)         | Type safety en toda la codebase                       |
| **Validación**   | Zod 4                       | Schemas de entidades + contratos de datos             |
| **Base de Datos**| MongoDB Atlas + Mongoose    | Persistencia en la nube con ODM                       |
| **CI/CD**        | GitHub Actions              | Build & deploy automáticos                            |

---

## 📜 Scripts Disponibles

```bash
npm run dev       # Servidor de desarrollo (http://localhost:3000)
npm run build     # Build de producción
npm run start     # Servidor de producción
npm run lint      # Linting con ESLint
```

---

## 🗺️ Roadmap

NutriPlan evoluciona en fases progresivas:

```mermaid
timeline
    title Evolución de NutriPlan
    MVP (actual) : Calculadora personal
                 : 1 nutricionista, 1 cliente
                 : Motor de cálculo DietEngine
    V1           : Multi-cliente
                 : Gestión de N clientes
                 : Tracking de progreso
                 : Historial de planes
    V2           : SaaS Multi-nutricionista
                 : Plataforma multi-tenant
                 : Auth + onboarding
                 : Generación de planes con AI
    V3           : Gyms + Nutrición
                 : Gestión de horarios
                 : Programas de entrenamiento
                 : Integración CrossFit
```

---

## 🤝 Desarrollo

El proyecto sigue principios **AI-native** — optimizado para desarrollo asistido por IA:

- 📐 **Clean Code** — Funciones pequeñas, nombres descriptivos, sin side effects
- 🧪 **Domain-first** — Lógica de negocio pura y testeable en `domain/`
- 📋 **OpenSpec** — Gestión de cambios con specs formales (`openspec/`)
- 🔀 **Git flow** — 1 cambio = 1 branch = 1 PR con walkthrough

---

<p align="center">
  <sub>Hecho con 💚 para nutricionistas que quieren digitalizar sus planes.</sub>
</p>
