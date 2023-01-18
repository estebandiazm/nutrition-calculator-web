import { Client } from "./Client";

export type ClientContextType = {
    client: Client;
    saveClient: (client: Client) => void
}