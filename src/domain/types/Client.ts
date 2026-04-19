import { DietPlan } from "./DietPlan";
import { DailyStep } from "./DailySteps";

export interface Client {
    name: string;
    targetWeight?: number;
    coachId: string;
    authId?: string;
    plans: DietPlan[];
    dailySteps?: DailyStep[];
    stepGoal?: number;
    updatedAt?: string | Date;
}
