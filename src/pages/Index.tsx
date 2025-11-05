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
      return;
    }

    localStorage.removeItem('cart');
    setCart([]);
    setCartOpen(false);
    setOrderForm({ name: '', phone: '', address: '', comment: '' });
  };

  return (
    <div className="min-h-screen bg-[#E8D5C4]">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <a href="#home" className="text-foreground font-medium">Главная</a>
              <a href="#about" className="text-foreground font-medium">О нас</a>
              <a href="#gallery" className="text-foreground font-medium">Наша галерея</a>
              <a href="#services" className="text-foreground font-medium">Услуги</a>
              <a href="#contact" className="text-foreground font-medium">Контакты</a>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => navigate('/profile')} 
                variant="ghost" 
                size="sm"
                className="gap-2"
              >
                <Icon name="User" size={16} />
                Профиль
              </Button>
              <Button 
                onClick={() => {
                  setSearchParams({ cart: 'open' });
                  setCartOpen(true);
                }} 
                variant="outline" 
                size="sm"
                className="gap-2"
              >
                <Icon name="ShoppingCart" size={16} />
                {cart.length > 0 && (
                  <span className="bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-xs">
                    {cart.length}
                  </span>
                )}
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <section className="relative pt-8 pb-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="space-y-6 pl-4">
              <div className="inline-block mb-4">
                <img 
                  src="https://cdn.poehali.dev/projects/edfd1245-8ae1-40c5-9c45-cf5c6e9df61a/files/8a5c464c-f2e5-47c9-84f3-74b2066bd4bb.jpg" 
                  alt="Cupcake"
                  className="w-16 h-16 object-cover"
                />
              </div>
              <h1 className="text-7xl font-bold leading-tight mb-2">
                <span className="text-[#B5787E]">Best</span>
                <span className="text-[#4A3428]">Cakes</span>
              </h1>
              <p className="text-[#8B5A4A] text-xl italic">Private Bakery Website</p>

              <div className="flex gap-3 pt-2">
                {[1, 2, 3, 4].map((_, idx) => (
                  <div key={idx} className="w-9 h-9 rounded-full border-2 border-[#C4938B] flex items-center justify-center cursor-pointer bg-white/50">
                    <Icon name={idx === 0 ? "Twitter" : idx === 1 ? "Facebook" : idx === 2 ? "Instagram" : "Youtube"} size={16} className="text-[#8B5A4A]" />
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <img 
                src="https://cdn.poehali.dev/projects/edfd1245-8ae1-40c5-9c45-cf5c6e9df61a/files/adc0df11-50e7-40ec-a4f5-a233ffd764df.jpg" 
                alt="Best Cakes"
                className="w-full max-w-xl mx-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card 
              className="p-12 text-center cursor-pointer border-none shadow-lg rounded-3xl bg-[#B5787E]"
            >
              <h3 className="text-4xl font-bold text-white mb-3 italic">Традиционные</h3>
              <h3 className="text-4xl font-bold text-white mb-4 italic">Торты</h3>
              <p className="text-white/90 text-sm italic mb-2">смотреть фото</p>
              <div className="w-8 h-8 mx-auto border-2 border-white rounded-full flex items-center justify-center">
                <Icon name="ArrowRight" size={16} className="text-white" />
              </div>
            </Card>

            <Card 
              className="p-12 text-center cursor-pointer border-none shadow-lg rounded-3xl bg-[#B8886F]"
            >
              <h3 className="text-4xl font-bold text-white mb-3 italic">Новинка!</h3>
              <h3 className="text-4xl font-bold text-white mb-4 italic">Капкейки</h3>
              <p className="text-white/90 text-sm italic mb-2">смотреть галерею</p>
              <div className="w-8 h-8 mx-auto border-2 border-white rounded-full flex items-center justify-center">
                <Icon name="ArrowRight" size={16} className="text-white" />
              </div>
            </Card>

            <Card 
              className="p-12 text-center cursor-pointer border-none shadow-lg rounded-3xl bg-[#D9A75F]"
            >
              <h3 className="text-4xl font-bold text-white mb-3 italic">Праздничные</h3>
              <h3 className="text-4xl font-bold text-white mb-4 italic">Торты</h3>
              <p className="text-white/90 text-sm italic mb-2">смотреть все</p>
              <div className="w-8 h-8 mx-auto border-2 border-white rounded-full flex items-center justify-center">
                <Icon name="ArrowRight" size={16} className="text-white" />
              </div>
            </Card>
          </div>
        </div>
      </section>



      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Icon name="Sparkles" size={20} className="text-[#E8B875]" />
              <Icon name="Star" size={16} className="text-[#E8B875]" />
              <Icon name="Sparkles" size={20} className="text-[#E8B875]" />
            </div>
            <h2 className="text-5xl font-bold mb-2">
              <span className="text-[#B5787E]">Популярные </span>
              <span className="text-[#D9A75F]">Торты</span>
            </h2>
            <div className="flex items-center justify-center gap-4">
              <Icon name="Sparkles" size={20} className="text-[#E8B875]" />
              <Icon name="Star" size={16} className="text-[#E8B875]" />
              <Icon name="Sparkles" size={20} className="text-[#E8B875]" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="text-center">
                <div 
                  onClick={() => navigate(`/product?id=${product.id}`)}
                  className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 cursor-pointer"
                >
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 tracking-wide">{product.name}</h3>
                <p className="text-[#B5787E] italic text-sm mb-1">классический десерт нашей пекарни</p>
                <p className="text-muted-foreground text-sm mb-4">Приготовлен по традиционному рецепту из натуральных ингредиентов высшего качества. Идеально подходит для любого праздника.</p>
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-[#E8B875] rounded-full"></div>
                </div>
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

      <footer className="py-4 bg-white border-t border-[#E8D5C4]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-muted-foreground">
            <p>Лучшие Торты © 2013 • Политика конфиденциальности</p>
            <div className="flex items-center gap-2">
              <Icon name="Home" size={14} className="text-[#B5787E]" />
              <span>ул. Джексон Бульвар 1020, Чикаго, Иллинойс 60604-2340</span>
            </div>
          </div>
        </div>
      </footer>

      <Sheet open={cartOpen} onOpenChange={(open) => {
        setCartOpen(open);
        if (!open) {
          setSearchParams({});
        }
      }}>
        <SheetContent className="w-full sm:max-w-md" forceMount>
          <SheetHeader>
            <SheetTitle>Корзина</SheetTitle>
          </SheetHeader>

          <div className="mt-6">
            {cart.length === 0 ? (
              <p className="text-center py-8">Корзина пуста</p>
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="border p-3 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{item.name}</h4>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm">
                          Удалить
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="border px-2 py-1 rounded"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="border px-2 py-1 rounded"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-bold">{item.price * item.quantity} ₽</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between text-lg font-bold mb-4">
                    <span>Итого:</span>
                    <span>{totalPrice} ₽</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Input
                    placeholder="Ваше имя"
                    value={orderForm.name}
                    onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                  />
                  <Input
                    placeholder="Телефон"
                    value={orderForm.phone}
                    onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                  />
                  <Input
                    placeholder="Адрес"
                    value={orderForm.address}
                    onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                  />
                  <button 
                    onClick={handleOrder}
                    className="w-full bg-[#B5787E] text-white py-2 rounded"
                  >
                    Оформить заказ
                  </button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}