
import type { Product } from '../types';

const categories = ["Fashion", "Electronics", "Home Goods", "Sports", "Books", "Toys"];

const products: Product[] = Array.from({ length: 60 }, (_, i) => {
    const category = categories[i % categories.length];
    const id = `product-${i + 1}`;
    let name = '';
    
    switch(category) {
        case 'Fashion': name = `Stylish ${['Jacket', 'Sneakers', 'Watch', 'Handbag', 'Sunglasses'][i%5]}`; break;
        case 'Electronics': name = `Modern ${['Headphones', 'Laptop', 'Smart Speaker', 'Camera', 'Drone'][i%5]}`; break;
        case 'Home Goods': name = `Minimalist ${['Vase', 'Lamp', 'Chair', 'Coffee Maker', 'Wall Art'][i%5]}`; break;
        case 'Sports': name = `Pro ${['Yoga Mat', 'Dumbbells', 'Basketball', 'Running Shoes', 'Water Bottle'][i%5]}`; break;
        case 'Books': name = `Bestselling ${['Novel', 'Cookbook', 'Sci-Fi Epic', 'Biography', 'History Book'][i%5]}`; break;
        case 'Toys': name = `Fun ${['Building Blocks', 'Action Figure', 'Plush Toy', 'Board Game', 'RC Car'][i%5]}`; break;
    }
    
    return {
        id,
        name: `${name} #${i+1}`,
        category,
        imageUrl: `https://picsum.photos/seed/${id}/400/400`
    };
});

export const getProducts = (): Product[] => {
    return products;
}

export const getRandomProducts = (count: number): Product[] => {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}
