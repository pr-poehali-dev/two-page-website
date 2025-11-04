import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface Order {
  id: number;
  date: string;
  items: string[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
}

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [user, setUser] = useState<User>({ name: '', email: '', phone: '', address: '' });
  const [orders] = useState<Order[]>([
    { id: 1, date: '15.11.2024', items: ['Шоколадный Торт'], total: 2500, status: 'completed' },
    { id: 2, date: '10.11.2024', items: ['Чизкейк с Апельсином', 'Торт с Малиной'], total: 4700, status: 'pending' }
  ]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      toast({ title: 'Ошибка', description: 'Заполните все поля', variant: 'destructive' });
      return;
    }
    
    const savedUser = { name: 'Пользователь', email: loginForm.email, phone: '+7 999 999-99-99', address: '' };
    localStorage.setItem('user', JSON.stringify(savedUser));
    setUser(savedUser);
    setIsLoggedIn(true);
    toast({ title: 'Успешно', description: 'Вы вошли в личный кабинет' });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.name || !registerForm.email || !registerForm.password || !registerForm.phone) {
      toast({ title: 'Ошибка', description: 'Заполните все поля', variant: 'destructive' });
      return;
    }
    
    const newUser = { name: registerForm.name, email: registerForm.email, phone: registerForm.phone, address: '' };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    setIsLoggedIn(true);
    toast({ title: 'Успешно', description: 'Регистрация завершена' });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser({ name: '', email: '', phone: '', address: '' });
    toast({ title: 'Выход', description: 'Вы вышли из личного кабинета' });
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify(user));
    toast({ title: 'Успешно', description: 'Профиль обновлен' });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'completed': return 'Выполнен';
      case 'pending': return 'В обработке';
      case 'cancelled': return 'Отменен';
      default: return status;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button onClick={() => navigate('/')} className="flex items-center gap-2">
                <Icon name="ChefHat" size={32} className="text-[#B5787E]" />
                <div>
                  <h1 className="text-3xl font-bold text-[#4A3428]">BestCakes</h1>
                  <p className="text-xs text-muted-foreground">Частная кондитерская</p>
                </div>
              </button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 max-w-md">
          <Card className="p-8">
            <div className="text-center mb-6">
              <Icon name="User" size={48} className="mx-auto mb-4 text-[#B5787E]" />
              <h2 className="text-2xl font-bold mb-2">
                {isLoginMode ? 'Вход в личный кабинет' : 'Регистрация'}
              </h2>
            </div>

            {isLoginMode ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Пароль</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
                <Button type="submit" className="w-full bg-[#B5787E]">Войти</Button>
                <p className="text-center text-sm text-muted-foreground">
                  Нет аккаунта?{' '}
                  <button type="button" onClick={() => setIsLoginMode(false)} className="text-[#B5787E] font-medium">
                    Зарегистрироваться
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="reg-name">Имя</Label>
                  <Input
                    id="reg-name"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    placeholder="Иван Иванов"
                  />
                </div>
                <div>
                  <Label htmlFor="reg-email">Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="reg-phone">Телефон</Label>
                  <Input
                    id="reg-phone"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                    placeholder="+7 999 999-99-99"
                  />
                </div>
                <div>
                  <Label htmlFor="reg-password">Пароль</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
                <Button type="submit" className="w-full bg-[#B5787E]">Создать аккаунт</Button>
                <p className="text-center text-sm text-muted-foreground">
                  Уже есть аккаунт?{' '}
                  <button type="button" onClick={() => setIsLoginMode(true)} className="text-[#B5787E] font-medium">
                    Войти
                  </button>
                </p>
              </form>
            )}
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/')} className="flex items-center gap-2">
              <Icon name="ChefHat" size={32} className="text-[#B5787E]" />
              <div>
                <h1 className="text-3xl font-bold text-[#4A3428]">BestCakes</h1>
                <p className="text-xs text-muted-foreground">Частная кондитерская</p>
              </div>
            </button>
            <Button onClick={handleLogout} variant="outline">
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Личный кабинет</h1>
            <p className="text-muted-foreground">Добро пожаловать, {user.name}!</p>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Профиль</TabsTrigger>
              <TabsTrigger value="orders">Мои заказы</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">Личные данные</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <Label htmlFor="profile-name">Имя</Label>
                    <Input
                      id="profile-name"
                      value={user.name}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="profile-email">Email</Label>
                    <Input
                      id="profile-email"
                      type="email"
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="profile-phone">Телефон</Label>
                    <Input
                      id="profile-phone"
                      value={user.phone}
                      onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="profile-address">Адрес доставки</Label>
                    <Input
                      id="profile-address"
                      value={user.address}
                      onChange={(e) => setUser({ ...user, address: e.target.value })}
                      placeholder="Город, улица, дом, квартира"
                    />
                  </div>
                  <Button type="submit" className="bg-[#B5787E]">
                    Сохранить изменения
                  </Button>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="mt-6">
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <Card className="p-12 text-center">
                    <Icon name="ShoppingBag" size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">У вас пока нет заказов</p>
                    <Button onClick={() => navigate('/')} className="mt-4 bg-[#B5787E]">
                      Перейти в каталог
                    </Button>
                  </Card>
                ) : (
                  orders.map((order) => (
                    <Card key={order.id} className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold">Заказ #{order.id}</h3>
                          <p className="text-sm text-muted-foreground">{order.date}</p>
                        </div>
                        <span className={`font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-2">Товары:</p>
                        <ul className="space-y-1">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="text-sm">• {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-4 border-t flex justify-between items-center">
                        <span className="font-bold text-lg">{order.total} ₽</span>
                        <Button variant="outline" size="sm">
                          Повторить заказ
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
