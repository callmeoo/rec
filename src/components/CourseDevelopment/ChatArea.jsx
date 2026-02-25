import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, FileText, MessageSquarePlus, History } from 'lucide-react';
import { clsx } from 'clsx';

const ChatArea = ({ messages = [], onSendMessage, disabled, onOptimizationDecision, onNewChat, history = [] }) => {
    const [input, setInput] = useState('');
    const [showHistory, setShowHistory] = useState(false);
    const messagesEndRef = useRef(null);
    const historyRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (historyRef.current && !historyRef.current.contains(event.target)) {
                setShowHistory(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        onSendMessage(input);
        setInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="h-full flex flex-col bg-white border-l border-slate-200">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <Bot size={18} className="text-blue-600" />
                    </div>
                    <span className="font-medium text-slate-700">AI 课程顾问</span>
                </div>
                <div className="flex items-center space-x-1">
                    <div className="relative" ref={historyRef}>
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            disabled={history.length < 2}
                            className={clsx(
                                "p-2 rounded-lg transition-colors",
                                history.length < 2
                                    ? "text-slate-300 cursor-not-allowed"
                                    : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                            )}
                            title="历史记录"
                        >
                            <History size={20} />
                        </button>

                        {showHistory && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-10">
                                <div className="px-3 py-2 text-xs font-medium text-slate-400 border-b border-slate-50">
                                    历史对话
                                </div>
                                {history.map((item) => (
                                    <button
                                        key={item.id}
                                        className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 truncate transition-colors"
                                        onClick={() => setShowHistory(false)}
                                    >
                                        {item.title}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={onNewChat}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="新建对话"
                    >
                        <MessageSquarePlus size={20} />
                    </button>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50">
                {messages.map((msg, index) => (
                    <div key={index} className={clsx("flex items-start mb-4", msg.role === 'user' ? "flex-row-reverse" : "")}>
                        <div className={clsx(
                            "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1",
                            msg.role === 'user' ? "bg-slate-200 ml-3" : "bg-blue-100 mr-3"
                        )}>
                            {msg.role === 'user' ? (
                                <div className="text-xs font-bold text-slate-600">U</div>
                            ) : (
                                <Bot size={16} className="text-blue-600" />
                            )}
                        </div>

                        <div className={clsx(
                            "p-3 rounded-2xl shadow-sm border max-w-[85%]",
                            msg.role === 'user'
                                ? "bg-blue-600 text-white rounded-tr-none border-blue-600"
                                : "bg-white text-slate-700 rounded-tl-none border-slate-100"
                        )}>
                            {msg.type === 'file-card' ? (
                                <div className="flex items-center p-2 bg-white/10 rounded border border-white/20">
                                    <FileText size={20} className="mr-2" />
                                    <span className="font-medium text-sm">{msg.content}</span>
                                </div>
                            ) : msg.type === 'optimization-card' ? (
                                <div className="space-y-3">
                                    <p className="text-sm font-medium text-slate-900">变更已完成，确认是否采纳？</p>
                                    <div className="text-xs bg-slate-50 p-2 rounded border border-slate-200 text-slate-500">
                                        <div className="line-through mb-1 text-red-400">{msg.original}</div>
                                        <div className="text-green-600">{msg.proposed}</div>
                                    </div>
                                    <div className="flex space-x-2 pt-1">
                                        <button
                                            onClick={() => onOptimizationDecision('accept')}
                                            className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                                        >
                                            接受
                                        </button>
                                        <button
                                            onClick={() => onOptimizationDecision('reject')}
                                            className="flex-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs rounded hover:bg-slate-50 transition-colors"
                                        >
                                            拒绝
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-100 bg-white">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={disabled ? "AI 正在生成中..." : "输入您的想法..."}
                        disabled={disabled}
                        className={clsx(
                            "w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm",
                            disabled && "opacity-50 cursor-not-allowed"
                        )}
                    />
                    <button
                        onClick={handleSend}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!input.trim() || disabled}
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatArea;
