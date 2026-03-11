'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  ThemeProvider,
  CircularProgress,
  Button,
} from '@mui/material';
import { PeopleAlt, Add } from '@mui/icons-material';
import { darkTheme } from '../themes';
import Menu from '../components/menu/Menu';
import { getClients } from './actions/clientActions';
import { Client } from '../domain/types/Client';
import { useRouter } from 'next/navigation';

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
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(255,255,255,0.10)',
    border: '1px solid rgba(124,159,255,0.35)',
    transform: 'translateY(-2px)',
  },
};

// ─── component ──────────────────────────────────────────────────────────────

type ClientWithId = Client & { id: string };

export default function HomePage() {
  const router = useRouter();
  const [clients, setClients] = useState<ClientWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getClients();
        setClients(data);
      } catch {
        setError('No se pudo conectar con la base de datos.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={rootBg}>
        <Menu />

        {/* ── Header ── */}
        <Box sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <PeopleAlt sx={{ color: '#7C9FFF', fontSize: 28 }} />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(90deg, #7C9FFF, #E91E8C)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Clientes
            </Typography>
          </Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem' }}>
            Gestiona los perfiles de tus pacientes y sus planes nutricionales.
          </Typography>
        </Box>

        {/* ── Content ── */}
        <Box sx={{ maxWidth: 700, mx: 'auto' }}>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#7C9FFF' }} />
            </Box>
          )}

          {error && (
            <Typography sx={{ color: '#ff5252', textAlign: 'center', py: 4 }}>
              {error}
            </Typography>
          )}

          {!loading && !error && clients.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <PeopleAlt sx={{ fontSize: 64, color: 'rgba(255,255,255,0.15)', mb: 2 }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 1 }}>
                Aún no tienes clientes registrados.
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
                Crea un plan nutricional y guárdalo con el nombre de un cliente para comenzar.
              </Typography>
            </Box>
          )}

          {!loading &&
            !error &&
            clients.map((client) => (
              <Card key={client.id} sx={{ ...glassCard, mb: 2 }}>
                <CardActionArea onClick={() => router.push(`/clients/${client.id}`)}>
                  <CardContent sx={{ py: 2.5, px: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{ color: '#fff', fontWeight: 700, mb: 0.5 }}
                        >
                          {client.name}
                        </Typography>
                        {client.targetWeight && (
                          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                            Peso objetivo: {client.targetWeight} kg
                          </Typography>
                        )}
                      </Box>
                      <Chip
                        label={`${client.plans.length} plan${client.plans.length !== 1 ? 'es' : ''}`}
                        size="small"
                        sx={{
                          background: 'rgba(124,159,255,0.15)',
                          color: '#7C9FFF',
                          fontWeight: 600,
                          border: '1px solid rgba(124,159,255,0.25)',
                        }}
                      />
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}

          {/* ── New plan button ── */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Add />}
            onClick={() => router.push('/creator')}
            sx={{
              mt: 2,
              borderColor: 'rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.7)',
              borderRadius: '50px',
              textTransform: 'none',
              fontWeight: 600,
              py: 1.5,
              '&:hover': {
                borderColor: '#7C9FFF',
                color: '#7C9FFF',
                background: 'rgba(124,159,255,0.08)',
              },
            }}
          >
            Crear Nuevo Plan
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
}