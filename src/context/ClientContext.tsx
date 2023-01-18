import { createContext, ReactNode, useState } from "react";
import { Client } from "../model/Client";
import { ClientContextType } from "../model/ClientContextType";


export const ClientContext = createContext<ClientContextType | null>(null)

interface ClientContextProps {
    children?: ReactNode
}
const ClientProvider: React.FC<ClientContextProps> = ({ children }) => {
    const [client, setClient] = useState({
        name: ''
    })

    const saveClient = (client: Client) => {
        setClient({ ...client, name: client.name })
    }

    return <ClientContext.Provider value={{ client, saveClient }}>{children}</ClientContext.Provider>
}

export default ClientProvider