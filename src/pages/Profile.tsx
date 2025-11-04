import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';


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
      alert('Заполните все поля');
      return;
    }
    
    const savedUser = { name: 'Пользователь', email: loginForm.email, phone: '+7 999 999-99-99', address: '' };
    localStorage.setItem('user', JSON.stringify(savedUser));
    setUser(savedUser);
    setIsLoggedIn(true);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.name || !registerForm.email || !registerForm.password || !registerForm.phone) {
      alert('Заполните все поля');
      return;
    }
    
    const newUser = { name: registerForm.name, email: registerForm.email, phone: registerForm.phone, address: '' };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser({ name: '', email: '', phone: '', address: '' });
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify(user));
    alert('Профиль сохранен');
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
        <header className="bg-white border-b py-4">
          <div className="container mx-auto px-4">
            <button onClick={() => navigate('/')} className="text-2xl font-bold">
              BestCakes
            </button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-md">
          <div className="border p-6 rounded">
            <h2 className="text-2xl font-bold mb-4 text-center">
              {isLoginMode ? 'Вход' : 'Регистрация'}
            </h2>

            {isLoginMode ? (
              <form onSubmit={handleLogin} className="space-y-3">
                <Input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="Email"
                />
                <Input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="Пароль"
                />
                <button type="submit" className="w-full bg-[#B5787E] text-white py-2 rounded">
                  Войти
                </button>
                <p className="text-center text-sm">
                  <button type="button" onClick={() => setIsLoginMode(false)} className="text-blue-600">
                    Регистрация
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3">
                <Input
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  placeholder="Имя"
                />
                <Input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  placeholder="Email"
                />
                <Input
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                  placeholder="Телефон"
                />
                <Input
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  placeholder="Пароль"
                />
                <button type="submit" className="w-full bg-[#B5787E] text-white py-2 rounded">
                  Создать аккаунт
                </button>
                <p className="text-center text-sm">
                  <button type="button" onClick={() => setIsLoginMode(true)} className="text-blue-600">
                    Войти
                  </button>
                </p>
              </form>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/')} className="text-2xl font-bold">
              BestCakes
            </button>
            <button onClick={handleLogout} className="border px-4 py-2 rounded">
              Выйти
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Личный кабинет</h1>
          
          <div className="border p-6 rounded mb-6">
            <h2 className="text-xl font-bold mb-4">Профиль</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-3">
              <Input
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                placeholder="Имя"
              />
              <Input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="Email"
              />
              <Input
                value={user.phone}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                placeholder="Телефон"
              />
              <Input
                value={user.address}
                onChange={(e) => setUser({ ...user, address: e.target.value })}
                placeholder="Адрес"
              />
              <button type="submit" className="w-full bg-[#B5787E] text-white py-2 rounded">
                Сохранить
              </button>
            </form>
          </div>

          <div className="border p-6 rounded">
            <h2 className="text-xl font-bold mb-4">Мои заказы</h2>
            {orders.length === 0 ? (
              <p className="text-center py-4">Заказов пока нет</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="border p-4 rounded">
                    <div className="flex justify-between mb-2">
                      <span className="font-bold">Заказ #{order.id}</span>
                      <span>{order.date}</span>
                    </div>
                    <div className="text-sm mb-2">
                      {order.items.join(', ')}
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>{getStatusText(order.status)}</span>
                      <span>{order.total} ₽</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}