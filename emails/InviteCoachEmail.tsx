import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Tailwind,
  pixelBasedPreset,
  Section,
  Hr
} from '@react-email/components';
import React from 'react';

interface InviteCoachEmailProps {
  actionUrl: string;
}

export default function InviteCoachEmail({ actionUrl }: InviteCoachEmailProps) {
  return (
    <Html lang="es">
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Head />
        <Preview>Has sido invitado como coach a FitMetrik</Preview>
        <Body className="bg-[#0a0f1e] font-sans m-0 py-10">
          <Container className="max-w-xl mx-auto p-8 border border-solid border-[#1e293b] rounded-2xl bg-[#0f172a]">

            <Heading className="text-2xl font-bold text-white tracking-tight mb-2 mt-0">
              ¡Bienvenido al equipo de FitMetrik!
            </Heading>
            <Text className="text-base text-[#94a3b8] mb-8 mt-0">
              Tu cuenta de coach está lista
            </Text>

            <Text className="text-base text-[#e2e8f0] mb-6">
              Has sido invitado como coach a FitMetrik. Desde tu panel podrás gestionar a tus clientes, crear planes nutricionales personalizados y hacer seguimiento de su progreso.
            </Text>

            <Text className="text-base text-[#e2e8f0] mb-6">
              Para activar tu cuenta y establecer tu contraseña, por favor haz clic en el siguiente botón:
            </Text>

            <Section className="text-center mb-8">
              <Button
                href={actionUrl}
                className="bg-[#ec4899] text-white px-8 py-3.5 rounded-xl block text-center no-underline box-border font-semibold w-full"
              >
                Activar mi cuenta de coach
              </Button>
            </Section>

            <Text className="text-sm text-[#94a3b8] mb-6">
              O copia y pega este enlace en tu navegador:
              <br />
              <a href={actionUrl} className="text-[#8b5cf6] break-all">{actionUrl}</a>
            </Text>

            <Hr className="border-[#1e293b] border-solid my-6 border-t border-l-0 border-r-0 border-b-0" />

            <Text className="text-xs text-[#64748b] text-center m-0">
              Si crees que esto es un error, puedes ignorar este correo.
              <br />
              © {new Date().getFullYear()} FitMetrik.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

InviteCoachEmail.PreviewProps = {
  actionUrl: '{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=invite',
} satisfies InviteCoachEmailProps;

export { InviteCoachEmail };
