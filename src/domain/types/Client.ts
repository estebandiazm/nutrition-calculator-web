import { DietPlan } from "./DietPlan";

export interface Client {
    name: string;
    targetWeight?: number;
    plans: DietPlan[];
}
