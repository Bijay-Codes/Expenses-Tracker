export const category = [
    'Groceries 🛒',
    'Restaurants & Takeout 🍕',
    'Coffee & Snacks ☕',
    'Transportation 🚙',
    'Gas & Fuel ⛽',
    'Housing 🏠',
    'Utilities ⚡',
    'Phone & Internet 📡',
    'Subscriptions 📺',
    'Healthcare 💊',
    'Fitness & Wellness 💪',
    'Insurance 🛡️',
    'Personal Care 💇‍♀️',
    'Clothing & Shoes 👟',
    'Tech & Electronics 💻',
    'Entertainment 🎮',
    'Hobbies 🎨',
    'Travel ✈️',
    'Gifts 🎁',
    'Pets 🐕',
    'Education & Learning 📚',
    'Financial 💳'
];
// some category havent been added to this list. thats because...
/*
    Housing can have higher base price depending on the area or states, so it will be bad to mock user on this.
    Education should not be mocked as the prices of institues and fees are rising rapidly.
    INsurance as well because it depends on people how much they spent on it, i cant make a guess here.
    Financial has a wide range of use cases so its better to not cover it,it wont be good if we roast a good expense.
*/

export const categoryLimits = {
    'Groceries 🛒': { min: 50, max: 5000 },
    'Restaurants & Takeout 🍕': { min: 100, max: 3000 },
    'Coffee & Snacks ☕': { min: 20, max: 800 },
    'Transportation 🚙': { min: 10, max: 2000 },
    'Gas & Fuel ⛽': { min: 200, max: 5000 },
    'Utilities ⚡': { min: 200, max: 10000 },
    'Phone & Internet 📡': { min: 99, max: 3000 },
    'Subscriptions 📺': { min: 99, max: 2000 },
    'Healthcare 💊': { min: 50, max: 20000 },
    'Fitness & Wellness 💪': { min: 500, max: 10000 },
    'Personal Care 💇‍♀️': { min: 50, max: 5000 },
    'Clothing & Shoes 👟': { min: 200, max: 20000 },
    'Tech & Electronics 💻': { min: 500, max: 150000 },
    'Entertainment 🎮': { min: 100, max: 5000 },
    'Hobbies 🎨': { min: 200, max: 15000 },
    'Travel ✈️': { min: 500, max: 100000 },
    'Gifts 🎁': { min: 100, max: 20000 },
    'Pets 🐕': { min: 200, max: 10000 },
};

