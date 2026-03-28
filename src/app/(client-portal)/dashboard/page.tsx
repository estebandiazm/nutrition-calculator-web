import React from 'react';
import { TopAppBar } from '@/components/layout/TopAppBar';
import { BottomNavBar } from '@/components/layout/BottomNavBar';
import { StepsCounter } from '@/components/dashboard/StepsCounter';
import { HydrationTracker } from '@/components/dashboard/HydrationTracker';
import { MacrosHUD } from '@/components/dashboard/MacrosHUD';
import { PlanSectionCard } from '@/components/dashboard/PlanSectionCard';
import { GlassCard } from '@/components/ui/GlassCard';

import { DietPlan } from '@/domain/types/DietPlan';
import { createClient } from '@/infrastructure/adapters/supabase/server';
import { getClientByAuthId } from '@/app/actions/clientActions';
import { redirect } from 'next/navigation';

export default async function ClientDashboard() {
  const mockPlan: DietPlan = {
    label: "Plan General",
    days: "Lunes a Sábado",
    recommendations: "Tomar mucha agua",
    meals: [
      {
        mealName: "Comida 1 (Desayuno)",
        blocks: [
          { blockType: "BASE", options: [{ foodName: "Huevos Enteros", grams: 150, measureUnit: "g" }] },
          { blockType: "ACOMPAÑAMIENTO", options: [{ foodName: "Pan Integral", grams: 80, measureUnit: "g" }] },
          { blockType: "GRASA", options: [{ foodName: "Aguacate Hass", grams: 50, measureUnit: "g" }] }
        ]
      },
      {
        mealName: "Comida 2 (Almuerzo)",
        blocks: [
          { blockType: "BASE", options: [{ foodName: "Pechuga de Pollo", grams: 200, measureUnit: "g" }] },
          { blockType: "ACOMPAÑAMIENTO", options: [{ foodName: "Arroz Blanco", grams: 150, measureUnit: "g" }] },
          { blockType: "FRUTA", options: [{ foodName: "Manzana Verde", grams: 1, measureUnit: "ud" }] }
        ]
      },
      {
        mealName: "Comida 3 (Cena)",
        blocks: [
          { blockType: "BASE", options: [{ foodName: "Salmón", grams: 180, measureUnit: "g" }] },
          { blockType: "ACOMPAÑAMIENTO", options: [{ foodName: "Papa al Horno", grams: 200, measureUnit: "g" }] }
        ]
      }
    ],
    snacks: [
      { optionNumber: 1, description: "Yogurt griego (150g) con almendras (15g)" },
      { optionNumber: 2, description: "Batido de proteína de whey (1 scoop en agua)" }
    ]
  };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const clientRecord = await getClientByAuthId(user.id);
  const activePlan = clientRecord?.plans && clientRecord.plans.length > 0 
    ? clientRecord.plans[clientRecord.plans.length - 1] 
    : mockPlan;

  const isMock = !clientRecord || !clientRecord.plans || clientRecord.plans.length === 0;

  const mealCardsData = activePlan.meals.map((meal, index) => {
    const foods = meal.blocks.flatMap(block => 
      block.options.map(opt => ({
        id: `${meal.mealName}-${opt.foodName}`,
        name: opt.foodName,
        category: block.blockType,
        amount: `${opt.grams}${opt.measureUnit}`,
        colorClass: block.blockType === 'BASE' ? 'border-primary' : block.blockType === 'GRASA' ? 'border-tertiary' : 'border-secondary'
      }))
    );
    return {
      title: meal.mealName,
      description: `${meal.blocks.length} bloques nutricionales`,
      totalWeight: foods.reduce((acc, f) => acc + (parseInt(f.amount) || 0), 0) + 'g',
      totalProtein: 'Calculado',
      foods,
      icon: 'restaurant_menu',
      defaultExpanded: false
    };
  });

  const snacksCardData = {
    title: "Snacks",
    description: "Elige una opción por día",
    totalWeight: activePlan.snacks?.length + " opciones",
    totalProtein: "-",
    foods: activePlan.snacks?.map(snack => ({
      id: `snack-${snack.optionNumber}`,
      name: `Opción ${snack.optionNumber}`,
      category: "Snack",
      amount: snack.description,
      colorClass: "border-primary"
    })) || [],
    icon: 'cookie'
  };

  const frutasCardData = {
    title: "Frutas Permitidas",
    description: "Equivalencias para 1 porción",
    totalWeight: "1 porción",
    totalProtein: "-",
    foods: [
      { id: 'f1', name: "Manzana", category: "Fruta", amount: "150g", colorClass: "border-tertiary" },
      { id: 'f2', name: "Fresa", category: "Fruta", amount: "200g", colorClass: "border-tertiary" },
      { id: 'f3', name: "Banano", category: "Fruta", amount: "90g", colorClass: "border-tertiary" },
    ],
    icon: 'nutrition'
  };

  // The array length is 5 (Comida 1, 2, 3, Snacks, Frutas), making it odd, so the last box spans full width
  const allCards = [...mealCardsData, snacksCardData, frutasCardData];

  return (
    <div className="font-display bg-surface-dim text-slate-100 min-h-screen pb-32 lg:pb-0 relative overflow-x-hidden w-full">
      {/* Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/30 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <TopAppBar clientName={clientRecord?.name || "Client User"} />

      <main className="flex-1 max-w-[1440px] mx-auto w-full p-6 lg:p-10 flex flex-col gap-8 mt-4">
        {/* Page Header & Plan Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">Planes Activos</h1>
            <p className="text-on-surface-variant mt-2 font-medium">
              {isMock ? "Mostrando datos de demostración" : `Estrategia nutricional de ${activePlan.label || 'Plan Personalizado'}`}
            </p>
          </div>
          <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 lg:w-auto w-full">
            <button className="flex-1 lg:px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-gradient-to-br from-primary to-accent-purple text-white shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-all">
              Plan General (6 Days)
            </button>
            <button className="flex-1 lg:px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-white transition-all">
              Plan Especial (1 Day)
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {/* TOP SECTION: Summary Widgets row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MacrosHUD />
            <StepsCounter current={8420} goal={10000} />
            <HydrationTracker current={3.5} goal={3.5} />
            
            <GlassCard className="rounded-3xl p-6 border-white/10 border-b-4 lg:border-l-4 lg:border-b-0 border-tertiary">
              <h3 className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-4">Snacks per Day</h3>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-tertiary/10 border border-tertiary/20 flex items-center justify-center text-tertiary shadow-inner">
                  <span className="material-symbols-outlined text-3xl">cookie</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{activePlan.snacks?.length || 0}</p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* BOTTOM SECTION: Full width Meals/Snacks grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start w-full">
            {allCards.map((card, idx) => {
              const isLastAndOdd = allCards.length % 2 !== 0 && idx === allCards.length - 1;
              return (
                <div key={idx} className={isLastAndOdd ? "md:col-span-2" : ""}>
                  <PlanSectionCard {...card} />
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <BottomNavBar />
    </div>
  );
}
