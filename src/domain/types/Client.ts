import { DietPlan } from "./DietPlan";

export interface Client {
    name: string;
    plan?: DietPlan;
}
