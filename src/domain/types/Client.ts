import { DietPlan } from "./DietPlan";

export interface Client {
    name: string;
    targetWeight?: number;
    coachId: string;
    authId?: string;
    plans: DietPlan[];
    updatedAt?: string | Date;
}
