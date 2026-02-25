import React, { useState, useEffect } from 'react';
import { Save, Cloud, CheckCircle2, Check, X } from 'lucide-react';
import { clsx } from 'clsx';

const CoursePlanDoc = ({ onGenerate, onOptimizeRequest, optimizingState, onOptimizationDecision }) => {
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState('刚刚');

    // Selection state
    const [showOptimizeBtn, setShowOptimizeBtn] = useState(false);
    const [btnPosition, setBtnPosition] = useState({ top: 0, left: 0 });
    const [selectedText, setSelectedText] = useState('');
    const [selectedSectionIndex, setSelectedSectionIndex] = useState(null);
    const [showPromptInput, setShowPromptInput] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [selectedRange, setSelectedRange] = useState({ start: 0, end: 0 });

    const [sections, setSections] = useState([
        {
            title: '一、课程划分依据',
            content: '根据电销新人培训文档，课程旨在快速提升新员工的电销基础技能与业务理解。考虑到学员多为90后，课程设计注重互动性与实战演练，将培训划分为基础理论、话术演练、抗压训练三个阶段。'
        },
        {
            title: '二、训练场景设计',
            content: '1. **初次接触场景**：模拟客户首次接听电话，目标是建立信任，获取客户基础信息。\n2. **产品介绍场景**：针对客户痛点进行产品价值传递，目标是激发客户兴趣。\n3. **异议处理场景**：模拟客户提出价格、竞品等异议，目标是消除顾虑，推进成交。\n4. **成交缔结场景**：识别成交信号，引导客户下单。'
        },
        {
            title: '三、AI陪练教练人设',
            content: '**角色**：资深电销经理（严厉但专业）\n**性格**：直截了当，注重效率，对细节要求严格。\n**对话风格**：模拟真实客户的刁钻提问，在复盘时给出针见血的点评。'
        },
        {
            title: '四、评分标准',
            content: '- **开场白（20%）**：语音语调是否亲切，是否清晰表明身份与目的。\n- **需求挖掘（30%）**：提问是否精准，能否引导客户多说。\n- **产品匹配（30%）**：推荐的产品卖点是否对应客户需求。\n- **异议处理（20%）**：面对拒绝是否从容，逻辑是否清晰。'
        },
        {
            title: '五、AI答疑教练人设',
            content: '**角色**：贴心的业务百科助手\n**性格**：耐心、细致、鼓励型。\n**功能**：随时解答关于产品知识、销售流程、系统操作等问题，提供话术建议。'
        }
    ]);

    // Simulated auto-save
    useEffect(() => {
        const interval = setInterval(() => {
            setSaving(true);
            setTimeout(() => {
                setSaving(false);
                setLastSaved('刚刚');
            }, 1000);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    // Handle text selection
    useEffect(() => {
        const handleSelection = (e) => {
            // If clicking inside the optimization UI, don't clear selection
            if (e.target.closest('.optimize-ui-element')) {
                return;
            }

            const selection = window.getSelection();

            // If we have a selection, check if it's valid
            if (selection.rangeCount && !selection.isCollapsed) {
                const text = selection.toString().trim();
                if (text) {
                    // Find which section is selected
                    let node = selection.anchorNode;
                    let sectionIndex = -1;

                    // Traverse up to find the section container
                    while (node && node !== document.body) {
                        if (node.dataset && node.dataset.sectionIndex !== undefined) {
                            sectionIndex = parseInt(node.dataset.sectionIndex);
                            break;
                        }
                        node = node.parentNode;
                    }

                    if (sectionIndex !== -1) {
                        const range = selection.getRangeAt(0);
                        const rect = range.getBoundingClientRect();

                        setBtnPosition({
                            top: rect.bottom + window.scrollY + 10,
                            left: rect.right + window.scrollX - 20
                        });
                        setSelectedText(text);
                        setSelectedSectionIndex(sectionIndex);
                        setSelectedRange({ start: range.startOffset, end: range.endOffset });
                        setShowOptimizeBtn(true);
                        return; // Keep selection
                    }
                }
            }

            setShowOptimizeBtn(false);
            setShowPromptInput(false);
        };

        document.addEventListener('mouseup', handleSelection);
        return () => document.removeEventListener('mouseup', handleSelection);
    }, []);

    const handleOptimizeClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowOptimizeBtn(false);
        setShowPromptInput(true);
    };

    const handlePromptSubmit = () => {
        if (!prompt.trim()) return;
        onOptimizeRequest(selectedSectionIndex, selectedText, prompt, selectedRange);
        setShowPromptInput(false);
        setPrompt('');
        // Clear selection
        window.getSelection().removeAllRanges();
    };

    const handleLocalDecision = (decision) => {
        if (decision === 'accept' && optimizingState) {
            const { sectionIndex, proposedText, range } = optimizingState;
            setSections(prev => prev.map((section, idx) => {
                if (idx === sectionIndex) {
                    const pre = section.content.slice(0, range.start);
                    const post = section.content.slice(range.end);
                    return {
                        ...section,
                        content: pre + proposedText + post
                    };
                }
                return section;
            }));
        }
        // If reject, we just clear the state, which onOptimizationDecision does.
        onOptimizationDecision(decision);
    };



    return (
        <div className="h-full flex flex-col bg-slate-50 relative">
            {/* Toolbar */}
            <div className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
                <div className="flex items-center text-sm text-slate-500">
                    <span className="font-medium text-slate-700 mr-4">课程策划方案.docx</span>
                    {saving ? (
                        <span className="flex items-center text-blue-600">
                            <Cloud size={14} className="mr-1 animate-pulse" />
                            保存中...
                        </span>
                    ) : (
                        <span className="flex items-center text-slate-400">
                            <CheckCircle2 size={14} className="mr-1" />
                            已保存 ({lastSaved})
                        </span>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    <button className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded transition-colors">
                        导出 PDF
                    </button>
                    <button
                        onClick={onGenerate}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors flex items-center"
                    >
                        <Save size={14} className="mr-1" />
                        生成训练课程
                    </button>
                </div>
            </div>

            {/* Document Content */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto bg-white shadow-sm border border-slate-200 min-h-[800px] p-12 relative">
                    <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">电销新人培训课程策划方案</h1>

                    <div className="space-y-8">
                        {sections.map((section, index) => (
                            <div key={index} className="group relative">
                                <h2 className="text-lg font-bold text-slate-800 mb-3 select-none border-l-4 border-blue-600 pl-3">
                                    {section.title}
                                </h2>
                                <div
                                    data-section-index={index}
                                    contentEditable={optimizingState?.sectionIndex !== index}
                                    suppressContentEditableWarning
                                    className="text-slate-600 leading-relaxed p-2 -ml-2 rounded hover:bg-slate-50 focus:bg-blue-50/30 focus:outline-none transition-colors whitespace-pre-wrap"
                                >
                                    {optimizingState?.sectionIndex === index ? (
                                        <>
                                            <span className="bg-red-100 text-red-600 line-through decoration-red-400 mr-1">
                                                {optimizingState.original}
                                            </span>
                                            <span className="bg-green-100 text-green-600 font-medium">
                                                {optimizingState.proposed}
                                            </span>
                                            {/* Render rest of content if needed, but for simplicity we assume full replacement or we'd need complex logic to split string. 
                                                For this demo, let's assume we replace the *entire* section content for the diff view if it matches, 
                                                OR we just show the diff of the selected part. 
                                                To keep it simple and robust for the demo: 
                                                We will display the *entire* section content, but replace the *selected part* with the diff.
                                                However, we don't have the full original content easily here without props.
                                                Let's assume optimizingState contains the FULL content with the diff applied for display purposes?
                                                Actually, the requirement says: "更改后内容插入在原内容后并绿色高亮，原文档内容红色高亮".
                                                Let's try to reconstruct the view.
                                            */}
                                            {/* 
                                                Use slicing based on optimizingState.range to show context
                                            */}
                                            {section.content.slice(0, optimizingState.range?.start || 0)}
                                            <span className="group/diff relative inline-block mx-1">
                                                <span className="bg-red-100 text-red-600 line-through decoration-red-400">
                                                    {optimizingState.originalText}
                                                </span>

                                                {/* Floating Actions for Deletion */}
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-md border border-slate-200 p-1 flex items-center space-x-1 opacity-0 group-hover/diff:opacity-100 transition-opacity z-10 pointer-events-none group-hover/diff:pointer-events-auto min-w-max">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleLocalDecision('accept');
                                                        }}
                                                        className="px-2 py-0.5 hover:bg-green-100 text-green-600 rounded text-xs font-medium transition-colors"
                                                        title="接受删除"
                                                    >
                                                        接受
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleLocalDecision('reject');
                                                        }}
                                                        className="px-2 py-0.5 hover:bg-red-100 text-red-600 rounded text-xs font-medium transition-colors"
                                                        title="拒绝删除"
                                                    >
                                                        拒绝
                                                    </button>
                                                </div>
                                            </span>

                                            <span className="group/diff relative inline-block">
                                                <span className="bg-green-100 text-green-600 font-medium">
                                                    {optimizingState.proposedText}
                                                </span>

                                                {/* Floating Actions for Insertion */}
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-md border border-slate-200 p-1 flex items-center space-x-1 opacity-0 group-hover/diff:opacity-100 transition-opacity z-10 pointer-events-none group-hover/diff:pointer-events-auto min-w-max">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleLocalDecision('accept');
                                                        }}
                                                        className="px-2 py-0.5 hover:bg-green-100 text-green-600 rounded text-xs font-medium transition-colors"
                                                        title="接受修改"
                                                    >
                                                        接受
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleLocalDecision('reject');
                                                        }}
                                                        className="px-2 py-0.5 hover:bg-red-100 text-red-600 rounded text-xs font-medium transition-colors"
                                                        title="拒绝修改"
                                                    >
                                                        拒绝
                                                    </button>
                                                </div>
                                            </span>
                                            {section.content.slice(optimizingState.range?.end || section.content.length)}
                                        </>
                                    ) : (
                                        section.content
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Floating Optimize Button */}
            {showOptimizeBtn && (
                <button
                    style={{ top: btnPosition.top, left: btnPosition.left }}
                    onClick={handleOptimizeClick}
                    className="optimize-ui-element fixed z-50 bg-blue-600 text-white px-3 py-1.5 rounded-full shadow-lg flex items-center text-xs font-medium hover:bg-blue-700 transition-transform hover:scale-105 animate-in fade-in zoom-in duration-200"
                >
                    <Cloud size={12} className="mr-1" />
                    智能优化
                </button>
            )}

            {/* Prompt Input Popover */}
            {showPromptInput && (
                <div
                    className="optimize-ui-element fixed z-50 bg-white rounded-lg shadow-xl border border-slate-200 p-3 w-80 animate-in fade-in zoom-in duration-200"
                    style={{ top: btnPosition.top, left: btnPosition.left }}
                >
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="请输入优化指令，例如：让语气更专业..."
                        className="w-full text-sm border border-slate-200 rounded p-2 mb-2 focus:outline-none focus:border-blue-500 resize-none h-20"
                        autoFocus
                    />
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => setShowPromptInput(false)}
                            className="px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 rounded"
                        >
                            取消
                        </button>
                        <button
                            onClick={handlePromptSubmit}
                            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            发送
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoursePlanDoc;
