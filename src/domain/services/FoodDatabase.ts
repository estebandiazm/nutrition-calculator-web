import { firstMealFoods, fruits, secondMealFoods } from "../data/foods";
import { Food, FoodCategory } from "../types/Food";

export class FoodDatabase {
  static getFruits(): Food[] {
    return fruits;
  }

  static getFirstMealFoods(): Food[] {
    return firstMealFoods;
  }

  static getSecondMealFoodsByCategory(category: FoodCategory): Food[] {
    return secondMealFoods.filter((food) => food.category === category);
  }

  static getSecondMealFoods(): Food[] {
    return secondMealFoods;
  }
}
