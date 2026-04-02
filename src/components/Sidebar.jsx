import React, { useState } from 'react';
import { Users, BookOpen, Settings, BarChart2, ChevronLeft, ChevronRight, Database, ExternalLink, TrendingUp, Car, FileText, Info } from 'lucide-react';
import { clsx } from 'clsx';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState({});

    const menuItems = [
        {
            icon: FileText,
            label: '版本说明'
        },
        {
            icon: TrendingUp,
            label: '为您推荐',
            subItems: ['为您推荐（PC端）', '为您推荐（移动端）']
        },
        {
            icon: Info,
            label: '功能说明',
            subItems: ['目标和数据基础', '推荐策略', '埋点', '可配置参数', '发布策略']
        },
        {
            icon: BarChart2,
            label: '推荐管理',
            subItems: ['推荐算法验证', '平台周转排行', '推荐数据看板']
        }
    ];

    // Auto-expand menu if active tab is a sub-item
    React.useEffect(() => {
        const parent = menuItems.find(item => item.subItems?.includes(activeTab));
        if (parent) {
            setExpandedMenus(prev => ({ ...prev, [parent.label]: true }));
        } else if (menuItems.some(item => item.label === activeTab && item.subItems)) {
            // If activeTab matches a parent label (e.g. from "Go to Course Config"), expand it
            setExpandedMenus(prev => ({ ...prev, [activeTab]: true }));
        }
    }, [activeTab]);

    const toggleMenu = (label) => {
        setExpandedMenus(prev => ({ ...prev, [label]: !prev[label] }));
    };

    const handleItemClick = (item) => {
        if (item.subItems) {
            toggleMenu(item.label);
        } else {
            setActiveTab(item.label);
        }
    };

    return (
        <div
            className={clsx(
                "h-full bg-slate-900 flex flex-col transition-all duration-300 relative",
                collapsed ? "w-16" : "w-64"
            )}
        >
            {/* Logo Area */}
            <div className="h-16 flex items-center justify-center border-b border-slate-800">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Car className="text-white" size={20} />
                </div>
                {!collapsed && (
                    <span className="ml-3 text-white font-semibold text-lg">二手车拍卖</span>
                )}
            </div>

            {/* Navigation Items */}
            <div className="flex-1 py-6 space-y-2 overflow-y-auto">
                {menuItems.map((item, index) => {
                    const isActive = activeTab === item.label || item.subItems?.includes(activeTab);
                    const isExpanded = expandedMenus[item.label];

                    return (
                        <div key={index}>
                            <div
                                onClick={() => handleItemClick(item)}
                                className={clsx(
                                    "flex items-center px-4 py-3 cursor-pointer transition-colors relative",
                                    isActive && !item.subItems
                                        ? "bg-blue-600 text-white"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                )}
                            >
                                <item.icon size={20} className={clsx("flex-shrink-0", isActive && "text-white")} />
                                {!collapsed && (
                                    <>
                                        <span className="ml-3 font-medium flex-1">{item.label}</span>
                                        {item.subItems && (
                                            <ChevronRight
                                                size={16}
                                                className={clsx("transition-transform", isExpanded && "rotate-90")}
                                            />
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Sub-menu */}
                            {!collapsed && item.subItems && isExpanded && (
                                <div className="bg-slate-950 py-1">
                                    {item.subItems.map((subItem, subIndex) => (
                                        <div
                                            key={subIndex}
                                            onClick={() => setActiveTab(subItem)}
                                            className={clsx(
                                                "pl-12 pr-4 py-2 text-sm cursor-pointer transition-colors",
                                                activeTab === subItem
                                                    ? "text-blue-400 bg-slate-900"
                                                    : "text-slate-500 hover:text-slate-300"
                                            )}
                                        >
                                            {subItem}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Collapse Button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute top-1/2 -right-3 transform -translate-y-1/2 p-1 bg-slate-700 hover:bg-slate-600 rounded-full text-white shadow-lg z-10"
            >
                {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">
                        U
                    </div>
                    {!collapsed && (
                        <div className="ml-3 overflow-hidden">
                            <div className="text-sm font-medium truncate">User Name</div>
                            <div className="text-xs text-slate-500 truncate">Admin</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
