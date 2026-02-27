'use client';

import React from 'react';
import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Food } from '../../domain/types/Food';

export type PlanDraft = {
  id: string;
  label: string;
  days: string;
  proteins: number;
  carbs: number;
  fruits: number;
  fats: number;
  foods: Food[];
};

const CATEGORY_EMOJI: Record<string, string> = {
  FRUIT: '🍊',
  BASE: '🍗',
  COMPLEMENT: '🍚',
};

const glassmorphicCard = {
  background: 'rgba(13, 31, 90, 0.55)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  borderRadius: '20px',
  border: '1px solid rgba(255,255,255,0.12)',
  padding: '24px',
  mb: 3,
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
  '& .MuiInputAdornment-root p': { color: 'rgba(255,255,255,0.5)' },
};

interface PlanCardProps {
  plan: PlanDraft;
  index: number;
  onUpdate: (index: number, updatedPlan: PlanDraft) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, index, onUpdate }) => {
  const update = (field: keyof PlanDraft, value: string | number | Food[]) => {
    onUpdate(index, { ...plan, [field]: value });
  };

  // Derived title: "Plan | {days} days" if days filled, otherwise "Plan | {index+1}"
  const cardTitle = plan.days.trim()
    ? `Plan | ${plan.days.trim()} days`
    : `Plan | ${index + 1}`;

  return (
    <Box sx={glassmorphicCard}>
      {/* Plan title */}
      <Typography
        variant="h6"
        sx={{ color: '#fff', fontWeight: 700, mb: 2, textAlign: 'center' }}
      >
        {cardTitle}
      </Typography>

      {/* Days field */}
      <TextField
        fullWidth
        label="Days"
        value={plan.days}
        onChange={(e) => update('days', e.target.value)}
        variant="outlined"
        size="small"
        sx={{ ...pillInput, mb: 2 }}
        InputLabelProps={{ style: { color: 'rgba(255,255,255,0.6)' } }}
      />

      {/* Proteins + Carbs */}
      <Grid container spacing={2} sx={{ mb: 1 }}>
        <Grid size={6}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', ml: 1 }}>
            Proteins
          </Typography>
          <TextField
            fullWidth
            type="number"
            value={plan.proteins}
            onChange={(e) => update('proteins', Number(e.target.value))}
            variant="outlined"
            size="small"
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">g</InputAdornment>,
              },
            }}
            sx={pillInput}
          />
        </Grid>
        <Grid size={6}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', ml: 1 }}>
            Carbs
          </Typography>
          <TextField
            fullWidth
            type="number"
            value={plan.carbs}
            onChange={(e) => update('carbs', Number(e.target.value))}
            variant="outlined"
            size="small"
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">g</InputAdornment>,
              },
            }}
            sx={pillInput}
          />
        </Grid>
      </Grid>

      {/* Fruits + Fats */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={6}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', ml: 1 }}>
            Fruits
          </Typography>
          <TextField
            fullWidth
            type="number"
            value={plan.fruits}
            onChange={(e) => update('fruits', Number(e.target.value))}
            variant="outlined"
            size="small"
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">g</InputAdornment>,
              },
            }}
            sx={pillInput}
          />
        </Grid>
        <Grid size={6}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', ml: 1 }}>
            Fats
          </Typography>
          <TextField
            fullWidth
            type="number"
            value={plan.fats}
            onChange={(e) => update('fats', Number(e.target.value))}
            variant="outlined"
            size="small"
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">g</InputAdornment>,
              },
            }}
            sx={pillInput}
          />
        </Grid>
      </Grid>

      {/* Food list */}
      {plan.foods.length > 0 && (
        <Box sx={{ mb: 2 }}>
          {plan.foods.map((food, fi) => (
            <Box
              key={fi}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 0.5,
              }}
            >
              <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem' }}>
                {CATEGORY_EMOJI[food.category] ?? '🍽️'} {food.name} -{' '}
                {food.totalGrams ?? food.grams}g
              </Typography>
              <IconButton
                size="small"
                onClick={() =>
                  update(
                    'foods',
                    plan.foods.filter((_, i) => i !== fi)
                  )
                }
                sx={{ color: 'rgba(255,255,255,0.4)', p: 0.5 }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PlanCard;
