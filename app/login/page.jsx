'use client';
import { useState } from 'react';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [confirmObj, setConfirmObj] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendOTP = async () => {
    setLoading(true);
    setError('');
    try {
      const recaptcha = new RecaptchaVerifier(auth, 'recaptcha', { size: 'invisible' });
      const confirmation = await signInWithPhoneNumber(auth, phone, recaptcha);
      setConfirmObj(confirmation);
      setStep(2);
    } catch (err) {
      setError('حصل خطأ — تأكد من رقم الموبايل');
    }
    setLoading(false);
  };

  const verifyOTP = async () => {
    setLoading(true);
    setError('');
    try {
      await confirmObj.confirm(otp);
      window.location.href = '/chat';
    } catch (err) {
      setError('كود غلط — حاول تاني');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-[#111] border border-[#222] rounded-2xl p-8 w-full max-w-sm">
        
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#f0eff5] rounded-lg flex items-center justify-center font-bold text-[#1a1c24] text-sm">
            JAN
          </div>
          <div>
            <div className="text-white font-semibold">JAN LLC</div>
            <div className="text-[#555] text-xs">From Dream to Market</div>
          </div>
        </div>

        <h1 className="text-white text-xl font-semibold mb-1">
          {step === 1 ? 'تسجيل الدخول' : 'أدخل الكود'}
        </h1>
        <p className="text-[#555] text-sm mb-6">
          {step === 1 ? 'أدخل رقم موبايلك' : `تم إرسال كود على ${phone}`}
        </p>

        {error && <div className="bg-red-900/20 border border-red-800 text-red-400 text-sm rounded-lg p-3 mb-4">{error}</div>}

        {step === 1 ? (
          <>
            <input
              type="tel"
              placeholder="+20 1xx xxxx xxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-lg px-4 py-3 text-sm mb-4 outline-none focus:border-[#444]"
              dir="ltr"
            />
            <div id="recaptcha"></div>
            <button
              onClick={sendOTP}
              disabled={loading || !phone}
              className="w-full bg-[#f0eff5] text-[#1a1c24] font-semibold rounded-lg py-3 text-sm disabled:opacity-50"
            >
              {loading ? 'جاري الإرسال...' : 'إرسال الكود'}
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="أدخل الكود المكون من 6 أرقام"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-lg px-4 py-3 text-sm mb-4 outline-none focus:border-[#444] text-center tracking-widest"
              maxLength={6}
            />
            <button
              onClick={verifyOTP}
              disabled={loading || otp.length < 6}
              className="w-full bg-[#f0eff5] text-[#1a1c24] font-semibold rounded-lg py-3 text-sm disabled:opacity-50"
            >
              {loading ? 'جاري التحقق...' : 'تأكيد'}
            </button>
            <button onClick={() => setStep(1)} className="w-full text-[#555] text-sm mt-3">
              رجوع
            </button>
          </>
        )}
      </div>
    </div>
  );
}