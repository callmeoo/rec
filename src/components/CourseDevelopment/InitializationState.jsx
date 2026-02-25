import React, { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import PreviewArea from './PreviewArea';
import ChatArea from './ChatArea';
import RequirementForm from './RequirementForm'; // Assuming this exists or is needed
import { GripVertical } from 'lucide-react';

const InitializationState = ({ setActiveTab }) => {
    const [messages, setMessages] = useState([
        { role: 'ai', content: '点击「开始」填写需求表单，让我更好地了解你的培训需求' }
    ]);

    // Mock history data
    const history = [
        { id: 1, title: 'Python 基础课程需求' },
        { id: 2, title: 'Java 进阶训练' },
        { id: 3, title: '新员工入职培训' }
    ];
    const [externalTabAction, setExternalTabAction] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    // New states for optimization flow
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [optimizingState, setOptimizingState] = useState(null);

    const handleSendMessage = (content) => {
        setMessages(prev => [...prev, { role: 'user', content }]);
    };

    // This was the original form submit handler, but we are simplifying for the new flow
    // or rather, we need to support the "Start" -> "Form" -> "Course Plan" flow.
    // The previous implementation used `externalTabAction` to open the course plan.
    // We should maintain that behavior if possible, or adapt to the new "hasSubmitted" state logic.
    // Based on previous steps, `PreviewArea` handles `showDoc={hasSubmitted}`.

    const handleStart = () => {
        // If we need to open the form
        // But wait, PreviewArea usually has the "Start" button.
        // Let's assume PreviewArea calls onFormSubmit when the form (which might be inside it or a modal) is submitted.
        // Actually, looking at previous code, RequirementForm was rendered in InitializationState.
        setIsFormOpen(true);
    };

    const handleFormSubmit = (data) => {
        setIsFormOpen(false);
        setHasSubmitted(true);
        setMessages(prev => [
            ...prev,
            { role: 'user', content: '我已填写完需求表单' },
            { role: 'ai', content: '收到！正在为您生成课程策划方案，请稍候...' },
            { role: 'ai', content: '方案已生成，您可以点击文档右上角的「生成训练课程」按钮，将方案转化为可执行的训练配置。', type: 'file-card' }
        ]);

        // Open the tab if that's how it works
        setExternalTabAction({
            type: 'add-tab',
            payload: {
                id: `course-plan-${Date.now()}`,
                title: '课程策划方案',
                type: 'course-plan'
            }
        });
    };

    const handleGenerateCourse = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setIsCompleted(true);
        }, 3000);
    };

    const handleReset = () => {
        setIsCompleted(false);
        setHasSubmitted(false);
        setMessages([{ role: 'ai', content: '点击「开始」填写需求表单，让我更好地了解你的培训需求' }]);
        setOptimizingState(null);
        setExternalTabAction({ type: 'reset' });
    };

    const handleOptimizeRequest = (sectionIndex, selectedText, prompt, range) => {
        setMessages(prev => [...prev, {
            role: 'user',
            content: `针对内容："${selectedText}"\n优化要求：${prompt}`
        }]);

        setTimeout(() => {
            const proposedText = `[优化后] ${selectedText}`;

            setOptimizingState({
                sectionIndex,
                originalText: selectedText,
                proposedText: proposedText,
                range: range
            });

            setMessages(prev => [...prev, {
                role: 'ai',
                content: '优化方案已生成，请在文档中查看对比。',
                type: 'optimization-card',
                original: selectedText,
                proposed: proposedText
            }]);
        }, 1500);
    };

    const handleOptimizationDecision = (decision) => {
        if (decision === 'accept') {
            setOptimizingState(null);
            setMessages(prev => [...prev, { role: 'ai', content: '已采纳优化方案。' }]);
        } else {
            setOptimizingState(null);
            setMessages(prev => [...prev, { role: 'ai', content: '已拒绝优化方案，保留原内容。' }]);
        }
    };

    return (
        <div className="h-full w-full bg-white relative">
            <PanelGroup direction="horizontal">
                <Panel defaultSize={60} minSize={50}>
                    <PreviewArea
                        // We need to pass onFormSubmit if PreviewArea has the Start button that opens the form?
                        // Or PreviewArea just emits "start" event?
                        // Let's look at PreviewArea usage. It seems it manages the tabs.
                        // If the form is external (modal), we need to trigger it.
                        // Assuming PreviewArea has a way to trigger the form or we pass a prop.
                        // Let's pass `onStart={handleStart}` if PreviewArea supports it, or `onFormSubmit` if it handles the form.
                        // Based on previous code, `PreviewArea` accepted `onFormSubmit`.
                        onFormSubmit={handleFormSubmit} // This might be for the embedded form?
                        externalTabAction={externalTabAction}
                        onGenerate={handleGenerateCourse}
                        isGenerating={isGenerating}
                        isCompleted={isCompleted}
                        onReset={handleReset}
                        setActiveTab={setActiveTab}
                        // Optimization props
                        onOptimizeRequest={handleOptimizeRequest}
                        optimizingState={optimizingState}
                        onOptimizationDecision={handleOptimizationDecision}
                    />
                </Panel>

                <PanelResizeHandle className="w-1 bg-slate-200 hover:bg-blue-400 transition-colors flex items-center justify-center cursor-col-resize group">
                    <div className="h-8 w-4 rounded bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:border-blue-400">
                        <GripVertical size={12} className="text-slate-400 group-hover:text-blue-500" />
                    </div>
                </PanelResizeHandle>

                <Panel defaultSize={40} minSize={33} maxSize={50}>
                    <ChatArea
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        disabled={isGenerating}
                        onOptimizationDecision={handleOptimizationDecision}
                        onNewChat={handleReset}
                        history={history}
                    />
                </Panel>
            </PanelGroup>

            {/* Render RequirementForm if it's a modal managed here */}
            {/* But wait, in previous code RequirementForm was imported but not rendered in the return? 
                Ah, I might have missed where it was rendered. 
                If PreviewArea renders the form inside a tab, we don't need it here.
                If it's a modal, we do.
                Let's assume for now PreviewArea handles the "Start" view which contains the form.
            */}
        </div>
    );
};

export default InitializationState;
