import { createContext, ReactNode, useState } from "react";
import { Client } from "../model/Client";
import { ClientContextType } from "../model/ClientContextType";
import { Plan } from "../model/Plan";


export const ClientContext = createContext<ClientContextType | null>(null)

interface ClientContextProps {
    children?: ReactNode
}
const ClientProvider: React.FC<ClientContextProps> = ({ children }) => {
    const [client, setClient] = useState({
        name: '',
        plan: {} as Plan | undefined
    })

    const saveClient = (client: Client) => {
        setClient({ ...client, name: client.name, plan: client.plan })
        console.log(client)
    }

    return <ClientContext.Provider value={{ client, saveClient }}>{children}</ClientContext.Provider>
}

export default ClientProvider