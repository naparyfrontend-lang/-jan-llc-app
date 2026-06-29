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
    <div style={{minHeight:'100vh', background:'#1a1a2e', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div style={{width:'390px', height:'844px', background:'#0a0a0a', borderRadius:'55px', border:'10px solid #333', position:'relative', overflow:'hidden', boxShadow:'0 0 0 2px #111, 0 30px 80px rgba(0,0,0,0.8)'}}>
        
        {/* Notch */}
        <div style={{position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:'120px', height:'34px', background:'#000', borderRadius:'0 0 20px 20px', zIndex:10}}></div>
        
        {/* Status bar */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 24px 0', marginTop:'4px'}}>
          <span style={{color:'#fff', fontSize:'13px', fontWeight:'600'}}>9:41</span>
          <div style={{display:'flex', gap:'6px', alignItems:'center'}}>
            <span style={{color:'#fff', fontSize:'11px'}}>●●●</span>
            <span style={{color:'#fff', fontSize:'11px'}}>WiFi</span>
            <span style={{color:'#fff', fontSize:'11px'}}>🔋</span>
          </div>
        </div>

        {/* Content */}
        <div style={{padding:'40px 28px', display:'flex', flexDirection:'column', height:'calc(100% - 50px)'}}>
          <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'36px'}}>
            <div style={{width:'40px', height:'40px', background:'#f0eff5', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'700', fontSize:'11px', color:'#1a1c24'}}>JAN</div>
            <div>
              <div style={{color:'#fff', fontSize:'15px', fontWeight:'600'}}>JAN LLC</div>
              <div style={{color:'#555', fontSize:'11px'}}>From Dream to Market</div>
            </div>
          </div>

          <h1 style={{color:'#fff', fontSize:'24px', fontWeight:'600', marginBottom:'4px'}}>
            {step === 1 ? 'تسجيل الدخول' : 'أدخل الكود'}
          </h1>
          <p style={{color:'#555', fontSize:'13px', marginBottom:'24px'}}>
            {step === 1 ? 'أدخل رقم موبايلك' : `تم إرسال كود على ${phone}`}
          </p>

          {error && <div style={{background:'rgba(255,0,0,0.1)', border:'1px solid rgba(255,0,0,0.3)', color:'#ff6b6b', fontSize:'13px', borderRadius:'10px', padding:'12px', marginBottom:'16px'}}>{error}</div>}

          {step === 1 ? (
            <>
              <input
                type="tel"
                placeholder="+20 1xx xxxx xxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{background:'#1a1a1a', border:'1px solid #2a2a2a', color:'#fff', borderRadius:'12px', padding:'14px 16px', fontSize:'15px', marginBottom:'16px', outline:'none', direction:'ltr'}}
                dir="ltr"
              />
              <div id="recaptcha"></div>
              <button
                onClick={sendOTP}
                disabled={loading || !phone}
                style={{background:'#f0eff5', color:'#1a1c24', fontWeight:'600', borderRadius:'12px', padding:'16px', fontSize:'15px', border:'none', cursor:'pointer', opacity: loading || !phone ? 0.5 : 1}}
              >
                {loading ? 'جاري الإرسال...' : 'إرسال الكود'}
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="الكود المكون من 6 أرقام"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{background:'#1a1a1a', border:'1px solid #2a2a2a', color:'#fff', borderRadius:'12px', padding:'14px 16px', fontSize:'20px', marginBottom:'16px', outline:'none', textAlign:'center', letterSpacing:'8px'}}
                maxLength={6}
              />
              <button
                onClick={verifyOTP}
                disabled={loading || otp.length < 6}
                style={{background:'#f0eff5', color:'#1a1c24', fontWeight:'600', borderRadius:'12px', padding:'16px', fontSize:'15px', border:'none', cursor:'pointer', opacity: loading || otp.length < 6 ? 0.5 : 1}}
              >
                {loading ? 'جاري التحقق...' : 'تأكيد'}
              </button>
              <button onClick={() => setStep(1)} style={{background:'none', border:'none', color:'#555', fontSize:'13px', marginTop:'12px', cursor:'pointer'}}>
                رجوع
              </button>
            </>
          )}
        </div>

        {/* Home indicator */}
        <div style={{position:'absolute', bottom:'8px', left:'50%', transform:'translateX(-50%)', width:'130px', height:'5px', background:'#444', borderRadius:'3px'}}></div>
      </div>
    </div>
  );
}