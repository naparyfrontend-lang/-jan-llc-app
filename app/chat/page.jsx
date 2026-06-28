'use client';
import { useState, useEffect, useRef } from 'react';
import { auth, db } from '../firebase';
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [user, setUser] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      if (!u) window.location.href = '/login';
      else setUser(u);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt'));
    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

 const sendMessage = async () => {
    if (!text.trim()) return;
    const msgText = text;
    setText('');
    await addDoc(collection(db, 'messages'), {
      text: msgText,
      uid: user.uid,
      phone: user.phoneNumber,
      createdAt: serverTimestamp(),
    });
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen bg-black text-white">
      <div className="w-60 bg-[#111] border-r border-[#222] flex flex-col">
        <div className="p-4 border-b border-[#222] flex items-center gap-2">
          <div className="w-8 h-8 bg-[#f0eff5] rounded-lg flex items-center justify-center text-[#1a1c24] font-bold text-xs">JAN</div>
          <div>
            <div className="text-sm font-semibold">JAN LLC</div>
            <div className="text-xs text-[#555]">From Dream to Market</div>
          </div>
        </div>
        <div className="p-3">
          <div className="text-xs text-[#444] uppercase tracking-wider mb-2 px-2">Channels</div>
          <div className="flex items-center gap-2 px-2 py-1.5 bg-[#222] rounded-lg text-sm"># general</div>
          <div className="flex items-center gap-2 px-2 py-1.5 text-[#555] text-sm mt-1"># random</div>
          <div className="flex items-center gap-2 px-2 py-1.5 text-[#555] text-sm mt-1"># projects</div>
        </div>
        <div className="mt-auto p-4 border-t border-[#222] flex items-center justify-between">
          <div className="text-xs text-[#555]">{user?.phoneNumber}</div>
          <button onClick={handleLogout} className="text-xs text-[#555] hover:text-red-400">خروج</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-[#222] flex items-center gap-2">
          <span className="text-[#555]">#</span>
          <span className="font-semibold">general</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2 ${msg.uid === user?.uid ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-lg bg-[#222] flex items-center justify-center text-xs flex-shrink-0">
                {msg.phone?.slice(-2)}
              </div>
              <div className={`max-w-xs px-3 py-2 rounded-xl text-sm ${msg.uid === user?.uid ? 'bg-[#f0eff5] text-black' : 'bg-[#1a1a1a] text-white'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 border-t border-[#222] flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="اكتب رسالة..."
            className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#444]"
            dir="rtl"
          />
          <button onClick={sendMessage} className="bg-[#f0eff5] text-black px-4 py-2.5 rounded-xl text-sm font-semibold">
            إرسال
          </button>
        </div>
      </div>
    </div>
  );
  
}