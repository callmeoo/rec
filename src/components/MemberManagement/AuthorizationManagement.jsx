import React, { useState } from 'react';
import { ShieldCheck, Search, Users, ExternalLink, Info, X, ChevronRight, ChevronLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

const AuthorizationManagement = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [view, setView] = useState('dashboard'); // 'dashboard' or 'detail'
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [showShortageWarning, setShowShortageWarning] = useState(false);

    // Mock Data
    const totalAuthCount = 10;
    const [authorizedMembers, setAuthorizedMembers] = useState([
        { id: 1, name: 'jiatian', department: '二级部门', phone: '18237292260' },
        { id: 2, name: '王羿', department: '二级部门', phone: '15336853007' },
        { id: 3, name: '杏仁', department: '二级部门', phone: '15089825010' },
    ]);

    const allMembers = [
        { id: 1, name: 'jiatian', department: '二级部门', phone: '18237292260' },
        { id: 2, name: '王羿', department: '二级部门', phone: '15336853007' },
        { id: 3, name: '杏仁', department: '二级部门', phone: '15089825010' },
        { id: 4, name: '陈诚', department: '二级部门', phone: '13812345678' },
        { id: 5, name: '张伟', department: '二级部门', phone: '13987654321' },
        { id: 6, name: '李静', department: '二级部门', phone: '13700001111' },
        { id: 7, name: '赵强', department: '二级部门', phone: '13622223333' },
        { id: 8, name: '何芳', department: '二级部门', phone: '13544445555' },
        { id: 9, name: '孙楠', department: '二级部门', phone: '13466667777' },
        { id: 10, name: '郭峰', department: '二级部门', phone: '13388889999' },
        { id: 11, name: '刘洋', department: '二级部门', phone: '13200000000' },
        { id: 12, name: '吴磊', department: '二级部门', phone: '13111112222' },
    ];

    const availableAuths = [
        { id: 1, count: 5, expiry: '2026-12-31' },
        { id: 2, count: 5, expiry: '2025-06-30' },
    ];

    const [tempSelectedMembers, setTempSelectedMembers] = useState([]);

    const handleOpenConfig = () => {
        setTempSelectedMembers(authorizedMembers.map(m => m.id));
        setShowConfigModal(true);
    };

    const handleConfirmConfig = () => {
        const selectedMembers = allMembers.filter(m => tempSelectedMembers.includes(m.id));
        setAuthorizedMembers(selectedMembers);

        // Per requirement: even if overflow, we save it.
        // The dashboard or card will show the warning.
        setShowConfigModal(false);
        setShowShortageWarning(false);
    };

    const handlePurchase = () => {
        console.log('Redirecting to official website payment page...');
        alert('正在跳转官网支付页面...\n支持资源点付费或扫码支付');
    };

    if (view === 'detail') {
        return (
            <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-300">
                <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setView('dashboard')}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <h3 className="text-lg font-bold text-slate-900 border-l pl-4 border-slate-200">授权详情</h3>
                    </div>
                </div>
                <div className="flex-1 p-8 overflow-auto">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6">
                            <h4 className="text-xl font-bold text-slate-900">当前已拥有的授权</h4>
                            <p className="text-sm text-slate-500 mt-1">查看授权数量及过期时间</p>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                                        <th className="px-8 py-5">授权数量</th>
                                        <th className="px-8 py-5 text-right">过期时间</th>
                                        <th className="px-8 py-5 text-right">当前状态</th>
                                        <th className="px-8 py-5 text-right">操作</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {availableAuths.map((auth, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mr-4">
                                                        <ShieldCheck size={20} />
                                                    </div>
                                                    <span className="text-xl font-bold text-slate-800">{auth.count} <span className="text-sm font-normal text-slate-500 ml-1">个授权</span></span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right font-medium text-slate-600">
                                                {auth.expiry}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className={clsx(
                                                    "inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold",
                                                    idx === 1 ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"
                                                )}>
                                                    {idx === 1 ? '即将到期' : '生效中'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button
                                                    onClick={handlePurchase}
                                                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm hover:underline"
                                                >
                                                    前往续期
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const isOverflow = authorizedMembers.length > totalAuthCount;

    return (
        <div className="flex flex-col h-full bg-slate-50 overflow-hidden animate-in fade-in duration-300">
            {/* Header / Stats Panel */}
            <div className="p-6 bg-white border-b border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <div className={clsx(
                        "p-5 rounded-2xl border shadow-sm relative overflow-hidden group transition-all",
                        isOverflow ? "bg-red-50 border-red-100" : "bg-emerald-50 border-emerald-100"
                    )}>
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            {isOverflow ? <AlertCircle size={80} className="text-red-500" /> : <ShieldCheck size={80} className="text-emerald-500" />}
                        </div>
                        <div className="relative z-10">
                            <div className={clsx(
                                "text-sm font-medium mb-1 flex items-center",
                                isOverflow ? "text-red-600" : "text-emerald-600"
                            )}>
                                当前团队已激活授权人数
                            </div>
                            <div className="flex items-baseline space-x-2">
                                <span className={clsx(
                                    "text-4xl font-bold",
                                    isOverflow ? "text-red-700" : "text-emerald-700"
                                )}>{Math.min(authorizedMembers.length, totalAuthCount)}</span>
                                <span className={clsx(
                                    "text-lg font-medium",
                                    isOverflow ? "text-red-600/60" : "text-emerald-600/60"
                                )}>/ {totalAuthCount}</span>
                            </div>
                        </div>

                        {isOverflow && (
                            <div className="mt-4 pt-4 border-t border-red-100 relative z-10 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex items-start">
                                    <AlertCircle className="text-red-500 mr-2 flex-shrink-0 mt-0.5" size={16} />
                                    <div className="flex-1">
                                        <p className="text-xs text-red-700 leading-relaxed font-medium">
                                            授权数不足，当前有 {authorizedMembers.length - totalAuthCount} 名成员无法正常使用。可前往购买授权，让更多成员加入持续成长的队伍。
                                        </p>
                                        <button
                                            onClick={handlePurchase}
                                            className="mt-2 text-xs font-bold text-red-800 border-b border-red-800 flex items-center hover:opacity-70 transition-opacity"
                                        >
                                            前往购买授权
                                            <ChevronRight size={14} className="ml-1" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div
                        onClick={() => setView('detail')}
                        className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="text-slate-500 text-sm font-medium mb-1">当前可用授权数</div>
                                <div className="text-3xl font-bold text-slate-800">{totalAuthCount - authorizedMembers.length}</div>
                            </div>
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <ChevronRight size={20} />
                            </div>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center">
                            点击查看明细列表
                            <ChevronRight size={12} className="ml-1" />
                        </div>
                    </div>

                    <div className="flex items-center justify-center">
                        <button
                            onClick={handlePurchase}
                            className="w-full h-fit py-3.5 px-6 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-[0.98]"
                        >
                            <span className="text-base mr-2">购买授权</span>
                            <Plus size={16} />
                        </button>
                    </div>
                </div>

                {/* Member Allocation Section */}
                <div className="flex-1 p-6 overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">成员授权分配</h3>
                            <p className="text-sm text-slate-500">管理已分配授权的团队成员</p>
                        </div>
                        <button
                            onClick={handleOpenConfig}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center"
                        >
                            <ShieldCheck size={16} className="mr-2 text-blue-600" />
                            配置授权
                        </button>
                    </div>

                    {/* Authorized List */}
                    <div className="bg-white rounded-xl border border-slate-200 flex-1 flex flex-col overflow-hidden shadow-sm">
                        <div className="overflow-auto flex-1">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                                        <th className="px-6 py-4 border-b border-slate-100">成员姓名</th>
                                        <th className="px-6 py-4 border-b border-slate-100">部门</th>
                                        <th className="px-6 py-4 border-b border-slate-100">手机号</th>
                                        <th className="px-6 py-4 border-b border-slate-100 w-32">状态</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {authorizedMembers.map((member, idx) => (
                                        <tr key={member.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4 border-b border-slate-100 font-medium text-slate-800">
                                                {member.name}
                                            </td>
                                            <td className="px-6 py-4 border-b border-slate-100 text-slate-600">
                                                {member.department}
                                            </td>
                                            <td className="px-6 py-4 border-b border-slate-100 text-slate-600 font-mono">
                                                {member.phone}
                                            </td>
                                            <td className="px-6 py-4 border-b border-slate-100">
                                                {idx < totalAuthCount ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                        <CheckCircle2 size={12} className="mr-1" />
                                                        授权生效中
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                        <AlertCircle size={12} className="mr-1" />
                                                        授权待购
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {authorizedMembers.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-20 text-center text-slate-400">
                                                <div className="flex flex-col items-center">
                                                    <Users size={48} className="mb-3 opacity-20" />
                                                    <p>暂无已授权成员</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>


                {/* Configuration Modal */}
                {showConfigModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col h-[80vh] animate-in slide-in-from-bottom-4 duration-300">
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">配置授权面板</h3>
                                    <p className="text-xs text-slate-500">已选 {tempSelectedMembers.length} 名成员</p>
                                </div>
                                <button onClick={() => { setShowConfigModal(false); setShowShortageWarning(false); }} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                    <X size={20} className="text-slate-500" />
                                </button>
                            </div>

                            <div className="p-6 flex-1 overflow-hidden flex flex-col">
                                {/* Search */}
                                <div className="relative mb-6">
                                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="搜索成员姓名、手机号..."
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                {/* Member Selection List */}
                                <div className="flex-1 overflow-auto border border-slate-100 rounded-xl">
                                    <div className="grid grid-cols-1 divide-y divide-slate-100">
                                        {allMembers.filter(m =>
                                            m.name.includes(searchQuery) || m.phone.includes(searchQuery)
                                        ).map(member => (
                                            <div
                                                key={member.id}
                                                onClick={() => {
                                                    setTempSelectedMembers(prev =>
                                                        prev.includes(member.id)
                                                            ? prev.filter(id => id !== member.id)
                                                            : [...prev, member.id]
                                                    );
                                                }}
                                                className={clsx(
                                                    "p-4 flex items-center justify-between cursor-pointer transition-colors hover:bg-slate-50",
                                                    tempSelectedMembers.includes(member.id) && "bg-blue-50/50"
                                                )}
                                            >
                                                <div className="flex items-center">
                                                    <div className={clsx(
                                                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mr-4",
                                                        tempSelectedMembers.includes(member.id) ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                                                    )}>
                                                        {member.name[0]}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-800">{member.name}</div>
                                                        <div className="text-xs text-slate-500">{member.department} · {member.phone}</div>
                                                    </div>
                                                </div>
                                                <div className={clsx(
                                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                                    tempSelectedMembers.includes(member.id)
                                                        ? "bg-blue-600 border-blue-600 text-white"
                                                        : "border-slate-200 bg-white"
                                                )}>
                                                    {tempSelectedMembers.includes(member.id) && <Check size={14} strokeWidth={3} />}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Shortage Warning */}
                                {showShortageWarning && (
                                    <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-start animate-in slide-in-from-top-2">
                                        <AlertCircle className="text-orange-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-orange-800">授权数不足</h4>
                                            <p className="text-xs text-orange-700 mt-1 leading-relaxed">
                                                当前已选人数超出授权上限，有 {tempSelectedMembers.length - totalAuthCount} 名成员无法正常使用。可前往购买授权，让更多成员加入持续成长的队伍。
                                            </p>
                                            <button
                                                onClick={handlePurchase}
                                                className="mt-3 text-sm font-bold text-orange-900 border-b border-orange-900 flex items-center hover:opacity-70 transition-opacity"
                                            >
                                                前往购买授权
                                                <ChevronRight size={14} className="ml-1" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                                <button
                                    onClick={() => { setShowConfigModal(false); setShowShortageWarning(false); }}
                                    className="px-6 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
                                >
                                    取消
                                </button>
                                <button
                                    onClick={handleConfirmConfig}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-md shadow-blue-200 transition-all active:scale-95"
                                >
                                    确认应用
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper components
const Plus = ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const Check = ({ size = 20, className = "", strokeWidth = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

export default AuthorizationManagement;
