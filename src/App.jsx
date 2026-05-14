import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import VatCalculator from './pages/tools/math/VatCalculator';
import SavingsCalculator from './pages/tools/finance/SavingsCalculator';
import StockAverageCalculator from './pages/tools/finance/StockAverageCalculator';
import IncomeTaxCalculator from './pages/tools/tax/IncomeTaxCalculator';
import HealthInsuranceCalculator from './pages/tools/tax/HealthInsuranceCalculator';
import NetSalaryCalculator from './pages/tools/finance/NetSalaryCalculator';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white relative selection:bg-blue-100 font-sans">
      <NavBar />
      <div className="flex-grow w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools/vat-calc" element={<VatCalculator />} />
          <Route path="/tools/savings-calc" element={<SavingsCalculator />} />
          <Route path="/tools/stock-average-calc" element={<StockAverageCalculator />} />
          <Route path="/tools/income-tax-calc" element={<IncomeTaxCalculator />} />
          <Route path="/tools/health-insurance-calc" element={<HealthInsuranceCalculator />} />
          <Route path="/tools/net-salary-calc" element={<NetSalaryCalculator />} />
          <Route path="*" element={<div className="flex items-center justify-center min-h-[60vh] font-bold text-slate-400">404: 페이지를 찾을 수 없습니다.</div>} />
        </Routes>
      </div>
      
      {/* Global Footer */}
      <footer className="text-center py-10 md:py-16 px-4 text-sm font-medium text-slate-500 bg-slate-50 border-t border-slate-200 mt-auto w-full">
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="text-3xl mb-2">🌿</div>
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">LifeHub</h3>
        </div>
        
        {/* Trust Pages Links for AdSense */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-6 text-slate-600 font-semibold">
          <Link to="/policy/about" className="hover:text-indigo-600 transition">About Us</Link>
          <Link to="/policy/contact" className="hover:text-indigo-600 transition">Contact Us</Link>
          <Link to="/policy/privacy" className="hover:text-indigo-600 transition">Privacy Policy</Link>
          <Link to="/policy/terms" className="hover:text-indigo-600 transition">Terms of Service</Link>
        </div>

        <p>© {new Date().getFullYear()} LifeHub. 당신의 일상을 이롭게 하는 프리미엄 생활 정보 매거진.</p>
        <div className="mt-4 text-xs text-slate-400 flex items-center justify-center gap-4">
          <span>Powered by React & TailwindCSS</span>
          <span className="text-slate-200">|</span>
          <Link to="/secret-hub" className="text-slate-300 hover:text-slate-500 transition">Admin</Link>
        </div>
      </footer>
    </div>
  );
}

export default App;
