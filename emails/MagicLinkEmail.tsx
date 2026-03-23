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

interface MagicLinkEmailProps {
  actionUrl: string;
}

export default function MagicLinkEmail({ actionUrl }: MagicLinkEmailProps) {
  return (
    <Html lang="es">
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Head />
        <Preview>Tu enlace mágico de acceso a FitMetrik</Preview>
        <Body className="bg-[#0a0f1e] font-sans m-0 py-10">
          <Container className="max-w-xl mx-auto p-8 border border-solid border-[#1e293b] rounded-2xl bg-[#0f172a]">
            
            <Heading className="text-2xl font-bold text-white tracking-tight mb-2 mt-0">
              Bienvenido de nuevo
            </Heading>
            <Text className="text-base text-[#94a3b8] mb-8 mt-0">
              FitMetrik
            </Text>
            
            <Text className="text-base text-[#e2e8f0] mb-6">
              Has solicitado un enlace mágico para iniciar sesión en tu cuenta. Haz clic en el botón de abajo para entrar de forma segura sin contraseña.
            </Text>

            <Section className="text-center mb-8">
              <Button
                href={actionUrl}
                className="bg-[#ec4899] text-white px-8 py-3.5 rounded-xl block text-center no-underline box-border font-semibold w-full"
              >
                Entrar a FitMetrik
              </Button>
            </Section>

            <Text className="text-sm text-[#94a3b8] mb-6">
              Si el botón no funciona, copia y pega este enlace en tu navegador:
              <br />
              <a href={actionUrl} className="text-[#8b5cf6] break-all">{actionUrl}</a>
            </Text>

            <Hr className="border-[#1e293b] border-solid my-6 border-t border-l-0 border-r-0 border-b-0" />

            <Text className="text-xs text-[#64748b] text-center m-0">
              Si no solicitaste este enlace, puedes ignorar este correo de forma segura.
              <br />
              © {new Date().getFullYear()} FitMetrik.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

MagicLinkEmail.PreviewProps = {
  actionUrl: '{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=magiclink',
} satisfies MagicLinkEmailProps;

export { MagicLinkEmail };
