import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';

const DashboardLayout = ({ children, activeTab, setActiveTab }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg"
            >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar - Desktop */}
            <div className="hidden lg:block">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            {/* Sidebar - Mobile */}
            {mobileMenuOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    {/* Sidebar */}
                    <div className="lg:hidden fixed inset-y-0 left-0 z-40 w-64">
                        <Sidebar 
                            activeTab={activeTab} 
                            setActiveTab={(tab) => {
                                setActiveTab(tab);
                                setMobileMenuOpen(false);
                            }} 
                        />
                    </div>
                </>
            )}

            <main className="flex-1 h-full overflow-hidden relative">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
