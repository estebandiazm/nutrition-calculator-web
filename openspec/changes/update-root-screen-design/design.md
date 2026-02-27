## Context

La pantalla root (`Creator.tsx`) actualmente maneja un único `DietPlan` por cliente. El modelo `Client` expone `plan?: DietPlan` (1:1). El componente Creator usa estado local plano (`data.name`, `data.fruits`, etc.) sin soporte de múltiples planes.

El nuevo diseño introduce una UI basada en tarjetas de plan con glassmorphism (azul oscuro, bordes redondeados, transparencias), alineada con el `ui-theme` spec existente. El cambio más significativo es escalar el modelo de datos y el estado local de "un plan" a "N planes".

**Stack actual:** Next.js, React, Material UI, TypeScript, Zod, Vite.

## Goals / Non-Goals

**Goals:**
- Actualizar `Client.ts` para soportar múltiples planes (`plans: DietPlan[]`)
- Añadir campo `label` (nombre del plan, e.g. "Plan 1", "Día de entreno") y `days` (días de aplicación) a `DietPlan`
- Rediseñar `Creator.tsx` para renderizar dinámicamente N tarjetas de plan
- Cada tarjeta expone: label del plan, days, Proteins (g), Carbs (g), Fruits (g), Fats (g), lista de alimentos seleccionados, botones `Add Another Meal` y `Save Plan`
- Botón global `Add Another Plan` para crear tarjetas adicionales
- Mantener la consistencia visual con el `ui-theme` spec (glassmorphism, dark blue, gradientes)

**Non-Goals:**
- Persistencia en base de datos (el modelo solo se guarda en contexto/localStorage como hoy)
- Reordenar planes via drag-and-drop
- Edición del viewer (se adapta en una fase posterior)
- Cambios a la lógica de `DietEngine` o `FoodDatabase`

## Decisions

### D1: Extender `DietPlan` con `label` y `days` (no crear nuevo tipo)
`DietPlan` ya contiene `clientId`, `clientName`, `meals`, etc. Añadir `label: string` y `days: string` como campos opcionales es suficiente para identificar el plan sin romper el contrato existente.

**Alternativa descartada:** Crear un tipo `ClientPlan = { meta: PlanMeta, plan: DietPlan }` wrapper. Introduce complejidad innecesaria dado que el schema Zod ya existe y solo necesita dos campos.

---

### D2: Estado multi-plan en `Creator` como array de objetos draft
En lugar de estado plano (`data.fruits`, `data.firstMeal`...), `Creator` manejará:
```ts
type PlanDraft = {
  id: string;           // uuid temporal para key de React
  label: string;        // "Plan 1", "Plan 2"...
  days: string;
  proteins: number;
  carbs: number;
  fruits: number;
  fats: number;
  foods: Food[];        // alimentos seleccionados en este plan
}
const [plans, setPlans] = useState<PlanDraft[]>([defaultPlanDraft()])
```
Cada tarjeta opera sobre su propio slice de `plans[i]` mediante callbacks con índice.

**Alternativa descartada:** `useReducer`. Adecuado si hubiera lógica compleja de transición; para este caso con pocos campos por plan, `useState` + funciones puras es más legible.

---

### D3: Componente `PlanCard` extraído de `Creator`
La tarjeta de plan se extrae a `src/components/creator/PlanCard.tsx` para mantener `Creator` limpio (solo orquesta el array de plans, botón Add Another Plan, header de cliente). `PlanCard` recibe `plan: PlanDraft`, `index: number` y callbacks de actualización.

**Alternativa descartada:** Mantener todo inline en `Creator`. Creator ya es extenso; con N planes el JSX sería inmanejable.

---

### D4: Macronutrientes como valores numéricos directos (no calculados)
Los campos Proteins/Carbs/Fruits/Fats son entradas numéricas que el nutricionista escribe manualmente (gramos objetivo). No se recalculan automáticamente a partir de alimentos seleccionados. Esto refleja el flujo actual donde `DietEngine.generatePlan` recibe gramos como parámetros.

---

### D5: Estilo con `sx` de MUI + custom CSS variables (no nuevo sistema de estilos)
Se extiende el patrón actual de `sx` props de MUI con valores de color extraídos del `ui-theme` (dark navy, glassmorphism). Los botones `Add Another Meal`/`Save Plan` usarán gradiente `linear-gradient(#E91E8C, #9C27B0)` via `sx` override, consistente con el prototipo visual.

## Risks / Trade-offs

- **Ruptura del viewer**: `viewer/` espera `client.plan` (singular). Deberá actualizarse para iterar `client.plans[]`. Riesgo bajo — el viewer es un componente de lectura.  
  → _Mitigación_: Incluir la actualización del viewer en el mismo PR/tasks.

- **Compatibilidad con `ClientContext`**: Si hay datos guardados en localStorage con el modelo antiguo (`plan: DietPlan`), la lectura fallará silenciosamente.  
  → _Mitigación_: No hay persistencia en localStorage actualmente (el contexto es in-memory por sesión). Sin riesgo real.

- **`DietEngine.generatePlan` hardcoded**: El engine actual recibe parámetros posicionales de gramos (hasta 8 parámetros). Al tener múltiples plans con macros independientes, cada plan llamará `generatePlan` con sus propios valores. No hay cambio en la firma del engine.  
  → _Mitigación_: Cada `PlanCard` llama `generatePlan` con sus propios macros en `saveHandler`.

## Migration Plan

1. Actualizar `DietPlan.ts` (Zod schema + type): añadir `label` y `days` como `optional()`
2. Actualizar `Client.ts`: `plan?: DietPlan` → `plans: DietPlan[]`
3. Actualizar `ClientContext` + `ClientContextType`: adaptar `saveClient` para recibir array
4. Crear `PlanCard.tsx` con el diseño glassmorphic
5. Refactorizar `Creator.tsx` para estado multi-plan y usar `PlanCard`
6. Actualizar `viewer/` para renderizar `client.plans[]`

Sin rollback complejo — migración aditiva, no hay almacenamiento persistente que migrar.

## Open Questions

- ¿El campo `days` en la tarjeta debe ser texto libre ("Lunes, Miércoles") o un selector de días de la semana? → Asumir texto libre por simplicidad inicial.
- ¿El botón `Save Plan` guarda el plan individualmente o solo `Save All` al final guarda todos los planes? → Según el prototipo visual, cada tarjeta tiene su propio `Save Plan`; se asume que guardar un plan individual lo adiciona al cliente y navega al viewer solo cuando todos los planes estén listos (o de forma individual si hay un solo plan). A confirmar.
