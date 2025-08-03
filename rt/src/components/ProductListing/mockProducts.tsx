import { IProduct, ICategory } from '../../types/backend.d';

export const mockCategories: ICategory[] = [
    {
        id: -1,
        name:"Fresh",
    },
    {
        id: -2,
        name:"Dry",
    },
]

export const mockProducts: IProduct[] = [
  {
    id: -1,
    name: 'Mock Rose Bouquet',
    description: 'A mock bouquet of fresh red roses.',
    basePrice: 199000,
    flowerStatus: 1,
    stockQuantity: 10,
    imageUrls: ['https://via.placeholder.com/300x300.png?text=Mock+Rose'],
    categories: [mockCategories[1]],
    condition: 'new',
  },
  {
    id: -2,
    name: 'Mock Sunflower Pot',
    description: 'A mock sunflower in a beautiful pot.',
    basePrice: 149000,
    flowerStatus: 1,
    stockQuantity: 5,
    imageUrls: ['https://via.placeholder.com/300x300.png?text=Mock+Sunflower'],
    categories: [mockCategories[0]],
    condition: 'new',
  },
  // Add more if needed
];
