import { Plan } from "./Plan";

export interface Client {
    name: string,
    plan?: Plan
}