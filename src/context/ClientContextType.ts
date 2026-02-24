import { Client } from "../domain/types/Client";

export type ClientContextType = {
    client: Client;
    saveClient: (client: Client) => void
}
