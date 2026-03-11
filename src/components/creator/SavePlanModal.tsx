'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Autocomplete,
  Alert,
} from '@mui/material';
import { PersonAdd, SaveOutlined } from '@mui/icons-material';
import { getClients, createClient, addDietPlanToClient } from '../../app/actions/clientActions';
import { Client } from '../../domain/types/Client';
import { DietPlan } from '../../domain/types/DietPlan';

// ─── types ──────────────────────────────────────────────────────────────────

type ClientWithId = Client & { id: string };

interface SavePlanModalProps {
  open: boolean;
  onClose: () => void;
  plans: DietPlan[];
  nutritionistId: string;
}

// ─── styles ─────────────────────────────────────────────────────────────────

const dialogPaperSx = {
  background: 'linear-gradient(135deg, #0d1a33 0%, #14285a 100%)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: '16px',
  minWidth: { xs: '90vw', sm: 420 },
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
};

// ─── component ──────────────────────────────────────────────────────────────

export default function SavePlanModal({ open, onClose, plans, nutritionistId }: SavePlanModalProps) {
  const [clients, setClients] = useState<ClientWithId[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientWithId | null>(null);
  const [newClientName, setNewClientName] = useState('');
  const [isNewClient, setIsNewClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingClients, setFetchingClients] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch existing clients when modal opens
  useEffect(() => {
    if (!open) return;
    setError(null);
    setSuccess(false);
    setSelectedClient(null);
    setNewClientName('');
    setIsNewClient(false);

    (async () => {
      setFetchingClients(true);
      try {
        const data = await getClients();
        setClients(data);
        if (data.length === 0) setIsNewClient(true);
      } catch {
        // silently fail – user can still create a new client
        setClients([]);
        setIsNewClient(true);
      } finally {
        setFetchingClients(false);
      }
    })();
  }, [open]);

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      let targetClientId: string;

      if (isNewClient || !selectedClient) {
        if (!newClientName.trim()) {
          setError('Ingresa un nombre para el nuevo cliente.');
          setLoading(false);
          return;
        }
        const created = await createClient({
          name: newClientName.trim(),
          nutritionistId,
        });
        targetClientId = created.id;
      } else {
        targetClientId = selectedClient.id;
      }

      // Push each plan to the client
      for (const plan of plans) {
        await addDietPlanToClient(targetClientId, plan);
      }

      setSuccess(true);
      setTimeout(() => onClose(), 1500);
    } catch {
      setError('Error al guardar. Verifica la conexión con la base de datos.');
    } finally {
      setLoading(false);
    }
  };

  const canSave = isNewClient ? newClientName.trim().length > 0 : selectedClient !== null;

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: dialogPaperSx }}>
      <DialogTitle
        sx={{
          color: '#fff',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <SaveOutlined sx={{ color: '#7C9FFF' }} />
        Guardar en Base de Datos
      </DialogTitle>

      <DialogContent>
        {success ? (
          <Alert
            severity="success"
            sx={{
              mt: 1,
              background: 'rgba(76,175,80,0.12)',
              color: '#81c784',
              border: '1px solid rgba(76,175,80,0.25)',
              '& .MuiAlert-icon': { color: '#81c784' },
            }}
          >
            ¡Planes guardados exitosamente!
          </Alert>
        ) : (
          <Box sx={{ mt: 1 }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', mb: 2 }}>
              {plans.length} plan{plans.length !== 1 ? 'es' : ''} se guardarán en el perfil del cliente.
            </Typography>

            {fetchingClients ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress size={28} sx={{ color: '#7C9FFF' }} />
              </Box>
            ) : (
              <>
                {!isNewClient && clients.length > 0 && (
                  <>
                    <Autocomplete
                      options={clients}
                      getOptionLabel={(option) => option.name}
                      value={selectedClient}
                      onChange={(_, value) => setSelectedClient(value)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Seleccionar Cliente"
                          size="small"
                          sx={pillInput}
                        />
                      )}
                      sx={{
                        mb: 1.5,
                        '& .MuiAutocomplete-popupIndicator': { color: 'rgba(255,255,255,0.5)' },
                        '& .MuiAutocomplete-clearIndicator': { color: 'rgba(255,255,255,0.5)' },
                      }}
                      slotProps={{
                        paper: {
                          sx: {
                            background: '#14285a',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#fff',
                          },
                        },
                      }}
                    />
                    <Button
                      size="small"
                      startIcon={<PersonAdd />}
                      onClick={() => setIsNewClient(true)}
                      sx={{
                        color: 'rgba(255,255,255,0.6)',
                        textTransform: 'none',
                        fontSize: '0.8rem',
                        '&:hover': { color: '#7C9FFF' },
                      }}
                    >
                      Crear nuevo cliente
                    </Button>
                  </>
                )}

                {isNewClient && (
                  <>
                    <TextField
                      fullWidth
                      label="Nombre del Cliente"
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      size="small"
                      sx={{ ...pillInput, mb: 1.5 }}
                      autoFocus
                    />
                    {clients.length > 0 && (
                      <Button
                        size="small"
                        onClick={() => setIsNewClient(false)}
                        sx={{
                          color: 'rgba(255,255,255,0.6)',
                          textTransform: 'none',
                          fontSize: '0.8rem',
                          '&:hover': { color: '#7C9FFF' },
                        }}
                      >
                        Seleccionar cliente existente
                      </Button>
                    )}
                  </>
                )}
              </>
            )}

            {error && (
              <Alert
                severity="error"
                sx={{
                  mt: 2,
                  background: 'rgba(244,67,54,0.12)',
                  color: '#ef9a9a',
                  border: '1px solid rgba(244,67,54,0.25)',
                  '& .MuiAlert-icon': { color: '#ef9a9a' },
                }}
              >
                {error}
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>

      {!success && (
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={onClose}
            sx={{
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'none',
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!canSave || loading}
            variant="contained"
            disableElevation
            startIcon={loading ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <SaveOutlined />}
            sx={{
              background: 'linear-gradient(135deg, #E91E8C, #9C27B0)',
              borderRadius: '50px',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              '&:hover': {
                background: 'linear-gradient(135deg, #C2185B, #7B1FA2)',
              },
              '&.Mui-disabled': {
                background: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.3)',
              },
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
