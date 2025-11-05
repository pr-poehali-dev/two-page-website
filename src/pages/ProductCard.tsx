import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  weight: string;
  ingredients: string[];
}

const products: Product[] = [
  {
    id: 1,
    name: 'Торт Шоколадный Восторг',
    price: 2500,
    description: 'Нежный шоколадный торт с бельгийским шоколадом, воздушным кремом и хрустящими слоями. Идеально подходит для особых случаев.',
    image: 'https://cdn.poehali.dev/projects/edfd1245-8ae1-40c5-9c45-cf5c6e9df61a/files/7c79b923-a64e-4e4b-8f10-a0338a48ef41.jpg',
    category: 'Традиционные торты',
    weight: '1.5 кг',
    ingredients: ['Бельгийский шоколад', 'Сливочный крем', 'Бисквит', 'Какао']
  },
  {
    id: 2,
    name: 'Набор Капкейков',
    price: 1200,
    description: 'Ассорти из 12 капкейков с различными начинками: ванильные, шоколадные, клубничные. Украшены цветным кремом.',
    image: 'https://cdn.poehali.dev/projects/edfd1245-8ae1-40c5-9c45-cf5c6e9df61a/files/a5cbc111-6495-4bfb-ade8-732b62d2aea3.jpg',
    category: 'Капкейки',
    weight: '12 шт',
    ingredients: ['Ванильный крем', 'Шоколадный крем', 'Клубничная начинка', 'Бисквит']
  },
  {
    id: 3,
    name: 'Праздничный Торт',
    price: 3500,
    description: 'Трехъярусный торт с фруктовой начинкой, покрытый нежным кремом и украшенный свежими ягодами.',
    image: 'https://cdn.poehali.dev/projects/edfd1245-8ae1-40c5-9c45-cf5c6e9df61a/files/d1568a98-3b6a-4ba4-bef5-beefd6ed5181.jpg',
    category: 'Праздничные торты',
    weight: '2.5 кг',
    ingredients: ['Свежие ягоды', 'Сливочный крем', 'Бисквит', 'Фруктовая начинка']
  }
];

export default function ProductCard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = parseInt(searchParams.get('id') || '1');
  const product = products.find(p => p.id === productId) || products[0];
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/')} className="text-2xl font-bold">
              BestCakes
            </button>
            <button onClick={() => navigate('/?cart=open')} className="border px-4 py-2 rounded">
              Корзина
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <button 
          onClick={() => navigate('/')} 
          className="mb-4 text-blue-600"
        >
          ← Назад
        </button>

        <div className="max-w-2xl mx-auto">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-64 object-cover mb-4 rounded"
          />

          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl font-bold text-[#B5787E] mb-4">{product.price} ₽</p>
          <p className="mb-4">{product.description}</p>

          <div className="border p-4 mb-4 rounded">
            <p className="mb-2"><strong>Вес:</strong> {product.weight}</p>
            <p><strong>Состав:</strong> {product.ingredients.join(', ')}</p>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <span>Количество:</span>
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="border px-3 py-1 rounded"
            >
              -
            </button>
            <span className="font-bold">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="border px-3 py-1 rounded"
            >
              +
            </button>
          </div>

          <button 
            onClick={addToCart}
            className="w-full bg-[#B5787E] text-white py-3 rounded font-bold"
          >
            В корзину — {product.price * quantity} ₽
          </button>
        </div>
      </main>
    </div>
  );
}