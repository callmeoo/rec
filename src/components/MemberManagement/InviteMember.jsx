import React, { useState } from 'react';
import { Search, Plus, UserPlus, Upload, ShieldCheck, MoreVertical, ChevronRight, ChevronDown, Folder } from 'lucide-react';
import { clsx } from 'clsx';

const InviteMember = ({ setActiveTab }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [view, setView] = useState('list'); // 'list' or 'add'

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        departments: [],
        phone: '',
        isAdmin: false
    });
    const [errors, setErrors] = useState({});
    const [showDeptSelector, setShowDeptSelector] = useState(false);
    const [adminLimitReached, setAdminLimitReached] = useState(false);

    // Mock Data for Members
    const [members, setMembers] = useState([
        { id: 1, name: 'jiatian', department: '二级部门', phone: '18237292260', isAdmin: false, authStatus: '未激活' },
        { id: 2, name: '王羿', department: '二级部门', phone: '15336853007', isAdmin: false, authStatus: '未激活' },
        { id: 3, name: '杏仁', department: '二级部门', phone: '15089825010', isAdmin: false, authStatus: '未激活' },
    ]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(members.map(m => m.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectMember = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleDeleteConfirm = () => {
        setMembers(prev => prev.filter(m => !selectedIds.includes(m.id)));
        setSelectedIds([]);
        setShowDeleteModal(false);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = '姓名是必填项';
        if (!formData.phone) {
            newErrors.phone = '手机号是必填项';
        } else if (!/^\d{11}$/.test(formData.phone)) {
            newErrors.phone = '请输入正确的11位手机号';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInvite = (continueAdding = false) => {
        if (!validateForm()) return;

        // Mock Admin Limit check (max 5)
        const currentAdmins = members.filter(m => m.isAdmin).length;
        if (formData.isAdmin && currentAdmins >= 5) {
            setAdminLimitReached(true);
            return;
        }

        const newMember = {
            id: Date.now(),
            name: formData.name,
            department: formData.departments.join(', ') || '二级部门',
            phone: formData.phone,
            isAdmin: formData.isAdmin,
            authStatus: '未激活'
        };

        setMembers([...members, newMember]);

        if (continueAdding) {
            setFormData({ name: '', departments: [], phone: '', isAdmin: false });
            setErrors({});
            setAdminLimitReached(false);
        } else {
            setView('list');
            setFormData({ name: '', departments: [], phone: '', isAdmin: false });
            setErrors({});
            setAdminLimitReached(false);
        }
    };

    // Mock Data for Department Tree
    const departmentTree = [
        {
            name: '杏仁有限公司',
            isOpen: true,
            children: [
                {
                    name: '二级部门',
                    isOpen: true,
                    isSelected: true,
                    children: [
                        { name: '三级部门', isOpen: false }
                    ]
                }
            ]
        }
    ];

    return (
        <div className="flex h-full bg-white relative">
            {/* Left Sidebar - Department Tree */}
            <div className="w-64 border-r border-slate-200 flex flex-col pt-4">
                <div className="px-4 mb-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="搜索成员、部门"
                            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                        <button className="absolute right-2 top-1.5 p-1 hover:bg-slate-200 rounded">
                            <Plus size={16} className="text-slate-600" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-2">
                    {departmentTree.map((dept, idx) => (
                        <div key={idx} className="space-y-1">
                            <div className="flex items-center px-2 py-1.5 text-sm hover:bg-slate-50 rounded cursor-pointer">
                                <ChevronDown size={14} className="text-slate-400 mr-1" />
                                <Folder size={16} className="text-blue-500 mr-2" />
                                <span className="text-slate-700">{dept.name}</span>
                            </div>
                            <div className="pl-4">
                                {dept.children.map((child, cIdx) => (
                                    <div key={cIdx}>
                                        <div className={clsx(
                                            "flex items-center px-2 py-1.5 text-sm rounded cursor-pointer group",
                                            child.isSelected ? "bg-blue-50 text-blue-600" : "hover:bg-slate-50 text-slate-700"
                                        )}>
                                            <ChevronDown size={14} className="text-slate-400 mr-1" />
                                            <Folder size={16} className={clsx("mr-2", child.isSelected ? "text-blue-600" : "text-blue-400")} />
                                            <span className="flex-1 font-medium">{child.name}</span>
                                            <MoreVertical size={14} className="text-slate-400 opacity-0 group-hover:opacity-100" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
                    <div className="flex items-center space-x-2 text-lg font-semibold text-slate-800">
                        <span>二级部门</span>
                        <span className="text-slate-400 font-normal">· {members.length}人</span>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="px-6 py-4 flex items-center justify-between space-x-3 bg-white">
                    <div className="flex items-center space-x-3">
                        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                            <UserPlus size={16} className="mr-2" />
                            添加成员
                        </button>
                        <button className="flex items-center px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                            <Upload size={16} className="mr-2" />
                            批量导入
                        </button>
                        <button className="flex items-center px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                            <ShieldCheck size={16} className="mr-2" />
                            为成员添加授权
                        </button>
                        <button
                            onClick={() => selectedIds.length > 0 && setShowDeleteModal(true)}
                            className={clsx(
                                "flex items-center px-4 py-2 border text-sm font-medium rounded-lg transition-colors",
                                selectedIds.length > 0
                                    ? "border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200"
                                    : "border-slate-100 text-slate-300 cursor-not-allowed"
                            )}
                        >
                            删除
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto px-6">
                    <table className="w-full text-left border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-sm font-medium">
                                <th className="px-4 py-3 border-b border-slate-200 first:rounded-tl-lg w-10">
                                    <input
                                        type="checkbox"
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        onChange={handleSelectAll}
                                        checked={members.length > 0 && selectedIds.length === members.length}
                                    />
                                </th>
                                <th className="px-4 py-3 border-b border-slate-200">姓名</th>
                                <th className="px-4 py-3 border-b border-slate-200">部门</th>
                                <th className="px-4 py-3 border-b border-slate-200">手机号</th>
                                <th className="px-4 py-3 border-b border-slate-200">是否为管理员</th>
                                <th className="px-4 py-3 border-b border-slate-200 last:rounded-tr-lg">授权状态</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {members.map((member) => (
                                <tr key={member.id} className={clsx(
                                    "hover:bg-slate-50 transition-colors group",
                                    selectedIds.includes(member.id) && "bg-blue-50/50"
                                )}>
                                    <td className="px-4 py-4 border-b border-slate-100">
                                        <input
                                            type="checkbox"
                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            checked={selectedIds.includes(member.id)}
                                            onChange={() => handleSelectMember(member.id)}
                                        />
                                    </td>
                                    <td className="px-4 py-4 border-b border-slate-100 font-medium text-slate-800">
                                        {member.name}
                                    </td>
                                    <td className="px-4 py-4 border-b border-slate-100 text-slate-600">
                                        {member.department}
                                    </td>
                                    <td className="px-4 py-4 border-b border-slate-100 text-slate-600">
                                        {member.phone}
                                    </td>
                                    <td className="px-4 py-4 border-b border-slate-100">
                                        <span className={clsx(
                                            "px-2 py-1 rounded-full text-xs font-medium",
                                            member.isAdmin ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"
                                        )}>
                                            {member.isAdmin ? '是' : '否'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 border-b border-slate-100">
                                        <span className={clsx(
                                            "px-2 py-1 rounded-full text-xs font-medium",
                                            member.authStatus === '已激活' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                                        )}>
                                            {member.authStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">确认删除</h3>
                            <p className="text-slate-600 leading-relaxed">
                                即将删除已选择的成员账号，并收回所有的授权。是否继续？
                            </p>
                        </div>
                        <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
                            >
                                确认
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InviteMember;
