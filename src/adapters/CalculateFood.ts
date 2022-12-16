import { Food } from "../model/Food";

const calculateIndex = (gramsTarget: number, fruitBaseGrams: number) => {
    return (gramsTarget * 90) / fruitBaseGrams;
}

function calculateGrams(fruit: Food, target: number, pivot: number): Food {
    let index = calculateIndex(target, pivot)
    let finalGrams = (fruit.grams * index) / 90
    fruit.totalGrams = Math.round(finalGrams);
    return fruit;
}

function calculate(gramsTarget: number, foods: Food[]): Food[] {
    let pivot = foods[0].grams
    let result = foods.map((fruit) => {
        return calculateGrams(fruit, gramsTarget, pivot)
    })
    return result;
}
export const CalculateFoodSimple = (target: number, foods: Food[]): Food[] => {
    return calculate(target, foods)
}