const PreFilledFoodItemSchema = require('../models/PreFilledMeal.model');
const foodItems = [
  // Your 20 Persian food items JSON data here (from the previous response)
  // ...

  {
    food_item: 'Kabab Koobideh',
    persian_name: 'کباب کوبیده',
    cuisine: 'Persian',
    serving_size: '1 Serving',
    calories: {
      amount: '350',
      unit: 'kcal',
    },
    total_fat: {
      amount: '20',
      unit: 'g',
    },
    saturated_fat: {
      amount: '6',
      unit: 'g',
    },
    cholesterol: {
      amount: '80',
      unit: 'mg',
    },
    sodium: {
      amount: '150',
      unit: 'mg',
    },
    total_carbohydrates: {
      amount: '10',
      unit: 'g',
    },
    dietary_fiber: {
      amount: '2',
      unit: 'g',
    },
    sugars: {
      amount: '2',
      unit: 'g',
    },
    protein: {
      amount: '25',
      unit: 'g',
    },
    vitamins_and_minerals: {
      vitamin_a: { amount: '50', unit: 'IU' },
      vitamin_c: { amount: '5', unit: 'mg' },
      calcium: { amount: '50', unit: 'mg' },
      iron: { amount: '5', unit: 'mg' },
    },
    ingredients: [
      'Ground Lamb',
      'Onion',
      'Salt',
      'Pepper',
      'Saffron (optional)',
    ],
    description:
      'A classic Persian kebab made with ground lamb, onions, and spices, often served with grilled tomatoes and onions.',
  },
  {
    food_item: 'Joojeh Kabab',
    persian_name: 'جوجه کباب',
    cuisine: 'Persian',
    serving_size: '1 Serving',
    calories: {
      amount: '300',
      unit: 'kcal',
    },
    total_fat: {
      amount: '15',
      unit: 'g',
    },
    saturated_fat: {
      amount: '4',
      unit: 'g',
    },
    cholesterol: {
      amount: '60',
      unit: 'mg',
    },
    sodium: {
      amount: '100',
      unit: 'mg',
    },
    total_carbohydrates: {
      amount: '5',
      unit: 'g',
    },
    dietary_fiber: {
      amount: '1',
      unit: 'g',
    },
    sugars: {
      amount: '1',
      unit: 'g',
    },
    protein: {
      amount: '20',
      unit: 'g',
    },
    vitamins_and_minerals: {
      vitamin_a: { amount: '40', unit: 'IU' },
      vitamin_c: { amount: '3', unit: 'mg' },
      calcium: { amount: '40', unit: 'mg' },
      iron: { amount: '3', unit: 'mg' },
    },
    ingredients: [
      'Chicken Thighs or Breasts',
      'Yogurt',
      'Onion',
      'Garlic',
      'Saffron (optional)',
    ],
    description:
      'A popular Iranian kebab made with marinated chicken, yogurt, onions, and saffron.',
  },
  {
    food_item: 'Ghormeh Sabzi Stew',
    persian_name: 'قرمه سبزی',
    cuisine: 'Persian',
    serving_size: '1 Cup',
    calories: {
      amount: '250',
      unit: 'kcal',
    },
    total_fat: {
      amount: '10',
      unit: 'g',
    },
    saturated_fat: {
      amount: '2',
      unit: 'g',
    },
    cholesterol: {
      amount: '0',
      unit: 'mg',
    },
    sodium: {
      amount: '150',
      unit: 'mg',
    },
    total_carbohydrates: {
      amount: '35',
      unit: 'g',
    },
    dietary_fiber: {
      amount: '5',
      unit: 'g',
    },
    sugars: {
      amount: '10',
      unit: 'g',
    },
    protein: {
      amount: '10',
      unit: 'g',
    },
    vitamins_and_minerals: {
      vitamin_a: { amount: '100', unit: 'IU' },
      vitamin_c: { amount: '20', unit: 'mg' },
      calcium: { amount: '100', unit: 'mg' },
      iron: { amount: '5', unit: 'mg' },
    },
    ingredients: [
      'Lamb',
      'Herbs (Parsley, Spinach, Fenugreek)',
      'Dried Lima Beans',
      'Onion',
      'Tomato',
      'Turmeric',
    ],
    description:
      'A traditional Persian stew with a rich and flavorful broth, typically served with rice.',
  },
  {
    food_item: 'Fesenjan Stew',
    persian_name: 'فسنجان',
    cuisine: 'Persian',
    serving_size: '1 Cup',
    calories: {
      amount: '270',
      unit: 'kcal',
    },
    total_fat: {
      amount: '11',
      unit: 'g',
    },
    saturated_fat: {
      amount: '3',
      unit: 'g',
    },
    cholesterol: {
      amount: '20',
      unit: 'mg',
    },
    sodium: {
      amount: '160',
      unit: 'mg',
    },
    total_carbohydrates: {
      amount: '36',
      unit: 'g',
    },
    dietary_fiber: {
      amount: '3',
      unit: 'g',
    },
    sugars: {
      amount: '10',
      unit: 'g',
    },
    protein: {
      amount: '8',
      unit: 'g',
    },
    vitamins_and_minerals: {
      vitamin_a: { amount: '40', unit: 'IU' },
      vitamin_c: { amount: '10', unit: 'mg' },
      calcium: { amount: '40', unit: 'mg' },
      iron: { amount: '2', unit: 'mg' },
    },
    ingredients: [
      'Pomegranate Paste',
      'Walnuts',
      'Chicken or Duck',
      'Onion',
      'Sugar',
      'Saffron',
    ],
    description:
      'A rich and tangy stew made with pomegranate paste, walnuts, and chicken or duck.',
  },
  {
    food_item: 'Gheymeh Stew',
    persian_name: 'خورشت قیمه',
    cuisine: 'Persian',
    serving_size: '1 Cup',
    calories: {
      amount: '300',
      unit: 'kcal',
    },
    total_fat: {
      amount: '15',
      unit: 'g',
    },
    saturated_fat: {
      amount: '4',
      unit: 'g',
    },
    cholesterol: {
      amount: '50',
      unit: 'mg',
    },
    sodium: {
      amount: '200',
      unit: 'mg',
    },
    total_carbohydrates: {
      amount: '40',
      unit: 'g',
    },
    dietary_fiber: {
      amount: '3',
      unit: 'g',
    },
    sugars: {
      amount: '15',
      unit: 'g',
    },
    protein: {
      amount: '15',
      unit: 'g',
    },
    vitamins_and_minerals: {
      vitamin_a: { amount: '50', unit: 'IU' },
      vitamin_c: { amount: '10', unit: 'mg' },
      calcium: { amount: '80', unit: 'mg' },
      iron: { amount: '4', unit: 'mg' },
    },
    ingredients: [
      'Ground Beef',
      'Split Peas',
      'Onion',
      'Tomato Paste',
      'Dried Lime',
      'Saffron',
    ],
    description:
      'Another popular Persian stew known for its hearty flavor and creamy texture.',
  },
  {
    food_item: 'Aash Reshteh',
    persian_name: 'آش رشته',
    cuisine: 'Persian',
    serving_size: '1 Cup',
    calories: {
      amount: '180',
      unit: 'kcal',
    },
    total_fat: {
      amount: '4',
      unit: 'g',
    },
    saturated_fat: {
      amount: '1',
      unit: 'g',
    },
    cholesterol: {
      amount: '0',
      unit: 'mg',
    },
    sodium: {
      amount: '100',
      unit: 'mg',
    },
    total_carbohydrates: {
      amount: '28',
      unit: 'g',
    },
    dietary_fiber: {
      amount: '5',
      unit: 'g',
    },
    sugars: {
      amount: '5',
      unit: 'g',
    },
    protein: {
      amount: '5',
      unit: 'g',
    },
    vitamins_and_minerals: {
      vitamin_a: { amount: '30', unit: 'IU' },
      vitamin_c: { amount: '8', unit: 'mg' },
      calcium: { amount: '50', unit: 'mg' },
      iron: { amount: '2', unit: 'mg' },
    },
    ingredients: [
      'Noodles',
      'Chickpeas',
      'Spinach',
      'Dried Mint',
      'Onion',
      'Garlic',
      'Yogurt (optional)',
    ],
    description:
      'A hearty soup or stew featuring noodles, chickpeas, spinach, and dried mint.',
  },
  {
    food_item: 'Dampokhtak',
    persian_name: 'دمپختک',
    cuisine: 'Persian',
    serving_size: '1 Cup',
    calories: {
      amount: '220',
      unit: 'kcal',
    },
    total_fat: {
      amount: '5',
      unit: 'g',
    },
    saturated_fat: {
      amount: '1',
      unit: 'g',
    },
    cholesterol: {
      amount: '0',
      unit: 'mg',
    },
    sodium: {
      amount: '60',
      unit: 'mg',
    },
    total_carbohydrates: {
      amount: '35',
      unit: 'g',
    },
    dietary_fiber: {
      amount: '3',
      unit: 'g',
    },
    sugars: {
      amount: '5',
      unit: 'g',
    },
    protein: {
      amount: '4',
      unit: 'g',
    },
    vitamins_and_minerals: {
      vitamin_a: { amount: '25', unit: 'IU' },
      vitamin_c: { amount: '7', unit: 'mg' },
      calcium: { amount: '35', unit: 'mg' },
      iron: { amount: '2', unit: 'mg' },
    },
    ingredients: [
      'Basmati Rice',
      'Chickpeas',
      'Dried Apricots',
      'Raisins',
      'Sugar',
      'Saffron',
    ],
    description:
      'A flavorful rice dish cooked with chickpeas, dried apricots, raisins, and saffron, often served with lamb.',
  },
  {
    food_item: 'Loobia Polo',
    persian_name: 'لوبیا پلو',
    cuisine: 'Persian',
    serving_size: '1 Cup',
    calories: {
      amount: '210',
      unit: 'kcal',
    },
    total_fat: {
      amount: '5',
      unit: 'g',
    },
    saturated_fat: {
      amount: '1',
      unit: 'g',
    },
    cholesterol: {
      amount: '0',
      unit: 'mg',
    },
    sodium: {
      amount: '60',
      unit: 'mg',
    },
    total_carbohydrates: {
      amount: '30',
      unit: 'g',
    },
    dietary_fiber: {
      amount: '4',
      unit: 'g',
    },
    sugars: {
      amount: '5',
      unit: 'g',
    },
    protein: {
      amount: '4',
      unit: 'g',
    },
    vitamins_and_minerals: {
      vitamin_a: { amount: '20', unit: 'IU' },
      vitamin_c: { amount: '8', unit: 'mg' },
      calcium: { amount: '30', unit: 'mg' },
      iron: { amount: '2', unit: 'mg' },
    },
    ingredients: [
      'Basmati Rice',
      'Dried Kidney Beans',
      'Onion',
      'Garlic',
      'Dried Mint',
      'Saffron (optional)',
    ],
    description:
      'A popular rice dish with dried kidney beans, onions, garlic, and dried mint.',
  },
  {
    food_item: 'kookoo',
    persian_name: 'کوکو',
    cuisine: 'Persian',
    serving_size: '1 Serving',
    calories: {
      amount: '200',
      unit: 'kcal',
    },
    total_fat: {
      amount: '8',
      unit: 'g',
    },
    saturated_fat: {
      amount: '2',
      unit: 'g',
    },
    cholesterol: {
      amount: '20',
      unit: 'mg',
    },
    sodium: {
      amount: '80',
      unit: 'mg',
    },
    total_carbohydrates: {
      amount: '20',
      unit: 'g',
    },
    dietary_fiber: {
      amount: '3',
      unit: 'g',
    },
    sugars: {
      amount: '5',
      unit: 'g',
    },
    protein: {
      amount: '6',
      unit: 'g',
    },
    vitamins_and_minerals: {
      vitamin_a: { amount: '80', unit: 'IU' },
      vitamin_c: { amount: '10', unit: 'mg' },
      calcium: { amount: '40', unit: 'mg' },
      iron: { amount: '3', unit: 'mg' },
    },
    ingredients: [
      'Eggs',
      'Various Herbs and Vegetables (e.g., Spinach, Parsley, Dill, Zucchini)',
      'Onion',
      'Garlic',
      'Turmeric',
      'Saffron (optional)',
    ],
    description:
      'A savory Persian frittata made with eggs, herbs, vegetables, onions, and spices.',
  },
  {
    food_item: 'Abgoosht (Dizi)',
    persian_name: 'آبگوشت (دیزی)',
    cuisine: 'Persian',
    serving_size: '1 Serving',
    calories: {
      amount: '450',
      unit: 'kcal',
    },
    total_fat: {
      amount: '22',
      unit: 'g',
    },
    saturated_fat: {
      amount: '7',
      unit: 'g',
    },
    cholesterol: {
      amount: '90',
      unit: 'mg',
    },
    sodium: {
      amount: '180',
      unit: 'mg',
    },
    total_carbohydrates: {
      amount: '50',
      unit: 'g',
    },
    dietary_fiber: {
      amount: '4',
      unit: 'g',
    },
    sugars: {
      amount: '12',
      unit: 'g',
    },
    protein: {
      amount: '20',
      unit: 'g',
    },
    vitamins_and_minerals: {
      vitamin_a: { amount: '120', unit: 'IU' },
      vitamin_c: { amount: '20', unit: 'mg' },
      calcium: { amount: '80', unit: 'mg' },
      iron: { amount: '7', unit: 'mg' },
    },
    ingredients: [
      'Lamb',
      'Chickpeas',
      'Potatoes',
      'Onion',
      'Garlic',
      'Dried Lime',
      'Yogurt',
    ],
    description:
      'A hearty and traditional Persian dish made with lamb, chickpeas, potatoes, and yogurt.',
  },
  {
    food_item: 'Kashk-e Bademjan',
    persian_name: 'کشک بادمجان',
    cuisine: 'Persian',
    serving_size: '1 Serving',
    calories: {
      amount: '200',
      unit: 'kcal',
    },
    total_fat: {
      amount: '8',
      unit: 'g',
    },
    saturated_fat: {
      amount: '2',
      unit: 'g',
    },
    cholesterol: {
      amount: '10',
      unit: 'mg',
    },
    sodium: {
      amount: '100',
      unit: 'mg',
    },
    total_carbohydrates: {
      amount: '15',
      unit: 'g',
    },
    dietary_fiber: {
      amount: '3',
      unit: 'g',
    },
    sugars: {
      amount: '5',
      unit: 'g',
    },
    protein: {
      amount: '5',
      unit: 'g',
    },
    vitamins_and_minerals: {
      vitamin_a: { amount: '60', unit: 'IU' },
      vitamin_c: { amount: '8', unit: 'mg' },
      calcium: { amount: '40', unit: 'mg' },
      iron: { amount: '2', unit: 'mg' },
    },
    ingredients: [
      'Eggplant',
      'Kashk (Whey Cheese)',
      'Garlic',
      'Onion',
      'Mint',
      'Dried Lime (optional)',
    ],
    description:
      'A popular Persian appetizer or side dish made with eggplant, whey cheese, garlic, onions, and mint.',
  },
  {
    food_item: 'Tahchin',
    persian_name: 'ته چین',
    cuisine: 'Persian',
    serving_size: '1 Cup',
    calories: {
      amount: '280',
      unit: 'kcal',
    },
    total_fat: {
      amount: '12',
      unit: 'g',
    },
    saturated_fat: {
      amount: '3',
      unit: 'g',
    },
    cholesterol: {
      amount: '30',
      unit: 'mg',
    },
    sodium: {
      amount: '120',
      unit: 'mg',
    },
    total_carbohydrates: {
      amount: '40',
      unit: 'g',
    },
    dietary_fiber: {
      amount: '2',
      unit: 'g',
    },
    sugars: {
      amount: '8',
      unit: 'g',
    },
    protein: {
      amount: '5',
      unit: 'g',
    },
    vitamins_and_minerals: {
      vitamin_a: { amount: '40', unit: 'IU' },
      vitamin_c: { amount: '10', unit: 'mg' },
      calcium: { amount: '40', unit: 'mg' },
      iron: { amount: '2', unit: 'mg' },
    },
    ingredients: [
      'Basmati Rice',
      'Yogurt',
      'Eggs',
      'Saffron',
      'Chicken or Lamb (optional)',
      'Various Herbs (e.g., Parsley, Dill, Tarragon)',
    ],
    description:
      'A layered rice dish with a crispy bottom crust, often featuring yogurt, eggs, saffron, and herbs.',
  },
  {
    food_item: 'Khorosht-e Karafs',
    persian_name: 'خورشت کرفس',
    cuisine: 'Persian',
    serving_size: '1 Cup',
    calories: {
      amount: '220',
      unit: 'kcal',
    },
    total_fat: {
      amount: '8',
      unit: 'g',
    },
    saturated_fat: {
      amount: '2',
      unit: 'g',
    },
    cholesterol: {
      amount: '15',
      unit: 'mg',
    },
    sodium: {
      amount: '100',
      unit: 'mg',
    },
    total_carbohydrates: {
      amount: '30',
      unit: 'g',
    },
    dietary_fiber: {
      amount: '3',
      unit: 'g',
    },
    sugars: {
      amount: '6',
      unit: 'g',
    },
    protein: {
      amount: '6',
      unit: 'g',
    },
    vitamins_and_minerals: {
      vitamin_a: { amount: '35', unit: 'IU' },
      vitamin_c: { amount: '12', unit: 'mg' },
      calcium: { amount: '35', unit: 'mg' },
      iron: { amount: '2', unit: 'mg' },
    },
    ingredients: [
      'Celery',
      'Ground Meat (Lamb, Beef, or Chicken)',
      'Onion',
      'Tomato Paste',
      'Dried Lime',
      'Saffron',
    ],
    description:
      'A Persian stew with celery, ground meat, and a flavorful tomato sauce.',
  },
  {
    food_item: 'Sabzi Polo',
    persian_name: 'سبزی پلو',
    cuisine: 'Persian',
    serving_size: '1 Cup',
    calories: {
      amount: '180',
      unit: 'kcal',
    },
    total_fat: {
      amount: '3',
      unit: 'g',
    },
    saturated_fat: {
      amount: '0',
      unit: 'g',
    },
    cholesterol: {
      amount: '0',
      unit: 'mg',
    },
    sodium: {
      amount: '40',
      unit: 'mg',
    },
    total_carbohydrates: {
      amount: '30',
      unit: 'g',
    },
    dietary_fiber: {
      amount: '3',
      unit: 'g',
    },
    sugars: {
      amount: '4',
      unit: 'g',
    },
    protein: {
      amount: '2',
      unit: 'g',
    },
    vitamins_and_minerals: {
      vitamin_a: { amount: '40', unit: 'IU' },
      vitamin_c: { amount: '10', unit: 'mg' },
      calcium: { amount: '20', unit: 'mg' },
      iron: { amount: '1', unit: 'mg' },
    },
    ingredients: [
      'Basmati Rice',
      'Herbs (Parsley, Spinach, Dill, Coriander)',
      'Butter or Oil',
      'Saffron (optional)',
    ],
    description:
      'A fragrant rice dish with a blend of fresh herbs, often served with grilled chicken or lamb.',
  },
  {
    food_item: 'Baghali Polo',
    persian_name: 'باغلی پلو',
    cuisine: 'Persian',
    serving_size: '1 Cup',
    calories: {
      amount: '220',
      unit: 'kcal',
    },
    total_fat: {
      amount: '6',
      unit: 'g',
    },
    saturated_fat: {
      amount: '1',
      unit: 'g',
    },
    cholesterol: {
      amount: '0',
      unit: 'mg',
    },
    sodium: {
      amount: '60',
      unit: 'mg',
    },
    total_carbohydrates: {
      amount: '32',
      unit: 'g',
    },
    dietary_fiber: {
      amount: '3',
      unit: 'g',
    },
    sugars: {
      amount: '6',
      unit: 'g',
    },
    protein: {
      amount: '4',
      unit: 'g',
    },
    vitamins_and_minerals: {
      vitamin_a: { amount: '30', unit: 'IU' },
      vitamin_c: { amount: '10', unit: 'mg' },
      calcium: { amount: '40', unit: 'mg' },
      iron: { amount: '2', unit: 'mg' },
    },
    ingredients: [
      'Basmati Rice',
      'Broad Beans',
      'Dill',
      'Lamb or Chicken (optional)',
    ],
    description:
      'A popular rice dish with broad beans and dill, often served with lamb or chicken.',
  },
  {
    food_item: 'Koofteh Tabrizi',
    persian_name: 'کوفته تبریزی',
    cuisine: 'Persian',
    serving_size: '1 Serving',
    calories: {
      amount: '300',
      unit: 'kcal',
    },
    total_fat: {
      amount: '12',
      unit: 'g',
    },
    saturated_fat: {
      amount: '3',
      unit: 'g',
    },
    cholesterol: {
      amount: '40',
      unit: 'mg',
    },
    sodium: {
      amount: '120',
      unit: 'mg',
    },
    total_carbohydrates: {
      amount: '35',
      unit: 'g',
    },
    dietary_fiber: {
      amount: '3',
      unit: 'g',
    },
    sugars: {
      amount: '8',
      unit: 'g',
    },
    protein: {
      amount: '15',
      unit: 'g',
    },
    vitamins_and_minerals: {
      vitamin_a: { amount: '70', unit: 'IU' },
      vitamin_c: { amount: '15', unit: 'mg' },
      calcium: { amount: '50', unit: 'mg' },
      iron: { amount: '4', unit: 'mg' },
    },
    ingredients: [
      'Ground Meat (Lamb, Beef, or Chicken)',
      'Rice',
      'Onion',
      'Barberries',
      'Walnut',
      'Egg',
      'Saffron (optional)',
    ],
    description:
      'A popular Persian meatball dish made with ground meat, rice, onions, barberries, walnuts, and eggs.',
  },
  {
    food_item: 'Tahdig',
    persian_name: 'ته دیگ',
    cuisine: 'Persian',
    serving_size: '1 Serving',
    calories: {
      amount: '150',
      unit: 'kcal',
    },
    total_fat: {
      amount: '5',
      unit: 'g',
    },
    saturated_fat: {
      amount: '1',
      unit: 'g',
    },
    cholesterol: {
      amount: '10',
      unit: 'mg',
    },
    sodium: {
      amount: '50',
      unit: 'mg',
    },
    total_carbohydrates: {
      amount: '20',
      unit: 'g',
    },
    dietary_fiber: {
      amount: '1',
      unit: 'g',
    },
    sugars: {
      amount: '3',
      unit: 'g',
    },
    protein: {
      amount: '3',
      unit: 'g',
    },
    vitamins_and_minerals: {
      vitamin_a: { amount: '20', unit: 'IU' },
      vitamin_c: { amount: '5', unit: 'mg' },
      calcium: { amount: '20', unit: 'mg' },
      iron: { amount: '1', unit: 'mg' },
    },
    ingredients: [
      'Basmati Rice',
      'Yogurt (optional)',
      'Potato (optional)',
      'Bread (optional)',
    ],
    description:
      'The crispy and flavorful bottom layer of a Persian rice dish, often made with yogurt, potato, or bread.',
  },
  {
    food_item: 'Zereshk Polo',
    persian_name: 'زرشک پلو',
    cuisine: 'Persian',
    serving_size: '1 Cup',
    calories: {
      amount: '200',
      unit: 'kcal',
    },
    total_fat: {
      amount: '5',
      unit: 'g',
    },
    saturated_fat: {
      amount: '1',
      unit: 'g',
    },
    cholesterol: {
      amount: '0',
      unit: 'mg',
    },
    sodium: {
      amount: '50',
      unit: 'mg',
    },
    total_carbohydrates: {
      amount: '30',
      unit: 'g',
    },
    dietary_fiber: {
      amount: '2',
      unit: 'g',
    },
    sugars: {
      amount: '5',
      unit: 'g',
    },
    protein: {
      amount: '3',
      unit: 'g',
    },
    vitamins_and_minerals: {
      vitamin_a: { amount: '30', unit: 'IU' },
      vitamin_c: { amount: '10', unit: 'mg' },
      calcium: { amount: '30', unit: 'mg' },
      iron: { amount: '2', unit: 'mg' },
    },

    ingredients: ['white Rice', 'Barberries', 'Saffron', 'Sugar', 'Oil'],
    description:
      'A fragrant and colorful rice dish with barberries, saffron, and a hint of sweetness.',
  },
];

const AddTemData = () => {
  PreFilledFoodItemSchema.insertMany(foodItems)
    .then(() => {
      console.log('Pre-filled food items data inserted!');
    })
    .catch((err) => {
      console.error('Error inserting food items data:', err);
    });
};
module.exports = AddTemData; // Export the Express app
