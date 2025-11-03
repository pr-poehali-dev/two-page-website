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
    
    toast({
      title: 'Добавлено в корзину',
      description: `${product.name} (${quantity} шт.)`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
              <Icon name="ChefHat" size={32} className="text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-primary">BestCakes</h1>
                <p className="text-xs text-muted-foreground">Частная кондитерская</p>
              </div>
            </button>
            <Button onClick={() => navigate('/?cart=open')} variant="outline" className="gap-2">
              <Icon name="ShoppingCart" size={20} />
              Корзина
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <Button 
          onClick={() => navigate('/')} 
          variant="ghost" 
          className="mb-6 gap-2"
        >
          <Icon name="ArrowLeft" size={20} />
          Назад к каталогу
        </Button>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-secondary/30">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
              <h1 className="text-5xl font-bold text-foreground mb-4">{product.name}</h1>
              <p className="text-3xl font-semibold text-primary">{product.price} ₽</p>
            </div>

            <p className="text-lg text-foreground/80 leading-relaxed">{product.description}</p>

            <Card className="p-6 bg-accent/50 border-border">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Icon name="Weight" size={20} className="text-primary" />
                  <span className="text-foreground">Вес: {product.weight}</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Icon name="ChefHat" size={20} className="text-primary" />
                    <span className="font-semibold text-foreground">Состав:</span>
                  </div>
                  <ul className="ml-8 space-y-1">
                    {product.ingredients.map((ing, idx) => (
                      <li key={idx} className="text-foreground/80">• {ing}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-foreground font-semibold">Количество:</span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10"
                  >
                    <Icon name="Minus" size={16} />
                  </Button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10"
                  >
                    <Icon name="Plus" size={16} />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={addToCart} 
                  size="lg" 
                  className="flex-1 text-lg py-6"
                >
                  <Icon name="ShoppingCart" size={20} className="mr-2" />
                  В корзину — {product.price * quantity} ₽
                </Button>
              </div>
            </div>

            <div className="pt-6 border-t border-border space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Icon name="Truck" size={20} />
                <span>Бесплатная доставка от 3000 ₽</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Icon name="Clock" size={20} />
                <span>Приготовление от 24 часов</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}