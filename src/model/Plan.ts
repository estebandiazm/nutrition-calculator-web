import { Food } from "./Food";

export interface Plan {
    fruits?: Food[],
    firstMeal?: Food[],
    secondMeal?: Food[]
}