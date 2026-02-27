"use client";
import { createContext, ReactNode, useEffect, useState } from "react";
import { Client } from "../domain/types/Client";
import { ClientContextType } from "./ClientContextType";

export const ClientContext = createContext<ClientContextType | null>(null);

interface ClientContextProps {
  children?: ReactNode;
}

const ClientProvider: React.FC<ClientContextProps> = ({ children }) => {

  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("client");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Migrate old data shape (plan → plans)
        if (parsed.plan && !parsed.plans) {
          parsed.plans = [parsed.plan];
          delete parsed.plan;
        }
        setClient(parsed);
      } else {
        setClient({ name: "", plans: [] });
      }
    } catch (err) {
      console.warn("Error leyendo localStorage", err);
      setClient({ name: "", plans: [] });
    }
  }, []);

  useEffect(() => {
    if (client) {
      localStorage.setItem("client", JSON.stringify(client));
    }
  }, [client]);

  const saveClient = (clientToSave: Client) => {
    setClient({ ...clientToSave });
    localStorage.setItem("client", JSON.stringify(clientToSave));
    console.log("Client saved:", clientToSave);
  };

  if (!client) return null;

  return (
    <ClientContext.Provider value={{ client, saveClient }}>
      {children}
    </ClientContext.Provider>
  );
};

export default ClientProvider;
