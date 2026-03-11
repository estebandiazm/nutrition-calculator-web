'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  ThemeProvider,
  CircularProgress,
  Button,
  Divider,
  IconButton,
} from '@mui/material';
import { ArrowBack, Person, FitnessCenter, Restaurant, Visibility } from '@mui/icons-material';
import { darkTheme } from '../../../themes';
import Menu from '../../../components/menu/Menu';
import { getClientById } from '../../actions/clientActions';
import { Client } from '../../../domain/types/Client';

// ─── styles ─────────────────────────────────────────────────────────────────

const rootBg = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0a1628 0%, #0d2157 50%, #0a1628 100%)',
  py: 3,
  px: { xs: 2, sm: 3, md: 6 },
};

const glassCard = {
  background: 'rgba(255,255,255,0.06)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: '16px',
  mb: 2,
};

// ─── component ──────────────────────────────────────────────────────────────

type ClientWithId = Client & { id: string };

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [client, setClient] = useState<ClientWithId | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getClientById(clientId);
        if (!data) {
          setError('Cliente no encontrado.');
          return;
        }
        setClient(data);
      } catch {
        setError('Error al cargar los datos del cliente.');
      } finally {
        setLoading(false);
      }
    })();
  }, [clientId]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={rootBg}>
        <Menu />

        <Box sx={{ maxWidth: 700, mx: 'auto' }}>
          {/* ── Back button ── */}
          <Button
            startIcon={<ArrowBack />}
            onClick={() => router.push('/')}
            sx={{
              color: 'rgba(255,255,255,0.6)',
              textTransform: 'none',
              mb: 2,
              '&:hover': { color: '#7C9FFF' },
            }}
          >
            Volver a Clientes
          </Button>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#7C9FFF' }} />
            </Box>
          )}

          {error && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography sx={{ color: '#ff5252', mb: 2 }}>{error}</Typography>
              <Button
                variant="outlined"
                onClick={() => router.push('/')}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'rgba(255,255,255,0.7)',
                  borderRadius: '50px',
                  textTransform: 'none',
                }}
              >
                Ir a Clientes
              </Button>
            </Box>
          )}

          {!loading && !error && client && (
            <>
              {/* ── Client profile ── */}
              <Card sx={glassCard}>
                <CardContent sx={{ py: 3, px: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #7C9FFF, #E91E8C)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Person sx={{ color: '#fff', fontSize: 28 }} />
                    </Box>
                    <Box>
                      <Typography
                        variant="h5"
                        sx={{ color: '#fff', fontWeight: 800 }}
                      >
                        {client.name}
                      </Typography>
                      {client.targetWeight && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <FitnessCenter sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }} />
                          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                            Peso objetivo: {client.targetWeight} kg
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* ── Plans section ── */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, mt: 3 }}>
                <Restaurant sx={{ color: '#7C9FFF', fontSize: 22 }} />
                <Typography
                  variant="h6"
                  sx={{ color: '#fff', fontWeight: 700 }}
                >
                  Planes Nutricionales
                </Typography>
                <Chip
                  label={client.plans.length}
                  size="small"
                  sx={{
                    background: 'rgba(124,159,255,0.15)',
                    color: '#7C9FFF',
                    fontWeight: 700,
                    border: '1px solid rgba(124,159,255,0.25)',
                    minWidth: 28,
                  }}
                />
              </Box>

              {client.plans.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Restaurant sx={{ fontSize: 48, color: 'rgba(255,255,255,0.12)', mb: 1 }} />
                  <Typography sx={{ color: 'rgba(255,255,255,0.4)' }}>
                    Este cliente aún no tiene planes guardados.
                  </Typography>
                </Box>
              )}

              {client.plans.map((plan, index) => (
                <Card key={index} sx={glassCard}>
                  <CardContent sx={{ py: 2.5, px: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography sx={{ color: '#fff', fontWeight: 700 }}>
                        {plan.label || `Plan ${index + 1}`}
                      </Typography>
                      {plan.days && (
                        <Chip
                          label={plan.days}
                          size="small"
                          sx={{
                            background: 'rgba(233,30,140,0.12)',
                            color: '#E91E8C',
                            fontWeight: 600,
                            border: '1px solid rgba(233,30,140,0.25)',
                          }}
                        />
                      )}
                    </Box>

                    {plan.recommendations && (
                      <Typography
                        sx={{
                          color: 'rgba(255,255,255,0.5)',
                          fontSize: '0.8rem',
                          mb: 1.5,
                        }}
                      >
                        {plan.recommendations}
                      </Typography>
                    )}

                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 1.5 }} />

                    {/* Meal summary */}
                    {plan.meals && plan.meals.length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                        {plan.meals.map((meal, mi) => (
                          <Chip
                            key={mi}
                            label={meal.mealName}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: 'rgba(255,255,255,0.15)',
                              color: 'rgba(255,255,255,0.6)',
                              fontSize: '0.75rem',
                            }}
                          />
                        ))}
                      </Box>
                    )}

                    {plan.snacks && plan.snacks.length > 0 && (
                      <Typography
                        sx={{
                          color: 'rgba(255,255,255,0.4)',
                          fontSize: '0.75rem',
                          mt: 1,
                        }}
                      >
                        {plan.snacks.length} snack{plan.snacks.length !== 1 ? 's' : ''}
                      </Typography>
                    )}

                    <Button
                      startIcon={<Visibility />}
                      onClick={() => router.push(`/viewer?clientId=${client.id}&planIndex=${index}`)}
                      size="small"
                      sx={{
                        mt: 2,
                        color: '#7C9FFF',
                        textTransform: 'none',
                        fontWeight: 600,
                        border: '1px solid rgba(124,159,255,0.25)',
                        borderRadius: '50px',
                        px: 2,
                        '&:hover': {
                          background: 'rgba(124,159,255,0.12)',
                          borderColor: '#7C9FFF',
                        },
                      }}
                    >
                      Ver Plan
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
