import { DietPlan } from "./DietPlan";

export interface Client {
    name: string;
    targetWeight?: number;
    nutritionistId: string;
    plans: DietPlan[];
}
