
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Brain, ScanLine, ChevronLeft, ArrowRight, Zap, Camera, Loader2, ShieldAlert, CheckCircle2, RotateCcw, Wrench } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { OrderStatus } from '../../../types';

type ExperienceStep = 'intro' | 'camera' | 'scanning' | 'result';

export const AIDiagnosisIntroPage = () => {
  const navigate = useNavigate();
  const { createOrder, currentUser } = useApp();
  const [step, setStep] = useState<ExperienceStep>('intro');
  const [scanProgress, setScanProgress] = useState(0);
  const [scanText, setScanText] = useState('初始化神经元网络...');

  // 模拟扫描过程的文本变化
  useEffect(() => {
    if (step === 'scanning') {
      const texts = [
        '正在分析图像元数据...',
        '识别设备型号：施耐德 iC65N...',
        '检测到接线端子过热异常 (85°C)...',
        '匹配百万级故障案例库...',
        '正在生成专业维修方案...'
      ];
      let textIdx = 0;
      
      const timer = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => setStep('result'), 500);
            return 100;
          }
          if (prev % 20 === 0 && textIdx < texts.length) {
            setScanText(texts[textIdx]);
            textIdx++;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(timer);
    }
  }, [step]);

  const handleStartExperience = () => setStep('camera');
  const handleCapture = () => setStep('scanning');
  const handleRestart = () => {
    setStep('intro');
    setScanProgress(0);
  };

  const handleBookRepair = () => {
    if (!currentUser) return;
    createOrder({
        type: 'Repair',
        title: 'AI 诊断转预约 - 漏保过热',
        description: 'AI 模拟诊断结果：检测到配电箱 1P 漏保开关端子发热异常，建议现场加固及更换。',
        priceEstimate: { min: 50, max: 120 },
        location: currentUser.location,
        status: OrderStatus.PENDING,
        scheduledTime: '尽快'
    });
    navigate('/user/orders');
  };

  return (
    <div className="h-full w-full bg-slate-950 relative overflow-hidden flex flex-col">
      {/* 背景光效 (通用) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-20%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-20%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* 步骤 1: 介绍页 (原有的) */}
      {step === 'intro' && (
        <div className="flex-1 flex flex-col animate-fade-in relative z-10">
          <div className="p-4 flex justify-between items-center mt-2">
            <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full text-white flex items-center justify-center border border-white/5"><ChevronLeft size={24} /></button>
            <div className="flex items-center space-x-2"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span><span className="text-white/60 text-xs font-mono tracking-wider">ONLINE</span></div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center -mt-10">
            <div className="relative mb-12 group">
                <div className="absolute inset-0 bg-indigo-500 blur-[50px] opacity-40 duration-1000"></div>
                <div className="w-40 h-40 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[3rem] flex items-center justify-center shadow-2xl relative z-10 animate-[bounce_3s_infinite]">
                    <Brain size={80} className="text-white" strokeWidth={1.5} />
                    <div className="absolute -top-3 -right-3 bg-white text-indigo-600 text-[10px] font-black px-3 py-1 rounded-full shadow-lg transform rotate-12 border-2 border-indigo-100">BETA</div>
                </div>
            </div>

            <h1 className="text-4xl font-black text-white mb-4 tracking-tight leading-tight">AI 智能<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">故障诊断专家</span></h1>
            <p className="text-indigo-200/80 text-sm mb-10 font-medium max-w-[80%] leading-relaxed">融合百万级维修案例库，<br/>拍照或描述，<span className="text-white font-bold border-b border-white/30 pb-0.5">10秒</span> 生成专业维修方案。</p>

            <div className="w-full grid grid-cols-2 gap-3 mb-8">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex flex-col items-center">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-3 text-blue-400"><ScanLine size={20} /></div>
                    <h3 className="text-white font-bold text-sm">拍照识别</h3>
                    <p className="text-white/40 text-[10px] mt-1">精准识别设备型号</p>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex flex-col items-center">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-3 text-purple-400"><Zap size={20} /></div>
                    <h3 className="text-white font-bold text-sm">秒级分析</h3>
                    <p className="text-white/40 text-[10px] mt-1">实时生成诊断报告</p>
                </div>
            </div>
          </div>

          <div className="p-6 pb-10 bg-gradient-to-t from-slate-950 to-transparent">
            <button onClick={handleStartExperience} className="w-full py-4 bg-white text-indigo-950 rounded-2xl font-black text-lg shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] active:scale-[0.98] transition-all flex items-center justify-center">
                立即开始体验 <ArrowRight size={20} className="ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* 步骤 2: 虚拟相机拍摄 */}
      {step === 'camera' && (
        <div className="flex-1 flex flex-col animate-fade-in relative z-10 bg-black">
          {/* 取景框 */}
          <div className="flex-1 relative flex flex-col items-center justify-center">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-70"></div>
             
             {/* 扫描辅助线 */}
             <div className="relative w-64 h-64 border-2 border-white/30 rounded-3xl overflow-hidden">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-500 rounded-tl-xl"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-500 rounded-tr-xl"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-500 rounded-bl-xl"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-500 rounded-br-xl"></div>
                
                {/* 移动的扫描线 */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-indigo-400 shadow-[0_0_15px_#6366f1] animate-[scan_2s_linear_infinite]"></div>
             </div>
             
             <p className="mt-8 text-white/80 font-black text-sm tracking-widest bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">请对准配电箱或故障点</p>
          </div>

          {/* 相机控制栏 */}
          <div className="h-40 bg-black p-6 flex items-center justify-around shrink-0 border-t border-white/5">
             <button onClick={() => setStep('intro')} className="text-white/60 flex flex-col items-center"><RotateCcw size={24} className="mb-1"/><span className="text-[10px]">取消</span></button>
             <button 
                onClick={handleCapture}
                className="w-20 h-20 bg-white rounded-full flex items-center justify-center p-1.5 active:scale-90 transition-transform"
             >
                <div className="w-full h-full rounded-full border-4 border-black bg-white flex items-center justify-center">
                    <Camera size={32} className="text-black" />
                </div>
             </button>
             <button className="text-white/60 flex flex-col items-center opacity-40"><Zap size={24} className="mb-1"/><span className="text-[10px]">自动</span></button>
          </div>
        </div>
      )}

      {/* 步骤 3: 扫描分析中 */}
      {step === 'scanning' && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 animate-fade-in relative z-10">
            <div className="relative mb-12">
                {/* 旋转的圆环 */}
                <div className="w-48 h-48 rounded-full border-4 border-white/5 border-t-indigo-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Brain size={48} className="text-indigo-400 animate-pulse" />
                </div>
                {/* 进度数值 */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-2xl font-black text-white">{scanProgress}%</div>
            </div>
            
            <div className="text-center space-y-4">
                <h3 className="text-xl font-bold text-white tracking-wide">AI 正在深度分析中</h3>
                <div className="flex flex-col items-center space-y-2">
                    <div className="flex items-center text-indigo-300 text-sm font-mono">
                        <Loader2 size={16} className="animate-spin mr-2" />
                        {scanText}
                    </div>
                </div>
            </div>

            {/* 模拟代码流 */}
            <div className="mt-12 w-full max-w-xs bg-black/40 rounded-xl p-4 font-mono text-[10px] text-green-500/60 h-32 overflow-hidden border border-white/5">
                 <div className="animate-[scroll-up_5s_linear_infinite]">
                    {">"} DEVICE_SCAN: ACTIVE<br/>
                    {">"} DETECTING_HARDWARE: Schneider_MCB_63A<br/>
                    {">"} THERMAL_ANALYSIS: ABNORMAL_DETECTION<br/>
                    {">"} TEMPERATURE: 84.6 C (CRITICAL)<br/>
                    {">"} FAILURE_PATTERN: TERMINAL_LOOSE<br/>
                    {">"} KNOWLEDGE_BASE_LOOKUP: SUCCESS<br/>
                    {">"} GENERATING_REPORT...<br/>
                    {">"} RISK_LEVEL: HIGH<br/>
                    {">"} RECOMMEND_SERVICE: EMERGENCY_REPAIR
                 </div>
            </div>
        </div>
      )}

      {/* 步骤 4: 诊断报告展示 */}
      {step === 'result' && (
        <div className="flex-1 flex flex-col p-6 animate-slide-up relative z-10 overflow-y-auto no-scrollbar pb-32">
             <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-6 mb-6 text-center">
                <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/30">
                    <ShieldAlert size={36} className="text-white animate-pulse" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">存在重大火灾隐患</h2>
                <p className="text-red-300 text-sm font-medium">检测到配电箱主控回路接线松动并伴随异常高温</p>
             </div>

             <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <h3 className="text-white font-bold mb-3 flex items-center text-sm"><CheckCircle2 size={16} className="mr-2 text-indigo-400"/> 诊断详情</h3>
                    <ul className="space-y-3 text-xs text-indigo-100/70">
                        <li className="flex justify-between"><span>设备型号</span><span className="text-white font-mono">施耐德 iC65N 1P+N</span></li>
                        <li className="flex justify-between"><span>检测温度</span><span className="text-red-400 font-bold">85.4°C</span></li>
                        <li className="flex justify-between"><span>故障特征</span><span className="text-white">端子压线不实，电弧打火</span></li>
                    </ul>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <h3 className="text-white font-bold mb-3 flex items-center text-sm"><Wrench size={16} className="mr-2 text-green-400"/> 建议方案</h3>
                    <p className="text-xs text-white/60 leading-relaxed mb-4">需专业电工携带扭矩螺丝批，对全屋配电箱端子进行紧固。若发现导线绝缘层碳化，需截断并重新接线或更换漏保开关。</p>
                    <div className="flex items-center space-x-2 text-[10px] text-green-400 font-bold bg-green-500/10 px-3 py-1.5 rounded-lg w-fit">
                        <Zap size={10} className="fill-current"/> 平台匹配该型号备品充足
                    </div>
                </div>
             </div>

             {/* 固定底栏 */}
             <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent flex gap-4">
                <button onClick={handleRestart} className="flex-1 py-4 bg-white/10 backdrop-blur-md text-white rounded-2xl font-bold flex items-center justify-center border border-white/10 active:scale-95 transition-transform">
                    <RotateCcw size={18} className="mr-2" /> 重新诊断
                </button>
                <button onClick={handleBookRepair} className="flex-[2] py-4 bg-red-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-red-500/20 active:scale-95 transition-transform flex items-center justify-center group overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    立即预约整改
                </button>
             </div>
        </div>
      )}

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(256px); }
        }
        @keyframes scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-80%); }
        }
      `}</style>
    </div>
  );
};
