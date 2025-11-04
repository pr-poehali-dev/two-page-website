import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Шоколадный Торт',
    price: 2500,
    image: 'https://cdn.poehali.dev/projects/edfd1245-8ae1-40c5-9c45-cf5c6e9df61a/files/7c79b923-a64e-4e4b-8f10-a0338a48ef41.jpg',
    category: 'traditional'
  },
  {
    id: 2,
    name: 'Чизкейк с Апельсином',
    price: 1200,
    image: 'https://cdn.poehali.dev/projects/edfd1245-8ae1-40c5-9c45-cf5c6e9df61a/files/a5cbc111-6495-4bfb-ade8-732b62d2aea3.jpg',
    category: 'cupcakes'
  },
  {
    id: 3,
    name: 'Торт с Малиной',
    price: 3500,
    image: 'https://cdn.poehali.dev/projects/edfd1245-8ae1-40c5-9c45-cf5c6e9df61a/files/d1568a98-3b6a-4ba4-bef5-beefd6ed5181.jpg',
    category: 'birthday'
  }
];

export default function Index() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [cartOpen, setCartOpen] = useState(searchParams.get('cart') === 'open');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderForm, setOrderForm] = useState({ name: '', phone: '', address: '', comment: '' });
  const { toast } = useToast();

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [cartOpen]);

  useEffect(() => {
    setCartOpen(searchParams.get('cart') === 'open');
  }, [searchParams]);

  const removeFromCart = (id: number) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateQuantity = (id: number, delta: number) => {
    const newCart = cart.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrder = () => {
    if (!orderForm.name || !orderForm.phone || !orderForm.address) {
      toast({
        title: 'Заполните все поля',
        description: 'Имя, телефон и адрес обязательны',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Заказ оформлен!',
      description: `Спасибо, ${orderForm.name}! Мы свяжемся с вами в ближайшее время.`,
    });

    localStorage.removeItem('cart');
    setCart([]);
    setCartOpen(false);
    setOrderForm({ name: '', phone: '', address: '', comment: '' });
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Кондитерская BestCakes</h1>
            <div className="flex gap-2">
              <button 
                onClick={() => navigate('/profile')} 
                className="bg-white text-blue-600 px-4 py-2 rounded"
              >
                Профиль
              </button>
              <button 
                onClick={() => {
                  setSearchParams({ cart: 'open' });
                  setCartOpen(true);
                }} 
                className="bg-white text-blue-600 px-4 py-2 rounded"
              >
                Корзина ({cart.length})
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-gray-200 py-3">
        <div className="container mx-auto px-4">
          <div className="flex gap-6">
            <a href="#home" className="text-black">Главная</a>
            <a href="#about" className="text-black">О нас</a>
            <a href="#products" className="text-black">Товары</a>
            <a href="#contact" className="text-black">Контакты</a>
          </div>
        </div>
      </nav>

      <section className="bg-yellow-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Добро пожаловать в BestCakes!</h2>
          <p className="text-xl mb-6">Самые вкусные торты в городе</p>
          <img 
            src="https://cdn.poehali.dev/projects/edfd1245-8ae1-40c5-9c45-cf5c6e9df61a/files/adc0df11-50e7-40ec-a4f5-a233ffd764df.jpg" 
            alt="Торты"
            className="mx-auto max-w-md border-4 border-black"
          />
        </div>
      </section>



      <section className="py-12" id="products">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Наши торты</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="border-2 border-black p-4">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover mb-3"
                />
                <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                <p className="text-xl font-bold text-red-600 mb-3">{product.price} ₽</p>
                <button 
                  onClick={() => navigate(`/product?id=${product.id}`)}
                  className="w-full bg-green-500 text-white py-2 rounded font-bold"
                >
                  Подробнее
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#F5EBE0]">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-3xl font-bold text-[#B5787E] italic mb-6">А вы знали?</h3>
              <div className="space-y-6 text-foreground/80">
                <div>
                  <p className="font-semibold mb-2 tracking-wide">MYTTRASE BETAYSA</p>
                  <p className="text-sm">Consectetur, adipisci velit, sed quia non numquam eius mod tempora incidunt</p>
                </div>
                <div>
                  <p className="font-semibold mb-2 tracking-wide">KSERTGASE VERTYAERSA</p>
                  <p className="text-sm">Zanuduni, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima venam</p>
                </div>
                <Button variant="outline" className="bg-[#B5787E] text-white hover:bg-[#9d6670] border-none mt-4">
                  Ещё
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-[#D9A75F] italic mb-6">Полезные ссылки</h3>
              <ul className="space-y-2">
                {[
                  'ST AVERTIAS DERO',
                  'DEERTO VARALA RANRAY',
                  'VERITAS NEARY KASTREAS',
                  'VEROUS FASI LAGIDAE AABUA',
                  'AVERTEO FEROSE',
                  'DELERTO VROOLADE',
                  'MASSER LIARGUS LERTYAUS LALASU',
                  'NERTAKERY LIAMAS VASE',
                  'NOERA VERTADEIRAS'
                ].map((link, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-foreground/70">
                    <Icon name="ChevronRight" size={14} className="text-[#D9A75F]" />
                    {link}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-[#8B5A4A] italic mb-6">Быстрое сообщение</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <Input placeholder="Ваше имя" className="bg-white border-[#C4938B]" />
                <Textarea placeholder="Сообщение" className="bg-white border-[#C4938B] min-h-[140px]" />
                <Button className="w-full bg-[#B5787E] hover:bg-[#9d6670] text-white">
                  Отправить
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-6 mt-12" id="contact">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">Кондитерская BestCakes</p>
          <p className="text-sm">Телефон: +7 (999) 123-45-67</p>
          <p className="text-sm">Адрес: ул. Примерная, д. 123</p>
          <p className="text-sm mt-2">© 2024 BestCakes</p>
        </div>
      </footer>

      <Sheet open={cartOpen} onOpenChange={(open) => {
        setCartOpen(open);
        if (!open) {
          setSearchParams({});
        }
      }}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto" forceMount>
          <SheetHeader>
            <SheetTitle className="text-2xl">Корзина</SheetTitle>
            <SheetDescription>
              {cart.length === 0 ? 'Ваша корзина пуста' : `Товаров в корзине: ${cart.length}`}
            </SheetDescription>
          </SheetHeader>

          {cart.length > 0 ? (
            <div className="space-y-6 mt-6">
              <div className="space-y-4">
                {cart.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex gap-4">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">{item.name}</h4>
                        <p className="text-primary font-semibold">{item.price} ₽</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Icon name="Minus" size={14} />
                          </Button>
                          <span className="text-sm w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Icon name="Plus" size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 ml-auto"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Icon name="Trash2" size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-xl font-bold mb-6">
                  <span>Итого:</span>
                  <span className="text-primary">{totalPrice} ₽</span>
                </div>

                <div className="space-y-4">
                  <Input
                    placeholder="Ваше имя *"
                    value={orderForm.name}
                    onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                  />
                  <Input
                    placeholder="Телефон *"
                    value={orderForm.phone}
                    onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                  />
                  <Input
                    placeholder="Адрес доставки *"
                    value={orderForm.address}
                    onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                  />
                  <Textarea
                    placeholder="Комментарий к заказу"
                    value={orderForm.comment}
                    onChange={(e) => setOrderForm({ ...orderForm, comment: e.target.value })}
                    className="min-h-[80px]"
                  />
                  <Button onClick={handleOrder} className="w-full" size="lg">
                    Оформить заказ
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Icon name="ShoppingCart" size={64} className="text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Добавьте товары в корзину</p>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}