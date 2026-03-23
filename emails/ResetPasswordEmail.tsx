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

interface ResetPasswordEmailProps {
  actionUrl: string;
}

export default function ResetPasswordEmail({ actionUrl }: ResetPasswordEmailProps) {
  return (
    <Html lang="es">
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Head />
        <Preview>Restablece tu contraseña de NutriPlan</Preview>
        <Body className="bg-[#0a0f1e] font-sans m-0 py-10">
          <Container className="max-w-xl mx-auto p-8 border border-solid border-[#1e293b] rounded-2xl bg-[#0f172a]">
            
            <Heading className="text-2xl font-bold text-white tracking-tight mb-2 mt-0">
              Restablecer Contraseña
            </Heading>
            <Text className="text-base text-[#94a3b8] mb-8 mt-0">
              NutriPlan Platform
            </Text>
            
            <Text className="text-base text-[#e2e8f0] mb-6">
              Recibimos una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el siguiente botón para elegir una nueva contraseña.
            </Text>

            <Section className="text-center mb-8">
              <Button
                href={actionUrl}
                className="bg-[#8b5cf6] text-white px-8 py-3.5 rounded-xl block text-center no-underline box-border font-semibold w-full"
              >
                Cambiar mi contraseña
              </Button>
            </Section>

            <Text className="text-sm text-[#94a3b8] mb-6">
              O copia y pega este enlace en tu navegador:
              <br />
              <a href={actionUrl} className="text-[#ec4899] break-all">{actionUrl}</a>
            </Text>

            <Hr className="border-[#1e293b] border-solid my-6 border-t border-l-0 border-r-0 border-b-0" />

            <Text className="text-xs text-[#64748b] text-center m-0">
              Si no solicitaste un cambio de contraseña, tu cuenta sigue estando segura y puedes ignorar este correo.
              <br />
              © {new Date().getFullYear()} NutriPlan Platform.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

ResetPasswordEmail.PreviewProps = {
  actionUrl: '{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=recovery',
} satisfies ResetPasswordEmailProps;

export { ResetPasswordEmail };
