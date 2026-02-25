import React, { useState, useEffect } from 'react';
import { Play, X, FileText, Plus, Loader2, CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    horizontalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import RequirementForm from './RequirementForm';
import CoursePlanDoc from './CoursePlanDoc';
import { clsx } from 'clsx';

// Sortable Tab Item Component
const SortableTab = ({ id, active, title, onClick, onClose }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={onClick}
            className={clsx(
                "group flex items-center px-4 py-2 text-sm font-medium border-r border-slate-200 cursor-pointer select-none min-w-[120px] max-w-[200px]",
                active
                    ? "bg-white text-blue-600 border-t-2 border-t-blue-600"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100 border-t-2 border-t-transparent"
            )}
        >
            <FileText size={14} className="mr-2 flex-shrink-0" />
            <span className="truncate flex-1">{title}</span>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClose(id);
                }}
                className="ml-2 p-0.5 rounded-full hover:bg-slate-200 text-slate-400 opacity-0 group-hover:opacity-100 transition-all"
            >
                <X size={12} />
            </button>
        </div>
    );
};

const PreviewArea = ({
    onStart,
    onFormSubmit,
    externalTabAction,
    onGenerate,
    isGenerating,
    isCompleted,
    onReset,
    setActiveTab,
    onOptimizeRequest,
    optimizingState,
    onOptimizationDecision
}) => {
    const [tabs, setTabs] = useState([]);
    const [activeTabId, setActiveTabId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleStart = () => {
        const newTabId = `req-form-${Date.now()}`;
        const newTab = {
            id: newTabId,
            title: '需求表单',
            type: 'requirement-form'
        };
        setTabs([...tabs, newTab]);
        setActiveTabId(newTabId);
        if (onStart) onStart();
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setTabs((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const closeTab = (id) => {
        const newTabs = tabs.filter(t => t.id !== id);
        setTabs(newTabs);
        if (activeTabId === id) {
            setActiveTabId(newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null);
        }
    };

    // Handle external actions (e.g. from Chat/InitializationState)
    useEffect(() => {
        if (externalTabAction) {
            if (externalTabAction.type === 'add-tab') {
                const newTab = externalTabAction.payload;
                setTabs(prev => [...prev, newTab]);
                setActiveTabId(newTab.id);
            } else if (externalTabAction.type === 'reset') {
                setTabs([]);
                setActiveTabId(null);
            }
        }
    }, [externalTabAction]);

    const renderContent = () => {
        if (isCompleted) {
            return (
                <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-50">
                    <div className="max-w-md text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={40} className="text-green-600" />
                        </div>
                        <h2 className="text-2xl font-semibold text-slate-800 mb-2">
                            课程已配置完成
                        </h2>
                        <p className="text-slate-500 mb-8">
                            点击前往【课程配置】可修改配置及上架到学员端
                        </p>
                        <div className="space-y-4">
                            <button
                                onClick={() => setActiveTab('课程配置')}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl flex items-center justify-center"
                            >
                                前往【课程配置】
                                <ArrowRight size={18} className="ml-2" />
                            </button>
                            <button
                                onClick={onReset}
                                className="w-full bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                            >
                                <RotateCcw size={18} className="mr-2" />
                                继续创建课程
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        if (isGenerating) {
            return (
                <div className="h-full flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-sm z-50 absolute inset-0">
                    <div className="flex flex-col items-center">
                        <Loader2 size={48} className="text-blue-600 animate-spin mb-4" />
                        <h3 className="text-lg font-medium text-slate-800">正在生成训练场景...</h3>
                        <p className="text-slate-500 text-sm mt-2">AI 正在根据您的策划方案构建课程</p>
                    </div>
                </div>
            );
        }

        if (!activeTabId) return <EmptyState onStart={handleStart} />;

        const activeTab = tabs.find(t => t.id === activeTabId);
        if (!activeTab) return <EmptyState onStart={handleStart} />;

        if (activeTab.type === 'requirement-form') {
            return <RequirementForm onSubmit={(data) => onFormSubmit(data, activeTab.id)} />;
        }

        if (activeTab.type === 'course-plan') {
            return (
                <CoursePlanDoc
                    onGenerate={onGenerate}
                    onOptimizeRequest={onOptimizeRequest}
                    optimizingState={optimizingState}
                    onOptimizationDecision={onOptimizationDecision}
                />
            );
        }

        return <div className="p-8">Unknown Tab Type</div>;
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 relative">
            {/* Tabs Header */}
            {tabs.length > 0 && !isCompleted && (
                <div className="h-10 bg-slate-100 border-b border-slate-200 flex items-end overflow-x-auto no-scrollbar">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={tabs.map(t => t.id)}
                            strategy={horizontalListSortingStrategy}
                        >
                            {tabs.map((tab) => (
                                <SortableTab
                                    key={tab.id}
                                    id={tab.id}
                                    title={tab.title}
                                    active={activeTabId === tab.id}
                                    onClick={() => setActiveTabId(tab.id)}
                                    onClose={closeTab}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative">
                {renderContent()}
            </div>
        </div>
    );
};

const EmptyState = ({ onStart }) => (
    <div className="h-full flex flex-col items-center justify-center p-8">
        <div className="max-w-md text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Play size={40} className="text-blue-600 ml-1" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">
                创建课程从填写培训需求表单开始
            </h2>
            <p className="text-slate-500 mb-8">
                我们将根据您的需求，为您量身定制AI培训课程
            </p>
            <button
                onClick={onStart}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-lg hover:shadow-xl flex items-center mx-auto"
            >
                <Play size={18} className="mr-2" />
                开始
            </button>
        </div>
    </div>
);

export default PreviewArea;
