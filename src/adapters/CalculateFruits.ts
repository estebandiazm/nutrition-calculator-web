import { Fruit } from "../model/Fruit";

const fruits: Fruit[] = [
    { 'name': 'Pina', 'grams': 150 },
    { 'name': 'papaya', 'grams': 175 },
    { 'name': 'Melon', 'grams': 207 },
    { 'name': 'Pera', 'grams': 130 },
    { 'name': 'Mango', 'grams': 125 },
    { 'name': 'Manzana', 'grams': 144 },
    { 'name': 'Banano', 'grams': 84 },
    { 'name': 'Kiwi', 'grams': 123 },
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
export const CalculateFruits = (target: number): Fruit[]=> {
    return calculate(target)
}