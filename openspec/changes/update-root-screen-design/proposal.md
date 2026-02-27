## Why

La pantalla inicial (`Creator`) fue diseñada para generar un único plan dietético por cliente. El flujo actual no permite al nutricionista crear múltiples planes para una misma persona (e.g., Plan 1 para días de entrenamiento, Plan 2 para días de descanso), limitando la flexibilidad clínica. Se rediseña la pantalla root para adoptar un nuevo layout moderno basado en tarjetas de plan, alineado con el prototipo visual aprobado.

## What Changes

- **Nuevo layout de pantalla root**: Reemplaza el layout de listas de alimentos estáticas por un layout centrado en tarjetas de plan (`Plan 1`, `Plan 2`, etc.) con estética glassmorphic azul oscuro, consistente con el `ui-theme` existente.
- **Campos de cabecera del cliente**: Se mantienen los campos `Client` (nombre) y `Target Weight` (kg) en la parte superior de la pantalla.
- **Tarjeta de plan con macronutrientes**: Cada tarjeta de plan incluye:
  - Campo `Days` (días de la semana o tipo de día en que aplica el plan)
  - Campos de macronutrientes: `Proteins (g)`, `Carbs (g)`, `Fruits (g)`, `Fats (g)`
  - Lista de alimentos seleccionados dentro del plan (con emoji de categoría, nombre y cantidad)
  - Botón `Add Another Meal` para agregar comidas dentro del plan
  - Botón `Save Plan` para guardar el plan individualmente
- **Soporte multi-plan**: El usuario puede agregar múltiples planes al mismo cliente mediante un botón `Add Another Plan`. Cada plan es independiente y se pueden crear N planes por cliente.
- **Modelo de datos actualizado**: `Client` pasa de tener `plan?: DietPlan` a `plans: DietPlan[]` para soportar múltiples planes.

## Capabilities

### New Capabilities
- `multi-plan-creator`: UI de creación de planes múltiples por cliente en la pantalla root. Permite agregar, editar y guardar N planes independientes para un mismo cliente, con campos de macronutrientes (proteínas, carbohidratos, frutas, grasas) y días de aplicación por plan.

### Modified Capabilities
- `ui-theme`: Los nuevos componentes (tarjetas de plan, inputs redondeados, botones con gradiente rosa/morado) deben adherirse a los requisitos de glassmorphism y estética azul moderna ya definidos. No hay cambio de requisito funcional, pero se valida que los nuevos componentes cumplan el estándar visual existente.

## Impact

- **`src/domain/types/Client.ts`**: Cambio de `plan?: DietPlan` → `plans: DietPlan[]`
- **`src/components/creator/Creator.tsx`**: Rediseño completo del componente para soportar estado multi-plan y nuevo layout
- **`src/context/ClientContext`**: Posible actualización del contexto para manejar array de planes
- **`src/domain/types/DietPlan.ts`**: Posible adición de campo `label` o `days` para identificar el plan (ej: "Día de entreno", "Día de descanso")
- **`src/app/viewer/`**: El viewer deberá adaptarse para renderizar múltiples planes por cliente
- Sin cambios en APIs externas ni dependencias de paquetes
