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
    name: 'Торт Шоколадный Восторг',
    price: 2500,
    image: 'https://cdn.poehali.dev/files/6b17a54b-b7b7-4c72-8925-3ba4a054cdaf.jpg',
    category: 'traditional'
  },
  {
    id: 2,
    name: 'Набор Капкейков',
    price: 1200,
    image: 'https://cdn.poehali.dev/files/6b17a54b-b7b7-4c72-8925-3ba4a054cdaf.jpg',
    category: 'cupcakes'
  },
  {
    id: 3,
    name: 'Праздничный Торт',
    price: 3500,
    image: 'https://cdn.poehali.dev/files/6b17a54b-b7b7-4c72-8925-3ba4a054cdaf.jpg',
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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <Icon name="ChefHat" size={32} className="text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-primary">BestCakes</h1>
                <p className="text-xs text-muted-foreground">Частная кондитерская</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <a href="#home" className="text-foreground hover:text-primary transition-colors">Главная</a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors">О нас</a>
              <a href="#gallery" className="text-foreground hover:text-primary transition-colors">Галерея</a>
              <a href="#services" className="text-foreground hover:text-primary transition-colors">Услуги</a>
              <a href="#contact" className="text-foreground hover:text-primary transition-colors">Контакты</a>
            </div>

            <Button 
              onClick={() => {
                setSearchParams({ cart: 'open' });
                setCartOpen(true);
              }} 
              variant="outline" 
              className="gap-2"
            >
              <Icon name="ShoppingCart" size={20} />
              {cart.length > 0 && (
                <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  {cart.length}
                </span>
              )}
            </Button>
          </nav>
        </div>
      </header>

      <section id="home" className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold">
                История • Предложения • Новости • Свежее • Архив
              </div>
              <h2 className="text-6xl md:text-7xl font-bold text-foreground leading-tight">
                Лучшие торты
              </h2>
              <p className="text-xl text-muted-foreground">
                Приготовлены с любовью в нашей частной кондитерской
              </p>
              <div className="flex gap-4 pt-4">
                <Icon name="Twitter" size={24} className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                <Icon name="Facebook" size={24} className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                <Icon name="Instagram" size={24} className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                <Icon name="Youtube" size={24} className="text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              </div>
            </div>
            <div className="relative h-[500px] animate-scale-in">
              <img 
                src="https://cdn.poehali.dev/files/6b17a54b-b7b7-4c72-8925-3ba4a054cdaf.jpg" 
                alt="Праздничный торт"
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Традиционные Торты', subtitle: 'смотреть фото', icon: 'Cake', color: 'bg-[#C4938B]' },
              { title: 'Новинка! Капкейки', subtitle: 'смотреть галерею', icon: 'Cookie', color: 'bg-[#8B5A4A]' },
              { title: 'Праздничные Торты', subtitle: 'смотреть все', icon: 'Gift', color: 'bg-[#E8B875]' }
            ].map((cat, idx) => (
              <Card 
                key={idx}
                className="p-8 text-center cursor-pointer hover-scale border-none shadow-lg rounded-3xl"
                style={{ backgroundColor: cat.color }}
              >
                <Icon name={cat.icon as any} size={48} className="mx-auto mb-4 text-white" />
                <h3 className="text-3xl font-bold text-white mb-2">{cat.title}</h3>
                <p className="text-white/90 italic">{cat.subtitle}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-foreground mb-4">Популярные торты</h2>
            <div className="flex items-center justify-center gap-4">
              <Icon name="Sparkles" size={24} className="text-primary" />
              <Icon name="Star" size={20} className="text-primary" />
              <Icon name="Sparkles" size={24} className="text-primary" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover-scale cursor-pointer border-border rounded-3xl shadow-lg">
                <div 
                  onClick={() => navigate(`/product?id=${product.id}`)}
                  className="aspect-square bg-secondary/30"
                >
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{product.name}</h3>
                  <p className="text-primary text-xl font-semibold mb-4">{product.price} ₽</p>
                  <Button 
                    onClick={() => navigate(`/product?id=${product.id}`)}
                    className="w-full"
                  >
                    Подробнее
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">А вы знали?</h3>
              <div className="space-y-4 text-muted-foreground">
                <p className="font-semibold">МУТТРАССЕ БЕТАЙСА</p>
                <p>Consectetur, adipisci velit, sed quia non numquam eius mod tempora incidunt</p>
                <p className="font-semibold">КСЕРТГАСЕ ВЕРТЯЕРСА</p>
                <p>Zanuduni, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima venam</p>
                <Button variant="outline" className="mt-4">Ещё</Button>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Полезные ссылки</h3>
              <ul className="space-y-2 text-muted-foreground">
                {['ST AVERTIAS DERO', 'DEERTO VARALA RANRAY', 'VERITAS NEARY KASTREAS', 'VEROUS FASI LAGIDAE AABUA', 'AVERTEO FEROSE', 'DELERTO VROOLADE', 'MASSER LIARGUS LERTYAUS LALASU', 'NERTAKERY LIAMAS VASE', 'NOERA VERTADEIRAS'].map((link, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Icon name="ChevronRight" size={16} className="text-primary" />
                    {link}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Быстрое сообщение</h3>
              <form className="space-y-4">
                <Input placeholder="Ваше имя" className="bg-white" />
                <Textarea placeholder="Сообщение" className="bg-white min-h-[120px]" />
                <Button className="w-full">Отправить</Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-6 border-t border-border bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              Best Cakes © 2013 • Политика конфиденциальности
            </p>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Icon name="MapPin" size={16} />
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
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
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
