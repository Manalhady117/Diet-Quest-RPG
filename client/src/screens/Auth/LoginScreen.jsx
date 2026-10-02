import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { PixelMascot } from '../../components/Mascot/PixelMascot.jsx';
import {
  LogIn,
  UserPlus,
  Sparkles,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  X
} from 'lucide-react';

export const LoginScreen = ({ onNavigateToRegister, onLoginSuccess }) => {
  const { login, register, isLoading } = useAuth();

  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('Sir Valorous');
  const [email, setEmail] = useState('hero@dietquest.com');
  const [password, setPassword] = useState('adventure123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (authMode === 'login') {
      const res = await login(email, password);
      if (res.success) {
        if (onLoginSuccess) onLoginSuccess(res.user);
      } else {
        setErrorMsg(res.message || 'Invalid email or password. Please verify your credentials.');
      }
    } else {
      const res = await register({
        name,
        email,
        password,
        user_goal: 'weight_loss',
        diet_type: 'Balanced',
        device_sync: 'In-App Walking Quests'
      });
      if (res.success) {
        if (onLoginSuccess) onLoginSuccess(res.user);
      } else {
        setErrorMsg(res.message || 'Registration failed. Please check your details.');
      }
    }
  };

  const handleQuickDemo = async () => {
    setEmail('hero@dietquest.com');
    setPassword('adventure123');
    setErrorMsg('');
    const res = await login('hero@dietquest.com', 'adventure123');
    if (res.success && onLoginSuccess) {
      onLoginSuccess(res.user);
    }
  };

  const handleSocialLogin = (provider) => {
    // Fill demo credentials and simulate seamless social sign in
    setEmail(`adventurer_${provider.toLowerCase()}@dietquest.com`);
    setPassword('socialquest2026');
    setErrorMsg('');
    setTimeout(async () => {
      const res = await login('hero@dietquest.com', 'adventure123');
      if (res.success && onLoginSuccess) onLoginSuccess(res.user);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 selection:bg-[#8B7CFF]/20 select-none">
      {/* Main Clean Card Layout */}
      <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#8B7CFF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#4ADE80]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center mb-6 relative z-10">
          <div className="inline-block mb-2.5 p-2 bg-[#F1F5F9] rounded-2xl border border-[#E2E8F0] shadow-2xs">
            <PixelMascot state={authMode === 'login' ? 'idle' : 'celebrate'} size={64} />
          </div>
          <h1 className="font-pixel text-lg sm:text-xl text-[#0F172A] tracking-wide mb-1 font-bold">
            DIET QUEST RPG
          </h1>
          <p className="text-xs text-[#64748B] font-sans-app leading-relaxed">
            {authMode === 'login'
              ? 'Welcome back! Resume your fitness quests & macro goals.'
              : 'Forge your adventurer profile to unlock customized AI diet plans.'}
          </p>
        </div>

        {/* Seamless Tab Mode Toggle (Login vs Register) */}
        <div className="relative z-10 mb-5 p-1 bg-[#F1F5F9] rounded-2xl border border-[#E2E8F0] grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl text-xs font-pixel font-bold transition-all cursor-pointer ${
              authMode === 'login'
                ? 'bg-white text-[#0F172A] shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl text-xs font-pixel font-bold transition-all cursor-pointer ${
              authMode === 'register'
                ? 'bg-white text-[#0F172A] shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            SIGN UP
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-sans-app flex items-start gap-2 animate-in fade-in">
            <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3.5 relative z-10">
          {authMode === 'register' && (
            <div>
              <label className="block text-[11px] font-sans-app font-semibold text-slate-700 mb-1">
                Hero Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Sir Valorous"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#8B7CFF] focus:bg-white rounded-xl py-2.5 px-3.5 pl-10 text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all shadow-2xs font-sans-app"
                />
                <User size={16} className="absolute left-3.5 top-3 text-[#94A3B8]" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-sans-app font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="hero@dietquest.com"
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#8B7CFF] focus:bg-white rounded-xl py-2.5 px-3.5 pl-10 text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all shadow-2xs font-sans-app"
              />
              <Mail size={16} className="absolute left-3.5 top-3 text-[#94A3B8]" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-sans-app font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#8B7CFF] focus:bg-white rounded-xl py-2.5 px-3.5 pl-10 pr-10 text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all shadow-2xs font-sans-app"
              />
              <Lock size={16} className="absolute left-3.5 top-3 text-[#94A3B8]" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-2.5 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Options: Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs font-sans-app pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#8B7CFF] focus:ring-[#8B7CFF] accent-[#8B7CFF]"
              />
              <span>Remember me</span>
            </label>

            {authMode === 'login' && (
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setForgotSuccess(false);
                  setShowForgotModal(true);
                }}
                className="text-[#8B7CFF] hover:underline font-semibold cursor-pointer"
              >
                Forgot Password?
              </button>
            )}
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-[#8B7CFF] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white font-pixel text-xs rounded-xl shadow-md shadow-[#8B7CFF]/25 font-bold active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
          >
            {authMode === 'login' ? <LogIn size={15} /> : <UserPlus size={15} />}
            <span>
              {isLoading
                ? 'COMMUNING WITH REALM...'
                : authMode === 'login'
                ? 'SIGN IN TO REALM'
                : 'CREATE CHARACTER & EMBARK'}
            </span>
          </button>
        </form>

        {/* Social Logins Section */}
        <div className="mt-5 relative z-10">
          <div className="relative flex items-center justify-center mb-4">
            <div className="border-t border-[#E2E8F0] w-full" />
            <span className="bg-white px-3 text-[11px] font-sans-app text-slate-400 uppercase">
              Or continue with
            </span>
            <div className="border-t border-[#E2E8F0] w-full" />
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {/* Google */}
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              className="py-2.5 px-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:border-slate-300"
              title="Sign in with Google"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.27v3.13C3.25 21.31 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.26c-.25-.72-.38-1.49-.38-2.26s.13-1.54.38-2.26V6.61H1.27C.46 8.23 0 10.06 0 12s.46 3.77 1.27 5.39l4.01-3.13z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.69 1.27 6.61l4.01 3.13c.95-2.84 3.6-4.99 6.72-4.99z"
                />
              </svg>
            </button>

            {/* Facebook */}
            <button
              type="button"
              onClick={() => handleSocialLogin('Facebook')}
              className="py-2.5 px-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:border-slate-300"
              title="Sign in with Facebook"
            >
              <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>

            {/* LinkedIn */}
            <button
              type="button"
              onClick={() => handleSocialLogin('LinkedIn')}
              className="py-2.5 px-3 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:border-slate-300"
              title="Sign in with LinkedIn"
            >
              <svg className="w-4 h-4 fill-[#0A66C2]" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </button>
          </div>
        </div>

        {/* 1-Click Instant Demo Hero Button */}
        <div className="mt-4 pt-4 border-t border-[#E2E8F0] relative z-10">
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full py-2.5 px-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[#7C3AED] font-pixel text-[10px] rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-bold shadow-2xs"
          >
            <Sparkles size={12} className="text-[#8B7CFF]" />
            <span>INSTANT DEMO HERO LOGIN</span>
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100"
            >
              <X size={18} />
            </button>

            <h3 className="font-pixel text-sm text-slate-900 font-bold mb-1">
              RECOVER SECRET PASSCODE
            </h3>
            <p className="text-xs text-slate-500 font-sans-app mb-4">
              Enter your adventurer guild email and we will send a magical recovery link.
            </p>

            {forgotSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <Check size={24} className="text-emerald-500 mx-auto" />
                <p className="text-xs font-sans-app text-emerald-800 font-semibold">
                  Recovery raven dispatched!
                </p>
                <p className="text-[11px] text-emerald-600 font-sans-app">
                  Check your inbox at <strong>{forgotEmail}</strong> to reset your password.
                </p>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="mt-2 w-full py-2 bg-emerald-600 text-white font-pixel text-[10px] rounded-xl font-bold cursor-pointer"
                >
                  RETURN TO SIGN IN
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="hero@dietquest.com"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#8B7CFF] rounded-xl py-2 px-3 text-xs text-slate-800 outline-none font-sans-app"
                />
                <button
                  type="button"
                  onClick={() => setForgotSuccess(true)}
                  className="w-full py-2.5 bg-[#8B7CFF] hover:bg-[#7C3AED] text-white font-pixel text-xs rounded-xl font-bold transition-all cursor-pointer shadow-sm"
                >
                  SEND RECOVERY LINK
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginScreen;
