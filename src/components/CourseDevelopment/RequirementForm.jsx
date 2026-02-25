import React, { useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';

const RequirementForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        goal: '',
        audience: '',
        language: '中文',
        materials: null,
        content: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.goal || !formData.audience || !formData.language) {
            alert('请填写所有必填项');
            return;
        }
        onSubmit(formData);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, materials: file });
        }
    };

    return (
        <div className="h-full flex flex-col bg-white">
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-slate-800">培训需求表单</h2>
                        <p className="text-slate-500 text-sm">请填写以下信息，我们将为您生成定制化的培训课程</p>
                    </div>

                    <form id="req-form" onSubmit={handleSubmit} className="space-y-6">
                        {/* 1. 培训目标 */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">
                                1. 培训目标 <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={formData.goal}
                                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                                placeholder="请填写培训后预期达到的目标"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[100px] resize-y"
                            />
                        </div>

                        {/* 2. 培训对象 */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">
                                2. 培训对象 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.audience}
                                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                                placeholder="请描述培训对象的特征，如岗位、年龄分布等"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>

                        {/* 3. 培训语言 */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">
                                3. 培训语言 <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.language}
                                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
                            >
                                <option value="中文">中文</option>
                                <option value="英文">英文</option>
                            </select>
                        </div>

                        {/* 4. 培训课程相关支持材料 */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">
                                4. 培训课程相关支持材料 <span className="text-red-500">*</span>
                            </label>
                            <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer relative group">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center justify-center text-center">
                                    {formData.materials ? (
                                        <>
                                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-3">
                                                <FileText size={24} />
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">{formData.materials.name}</span>
                                            <span className="text-xs text-slate-500 mt-1">点击更换文件</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                <Upload size={24} />
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">点击上传文件</span>
                                            <span className="text-xs text-slate-500 mt-1">支持 Word, PDF, PPT 等格式</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 5. 培训内容 */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">
                                5. 培训内容
                            </label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="其他要备注的培训内容"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[100px] resize-y"
                            />
                        </div>
                    </form>
                </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-white flex justify-end">
                <button
                    type="submit"
                    form="req-form"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors shadow-sm"
                >
                    提交需求
                </button>
            </div>
        </div>
    );
};

export default RequirementForm;
