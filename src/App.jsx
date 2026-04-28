import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Category from './pages/Category';
import PostDetail from './pages/PostDetail';
import Admin from './pages/Admin';
import PolicyPage from './pages/PolicyPage';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white relative selection:bg-blue-100 font-sans">
      <NavBar />
      <div className="flex-grow w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:categoryId" element={<Category />} />
          <Route path="/post/:slug" element={<PostDetail />} />
          <Route path="/policy/:type" element={<PolicyPage />} />
          <Route path="/secret-hub" element={<Admin />} />
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
        </div>
      </footer>
    </div>
  );
}

export default App;
