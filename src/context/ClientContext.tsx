"use client";
import { createContext, ReactNode, useEffect, useState } from "react";
import { Client } from "../model/Client";
import { ClientContextType } from "../model/ClientContextType";

export const ClientContext = createContext<ClientContextType | null>(null);

interface ClientContextProps {
  children?: ReactNode;
}

const ClientProvider: React.FC<ClientContextProps> = ({ children }) => {

  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("client");
      console.log("Client stored:", stored);
      if (stored) {
        const parsed = JSON.parse(stored);
        setClient(parsed);
      } else {
        setClient({
          name: "",
          plan: {
            fruits: [],
            firstMeal: [],
            secondMeal: [],
          },
        });
      }
    } catch (err) {
      console.warn("Error leyendo localStorage", err);
    }
  }, []);

  useEffect(() => {
    if (client) {
      localStorage.setItem("client", JSON.stringify(client));
    }
  }, [client]);

  const saveClient = (clientToSave: Client) => {
    setClient({ ...clientToSave });
    console.log("Client saved:", client);
  };

  if (!client) return null;

  return (
    <ClientContext.Provider value={{ client, saveClient }}>
      {children}
    </ClientContext.Provider>
  );
};

export default ClientProvider;
