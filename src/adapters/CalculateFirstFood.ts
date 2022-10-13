import { Fruit } from "../model/Fruit";

const fruits: Fruit[] = [
    { 'name': 'Avena', 'grams': 90 },
    { 'name': 'Arroz', 'grams': 192 },
    { 'name': 'Tocineta', 'grams': 45 },
    { 'name': 'Granola', 'grams': 77 },
    { 'name': 'Arepa Masmai', 'grams': 2 },
    { 'name': 'froot loops + 250ml', 'grams': 55 },
]

const calculateIndex = (gramsTarget: number, fruitBaseGrams: number) => {
    return (gramsTarget * 90) / fruitBaseGrams;
}

function calculateGrams (fruit: Fruit, target: number): Fruit {
    let index = calculateIndex(target, fruits[0].grams)
    let finalGrams = (fruit.grams * index) / 90
    fruit.totalGrams = Math.round(finalGrams);
    return fruit;
}

function calculate(gramsTarget: number): Fruit[] {
    let result = fruits.map((fruit) => {
        return calculateGrams(fruit, gramsTarget)
    })
    return result;
}
export const CalculateFirstFood = (target: number): Fruit[]=> {
    return calculate(target)
}