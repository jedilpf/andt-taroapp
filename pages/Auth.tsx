
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Zap, User, Wrench, ArrowRight, ArrowLeft, Check, Shield, ShieldCheck, Smartphone, Gift, Award, Clock, Star, ChevronRight, HeartHandshake, Siren, Lightbulb, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { createPortal } from 'react-dom';

// --- 高精度品牌原生 Logo (SVG) ---

const WeChatIcon = () => (
    <svg width="28" height="28" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <path d="M512 1024C229.248 1024 0 794.752 0 512S229.248 0 512 0s512 229.248 512 512-229.248 512-512 512z" fill="#07C160"/>
        <path d="M625.344 323.008c-121.28 0-219.52 86.848-219.52 194.048 0 58.624 29.312 111.424 76.544 148.544l-19.456 58.176 67.52-33.856c29.056 8.384 60.16 12.864 92.928 12.864 121.216 0 219.52-86.848 219.52-194.048 0-107.2-98.304-194.048-217.536-194.048v-1.664z m-79.168 84.864c14.272 0 25.856 10.112 25.856 22.592s-11.584 22.592-25.856 22.592-25.856-10.112-25.856-22.592 11.584-22.592 25.856-22.592z m158.336 0c14.272 0 25.856 10.112 25.856 22.592s-11.584 22.592-25.856 22.592-25.856-10.112-25.856-22.592 11.584-22.592 25.856-22.592zM396.224 167.36c-145.472 0-263.424 104.32-263.424 232.832 0 70.336 35.136 133.696 91.84 178.24L201.28 648.32l81.024-40.576c34.88 10.112 72.192 15.424 111.488 15.424 11.648 0 23.04-0.448 34.304-1.344-5.376-13.632-8.32-28.288-8.32-43.52 0-120.448 110.144-218.112 246.016-218.112 14.592 0 28.8 1.152 42.496 3.328 0-1.856 0.192-3.648 0.192-5.44 0-128.576-117.952-232.896-261.248-232.896l-50.624 1.6z m-101.376 101.888c17.152 0 31.04 12.096 31.04 27.136s-13.888 27.136-31.04 27.136-31.04-12.096-31.04-27.136 13.888-27.136 31.04-27.136z m202.752 0c17.152 0 31.04 12.096 31.04 27.136s-13.888 27.136-31.04 27.136-31.04-12.096-31.04-27.136 13.888-27.136 31.04-27.136z" fill="white"/>
    </svg>
);

const AlipayIcon = () => (
    <svg width="28" height="28" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <path d="M512 1024c282.752 0 512-229.248 512-512S794.752 0 512 0 0 229.248 0 512s229.248 512 512 512z" fill="#1677FF"/>
        <path d="M722.56 430.72c2.56-11.52 3.84-23.04 3.84-34.56 0-10.24-8.96-19.2-19.2-19.2h-227.2v-73.6h158.72c10.24 0 19.2-8.96 19.2-19.2v-34.56c0-10.24-8.96-19.2-19.2-19.2h-323.2c-10.24 0-19.2 8.96-19.2 19.2v34.56c0 10.24 8.96 19.2 19.2 19.2h158.72v73.6h-115.84c-10.24 0-19.2 8.96-19.2 19.2s8.96 19.2 19.2 19.2h133.12c-18.56 89.6-76.16 156.8-147.2 195.84-8.96 5.12-12.16 16.64-6.4 25.6l22.4 36.48c4.48 7.04 13.44 8.96 20.48 4.48 105.6-67.2 179.2-164.48 202.88-280.96h126.72c6.4 0 11.52 5.12 11.52 11.52 0 3.2-1.28 6.4-3.2 8.32L521.6 690.56c-4.48 4.48-4.48 10.88 0 15.36l30.72 30.72c4.48 4.48 10.88 4.48 15.36 0l311.68-311.68c1.92-1.92 3.2-3.84 4.48-6.4z m-115.2 265.6l-27.52-27.52c-4.48-4.48-10.88-4.48-15.36 0l-53.76 53.76c-31.36 31.36-73.6 48.64-117.76 48.64s-86.4-17.28-117.76-48.64c-65.28-65.28-65.28-170.88 0-236.16 4.48-4.48 4.48-10.88 0-15.36l-27.52-27.52c-4.48-4.48-10.88-4.48-15.36 0-80 80-80 210.56 0 290.56 42.24 42.24 99.2 65.92 160.64 65.92s118.4-23.68 160.64-65.92l53.76-53.76c4.48-4.48 4.48-10.88 0-15.36z" fill="white"/>
    </svg>
);

const QQIcon = () => (
    <svg width="28" height="28" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <path d="M512 1024c282.752 0 512-229.248 512-512S794.752 0 512 0 0 229.248 0 512s229.248 512 512 512z" fill="#12B7F5"/>
        <path d="M512 213.333c-141.333 0-256 106.667-256 238.222 0 42.667 12.288 82.603 33.621 116.907-6.57 21.163-17.75 53.077-36.181 96.085l-22.955 53.333c-5.461 12.63 6.741 25.6 19.797 21.163l75.435-25.429c13.483-4.523 27.819-1.963 39.168 6.827 42.752 32.939 93.184 52.48 147.115 52.48s104.363-19.541 147.115-52.48c11.349-8.79 25.685-11.35 39.168-6.827l75.435 25.429c13.056 4.437 25.258-8.533 19.797-21.163l-22.955-53.333c-18.432-43.008-29.611-74.922-36.181-96.085 21.333-34.304 33.621-74.24 33.621-116.907 0-131.555-114.667-238.222-256-238.222z" fill="white"/>
    </svg>
);

const AppleIcon = () => (
    <svg width="24" height="24" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
        <path d="M738.133 538.453c1.067-104.533 85.333-154.667 89.6-157.867-49.067-71.467-124.8-81.067-151.467-82.133-64-6.4-124.8 38.4-156.8 38.4-32 0-82.133-37.333-135.466-36.267-70.4 1.067-135.467 41.6-171.734 104.534-73.6 128-18.133 316.8 53.334 419.2 35.2 50.133 76.8 105.6 131.2 103.466 51.2-2.133 70.4-33.066 132.266-33.066 61.867 0 78.934 33.066 133.334 32 55.466-1.067 91.733-49.066 125.866-99.2 39.467-57.6 55.467-113.067 56.534-116.267-1.067 0-107.734-41.6-106.667-172.8zM654.933 211.2c28.8-35.2 48-83.2 42.667-131.2-41.6 2.133-91.733 27.733-121.6 62.933-26.667 30.934-50.133 80-43.733 125.867 45.866 3.2 92.8-23.467 122.666-57.6z" fill="black"/>
    </svg>
);

const PhoneIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 2H7C5.89543 2 5 2.89543 5 4V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V4C19 2.89543 18.1046 2 17 2Z" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 18H12.01" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

// --- Agreement Modal Component ---
const AgreementModal = ({ type, onClose }: { type: 'terms' | 'privacy', onClose: () => void }) => {
    const content = type === 'terms' ? {
        title: '用户服务协议',
        sections: [
            { h: '1. 协议确认', p: '欢迎使用安电通。当您完成注册或开始使用本服务，即表示您已充分阅读、理解并同意接受本协议的全部内容。' },
            { h: '2. 服务内容', p: '安电通提供家庭电力维修预约、AI故障诊断、社区志愿者服务匹配等功能。具体服务以App实际呈现为准。' },
            { h: '3. 账户安全', p: '您应当妥善保管您的登录密码和验证码，任何通过您账户进行的操作均视为您的本人行为。' },
            { h: '4. 用户行为规范', p: '用户禁止发布虚假报修信息，禁止利用平台漏洞牟利，禁止对服务师傅进行人身攻击。' },
            { h: '5. 责任限制', p: '平台对由于不可抗力或第三方通讯故障导致的订单延误不承担赔偿责任。' }
        ]
    } : {
        title: '隐私保护政策',
        sections: [
            { h: '1. 信息收集', p: '为提供精准的上门服务，我们需要收集您的精确地理位置、手机号码、实名认证信息。' },
            { h: '2. 信息使用', p: '您的位置信息仅在您发起报修且师傅接单后，在服务期间对承接师傅可见。' },
            { h: '3. 设备权限申请', p: 'App会申请相机（用于AI拍摄诊断）、麦克风（语音沟通）、存储（保存维修图片）等权限。' },
            { h: '4. 信息保护措施', p: '我们采用符合行业标准的加密传输和防火墙技术保护您的数据安全。' },
            { h: '5. 用户权利', p: '您可以随时在“设置-隐私管理”中撤回权限授权或申请注销账户。' }
        ]
    };

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex items-end justify-center pointer-events-none px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity" onClick={onClose}></div>
            <div className="w-full max-w-md bg-white rounded-t-[2.5rem] p-8 animate-slide-up pointer-events-auto relative z-10 pb-safe shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
                <div className="flex justify-between items-center mb-6 shrink-0">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">{content.title}</h3>
                    <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-400 active:scale-90 transition-transform"><X size={20}/></button>
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pb-6 pr-2">
                    {content.sections.map((sec, i) => (
                        <div key={i} className="space-y-2">
                            <h4 className="font-black text-slate-700 text-sm">{sec.h}</h4>
                            <p className="text-slate-500 text-xs leading-relaxed font-medium">{sec.p}</p>
                        </div>
                    ))}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mt-4">
                        <p className="text-[10px] text-slate-400 leading-relaxed font-bold">版本日期：2024.11.26<br/>开发者：上海安电通数字科技有限公司</p>
                    </div>
                </div>
                <button onClick={onClose} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-transform mt-4">
                    同意并继续
                </button>
            </div>
        </div>,
        document.body
    );
};

export const Splash: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => navigate('/role'), 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-green-600 flex flex-col items-center justify-center text-white z-[9999] overflow-hidden touch-none">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-green-900/20 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center animate-fade-in">
        <div className="p-6 bg-white rounded-full shadow-2xl shadow-green-900/20 animate-bounce mb-8">
          <Zap className="text-green-600 fill-green-600" size={64} strokeWidth={0} />
        </div>
        <h1 className="text-5xl font-extrabold tracking-[0.2em] text-white drop-shadow-sm mb-4">安电通</h1>
        <div className="flex items-center space-x-4 text-green-50 text-lg font-medium tracking-widest opacity-90">
           <span>公益</span>
           <span className="w-1.5 h-1.5 bg-green-300 rounded-full"></span>
           <span>专业</span>
           <span className="w-1.5 h-1.5 bg-green-300 rounded-full"></span>
           <span>便民</span>
        </div>
      </div>

      <div className="absolute bottom-12 text-green-200/40 text-[10px] tracking-[0.5em] font-bold select-none">
           安电通 · 社区电力志愿服务
      </div>
    </div>
  );
};

const HeroCarousel = () => {
  const [index, setIndex] = useState(0);
  
  const ads = [
    {
      id: 1,
      tag: "官方补贴",
      title: "公益安检",
      desc: "全屋线路免费查",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
      icon: ShieldCheck,
      color: "from-emerald-400 to-teal-600"
    },
    {
      id: 2,
      tag: "爱心义工",
      title: "助老扶弱",
      desc: "独居长者免人工",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
      icon: HeartHandshake,
      color: "from-rose-400 to-pink-600"
    },
    {
      id: 3,
      tag: "志愿响应",
      title: "应急救援",
      desc: "24h 守护万家灯火",
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80",
      icon: Siren,
      color: "from-amber-400 to-orange-600"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ads.length);
    }, 4000); 
    return () => clearInterval(timer);
  }, [ads.length]);

  return (
     <div className="absolute top-0 left-0 w-full h-[60vh] z-0 overflow-hidden bg-slate-900">
           {ads.map((ad, i) => (
                <div 
                    key={ad.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === index ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img 
                        src={ad.image} 
                        alt={ad.title} 
                        className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-linear ${i === index ? 'scale-110' : 'scale-100'}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/30 to-white"></div>
                </div>
           ))}

           <div className="absolute top-[15%] right-6 z-10 w-20 h-[360px] pointer-events-none">
               {ads.map((ad, i) => (
                   <div 
                        key={ad.id} 
                        className={`transition-all duration-700 ease-out absolute right-0 top-0 flex items-start justify-end
                            ${i === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                        `}
                   >
                        <div className="mr-3 mt-8 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-l-full border border-white/10 animate-fade-in delay-300 transform origin-right shadow-sm">
                            <p className="text-[10px] font-bold text-white whitespace-nowrap tracking-wide">{ad.desc}</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${ad.color} flex items-center justify-center mb-4 shadow-lg shadow-black/20 ring-2 ring-white/10 relative`}>
                                <ad.icon size={16} className="text-white drop-shadow-md relative z-10" />
                            </div>

                            <div className="flex flex-col items-center space-y-2">
                                <div style={{ writingMode: 'vertical-rl' }} className="text-[10px] font-medium text-white/80 tracking-[0.4em] flex items-center justify-center min-h-[60px] drop-shadow-md">
                                    {ad.tag}
                                </div>
                                <div className="w-[1px] h-8 bg-gradient-to-b from-white/0 via-white/50 to-white/0 opacity-70"></div>
                                <h2 style={{ writingMode: 'vertical-rl' }} className="text-2xl font-black text-white tracking-[0.3em] drop-shadow-xl leading-none min-h-[120px] flex items-center justify-center filter">
                                    {ad.title}
                                </h2>
                            </div>
                        </div>
                   </div>
               ))}
           </div>
           <div className="absolute top-20 right-20 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
     </div>
  );
};

export const RoleSelect: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] bg-white relative flex flex-col">
       <HeroCarousel />
       <div className="flex-1 flex flex-col px-6 pt-24 pb-safe relative z-10 justify-between">
          <div className="animate-fade-up max-w-[65%]">
             <div className="w-12 h-12 bg-white/10 backdrop-blur-md text-white rounded-2xl flex items-center justify-center mb-6 border border-white/20 shadow-2xl">
                <Lightbulb size={28} fill="currentColor" className="drop-shadow-lg text-yellow-300" />
             </div>
             <h1 className="text-4xl font-black text-white mb-2 leading-tight tracking-tight drop-shadow-lg">
                社区电力<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-cyan-200">公益服务站</span>
             </h1>
             <p className="text-white/70 font-medium text-sm drop-shadow-md tracking-wide">消除隐患 · 温暖邻里</p>
          </div>

          <div className="flex flex-col gap-4 mt-auto pb-8">
              <button
                onClick={() => navigate('/login?role=USER')}
                className="group relative w-full h-32 overflow-hidden rounded-[1.5rem] bg-white shadow-xl shadow-amber-500/10 transition-all duration-300 hover:scale-[1.02] active:scale-95 border border-gray-50 flex items-center px-6 animate-fade-up"
                style={{animationDelay: '100ms'}}
              >
                 <div className="absolute right-0 top-0 h-full w-3/4 bg-gradient-to-l from-amber-50 to-transparent opacity-80 transition-opacity"></div>
                 <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-100 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>

                 <div className="relative z-10 w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center text-amber-600 shadow-inner group-hover:scale-110 transition-transform shrink-0 border border-amber-200/50">
                    <User size={28} strokeWidth={2.5} />
                 </div>

                 <div className="relative z-10 ml-5 text-left flex-1 min-w-0">
                    <h3 className="text-2xl font-black text-gray-800 leading-none mb-1.5 group-hover:text-amber-600 transition-colors">我是业主</h3>
                    <p className="text-gray-400 text-xs font-bold tracking-wide truncate">家庭维修 · 公益检测 · 志愿服务</p>
                 </div>
                 
                 <div className="relative z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-300 shadow-sm border border-gray-100 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500 transition-all transform translate-x-2 group-hover:translate-x-0 shrink-0">
                    <ArrowRight size={20} strokeWidth={3} />
                 </div>
              </button>

              <button
                onClick={() => navigate('/login?role=ELECTRICIAN')}
                className="group relative w-full h-32 overflow-hidden rounded-[1.5rem] bg-white shadow-xl shadow-teal-500/10 transition-all duration-300 hover:scale-[1.02] active:scale-95 border border-gray-50 flex items-center px-6 animate-fade-up"
                style={{animationDelay: '200ms'}}
              >
                 <div className="absolute right-0 top-0 h-full w-3/4 bg-gradient-to-l from-teal-50 to-transparent opacity-80 transition-opacity"></div>
                 <div className="absolute -right-10 -top-10 w-40 h-40 bg-teal-100 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>

                 <div className="relative z-10 w-14 h-14 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl flex items-center justify-center text-teal-600 shadow-inner group-hover:scale-110 transition-transform shrink-0 border border-teal-200/50">
                    <Wrench size={28} strokeWidth={2.5} />
                 </div>

                 <div className="relative z-10 ml-5 text-left flex-1 min-w-0">
                    <h3 className="text-2xl font-black text-gray-800 leading-none mb-1.5 group-hover:text-teal-600 transition-colors">我是师傅</h3>
                    <p className="text-gray-400 text-xs font-bold tracking-wide truncate">加入义工 · 技能认证 · 服务社区</p>
                 </div>
                 
                 <div className="relative z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-300 shadow-sm border border-gray-100 group-hover:bg-teal-500 group-hover:text-white group-hover:border-teal-500 transition-all transform translate-x-2 group-hover:translate-x-0 shrink-0">
                    <ArrowRight size={20} strokeWidth={3} />
                 </div>
              </button>
          </div>
       </div>
       
       <div className="text-center pb-6 relative z-10 animate-fade-in delay-300 flex justify-center pointer-events-none">
          <div className="bg-gray-50/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-gray-100 flex items-center space-x-2 shadow-sm">
             <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
             <p className="text-[10px] text-gray-400 font-bold tracking-widest">安电通 · 社区公益项目</p>
          </div>
       </div>
    </div>
  );
};

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const roleParam = (searchParams.get('role') as UserRole) || UserRole.USER;
  
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [agreementType, setAgreementType] = useState<'terms' | 'privacy' | null>(null);

  const isUser = roleParam === UserRole.USER;

  const theme = isUser ? {
      color: 'text-green-600',
      bg: 'bg-green-600',
      lightBg: 'bg-green-50',
      ring: 'focus:ring-green-500',
      gradient: 'from-green-600 to-emerald-600',
      shadow: 'shadow-green-500/30',
      image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1000&q=80',
      title: '欢迎回家',
      subtitle: '一键呼叫专业电工，守护家庭用电安全',
      overlay: 'from-green-900/40 via-green-800/60 to-green-900/90'
  } : {
      color: 'text-blue-600',
      bg: 'bg-blue-600',
      lightBg: 'bg-blue-50',
      ring: 'focus:ring-blue-500',
      gradient: 'from-blue-600 to-indigo-600',
      shadow: 'shadow-blue-500/30',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=80',
      title: '师傅登录',
      subtitle: '接单赚钱 · 职业认证 · 平台保障',
      overlay: 'from-blue-900/40 via-blue-800/60 to-blue-900/90'
  };

  const handleGetCode = () => {
    if (countdown > 0) return;
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleDemoLogin = () => {
    const mockPhone = isUser ? '13800138000' : '13900139000';
    setPhone(mockPhone);
    setCode('8888');
    
    setTimeout(() => {
      login(mockPhone, roleParam);
      if (isUser) navigate('/user/home');
      else navigate('/electrician/hall');
    }, 500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(phone, roleParam);
    if (isUser) navigate('/user/home');
    else navigate('/electrician/hall');
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-white relative">
        <div className="relative h-[38vh] shrink-0 overflow-hidden">
            <div className="absolute inset-0 animate-[subtle-zoom_20s_infinite_alternate]">
                <img src={theme.image} className="w-full h-full object-cover" alt="Background" />
            </div>
            <div className={`absolute inset-0 bg-gradient-to-b ${theme.overlay}`}></div>
            
            <button 
                onClick={() => navigate('/role')} 
                className="absolute top-safe left-4 mt-2 p-2.5 bg-white/10 backdrop-blur-md rounded-full text-white z-20 hover:bg-white/20 transition-colors active:scale-95 border border-white/10"
            >
                <ArrowLeft size={24}/>
            </button>

            <div className="absolute bottom-10 left-8 right-8 text-white z-20 animate-fade-up">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-5 border border-white/20 shadow-lg">
                    {isUser ? <User size={32} className="text-white"/> : <Wrench size={32} className="text-white"/>}
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-2 drop-shadow-md">{theme.title}</h1>
                <p className="text-white/80 text-sm font-medium leading-relaxed">{theme.subtitle}</p>
            </div>
        </div>

        <div className="flex-1 bg-white -mt-8 rounded-t-[2.5rem] relative z-30 px-8 pt-10 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-200 rounded-full"></div>

            <form onSubmit={handleLogin} className="space-y-6 mt-2">
                <div className="group">
                    <label className="block text-xs font-bold text-gray-400 mb-2 ml-1">手机号码</label>
                    <div className={`relative flex items-center bg-gray-50 rounded-2xl border border-transparent group-focus-within:bg-white group-focus-within:border-gray-200 group-focus-within:ring-4 ${isUser ? 'group-focus-within:ring-green-500/10' : 'group-focus-within:ring-blue-500/10'} transition-all shadow-sm`}>
                        <div className="pl-4 text-gray-400"><Smartphone size={20}/></div>
                        <input 
                            type="tel" 
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder="请输入手机号"
                            className="w-full bg-transparent h-14 pl-3 pr-4 outline-none font-bold text-gray-800 placeholder:font-medium placeholder:text-gray-300" 
                        />
                    </div>
                </div>

                <div className="group">
                    <label className="block text-xs font-bold text-gray-400 mb-2 ml-1">验证码</label>
                    <div className="flex gap-3">
                        <div className={`relative flex-1 flex items-center bg-gray-50 rounded-2xl border border-transparent group-focus-within:bg-white group-focus-within:border-gray-200 group-focus-within:ring-4 ${isUser ? 'group-focus-within:ring-green-500/10' : 'group-focus-within:ring-blue-500/10'} transition-all shadow-sm`}>
                             <div className="pl-4 text-gray-400"><Shield size={20}/></div>
                             <input 
                                type="text" 
                                value={code}
                                onChange={e => setCode(e.target.value)}
                                placeholder="请输入验证码"
                                className="w-full bg-transparent h-14 pl-3 pr-4 outline-none font-bold text-gray-800 placeholder:font-medium placeholder:text-gray-300" 
                             />
                        </div>
                        <button 
                            type="button"
                            onClick={handleGetCode}
                            disabled={countdown > 0}
                            className={`h-14 px-5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all active:scale-95 ${countdown > 0 ? 'bg-gray-100 text-gray-400' : `${theme.lightBg} ${theme.color}`}`}
                        >
                            {countdown > 0 ? `${countdown}s` : '获取验证码'}
                        </button>
                    </div>
                </div>

                <div className="flex items-center space-x-2 pt-2 px-1">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors cursor-pointer ${theme.bg}`}>
                        <Check size={12} className="text-white" strokeWidth={4} />
                    </div>
                    <span className="text-xs text-gray-400 leading-none pt-0.5">
                        我已阅读并同意 <span onClick={() => setAgreementType('terms')} className="text-gray-800 font-bold cursor-pointer hover:underline">《用户协议》</span> 与 <span onClick={() => setAgreementType('privacy')} className="text-gray-800 font-bold cursor-pointer hover:underline">《隐私政策》</span>
                    </span>
                </div>

                <div className="space-y-6">
                    <button 
                        type="submit"
                        className={`w-full h-14 rounded-2xl font-bold text-lg text-white shadow-lg ${theme.shadow} bg-gradient-to-r ${theme.gradient} active:scale-[0.98] transition-all flex items-center justify-center`}
                    >
                        立即登录
                    </button>

                    <div className="pt-2">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="h-px flex-1 bg-slate-100"></div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">第三方登录</span>
                            <div className="h-px flex-1 bg-slate-100"></div>
                        </div>
                        <div className="flex justify-between items-center px-2">
                            <button type="button" onClick={() => alert('唤起微信...')} className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center active:scale-90 transition-transform">
                                <WeChatIcon />
                            </button>
                            <button type="button" onClick={() => alert('唤起支付宝...')} className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center active:scale-90 transition-transform">
                                <AlipayIcon />
                            </button>
                            <button type="button" onClick={() => alert('手机快捷登录...')} className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center active:scale-90 transition-transform">
                                <PhoneIcon />
                            </button>
                            <button type="button" onClick={() => alert('唤起Apple ID...')} className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center active:scale-90 transition-transform">
                                <AppleIcon />
                            </button>
                            <button type="button" onClick={() => alert('唤起QQ...')} className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center active:scale-90 transition-transform">
                                <QQIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            <div className="mt-auto pb-safe pt-8">
                 <div className="text-center">
                     <button 
                        onClick={handleDemoLogin} 
                        className="py-3 px-6 text-gray-400 text-xs font-medium hover:text-gray-600 transition-colors bg-gray-50 rounded-full active:scale-95"
                     >
                        — 试用演示账号 —
                     </button>
                 </div>
            </div>
        </div>

        {agreementType && <AgreementModal type={agreementType} onClose={() => setAgreementType(null)} />}
    </div>
  )
}
