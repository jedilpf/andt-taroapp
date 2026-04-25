
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Zap, Activity, Home, AlertTriangle, CheckCircle, ChevronRight, RefreshCw, ThermometerSun, Wifi, Lock, Fan, Plug } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';

// --- Optimized Radar Chart ---
const RadarChart = ({ data, labels, scanning }: { data: number[], labels: string[], scanning: boolean }) => {
    const size = 220;
    const center = size / 2;
    const radius = 70;
    const total = data.length;

    const getPoint = (value: number, index: number, maxRadius: number) => {
        const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
        const r = (value / 100) * maxRadius;
        return {
            x: center + r * Math.cos(angle),
            y: center + r * Math.sin(angle)
        };
    };

    const points = data.map((val, i) => {
        const p = getPoint(val, i, radius);
        return `${p.x},${p.y}`;
    }).join(' ');

    const gridLevels = [33, 66, 100];
    
    return (
        <div className="relative flex items-center justify-center w-full h-[240px]">
            {/* Scanning Effect */}
            {scanning && (
                 <div className="absolute inset-0 flex items-center justify-center z-0">
                     <div className="w-[200px] h-[200px] rounded-full border border-emerald-400/30 animate-[ping_2s_linear_infinite]"></div>
                     <div className="w-[160px] h-[160px] rounded-full border border-emerald-400/50 animate-[ping_2s_linear_infinite_0.5s]"></div>
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent animate-[spin_3s_linear_infinite]"></div>
                 </div>
            )}

            <svg width={size} height={size} className="relative z-10 overflow-visible">
                {/* Grid Lines */}
                {gridLevels.map((level, i) => (
                    <polygon 
                        key={i} 
                        points={Array.from({ length: total }).map((_, j) => {
                            const p = getPoint(level, j, radius);
                            return `${p.x},${p.y}`;
                        }).join(' ')}
                        fill="none" 
                        stroke="rgba(255,255,255,0.2)" 
                        strokeWidth="1" 
                        strokeDasharray="4 4"
                    />
                ))}

                {/* Axis Lines */}
                {Array.from({ length: total }).map((_, i) => {
                    const p = getPoint(100, i, radius);
                    return (
                        <line 
                            key={i} 
                            x1={center} y1={center} 
                            x2={p.x} y2={p.y} 
                            stroke="rgba(255,255,255,0.1)" 
                            strokeWidth="1" 
                        />
                    );
                })}

                {/* Data Polygon */}
                <polygon 
                    points={points} 
                    fill="rgba(52, 211, 153, 0.3)" 
                    stroke="#34d399" 
                    strokeWidth="2"
                    className="transition-all duration-1000 ease-out drop-shadow-[0_0_10px_rgba(52,211,153,0.6)]"
                />

                {/* Data Points */}
                {data.map((val, i) => {
                    const p = getPoint(val, i, radius);
                    return (
                        <circle 
                            key={i} 
                            cx={p.x} cy={p.y} 
                            r="4" 
                            fill="#10b981"
                            stroke="white"
                            strokeWidth="2"
                            className="transition-all duration-1000 ease-out"
                        />
                    );
                })}

                {/* Labels */}
                {labels.map((label, i) => {
                    const p = getPoint(125, i, radius);
                    return (
                        <text 
                            key={i} 
                            x={p.x} y={p.y} 
                            textAnchor="middle" 
                            dominantBaseline="middle" 
                            fill="white"
                            fontSize="11"
                            fontWeight="bold"
                            className="opacity-90"
                        >
                            {label}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
};

const SafetyPage = () => {
    const navigate = useNavigate();
    const { createOrder, currentUser } = useApp();
    const [scanning, setScanning] = useState(false);
    const [score, setScore] = useState(92);
    
    // Radar Data
    const labels = ['线路健康', '负载平衡', '漏电保护', '电器安全', '环境因素'];
    const [radarData, setRadarData] = useState([90, 85, 95, 88, 92]);

    // Detailed Status Items
    const [systemStatus, setSystemStatus] = useState([
        { id: 1, icon: Zap, title: '线路负载', status: 'warning', val: '85%', msg: '高峰期接近临界值' },
        { id: 2, icon: Activity, title: '漏保测试', status: 'good', val: '30ms', msg: '动作灵敏有效' },
        { id: 3, icon: ThermometerSun, title: '线缆温度', status: 'good', val: '26°C', msg: '运行温度正常' },
        { id: 4, icon: Wifi, title: '智能网关', status: 'good', val: '在线', msg: '设备连接稳定' },
    ]);

    // Room Status
    const rooms = [
        { name: '客厅', status: 'good', devices: 8 },
        { name: '厨房', status: 'warning', devices: 5 },
        { name: '主卧', status: 'good', devices: 4 },
        { name: '卫生间', status: 'good', devices: 3 },
    ];

    const startScan = () => {
        setScanning(true);
        // Simulate scan
        setTimeout(() => {
            setScanning(false);
            setScore(88); // Drop score slightly to prompt action
            setRadarData([85, 70, 95, 80, 90]);
            setSystemStatus(prev => prev.map(item => 
                item.id === 1 ? {...item, status: 'alert', msg: '负载过高，建议检查'} : item
            ));
        }, 2500);
    };

    const handleOptimize = () => {
        if (currentUser) {
            createOrder({
                type: 'Checkup',
                title: '家庭电路优化检测',
                description: '智能系统检测到负载异常，建议专业电工上门进行负载平衡及线路老化检查。',
                priceEstimate: { min: 50, max: 100 },
                location: currentUser.location,
                status: OrderStatus.PENDING,
                scheduledTime: '尽快'
            });
            navigate('/user/orders');
        }
    };

    return (
        <div className="h-full flex flex-col bg-[#F5F7FA] overflow-hidden relative">
             {/* Immersive Header Background */}
             <div className="absolute top-0 left-0 w-full h-[380px] bg-gradient-to-b from-emerald-900 via-emerald-800 to-[#F5F7FA] rounded-b-[3rem] z-0 overflow-hidden">
                 {/* Abstract Particles */}
                 <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse"></div>
                 <div className="absolute -right-20 -top-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
                 <div className="absolute -left-20 top-40 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl"></div>
             </div>

             {/* Top Nav */}
             <div className="relative z-10 p-4 flex justify-between items-center text-white">
                {/* Use navigate(-1) instead of pushing new route to prevent history loop */}
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors active:scale-95">
                    <ArrowLeft size={24}/>
                </button>
                <h1 className="text-lg font-bold tracking-wide">家庭安全中心</h1>
                <button onClick={() => navigate('/user/settings')} className="p-2 -mr-2 rounded-full hover:bg-white/10 transition-colors">
                    <Shield size={22}/>
                </button>
            </div>

            {/* Dashboard Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 pb-24">
                
                {/* 1. Score & Radar Section */}
                <div className="flex flex-col items-center mb-6">
                    <div className="relative">
                        <RadarChart data={radarData} labels={labels} scanning={scanning} />
                        
                        {/* Central Score - Floating */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
                            {!scanning && (
                                <div className="flex flex-col items-center animate-fade-in">
                                    <span className="text-5xl font-black text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)] tracking-tighter">
                                        {score}
                                    </span>
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-200 font-bold mt-1">
                                        Safety Score
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Scan Button */}
                    <button 
                        onClick={startScan}
                        disabled={scanning}
                        className={`mt-2 px-6 py-2.5 rounded-full text-sm font-bold flex items-center transition-all ${scanning ? 'bg-emerald-500/20 text-emerald-200 cursor-not-allowed' : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 active:scale-95 shadow-lg backdrop-blur-md'}`}
                    >
                        {scanning ? (
                            <><RefreshCw className="animate-spin mr-2" size={16}/> 检测中...</>
                        ) : (
                            <><RefreshCw className="mr-2" size={16}/> 重新检测</>
                        )}
                    </button>
                </div>

                {/* 2. System Status Cards */}
                <div className="px-4 mb-6">
                    <div className="grid grid-cols-2 gap-3">
                        {systemStatus.map((item) => (
                            <div key={item.id} className={`p-4 rounded-2xl border backdrop-blur-sm transition-all ${item.status === 'alert' ? 'bg-red-50/90 border-red-100' : (item.status === 'warning' ? 'bg-orange-50/90 border-orange-100' : 'bg-white border-white/50 shadow-sm')}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <div className={`p-2 rounded-xl ${item.status === 'good' ? 'bg-emerald-100 text-emerald-600' : (item.status === 'alert' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600')}`}>
                                        <item.icon size={20}/>
                                    </div>
                                    {item.status !== 'good' && <AlertTriangle size={16} className={item.status === 'alert' ? 'text-red-500' : 'text-orange-500'} />}
                                </div>
                                <h3 className="text-sm font-bold text-gray-800 mb-0.5">{item.title}</h3>
                                <div className="flex items-baseline space-x-1">
                                    <span className={`text-lg font-black ${item.status === 'good' ? 'text-gray-900' : (item.status === 'alert' ? 'text-red-600' : 'text-orange-600')}`}>{item.val}</span>
                                </div>
                                <p className={`text-[10px] mt-1 truncate ${item.status === 'good' ? 'text-gray-400' : 'text-gray-600 font-medium'}`}>{item.msg}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Room Status (New) */}
                <div className="px-4 mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-gray-800 flex items-center">
                            <Home size={18} className="mr-2 text-emerald-600"/> 分区概览
                        </h3>
                        <span className="text-xs text-gray-400">4个区域监控中</span>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <div className="divide-y divide-gray-50">
                            {rooms.map((room, i) => (
                                <div key={i} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                                    <div className="flex items-center">
                                        <div className={`w-2 h-2 rounded-full mr-3 ${room.status === 'good' ? 'bg-green-500' : 'bg-orange-500 animate-pulse'}`}></div>
                                        <span className="font-bold text-gray-800 text-sm">{room.name}</span>
                                    </div>
                                    <div className="flex items-center text-xs text-gray-400">
                                        <Plug size={12} className="mr-1"/> {room.devices}个设备
                                        {room.status === 'warning' && (
                                            <span className="ml-2 text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded font-bold">负载偏高</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 4. Action Banner */}
                <div className="px-4">
                    {score < 90 ? (
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-5 text-white shadow-lg shadow-orange-500/20 relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-center mb-2">
                                    <AlertTriangle size={20} className="mr-2"/>
                                    <h3 className="font-bold text-lg">存在安全隐患</h3>
                                </div>
                                <p className="text-white/90 text-xs mb-4 max-w-[70%]">检测到厨房负载偏高，且漏保动作有延迟风险，建议立即优化。</p>
                                <button 
                                    onClick={handleOptimize}
                                    className="bg-white text-red-600 px-5 py-2 rounded-full text-xs font-bold shadow-sm active:scale-95 transition-transform flex items-center"
                                >
                                    一键预约整改 <ChevronRight size={14} className="ml-1"/>
                                </button>
                            </div>
                            <Shield size={100} className="absolute -right-4 -bottom-6 text-white opacity-10 rotate-12"/>
                        </div>
                    ) : (
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-center mb-2">
                                    <CheckCircle size={20} className="mr-2"/>
                                    <h3 className="font-bold text-lg">家庭用电环境安全</h3>
                                </div>
                                <p className="text-white/90 text-xs">各项指标正常，请继续保持良好的用电习惯。</p>
                            </div>
                            <Shield size={100} className="absolute -right-4 -bottom-6 text-white opacity-10 rotate-12"/>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SafetyPage;
