import { DietPlan } from "./DietPlan";
import { DailyStep } from "./DailySteps";
import { DailyWeight } from "./DailyWeight";

export interface Client {
    name: string;
    targetWeight?: number;
    coachId: string;
    authId?: string;
    plans: DietPlan[];
    dailySteps?: DailyStep[];
    dailyWeights?: DailyWeight[];
    stepGoal?: number;
    updatedAt?: string | Date;
}
