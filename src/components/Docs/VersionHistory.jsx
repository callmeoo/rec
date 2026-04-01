import React from 'react';
import { FileText } from 'lucide-react';

const VersionHistory = () => {
  const versions = [
    {
      version: 'v1.0.0',
      date: '2026.1.28',
      author: '袁丽娟',
      description: '文档创建'
    }
  ];

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="text-blue-600" size={28} />
          版本说明
        </h1>
        <p className="text-sm text-slate-500 mt-1">修订记录</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">一、修订记录</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-700">版本号</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-700">修订日期</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-700">修订人</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-slate-700">修订说明</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {versions.map((v, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{v.version}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{v.date}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{v.author}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{v.description}</td>
                  </tr>
                ))}
                {/* 空行占位 */}
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-400">&nbsp;</td>
                  <td className="px-6 py-4 text-sm text-slate-400"></td>
                  <td className="px-6 py-4 text-sm text-slate-400"></td>
                  <td className="px-6 py-4 text-sm text-slate-400"></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-400">&nbsp;</td>
                  <td className="px-6 py-4 text-sm text-slate-400"></td>
                  <td className="px-6 py-4 text-sm text-slate-400"></td>
                  <td className="px-6 py-4 text-sm text-slate-400"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VersionHistory;
