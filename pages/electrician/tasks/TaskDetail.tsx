
import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Phone, CheckCircle, MapPin, Navigation, Clock, FileText, Camera, Shield, DollarSign, Image, X, Upload, Eye } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { OrderStatus } from '../../../types';

interface UploadedPhoto {
  id: string;
  type: 'before' | 'after' | 'material' | 'video';
  url: string;
  label: string;
}

export const TaskDetail = () => {
    const { id } = useParams<{id: string}>();
    const navigate = useNavigate();
    const { orders, updateOrder } = useApp();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const allOrders = [...orders];
    const order = allOrders.find(o => o.id === id);
    const [loading, setLoading] = useState(false);
    const [showPriceInput, setShowPriceInput] = useState(false);
    const [finalPrice, setFinalPrice] = useState('');
    const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
    const [currentUploadType, setCurrentUploadType] = useState<'before' | 'after' | 'material'>('before');
    const [showUploadPanel, setShowUploadPanel] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const mockExistingPhotos: UploadedPhoto[] = [
      { id: 'p1', type: 'before', url: '', label: '服务前' },
      { id: 'p2', type: 'after', url: '', label: '服务后' },
    ];

    const displayPhotos = uploadedPhotos.length > 0 ? uploadedPhotos : mockExistingPhotos;

    const getPhotoTypeLabel = (type: 'before' | 'after' | 'material' | 'video') => {
      switch(type) {
        case 'before': return '服务前';
        case 'after': return '服务后';
        case 'material': return '配件照片';
        case 'video': return '过程视频';
        default: return '';
      }
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newPhoto: UploadedPhoto = {
            id: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: currentUploadType,
            url: event.target?.result as string,
            label: getPhotoTypeLabel(currentUploadType),
          };
          setUploadedPhotos(prev => [...prev, newPhoto]);
        };
        reader.readAsDataURL(file);
      });

      setShowUploadPanel(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removePhoto = (photoId: string) => {
      setUploadedPhotos(prev => prev.filter(p => p.id !== photoId));
    };

    if (!order) return (
        <div className="min-h-[100dvh] bg-gray-50 flex flex-col items-center justify-center">
            <FileText size={48} className="text-gray-300 mb-4"/>
            <p className="text-gray-500">订单详情加载中或不存在...</p>
            <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 font-bold">返回上一页</button>
        </div>
    );

    const steps = [
        { status: OrderStatus.ACCEPTED, label: '已接单' },
        { status: OrderStatus.ARRIVED, label: '已上门' },
        { status: OrderStatus.IN_PROGRESS, label: '施工中' },
        { status: OrderStatus.COMPLETED, label: '待支付' },
    ];

    const currentStepIndex = steps.findIndex(s => s.status === order.status);

    const handleNextStep = () => {
        if (order.status === OrderStatus.IN_PROGRESS && !showPriceInput) {
            setShowPriceInput(true);
            return;
        }

        setLoading(true);
        setTimeout(() => {
            let nextStatus = order.status;
            let updates: any = {};

            if (order.status === OrderStatus.ACCEPTED) {
                nextStatus = OrderStatus.ARRIVED;
            } else if (order.status === OrderStatus.ARRIVED) {
                nextStatus = OrderStatus.IN_PROGRESS;
            } else if (order.status === OrderStatus.IN_PROGRESS) {
                nextStatus = OrderStatus.COMPLETED;
                if (finalPrice) {
                    updates.priceEstimate = {
                        ...order.priceEstimate,
                        final: parseFloat(finalPrice)
                    };
                }
            }

            updateOrder(order.id, { status: nextStatus, ...updates });
            setLoading(false);
            if (nextStatus === OrderStatus.COMPLETED) {
                navigate(-1);
            }
        }, 800);
    };

    return (
        <div className="min-h-[100dvh] bg-gray-50 pb-24 relative z-50">
            {/* Header */}
            <div className="bg-blue-900 text-white p-4 sticky top-0 z-20 flex items-center justify-between shadow-md">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full"><ArrowLeft size={20}/></button>
                <span className="font-bold text-lg">订单详情</span>
                <button onClick={() => window.open('tel:13800000000')} className="p-2 hover:bg-white/10 rounded-full"><Phone size={20}/></button>
            </div>

            {/* Status Bar */}
            <div className="bg-white p-4 shadow-sm mb-3">
                <div className="flex justify-between items-center relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10"></div>
                    <div className="absolute top-1/2 left-0 h-0.5 bg-green-500 -z-10 transition-all duration-500" style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}></div>

                    {steps.map((step, idx) => {
                        const isCompleted = idx <= currentStepIndex;
                        return (
                            <div key={step.status} className="flex flex-col items-center bg-white px-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                                    {isCompleted ? <CheckCircle size={14}/> : idx + 1}
                                </div>
                                <span className={`text-[10px] mt-1 font-medium ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}>{step.label}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="px-4 space-y-4">
                {/* Client Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-1">{order.type === 'Repair' ? '电路急修' : order.title}</h2>
                            <div className="flex items-center text-sm text-gray-500">
                                <Clock size={14} className="mr-1"/> {order.scheduledTime}
                            </div>
                        </div>
                        <span className="text-2xl font-bold text-blue-600">¥{order.priceEstimate.final || order.priceEstimate.min}</span>
                    </div>

                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="mt-1"><MapPin size={18} className="text-blue-600"/></div>
                        <div className="flex-1">
                            <p className="font-bold text-gray-800 text-sm mb-1">{order.location.address}</p>
                            <div className="flex justify-between items-center">
                                <p className="text-xs text-gray-500">{order.clientName} (已实名)</p>
                                <button onClick={() => window.open(`https://maps.google.com?q=${encodeURIComponent(order.location.address)}`)} className="bg-white text-blue-600 border border-blue-200 px-2 py-1 rounded text-xs font-bold flex items-center shadow-sm active:bg-blue-50">
                                    <Navigation size={12} className="mr-1"/> 导航
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Price Input Area */}
                {showPriceInput && (
                    <div className="bg-white rounded-2xl p-5 shadow-lg border border-blue-100 animate-slide-up">
                        <h3 className="font-bold text-gray-800 mb-3 flex items-center"><DollarSign size={16} className="mr-2 text-green-600"/> 录入最终费用</h3>
                        <div className="bg-gray-50 rounded-xl p-2 flex items-center border border-gray-200">
                            <span className="text-lg font-bold text-gray-500 px-3">¥</span>
                            <input
                                type="number"
                                value={finalPrice}
                                onChange={(e) => setFinalPrice(e.target.value)}
                                placeholder="请输入实收金额 (含材料)"
                                className="flex-1 bg-transparent outline-none text-xl font-bold text-gray-900 h-10"
                                autoFocus
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">确认后将发送账单给用户，用户支付后资金进入余额。</p>
                    </div>
                )}

                {/* Description */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center"><FileText size={16} className="mr-2 text-gray-400"/> 故障描述</h3>
                    <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-xl">{order.description || '用户未填写详细描述，请上门后核实。'}</p>
                </div>

                {/* Service Record Photos */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800 flex items-center">
                            <Camera size={16} className="mr-2 text-gray-400"/>
                            服务记录
                        </h3>
                        {order.status === OrderStatus.IN_PROGRESS && (
                            <button
                                onClick={() => setShowUploadPanel(!showUploadPanel)}
                                className="text-xs text-blue-600 font-bold flex items-center"
                            >
                                <Upload size={12} className="mr-1"/> 上传
                            </button>
                        )}
                    </div>

                    {/* Upload Panel */}
                    {showUploadPanel && order.status === OrderStatus.IN_PROGRESS && (
                        <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
                            <p className="text-xs text-gray-500 mb-3">选择照片类型：</p>
                            <div className="flex gap-2 mb-3">
                                {(['before', 'after', 'material'] as const).map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setCurrentUploadType(type)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                                            currentUploadType === type
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white border border-gray-200 text-gray-600'
                                        }`}
                                    >
                                        {getPhotoTypeLabel(type)}
                                    </button>
                                ))}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handlePhotoUpload}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center justify-center"
                            >
                                <Camera size={14} className="mr-2"/> 选择照片
                            </button>
                        </div>
                    )}

                    {/* Photo Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        {displayPhotos.map((photo, idx) => (
                            <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group">
                                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                    <Image size={24} className="text-gray-400" />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                    <span className="text-white text-[10px] font-bold">{photo.label}</span>
                                </div>
                                {photo.url && (
                                    <button
                                        onClick={() => setPreviewImage(photo.url)}
                                        className="absolute top-1 right-1 p-1 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Eye size={12} className="text-gray-600" />
                                    </button>
                                )}
                                {uploadedPhotos.find(p => p.id === photo.id) && (
                                    <button
                                        onClick={() => removePhoto(photo.id)}
                                        className="absolute top-1 left-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} className="text-white" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                        <span className="text-[10px] text-gray-400 flex items-center">
                            <span className="w-4 h-4 rounded bg-gray-200 flex items-center justify-center mr-1 text-xs">前</span>
                            服务前照片
                        </span>
                        <span className="text-[10px] text-gray-400 flex items-center">
                            <span className="w-4 h-4 rounded bg-gray-200 flex items-center justify-center mr-1 text-xs">后</span>
                            服务后照片
                        </span>
                        <span className="text-[10px] text-gray-400 flex items-center">
                            <span className="w-4 h-4 rounded bg-gray-200 flex items-center justify-center mr-1 text-xs">配</span>
                            配件照片
                        </span>
                    </div>
                </div>

                {/* Safety Tips */}
                <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 flex items-start text-sm text-orange-800">
                    <Shield size={16} className="mr-2 mt-0.5 shrink-0"/>
                    <p>作业时请务必切断电源，规范佩戴绝缘手套。遇到高危情况请立即报备平台。</p>
                </div>
            </div>

            {/* Image Preview Modal */}
            {previewImage && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setPreviewImage(null)}>
                    <button className="absolute top-4 right-4 p-2 bg-white/20 rounded-full" onClick={() => setPreviewImage(null)}>
                        <X size={20} className="text-white"/>
                    </button>
                    <div className="w-full max-w-md mx-4">
                        <img src={previewImage} alt="Preview" className="w-full rounded-xl"/>
                    </div>
                </div>
            )}

            {/* Fixed Bottom Action */}
            {order.status !== OrderStatus.COMPLETED && order.status !== OrderStatus.PAID && order.status !== OrderStatus.CANCELLED && (
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white p-4 border-t shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-30 safe-area-bottom">
                    <button
                        onClick={handleNextStep}
                        disabled={loading || (showPriceInput && !finalPrice)}
                        className={`w-full py-3.5 rounded-xl font-bold text-lg shadow-lg active:scale-[0.98] transition-transform flex justify-center items-center disabled:opacity-70 ${showPriceInput ? 'bg-green-600 text-white shadow-green-200' : 'bg-blue-600 text-white shadow-blue-200'}`}
                    >
                        {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
                        {showPriceInput ? '确认费用并完工' : (
                            order.status === OrderStatus.ACCEPTED ? '我已到达现场' : (
                                order.status === OrderStatus.ARRIVED ? '开始施工' : '完工录入费用'
                            )
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};
