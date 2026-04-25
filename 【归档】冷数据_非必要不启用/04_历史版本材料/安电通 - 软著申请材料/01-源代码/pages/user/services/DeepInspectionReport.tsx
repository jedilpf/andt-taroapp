
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const DeepInspectionReport = () => {
    const navigate = useNavigate();
    const { orderId } = useParams<{ orderId: string }>();

    // Detailed Mock Data (Simulating the HTML template data)
    const data = {
        reportNo: `ER-${new Date().getFullYear()}-${orderId?.slice(-4) || '0108-886'}`,
        date: new Date().toLocaleDateString(),
        score: 82,
        checkPoints: 13,
        hazards: 2,
        owner: { name: "李安全", phone: "138****8888", address: "上海市浦东新区张江路88号 智慧公寓 3-601" },
        system: { year: "2015年", type: "单相三线制 (TN-S系统)", inlet: "10mm² (铜芯)", mainSwitch: "C63A (2P)" },
        distributionBox: [
            { item: "L-N 电压稳定性", std: "220V ±10%", val: "224.5 V", result: "合格", memo: "电压稳定" },
            { item: "L-PE 电源极性", std: "火零地正确", val: "正常", result: "合格", memo: "左零右火" },
            { item: "漏电(RCD)动作电流", std: "≤ 30mA", val: "22 mA", result: "合格", memo: "灵敏度正常" },
            { item: "漏电(RCD)动作时间", std: "≤ 0.1s", val: "0.04 s", result: "合格", memo: "响应迅速" },
            { item: "主回路端子温度", std: "温升 ≤ 30K", val: "48.5 °C", result: "不合格", memo: "螺丝松动/虚接", highlight: true },
        ],
        circuits: [
            { id: "Z1", area: "全屋照明", spec: "2.5mm² / C16", ins: "> 500", imp: "0.45", result: "✔ 优", status: "pass" },
            { id: "Z2", area: "客厅插座", spec: "2.5mm² / C20", ins: "480", imp: "0.52", result: "✔ 优", status: "pass" },
            { id: "Z3", area: "厨房插座", spec: "4.0mm² / C25", ins: "120", imp: "0.38", result: "⚠ 良", status: "warn" },
            { id: "Z4", area: "次卧插座", spec: "2.5mm² / C20", ins: "> 500", imp: "∞ (断路)", result: "❌ 故障", status: "fail", highlight: true },
            { id: "Z5", area: "卫生间热水器", spec: "4.0mm² / C25", ins: "550", imp: "0.35", result: "✔ 优", status: "pass" },
        ],
        defects: [
            { id: "01", level: "严重", desc: "配电箱过热：主空开下口L相温度达48.5°C，存在烧毁风险。", action: "1. 断电操作。\n2. 清理氧化层，重新紧固。\n3. 通电后复测温度。", time: "0.5 小时" },
            { id: "02", level: "严重", desc: "接地失效：Z4回路(次卧)地线阻抗无穷大，插座面板内未连接地线。", action: "1. 拆开次卧插座面板。\n2. 检查是否有地线遗漏未接或中间断裂。\n3. 恢复接地连接。", time: "1.0 小时" },
            { id: "03", level: "一般", desc: "标识不清：强电箱内各回路未粘贴对应的区域标签。", action: "建议补充粘贴回路标签（如：厨房、空调等），便于后期维护。", time: "0.2 小时" },
        ]
    };

    return (
        <div className="h-full overflow-y-auto bg-slate-100 flex flex-col relative w-full">
            <style>{`
                :root {
                    --primary-color: #0056b3;
                    --danger-color: #d9534f;
                    --warning-color: #f0ad4e;
                    --success-color: #5cb85c;
                    --border-color: #dee2e6;
                    --bg-gray: #f8f9fa;
                }

                .report-body {
                    font-family: "Microsoft YaHei", "SimHei", sans-serif;
                    color: #333;
                    line-height: 1.4;
                    max-width: 210mm;
                    width: 100%;
                    margin: 20px auto;
                    background-color: #fff;
                    padding: 20mm;
                    min-height: 297mm; /* A4 height */
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                }

                @media screen and (max-width: 768px) {
                    .report-body {
                        width: 100%;
                        max-width: 100%;
                        margin: 0;
                        padding: 15px;
                        min-height: auto;
                        box-shadow: none;
                    }
                }

                @media print {
                    @page { size: A4; margin: 0; }
                    body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; }
                    .no-print { display: none !important; }
                    .report-body { padding: 15mm; max-width: none; width: 100%; margin: 0; box-shadow: none; min-height: auto; }
                }

                .report-header {
                    border-bottom: 2px solid var(--primary-color);
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    flex-wrap: wrap;
                }
                
                .report-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
                .report-table th, .report-table td { border: 1px solid var(--border-color); padding: 8px 10px; text-align: left; }
                .report-table th { background-color: var(--bg-gray); font-weight: bold; color: #444; white-space: nowrap; }
                
                .status-badge { padding: 2px 6px; border-radius: 4px; color: #fff; font-size: 11px; display: inline-block; white-space: nowrap; }
                .bg-pass { background-color: var(--success-color); }
                .bg-fail { background-color: var(--danger-color); }
                .bg-warn { background-color: var(--warning-color); }

                .dashboard {
                    display: flex; gap: 15px; margin-bottom: 25px; padding: 15px;
                    background-color: #f0f7ff; border: 1px solid #cce5ff; border-radius: 6px;
                    flex-wrap: wrap;
                }
                .score-box { flex: 1; min-width: 80px; text-align: center; border-right: 1px solid #dcdcdc; }
                .score-box:last-child { border-right: none; }
                .score-num { font-size: 24px; font-weight: bold; color: var(--primary-color); display: block; }
                @media (min-width: 768px) { .score-num { font-size: 32px; } }

                .report-h2 { font-size: 16px; border-left: 5px solid var(--primary-color); padding-left: 10px; margin-top: 30px; margin-bottom: 10px; background-color: #eee; padding: 5px 10px; font-weight: bold; }
                
                .table-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; margin-bottom: 20px; }
            `}</style>

            {/* Top Bar for Web View */}
            <div className="no-print sticky top-0 bg-slate-800 text-white p-4 flex justify-between items-center z-50 shadow-md shrink-0">
                <button onClick={() => navigate(-1)} className="hover:text-gray-300 font-bold flex items-center">
                    <span className="mr-1">←</span> 返回
                </button>
                <span className="font-bold text-sm md:text-base truncate px-2">A4 深度检测报告预览</span>
                <button
                    onClick={() => window.print()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded font-bold transition-colors flex items-center text-xs md:text-sm shrink-0"
                >
                    🖨️ 打印 / 导出
                </button>
            </div>

            <div className="flex-1 w-full">
                <div className="report-body">
                    <header className="report-header">
                        <div className="text-xl md:text-2xl font-bold text-[#0056b3] mb-2 md:mb-0">
                            ⚡ 安电通 <span style={{ fontSize: '14px', color: '#666', fontWeight: 'normal' }}>| 智慧用电检测专家</span>
                        </div>
                        <div className="text-right text-xs text-[#666]">
                            <div>报告编号：{data.reportNo}</div>
                            <div>检测日期：{data.date}</div>
                            <div>校验码：AD-9921-XQ</div>
                        </div>
                    </header>

                    <section>
                        <div className="dashboard">
                            <div className="score-box">
                                <span className="score-num">{data.score}</span>
                                <span className="text-xs text-[#666]">安全综合评分</span>
                            </div>
                            <div className="score-box">
                                <span className="score-num" style={{ color: '#f0ad4e' }}>需关注</span>
                                <span className="text-xs text-[#666]">系统整体状态</span>
                            </div>
                            <div className="score-box">
                                <span className="score-num">{data.checkPoints}</span>
                                <span className="text-xs text-[#666]">检测点位总数</span>
                            </div>
                            <div className="score-box">
                                <span className="score-num" style={{ color: '#d9534f' }}>{data.hazards}</span>
                                <span className="text-xs text-[#666]">发现隐患数</span>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="report-h2">一、 基础信息 (Basic Information)</div>
                        <div className="table-wrapper">
                            <table className="report-table">
                                <tbody>
                                    <tr>
                                        <th style={{ width: '15%' }}>业主姓名</th>
                                        <td style={{ width: '35%' }}>{data.owner.name}</td>
                                        <th style={{ width: '15%' }}>联系电话</th>
                                        <td style={{ width: '35%' }}>{data.owner.phone}</td>
                                    </tr>
                                    <tr>
                                        <th>房屋地址</th>
                                        <td colSpan={3}>{data.owner.address}</td>
                                    </tr>
                                    <tr>
                                        <th>建筑年代</th>
                                        <td>{data.system.year}</td>
                                        <th>供电制式</th>
                                        <td>{data.system.type}</td>
                                    </tr>
                                    <tr>
                                        <th>入户线径</th>
                                        <td>{data.system.inlet}</td>
                                        <th>主空开规格</th>
                                        <td>{data.system.mainSwitch}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <div className="report-h2">二、 配电箱深度检测 (Distribution Board)</div>
                        <p className="text-xs text-[#666] mb-1">*检测环境温度：22°C | 相对湿度：45%</p>

                        <div className="table-wrapper">
                            <table className="report-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '25%' }}>检测项目</th>
                                        <th style={{ width: '20%' }}>参考标准</th>
                                        <th style={{ width: '20%' }}>实测数据</th>
                                        <th style={{ width: '15%' }}>结果</th>
                                        <th style={{ width: '20%' }}>备注</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.distributionBox.map((row, idx) => (
                                        <tr key={idx}>
                                            <td>{row.item}</td>
                                            <td>{row.std}</td>
                                            <td style={row.highlight ? { color: 'red', fontWeight: 'bold' } : {}}>{row.val}</td>
                                            <td className="text-center">
                                                <span className={`status-badge ${row.result === '合格' ? 'bg-pass' : 'bg-fail'}`}>{row.result}</span>
                                            </td>
                                            <td>{row.memo}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="border border-[#eee] p-3">
                            <h3 className="text-sm text-[#555] font-bold mb-2">📷 热成像异常点记录</h3>
                            <div className="flex gap-3 mt-1 flex-wrap">
                                <div className="w-[120px] h-[90px] bg-[#eee] border border-dashed border-[#999] flex items-center justify-center text-[10px] text-[#888] flex-col text-center">
                                    <span>[热成像图]</span>
                                    <span>配电箱主线发热</span>
                                </div>
                                <div className="w-[120px] h-[90px] bg-[#eee] border border-dashed border-[#999] flex items-center justify-center text-[10px] text-[#888] flex-col text-center">
                                    <span>[可见光图]</span>
                                    <span>对应实物位置</span>
                                </div>
                                <div className="text-xs ml-0 md:ml-3 text-[#666] flex-1 min-w-[200px]">
                                    <p><strong>分析：</strong> 主断路器出线端L相接触电阻过大。</p>
                                    <p><strong>建议：</strong> 立即使用力矩扳手紧固，必要时更换线鼻。</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="report-h2">三、 绝缘与阻抗详细数据 (Circuit Details)</div>
                        <div className="table-wrapper">
                            <table className="report-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '10%' }}>回路</th>
                                        <th style={{ width: '20%' }}>功能区域</th>
                                        <th style={{ width: '15%' }}>线径/保护</th>
                                        <th style={{ width: '15%' }}>绝缘阻值(MΩ)</th>
                                        <th style={{ width: '15%' }}>回路阻抗(Ω)</th>
                                        <th style={{ width: '15%' }}>判定</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.circuits.map((row, idx) => (
                                        <tr key={idx} style={row.highlight ? { backgroundColor: '#fff0f0' } : {}}>
                                            <td>{row.id}</td>
                                            <td>{row.area}</td>
                                            <td>{row.spec}</td>
                                            <td>{row.ins}</td>
                                            <td style={row.highlight ? { color: 'red' } : {}}>{row.imp}</td>
                                            <td className="text-center">
                                                <span className={`status-badge ${row.status === 'pass' ? 'bg-pass' : row.status === 'warn' ? 'bg-warn' : 'bg-fail'}`}>
                                                    {row.result}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <div className="break-before-page"></div>

                    <section>
                        <div className="report-h2">四、 隐患清单与整改建议 (Defect List)</div>
                        <div className="table-wrapper">
                            <table className="report-table" style={{ border: '2px solid var(--danger-color)' }}>
                                <thead style={{ backgroundColor: '#fff5f5' }}>
                                    <tr>
                                        <th style={{ width: '5%' }}>ID</th>
                                        <th style={{ width: '10%' }}>等级</th>
                                        <th style={{ width: '35%' }}>隐患描述</th>
                                        <th style={{ width: '35%' }}>整改建议 (Action Required)</th>
                                        <th style={{ width: '15%' }}>预估工时</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.defects.map((d, idx) => (
                                        <tr key={idx}>
                                            <td>{d.id}</td>
                                            <td><span className={`status-badge ${d.level === '严重' ? 'bg-fail' : 'bg-warn'}`}>{d.level}</span></td>
                                            <td>
                                                <div dangerouslySetInnerHTML={{ __html: d.desc.replace('\n', '<br/>') }}></div>
                                            </td>
                                            <td>
                                                <div className="whitespace-pre-line">{d.action}</div>
                                            </td>
                                            <td>{d.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="mt-10">
                        <div className="border border-dashed border-[#999] p-4 text-[11px] text-[#555] bg-[#fcfcfc]">
                            <strong>免责声明：</strong>
                            本报告仅反映检测当日（{data.date}）在现有环境条件下可见部分及可测数据的电气安全状况。对于墙体内暗敷管线的物理破损、非法私拉乱接等隐蔽工程，本报告基于仪器数据进行推断，不能完全代替破坏性检查。建议业主每 2 年进行一次复检。
                        </div>

                        <table className="mt-10 border-0 w-full no-border-table">
                            <tbody className="border-0">
                                <tr className="border-0">
                                    <td className="border-0 w-1/2 pt-10 align-top">
                                        <div className="border-b border-black w-full md:w-[200px] mb-1"></div>
                                        <strong>检测工程师 (签字)</strong><br />
                                        <span className="text-xs text-gray-500">证书编号: ELE-CN-20250901</span>
                                    </td>
                                    <td className="border-0 w-1/2 text-right pt-10 align-top">
                                        <div className="inline-block text-left">
                                            <div className="border-b border-black w-full md:w-[200px] mb-1"></div>
                                            <strong>业主确认 (签字)</strong><br />
                                            <span className="text-xs text-gray-500">确认收到整改建议</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    <footer className="text-center mt-12 text-[10px] text-[#999] border-t border-[#eee] pt-2">
                        技术支持：安电通 (Andiantong) 智慧电力安全云平台 | 官网：www.andiantong.com | 客服热线：400-888-ASAP
                    </footer>
                </div>
            </div>
        </div>
    );
};
