import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Home, User, Sparkles, Heart, ChevronLeft, MapPin, Clock, Plus, Minus, X, Loader2 } from 'lucide-react';
import { Product, CartItem, Topping, Size } from './types';
import { PRODUCTS, TOPPINGS, SIZES_PRICE_MODIFIER } from './constants';
import { editAcaiImage, generateAcaiImage } from './services/geminiService';

// --- Components ---

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isHideNav = ['/', '/checkout'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-dark-bg text-white pb-20 max-w-md mx-auto shadow-2xl shadow-acai/20 overflow-hidden relative">
      {children}
      
      {!isHideNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-gray-800 p-4 flex justify-around items-center max-w-md mx-auto z-50">
          <NavItem to="/menu" icon={<Home size={24} />} label="Início" active={location.pathname === '/menu'} />
          <NavItem to="/loyalty" icon={<Heart size={24} />} label="Fidelidade" active={location.pathname === '/loyalty'} />
          <NavItem to="/cart" icon={<ShoppingBag size={24} />} label="Carrinho" active={location.pathname === '/cart'} />
          <NavItem to="/tracking" icon={<User size={24} />} label="Perfil" active={location.pathname === '/tracking'} />
        </nav>
      )}
    </div>
  );
};

const NavItem = ({ to, icon, label, active }: { to: string, icon: React.ReactNode, label: string, active: boolean }) => {
  const navigate = useNavigate();
  return (
    <button 
      onClick={() => navigate(to)}
      className={`flex flex-col items-center space-y-1 transition-all duration-300 ${active ? 'text-neon-pink scale-110' : 'text-gray-400'}`}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
};

// --- Pages ---

const Onboarding = () => {
  const navigate = useNavigate();
  
  return (
    <div className="h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-dark-bg to-acai-dark relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
         {/* Abstract shapes */}
         <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-acai rounded-full blur-3xl"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-neon-pink rounded-full blur-3xl"></div>
      </div>

      <div className="z-10 flex flex-col items-center text-center">
        <div className="w-48 h-48 relative mb-8">
           {/* Bowl Animation */}
           <div className="absolute bottom-0 left-0 w-full bg-acai rounded-b-full animate-fill-up overflow-hidden border-4 border-white/10 opacity-90">
              <div className="w-full h-full bg-gradient-to-tr from-acai-dark to-acai"></div>
           </div>
           <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-white/20"></div>
           <Sparkles className="absolute top-0 right-0 text-neon-pink animate-pulse" size={32} />
        </div>

        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-neon-pink to-acai-light">
          Açaí Flow
        </h1>
        <p className="text-gray-300 mb-10 max-w-[250px]">
          A melhor experiência de açaí, do seu jeito, na sua porta.
        </p>

        <button 
          onClick={() => navigate('/menu')}
          className="w-full bg-neon-pink hover:bg-pink-500 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-neon-pink/30 transform transition hover:scale-105 active:scale-95"
        >
          Pedir Agora
        </button>
      </div>
    </div>
  );
};

const Menu = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 pt-12">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Olá, Açaí Lover 👋</h2>
          <p className="text-sm text-gray-400">O que vamos pedir hoje?</p>
        </div>
        <div className="bg-dark-card p-2 rounded-full border border-gray-700">
           <MapPin size={20} className="text-neon-pink" />
        </div>
      </header>

      {/* Banners / Promotions */}
      <div className="mb-8 overflow-x-auto flex space-x-4 pb-4 scrollbar-hide">
        <div className="min-w-[280px] h-40 rounded-2xl bg-gradient-to-r from-acai-dark to-purple-900 p-5 flex flex-col justify-center relative overflow-hidden group">
          <div className="z-10">
            <span className="bg-neon-pink text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block">NOVO</span>
            <h3 className="text-2xl font-bold text-white leading-tight">Açaí com<br/>Inteligência Artificial</h3>
            <p className="text-xs text-gray-300 mt-1">Crie o bowl dos seus sonhos.</p>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-50 group-hover:scale-110 transition-transform duration-500">
             <Sparkles size={100} className="text-white" />
          </div>
        </div>
      </div>

      <h3 className="text-lg font-bold text-white mb-4">Cardápio</h3>
      <div className="space-y-4">
        {PRODUCTS.map((product) => (
          <div 
            key={product.id}
            onClick={() => navigate(`/customize/${product.id}`)}
            className="bg-dark-card rounded-2xl p-4 flex items-center space-x-4 border border-transparent hover:border-acai/50 transition-all cursor-pointer group"
          >
            <img src={product.image} alt={product.name} className="w-20 h-20 rounded-xl object-cover group-hover:scale-105 transition-transform" />
            <div className="flex-1">
              <h4 className="font-bold text-white">{product.name}</h4>
              <p className="text-xs text-gray-400 line-clamp-2 mb-2">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-neon-pink font-bold">R$ {product.basePrice.toFixed(2)}</span>
                <div className="w-8 h-8 bg-acai/20 rounded-full flex items-center justify-center text-acai-light">
                  <Plus size={16} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Customization = ({ addToCart }: { addToCart: (item: CartItem) => void }) => {
  const { id } = useLocation().pathname.match(/\/customize\/(?<id>.*)/)?.groups || {};
  const navigate = useNavigate();
  const product = PRODUCTS.find(p => p.id === id);
  
  const [size, setSize] = useState<Size>(Size.M);
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [isAiMode, setIsAiMode] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiImage, setAiImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBlob, setGeneratedBlob] = useState<string | null>(null); // Base64 for the cart

  useEffect(() => {
    if (!product) navigate('/menu');
  }, [product, navigate]);

  const toggleTopping = (topping: Topping) => {
    if (selectedToppings.find(t => t.id === topping.id)) {
      setSelectedToppings(prev => prev.filter(t => t.id !== topping.id));
    } else {
      setSelectedToppings(prev => [...prev, topping]);
    }
  };

  const calculateTotal = () => {
    if (!product) return 0;
    let total = product.basePrice + SIZES_PRICE_MODIFIER[size];
    selectedToppings.forEach(t => total += t.price);
    return total;
  };

  const handleAddToCart = () => {
    if (!product) return;
    const newItem: CartItem = {
      id: Date.now().toString(),
      productId: product.id,
      productName: product.name,
      size,
      toppings: selectedToppings,
      totalPrice: calculateTotal(),
      quantity: 1,
      aiGeneratedImage: generatedBlob || undefined
    };
    addToCart(newItem);
    navigate('/cart');
  };

  // --- Gemini Logic ---
  const handleAiAction = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    
    try {
      let resultBase64: string | null;

      if (generatedBlob) {
        // Edit existing
        resultBase64 = await editAcaiImage(generatedBlob, aiPrompt);
      } else {
        // Generate new or Edit default product image (fetch then edit)
        // For simplicity in this demo, if no blob exists, we generate from scratch or use a placeholder logic
        // A real app would fetch the product.image, convert to base64, and send it.
        // Here, we'll ask Gemini to generate a fresh one based on description + prompt.
        resultBase64 = await generateAcaiImage(aiPrompt);
      }

      if (resultBase64) {
        setGeneratedBlob(resultBase64);
        setAiImage(`data:image/png;base64,${resultBase64}`);
      }
    } catch (e) {
      alert("Erro ao gerar imagem. Tente novamente.");
    } finally {
      setIsGenerating(false);
      setAiPrompt(''); // clear prompt but keep image
    }
  };

  if (!product) return null;

  return (
    <div className="min-h-screen bg-dark-bg pb-24 relative">
      {/* Header Image Area */}
      <div className="relative h-72 w-full bg-gray-800 rounded-b-[40px] overflow-hidden shadow-2xl shadow-acai/20">
        <img 
          src={aiImage || product.image} 
          alt="Açaí Bowl" 
          className="w-full h-full object-cover transition-all duration-500"
        />
        <button 
          onClick={() => navigate('/menu')}
          className="absolute top-4 left-4 bg-black/40 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/60 transition"
        >
          <ChevronLeft size={24} />
        </button>

        <button
            onClick={() => setIsAiMode(!isAiMode)}
            className={`absolute top-4 right-4 p-2 px-4 rounded-full backdrop-blur-md flex items-center gap-2 transition-all ${isAiMode ? 'bg-neon-pink text-white' : 'bg-black/40 text-gray-200'}`}
        >
            <Sparkles size={18} />
            <span className="text-xs font-bold">IA Studio</span>
        </button>

        {/* Overlay Gradient */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-dark-bg to-transparent"></div>
      </div>

      <div className="px-6 -mt-10 relative z-10">
        <div className="flex justify-between items-end mb-6">
            <div>
                <h1 className="text-3xl font-bold text-white">{product.name}</h1>
                <p className="text-gray-400 text-sm">{product.description}</p>
            </div>
            <div className="text-neon-pink text-2xl font-bold">
                R$ {calculateTotal().toFixed(2)}
            </div>
        </div>

        {isAiMode ? (
            <div className="bg-dark-card p-4 rounded-2xl border border-neon-pink/30 mb-6 animate-fade-in">
                <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                    <Sparkles size={16} className="text-neon-pink" />
                    Personalize com Gemini AI
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                    Descreva como você quer seu açaí e a IA vai criar uma prévia visual para você. Ex: "Adicione muito leite condensado caindo pelas bordas" ou "Estilo cyberpunk".
                </p>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="Digite seu desejo..."
                        className="flex-1 bg-dark-input rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-neon-pink"
                    />
                    <button 
                        onClick={handleAiAction}
                        disabled={isGenerating}
                        className="bg-neon-pink rounded-xl px-4 py-2 text-white disabled:opacity-50"
                    >
                        {isGenerating ? <Loader2 className="animate-spin" size={20} /> : 'Gerar'}
                    </button>
                </div>
            </div>
        ) : (
            <>
                {/* Size Selection */}
                <div className="mb-8">
                <h3 className="text-white font-bold mb-4">Tamanho</h3>
                <div className="flex justify-between bg-dark-card p-2 rounded-2xl">
                    {Object.keys(SIZES_PRICE_MODIFIER).map((s) => (
                    <button
                        key={s}
                        onClick={() => setSize(s as Size)}
                        className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${size === s ? 'bg-acai text-white shadow-lg shadow-acai/40' : 'text-gray-400 hover:text-white'}`}
                    >
                        {s}
                    </button>
                    ))}
                </div>
                </div>

                {/* Toppings */}
                <div className="mb-8">
                <h3 className="text-white font-bold mb-4">Adicionais</h3>
                <div className="grid grid-cols-4 gap-3">
                    {TOPPINGS.map((topping) => {
                    const isSelected = selectedToppings.some(t => t.id === topping.id);
                    return (
                        <button
                        key={topping.id}
                        onClick={() => toggleTopping(topping)}
                        className={`aspect-square rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 ${isSelected ? 'bg-acai/20 border-acai scale-105' : 'bg-dark-card border-transparent hover:bg-gray-800'}`}
                        >
                        <span className="text-2xl mb-1">{topping.icon}</span>
                        <span className="text-[10px] text-gray-300 text-center leading-tight">{topping.name}</span>
                        </button>
                    );
                    })}
                </div>
                </div>
            </>
        )}

        <button 
            onClick={handleAddToCart}
            className="w-full bg-neon-pink text-white font-bold py-4 rounded-2xl shadow-lg shadow-neon-pink/20 hover:shadow-neon-pink/40 transition-all transform active:scale-95 flex justify-between px-8 items-center"
        >
            <span>Adicionar ao Pedido</span>
            <span>R$ {calculateTotal().toFixed(2)}</span>
        </button>
      </div>
    </div>
  );
};

const Cart = ({ items, onRemove }: { items: CartItem[], onRemove: (id: string) => void }) => {
  const navigate = useNavigate();
  const total = items.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <div className="p-6 pt-8 min-h-screen">
      <h2 className="text-2xl font-bold text-white mb-6">Seu Carrinho</h2>
      
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500">
            <ShoppingBag size={64} className="mb-4 opacity-20" />
            <p>Seu carrinho está vazio.</p>
            <button onClick={() => navigate('/menu')} className="mt-4 text-neon-pink font-bold">Ver Cardápio</button>
        </div>
      ) : (
        <div className="space-y-4 mb-24">
            {items.map((item) => (
                <div key={item.id} className="bg-dark-card p-4 rounded-2xl flex gap-4 items-center border border-gray-800 relative overflow-hidden">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-900 shrink-0">
                        <img 
                            src={item.aiGeneratedImage ? `data:image/png;base64,${item.aiGeneratedImage}` : PRODUCTS.find(p => p.id === item.productId)?.image} 
                            alt={item.productName} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-white">{item.productName}</h4>
                        <p className="text-xs text-gray-400 mb-1">Tamanho: {item.size}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                            {item.toppings.map(t => (
                                <span key={t.id} className="text-[10px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-300">{t.name}</span>
                            ))}
                        </div>
                        <span className="text-neon-pink font-bold">R$ {item.totalPrice.toFixed(2)}</span>
                    </div>
                    <button 
                        onClick={() => onRemove(item.id)}
                        className="absolute top-2 right-2 text-gray-600 hover:text-red-500 p-2"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
      )}

      {items.length > 0 && (
          <div className="fixed bottom-24 left-0 right-0 px-6 max-w-md mx-auto">
              <div className="bg-dark-card/80 backdrop-blur-lg border border-gray-700 p-4 rounded-2xl mb-4">
                  <div className="flex justify-between mb-2 text-sm text-gray-400">
                      <span>Subtotal</span>
                      <span>R$ {total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2 text-sm text-gray-400">
                      <span>Entrega</span>
                      <span>R$ 5.00</span>
                  </div>
                  <div className="border-t border-gray-700 my-2"></div>
                  <div className="flex justify-between font-bold text-white text-lg">
                      <span>Total</span>
                      <span>R$ {(total + 5).toFixed(2)}</span>
                  </div>
              </div>
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-neon-pink text-white font-bold py-4 rounded-2xl shadow-lg shadow-neon-pink/30 active:scale-95 transition-transform"
              >
                  Finalizar Pedido
              </button>
          </div>
      )}
    </div>
  );
};

const Checkout = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Success

    if (step === 3) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-dark-bg">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce-short shadow-lg shadow-green-500/40">
                    <Sparkles className="text-white" size={40} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Pedido Confirmado!</h2>
                <p className="text-gray-400 mb-8">Seu açaí já está sendo preparado com todo carinho.</p>
                
                <button 
                    onClick={() => navigate('/tracking')}
                    className="bg-acai text-white px-8 py-3 rounded-xl font-bold"
                >
                    Acompanhar Entrega
                </button>
            </div>
        )
    }

    return (
        <div className="p-6 pt-8 min-h-screen bg-dark-bg">
             <div className="flex items-center mb-6">
                <button onClick={() => navigate(-1)} className="mr-4 p-2 bg-dark-card rounded-full"><ChevronLeft size={20}/></button>
                <h2 className="text-xl font-bold text-white">Checkout</h2>
            </div>

            <div className="space-y-6">
                {/* Address Section */}
                <div className="bg-dark-card p-4 rounded-2xl border border-gray-800">
                    <h3 className="text-neon-pink font-bold mb-3 flex items-center gap-2"><MapPin size={18}/> Endereço de Entrega</h3>
                    <div className="bg-dark-input p-3 rounded-xl text-sm text-gray-300 mb-2">
                        Rua das Flores, 123 - Centro
                    </div>
                    <button className="text-xs text-acai-light font-bold">Alterar endereço</button>
                </div>

                {/* Payment Section */}
                <div className="bg-dark-card p-4 rounded-2xl border border-gray-800">
                    <h3 className="text-neon-pink font-bold mb-3 flex items-center gap-2"><ShoppingBag size={18}/> Pagamento</h3>
                    
                    <div className="space-y-2">
                        <label className="flex items-center gap-3 bg-dark-input p-3 rounded-xl cursor-pointer border border-acai/50">
                            <div className="w-4 h-4 rounded-full bg-acai"></div>
                            <span className="text-white font-medium">PIX (5% desconto)</span>
                        </label>
                        <label className="flex items-center gap-3 bg-dark-input p-3 rounded-xl cursor-pointer border border-transparent opacity-60">
                            <div className="w-4 h-4 rounded-full border border-gray-500"></div>
                            <span className="text-white font-medium">Cartão de Crédito</span>
                        </label>
                    </div>
                </div>
            </div>

            <button 
                onClick={() => setStep(3)}
                className="fixed bottom-8 left-6 right-6 max-w-[calc(100%-3rem)] mx-auto bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-500/20 transition-all transform active:scale-95"
            >
                Pagar com PIX
            </button>
        </div>
    )
}

const Tracking = () => {
    const steps = [
        { id: 1, label: 'Pedido Confirmado', time: '14:30', done: true },
        { id: 2, label: 'Preparando', time: '14:32', done: true },
        { id: 3, label: 'Saiu para Entrega', time: '...', done: false },
        { id: 4, label: 'Entregue', time: '...', done: false },
    ];

    return (
        <div className="p-6 pt-8 min-h-screen">
            <h2 className="text-2xl font-bold text-white mb-8">Rastreamento</h2>

            <div className="bg-dark-card p-6 rounded-3xl border border-gray-800 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-neon-pink/10 blur-3xl rounded-full"></div>
                 
                 <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-acai/20 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                        <span className="text-3xl">🛵</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">Previsão: 14:50 - 15:00</h3>
                 </div>

                 <div className="space-y-8 relative">
                    {/* Line connecting dots */}
                    <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-700"></div>

                    {steps.map((step) => (
                        <div key={step.id} className="relative flex items-start gap-4">
                            <div className={`z-10 w-6 h-6 rounded-full border-4 ${step.done ? 'bg-acai border-acai shadow-[0_0_10px_#8A2BE2]' : 'bg-dark-card border-gray-600'} shrink-0 transition-all duration-500`}></div>
                            <div>
                                <h4 className={`font-bold ${step.done ? 'text-white' : 'text-gray-500'}`}>{step.label}</h4>
                                <p className="text-xs text-gray-500">{step.time}</p>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
    );
}

const Loyalty = () => {
    const points = 350;
    const maxPoints = 500;
    const progress = (points / maxPoints) * 100;

    return (
        <div className="p-6 pt-8 min-h-screen">
            <h2 className="text-2xl font-bold text-white mb-6">Fidelidade</h2>

            <div className="bg-gradient-to-br from-acai to-acai-dark p-6 rounded-3xl shadow-xl shadow-acai/30 mb-8 relative overflow-hidden">
                <Sparkles className="absolute top-4 right-4 text-white/30" />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                
                <p className="text-acai-light text-sm font-bold mb-1">MEUS PONTOS</p>
                <h3 className="text-5xl font-bold text-white mb-6">{points}</h3>

                <div className="relative w-full h-3 bg-black/30 rounded-full overflow-hidden mb-2">
                    <div className="absolute top-0 left-0 h-full bg-neon-pink transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-xs text-white/80 text-right">Faltam {maxPoints - points} para resgatar</p>
            </div>

            <h3 className="text-lg font-bold text-white mb-4">Recompensas</h3>
            <div className="space-y-4">
                {[
                    { title: 'Topping Grátis', cost: 200, canRedeem: true },
                    { title: 'Açaí 300ml', cost: 500, canRedeem: false },
                    { title: 'Combo Casal', cost: 1000, canRedeem: false },
                ].map((reward, idx) => (
                    <div key={idx} className="bg-dark-card p-4 rounded-2xl flex justify-between items-center border border-gray-800">
                        <div>
                            <h4 className="font-bold text-white">{reward.title}</h4>
                            <p className="text-xs text-neon-pink font-bold">{reward.cost} pts</p>
                        </div>
                        <button 
                            disabled={!reward.canRedeem}
                            className={`px-4 py-2 rounded-xl text-xs font-bold ${reward.canRedeem ? 'bg-white text-acai' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                        >
                            Resgatar
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- Main App ---

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/customize/:id" element={<Customization addToCart={addToCart} />} />
          <Route path="/cart" element={<Cart items={cart} onRemove={removeFromCart} />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/loyalty" element={<Loyalty />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}