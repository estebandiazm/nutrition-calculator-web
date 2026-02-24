export type FoodCategory = 'FRUIT' | 'BASE' | 'COMPLEMENT';

export interface Food {
    name: string;
    grams: number;
    category: FoodCategory;
    totalGrams?: number;
}
