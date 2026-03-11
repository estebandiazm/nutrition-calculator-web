'use client';

import React, { useContext, useState } from 'react';
import { Box, Button, TextField, Typography, ThemeProvider } from '@mui/material';
import { AccountCircle, MonitorWeightRounded, AddCircleOutline, SaveOutlined, CloudUploadOutlined } from '@mui/icons-material';
import { ClientContext } from '../../context/ClientContext';
import { ClientContextType } from '../../context/ClientContextType';
import { DietEngine } from '../../domain/services/DietEngine';
import { FoodDatabase } from '../../domain/services/FoodDatabase';
import { useRouter } from 'next/navigation';
import { darkTheme } from '../../themes';
import Menu from '../menu/Menu';
import PlanCard, { PlanDraft } from './PlanCard';
import SavePlanModal from './SavePlanModal';
import { DietPlan } from '../../domain/types/DietPlan';

// ─── helpers ────────────────────────────────────────────────────────────────

const createDefaultPlan = (): PlanDraft => ({
  id: crypto.randomUUID(),
  label: '',
  days: '',
  proteins: 20,
  carbs: 20,
  fruits: 0,
  fats: 0,
  foods: [],
});

// ─── styles ─────────────────────────────────────────────────────────────────

const rootBg = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0a1628 0%, #0d2157 50%, #0a1628 100%)',
  py: 3,
  px: { xs: 2, sm: 3, md: 6 },
};

const pillInput = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '50px',
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.25)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
    '&.Mui-focused fieldset': { borderColor: '#7C9FFF' },
  },
  '& .MuiInputBase-input': { color: '#fff' },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
  '& input[type=number]::-webkit-inner-spin-button': { display: 'none' },
};

// ─── component ──────────────────────────────────────────────────────────────

const Creator = () => {
  const router = useRouter();
  const { saveClient } = useContext(ClientContext) as ClientContextType;

  const [clientName, setClientName] = useState('');
  const [targetWeight, setTargetWeight] = useState<number | ''>('');
  const [plans, setPlans] = useState<PlanDraft[]>([createDefaultPlan()]);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [generatedPlans, setGeneratedPlans] = useState<DietPlan[]>([]);

  // Update a single plan by index
  const handlePlanUpdate = (index: number, updatedPlan: PlanDraft) => {
    setPlans((prev) => prev.map((p, i) => (i === index ? updatedPlan : p)));
  };

  // Add a new empty plan card
  const handleAddPlan = () => {
    setPlans((prev) => [...prev, createDefaultPlan()]);
  };

  // Save ALL plans at once → generate each DietPlan, persist, then navigate
  const handleSaveAll = () => {
    const fruits = FoodDatabase.getFruits();
    const firstMeal = FoodDatabase.getFirstMealFoods();
    const base = FoodDatabase.getSecondMealFoodsByCategory('BASE');
    const complement = FoodDatabase.getSecondMealFoodsByCategory('COMPLEMENT');

    const dietPlans = plans.map((draft, index) => {
      const generated = DietEngine.generatePlan(
        clientName || 'Cliente',
        fruits, draft.fruits,
        firstMeal, draft.proteins,
        base, draft.carbs,
        complement, draft.fats,
        base, draft.carbs,
        complement, draft.fats,
      );

      // Title follows "Plan {days}" if days is set, else "Plan {n}"
      const label = draft.days.trim()
        ? `Plan ${draft.days.trim()}`
        : `Plan ${index + 1}`;

      return {
        ...generated,
        label,
        days: draft.days,
      };
    });

    saveClient({
      name: clientName,
      nutritionistId: '',
      targetWeight: targetWeight !== '' ? targetWeight : undefined,
      plans: dietPlans,
    });

    router.push('/viewer');
  };

  // Generate plans and open the modal so the user can choose a client to persist to
  const handleSaveToDB = () => {
    const fruits = FoodDatabase.getFruits();
    const firstMeal = FoodDatabase.getFirstMealFoods();
    const base = FoodDatabase.getSecondMealFoodsByCategory('BASE');
    const complement = FoodDatabase.getSecondMealFoodsByCategory('COMPLEMENT');

    const dietPlans: DietPlan[] = plans.map((draft, index) => {
      const generated = DietEngine.generatePlan(
        clientName || 'Cliente',
        fruits, draft.fruits,
        firstMeal, draft.proteins,
        base, draft.carbs,
        complement, draft.fats,
        base, draft.carbs,
        complement, draft.fats,
      );

      const label = draft.days.trim()
        ? `Plan ${draft.days.trim()}`
        : `Plan ${index + 1}`;

      return {
        ...generated,
        label,
        days: draft.days,
      };
    });

    setGeneratedPlans(dietPlans);
    setSaveModalOpen(true);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={rootBg}>
        <Menu />

        {/* ── Client header ── */}
        <Box sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
          <TextField
            fullWidth
            label="Client"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ ...pillInput, mb: 2 }}
            slotProps={{
              input: {
                startAdornment: (
                  <AccountCircle sx={{ color: 'rgba(255,255,255,0.5)', mr: 1 }} />
                ),
              },
            }}
          />
          <TextField
            fullWidth
            label="Target Weight"
            type="number"
            value={targetWeight}
            onChange={(e) =>
              setTargetWeight(e.target.value === '' ? '' : Number(e.target.value))
            }
            variant="outlined"
            size="small"
            sx={pillInput}
            slotProps={{
              input: {
                startAdornment: (
                  <MonitorWeightRounded sx={{ color: 'rgba(255,255,255,0.5)', mr: 1 }} />
                ),
                endAdornment: (
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', mr: 1 }}>
                    kg
                  </Typography>
                ),
              },
            }}
          />
        </Box>

        {/* ── Plan cards ── */}
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
          {plans.map((plan, index) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              index={index}
              onUpdate={handlePlanUpdate}
            />
          ))}

          {/* ── Add Another Plan ── */}
          <Button
            fullWidth
            variant="outlined"
            onClick={handleAddPlan}
            startIcon={<AddCircleOutline />}
            sx={{
              borderColor: 'rgba(255,255,255,0.3)',
              color: 'rgba(255,255,255,0.8)',
              borderRadius: '50px',
              textTransform: 'none',
              fontWeight: 600,
              py: 1.5,
              mb: 2,
              '&:hover': {
                borderColor: '#7C9FFF',
                color: '#7C9FFF',
                background: 'rgba(124,159,255,0.08)',
              },
            }}
          >
            Add Another Plan
          </Button>

          {/* ── Save All Plans ── */}
          <Button
            fullWidth
            variant="contained"
            onClick={handleSaveAll}
            startIcon={<SaveOutlined />}
            disableElevation
            sx={{
              background: 'linear-gradient(135deg, #E91E8C, #9C27B0)',
              color: '#fff',
              borderRadius: '50px',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '1rem',
              py: 1.8,
              mb: 4,
              '&:hover': {
                background: 'linear-gradient(135deg, #C2185B, #7B1FA2)',
              },
            }}
          >
            Guardar Planes
          </Button>

          {/* ── Save to Database ── */}
          <Button
            fullWidth
            variant="outlined"
            onClick={handleSaveToDB}
            startIcon={<CloudUploadOutlined />}
            sx={{
              borderColor: 'rgba(124,159,255,0.4)',
              color: '#7C9FFF',
              borderRadius: '50px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              py: 1.5,
              mb: 4,
              '&:hover': {
                borderColor: '#7C9FFF',
                background: 'rgba(124,159,255,0.08)',
              },
            }}
          >
            Guardar en Base de Datos
          </Button>
        </Box>

        <SavePlanModal
          open={saveModalOpen}
          onClose={() => setSaveModalOpen(false)}
          plans={generatedPlans}
          nutritionistId={process.env.NEXT_PUBLIC_DEFAULT_NUTRITIONIST_ID ?? ''}
        />
      </Box>
    </ThemeProvider>
  );
};

export default Creator;
