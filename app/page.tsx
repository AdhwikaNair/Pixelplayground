"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Matter from "matter-js";
import confetti from "canvas-confetti";
import { Send, Zap, Monitor, CoffeeIcon, AlertTriangle, Gamepad2, Heart, PenTool, Eraser, Sparkles, Bomb, Highlighter, Pencil, X, Save, FilePlus, HelpCircle, RefreshCcw, LogOut, Droplet, Star, Play, SkipForward, Layers, PencilLine, Volume2, Beaker as Marker } from "lucide-react";
import { Beaker } from "lucide-react"; // Import Beaker here

// --- TYPES ---
type Vibe = "neutral" | "chaos" | "retro" | "wiggly" | "coffee_mode";

// --- MAIN COMPONENT ---
export default function App() {
  const [vibe, setVibe] = useState<Vibe>("neutral");
  const [inputValue, setInputValue] = useState("");
  const [flash, setFlash] = useState(false);
  const [darkness, setDarkness] = useState(false);
  const [konamiSeq, setKonamiSeq] = useState<string[]>([]);
  const [markerSize, setMarkerSize] = useState(32); // Declare markerSize variable here

  // Cheat code listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKonamiSeq((prev) => {
        const newSeq = [...prev, e.key];
        if (newSeq.length > 10) newSeq.shift();
        const code = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
        if (JSON.stringify(newSeq) === JSON.stringify(code)) setVibe("retro");
        return newSeq;
      });
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleInput = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputValue.toLowerCase().trim();
    if (cmd === "chaos") setVibe("chaos");
    else if (cmd === "wiggly" || cmd === "paint") setVibe("wiggly");
    else if (cmd === "coffee" || cmd === "latte") setVibe("coffee_mode");
    else if (cmd === "konami" || cmd === "retro") setVibe("retro");
    else if (cmd === "darkness") setDarkness(true);
    else if (cmd === "sudo rm -rf /") {
      setFlash(true);
      setTimeout(() => { setVibe("neutral"); setInputValue(""); setFlash(false); }, 2000);
    }
  };

  const resetToNeutral = () => { setVibe("neutral"); setInputValue(""); };

  return (
    <div className={`min-h-screen w-full transition-colors duration-700 overflow-hidden relative 
      ${vibe === "neutral" ? "bg-slate-50 flex items-center justify-center font-sans text-slate-900" : ""}
      ${vibe === "chaos" ? "bg-yellow-400 text-black font-black" : ""}
      ${vibe === "retro" ? "bg-[#2c2137] text-[#d3c6aa] font-mono" : ""}
      ${vibe === "wiggly" || vibe === "coffee_mode" ? "bg-[#fffcf5] text-[#4e342e] font-mono" : ""}
    `}>
      {flash && (
        <div className="fixed inset-0 bg-black z-[200] flex items-center justify-center text-red-500 font-mono text-xl animate-pulse">
          <AlertTriangle className="mr-2" /> SYSTEM CRASH... REBOOTING
        </div>
      )}
      
      {darkness && <DarknessOverlay onClose={() => setDarkness(false)} />}
      
      <AnimatePresence mode="wait">
        {vibe === "neutral" && (
          <motion.div key="neutral" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex items-center justify-center relative">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
            <div className="text-center space-y-8 z-10 max-w-md w-full px-6">
              <motion.h1 initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-7xl font-black tracking-tighter drop-shadow-sm">Pixel Playground.</motion.h1>
              <p className="text-slate-600 font-mono text-sm tracking-wider">Where imagination meets interaction. Create, explore, and play.</p>
              <form onSubmit={handleInput} className="relative group">
                <input 
                  autoFocus 
                  type="text" 
                  value={inputValue} 
                  onChange={(e) => setInputValue(e.target.value)} 
                  placeholder="Coffee / Wiggly / Chaos" 
                  className="w-full px-6 py-5 border-4 border-slate-900 rounded-[2.5rem] focus:ring-8 focus:ring-slate-100 outline-none bg-white text-center text-2xl transition-all shadow-[10px_10px_0px_rgba(0,0,0,1)] placeholder:text-slate-300 uppercase tracking-widest font-black" 
                />
                <button type="submit" className="absolute right-6 top-1/2 -translate-y-1/2 p-2 bg-slate-900 text-white rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"><Send size={20} /></button>
              </form>
              <div className="flex justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span className="border-2 border-slate-200 px-3 py-1 rounded-full bg-white">Interaction Designer</span>
                <span className="border-2 border-slate-200 px-3 py-1 rounded-full bg-white">Creative Developer</span>
              </div>
            </div>
          </motion.div>
        )}
        
        {vibe === "chaos" && <ChaosMode onBack={resetToNeutral} />}
        {vibe === "retro" && <RetroMode onBack={resetToNeutral} />}
        {vibe === "wiggly" && <WigglyMode onBack={resetToNeutral} markerSize={markerSize} setMarkerSize={setMarkerSize} />}
        {vibe === "coffee_mode" && <CoffeeMode onBack={resetToNeutral} />}
      </AnimatePresence>
    </div>
  );
}

// --- SOUNDS ---
const playSplashSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContext();
      
      // Glass Clink
      const clink = audioCtx.createOscillator();
      const clinkGain = audioCtx.createGain();
      clink.type = 'sine';
      clink.frequency.setValueAtTime(2800, audioCtx.currentTime);
      clink.frequency.exponentialRampToValueAtTime(1500, audioCtx.currentTime + 0.05);
      clinkGain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      clinkGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      clink.connect(clinkGain); clinkGain.connect(audioCtx.destination);
      
      // Liquid Splash
      const bufferSize = audioCtx.sampleRate * 0.6;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.5);
      const splashGain = audioCtx.createGain();
      splashGain.gain.setValueAtTime(0.6, audioCtx.currentTime);
      splashGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
      noise.connect(filter); filter.connect(splashGain); splashGain.connect(audioCtx.destination);

      clink.start(); noise.start();
      clink.stop(audioCtx.currentTime + 0.1); noise.stop(audioCtx.currentTime + 0.6);
    } catch (e) { console.error(e); }
};

const playRetroExplosion = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioContext();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.6, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {}
};

const playChaosSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioContext();
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        const gain2 = audioCtx.createGain();
        
        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.3);
        osc2.frequency.setValueAtTime(330, audioCtx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.3);
        
        gain1.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        gain2.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        
        osc1.connect(gain1); gain1.connect(audioCtx.destination);
        osc2.connect(gain2); gain2.connect(audioCtx.destination);
        osc1.start(); osc2.start();
        osc1.stop(audioCtx.currentTime + 0.3); osc2.stop(audioCtx.currentTime + 0.3);
    } catch (e) {}
};

// --- MODE: COFFEE MODE (Full Screen Spill) ---
const CoffeeMode = ({ onBack }: { onBack: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'marker' | 'eraser' | 'pattern'>('pen');
  const [color, setColor] = useState('#4e342e');
  const [distraction, setDistraction] = useState(0);
  const [spilled, setSpilled] = useState(false);
  const [shake, setShake] = useState(false);
  const lastStampPos = useRef<{x: number, y: number} | null>(null);

  const THRESHOLD = 1200; 

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
    }
  }, []);

  const getCoordinates = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { 
        x: (e.clientX - rect.left) * (canvas.width / rect.width), 
        y: (e.clientY - rect.top) * (canvas.height / rect.height) 
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (spilled) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const { x, y } = getCoordinates(e);

    if (tool === 'pattern') {
      ctx.font = "45px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("❤️", x, y);
      lastStampPos.current = { x, y };
    } else {
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineCap = 'round';
      ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
      ctx.lineWidth = tool === 'marker' ? 24 : 4;
    }
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || spilled) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const { x, y } = getCoordinates(e);

    if (tool === 'pattern') {
      if (!lastStampPos.current) return;
      const dist = Math.sqrt((x-lastStampPos.current.x)**2 + (y-lastStampPos.current.y)**2);
      if (dist > 55) { 
        ctx.fillText("❤️", x, y); 
        lastStampPos.current = { x, y };
        setDistraction(p => p + 15); 
      }
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
      setDistraction(p => p + 1);
    }

    if (distraction > THRESHOLD && !spilled) {
        setSpilled(true); setShake(true); playSplashSound();
        setTimeout(() => setShake(false), 800);
    }
  };

  const stopDrawing = () => { setIsDrawing(false); lastStampPos.current = null; };

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
    }
    setSpilled(false); setDistraction(0);
  };

  return (
    <div className={`w-full min-h-screen bg-[#fffcf5] font-mono text-[#4e342e] overflow-hidden select-none relative ${shake ? 'animate-bounce' : ''}`}>
      
      {/* FULL SCREEN SPILL (Not confined to box) */}
      <AnimatePresence>
        {spilled && (
          <motion.div initial={{ opacity: 0, scale: 0.5, y: -400 }} animate={{ opacity: 1, scale: 1.5, y: 100 }} exit={{ opacity: 0 }} className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center mix-blend-multiply">
            <svg viewBox="0 0 400 400" className="w-[180vw] h-[180vh]">
                <defs>
                  <filter id="coffee-goo">
                    <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="turb" />
                    <feDisplacementMap in="SourceGraphic" in2="turb" scale="50" />
                  </filter>
                </defs>
                <path fill="#3e2723" style={{ filter: 'url(#coffee-goo)' }} d="M50,100 Q200,-50 350,100 L380,300 Q200,450 20,300 Z" opacity="0.9" />
                <path fill="#5d4037" style={{ filter: 'url(#coffee-goo)' }} d="M100,120 Q200,80 300,120 L320,280 Q200,350 80,280 Z" opacity="0.6" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-[110] bg-white border-b-4 border-black px-6 py-2 flex justify-between items-center shadow-lg">
        <div className="flex gap-4 text-sm font-black uppercase items-center">
            <div className="p-2 bg-yellow-400 border-2 border-black rounded-full shadow-[3px_3px_0_black]"><CoffeeIcon size={20} /></div>
            <span className="tracking-tighter text-xl">ADHWIKA_DESK_SIMULATOR.exe</span>
        </div>
        <button onClick={onBack} className="bg-black text-white border-4 border-black px-6 py-1 font-black hover:bg-red-500 shadow-none transition-all">EXIT</button>
      </div>

      <div className="flex h-[calc(100vh-65px)] p-6 gap-6 relative z-10">
        {/* Toolbar */}
        <div className="w-24 bg-white border-4 border-black shadow-[8px_8px_0_#4e342e] flex flex-col p-2 gap-4 z-20">
          <ToolBtn_Fixed icon={<Pencil size={24}/>} color="#a1e3ff" active={tool==='pen'} onClick={() => setTool('pen')} />
          <ToolBtn_Fixed icon={<Sparkles size={24}/>} color="#ffa1df" active={tool==='pattern'} onClick={() => setTool('pattern')} />
          <ToolBtn_Fixed icon={<Eraser size={24}/>} color="#f0f0f0" active={tool==='eraser'} onClick={() => setTool('eraser')} />
          <div className="mt-auto grid grid-cols-2 gap-2">
            {['#4e342e', '#ff0055', '#00ccaa', '#ffcc00'].map(c => (
              <button key={c} onClick={() => setColor(c)} className={`w-full aspect-square border-2 border-black rounded-sm ${color===c?'ring-4 ring-black scale-110 shadow-lg':''}`} style={{backgroundColor: c}} />
            ))}
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-white border-4 border-black shadow-[15px_15px_0_rgba(0,0,0,0.1)] relative overflow-hidden">
          <canvas ref={canvasRef} width={1600} height={1200} className={`w-full h-full mt-4 bg-white transition-opacity duration-1000 ${spilled ? 'opacity-40 grayscale-[0.3]' : 'opacity-100'} ${tool === 'pen' ? 'cursor-crosshair' : 'cursor-default'}`} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} />
        </div>

        {/* Desk UI (The Physical Cup) */}
        <div className="w-80 flex flex-col gap-6">
          <div className="bg-white border-4 border-black p-6 shadow-[10px_10px_0_#4e342e] flex flex-col items-center gap-6 relative">
             <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Desk Environment</div>
             <motion.div animate={spilled ? { rotate: 95, x: 60, y: 40 } : { rotate: Math.sin(distraction/15)*3, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 12 }} className="relative cursor-pointer">
                <svg width="120" height="140" viewBox="0 0 100 120" className="drop-shadow-xl">
                    <path d="M75,40 C95,40 95,80 75,80" fill="none" stroke="black" strokeWidth="8"/>
                    <path d="M15,20 L85,20 L80,105 C80,120 20,120 20,105 Z" fill="white" stroke="black" strokeWidth="8"/>
                    <rect x="25" y="30" width="50" height="15" rx="5" fill="#3e2723" />
                    {!spilled && (
                        <motion.g animate={{ y: [-15, -40], opacity: [0.6, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                            <path d="M40,15 Q45,0 50,15" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="4"/><path d="M55,15 Q60,0 65,15" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="4"/>
                        </motion.g>
                    )}
                </svg>
             </motion.div>
             <div className="w-full bg-slate-100 border-2 border-black h-6 relative overflow-hidden">
                <motion.div animate={{ width: `${Math.min((distraction/1200)*100, 100)}%` }} className={`h-full ${distraction > 1200*0.85 ? 'bg-red-500' : 'bg-[#795548]'}`} />
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black uppercase text-black mix-blend-difference">Instability</span>
             </div>
          </div>

          <button onClick={() => {}} className={`w-full border-4 border-black p-6 font-black text-xl uppercase transition-all flex flex-col items-center gap-2 ${spilled ? 'bg-yellow-400 shadow-[8px_8px_0_black] hover:scale-105 active:translate-y-1 active:shadow-none' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}>
            <RefreshCcw size={32} className={spilled ? "animate-spin" : ""} /> WIPE DESK
          </button>
          <button onClick={onBack} className="bg-white border-4 border-black p-4 font-black uppercase shadow-[6px_6px_0_black] hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"><LogOut size={20}/> LOG OFF</button>
        </div>
      </div>
    </div>
  );
};

const ToolBtn_Fixed = ({ icon, color, active, onClick }: { icon: React.ReactNode, color: string, active: boolean, onClick: () => void }) => (
    <button onClick={onClick} style={{ backgroundColor: active ? color : 'white' }} className={`p-4 border-4 border-black shadow-[4px_4px_0_black] transition-all flex items-center justify-center hover:scale-110 active:translate-x-1 active:translate-y-1 active:shadow-none ${active ? 'scale-110 translate-x-0.5' : ''}`}>{icon}</button>
);

// --- MODE: WIGGLY PAINT (Original experience) ---
const WigglyMode = ({ onBack, markerSize, setMarkerSize }: { onBack: () => void, markerSize: number, setMarkerSize: (size: number) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'marker' | 'highlighter' | 'eraser' | 'pattern'>('pen');
  const [pattern, setPattern] = useState<'kitty' | 'star' | 'heart'>('kitty');
  const [color, setColor] = useState('#1a2b3c');
  const [shake, setShake] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [pastCreations, setPastCreations] = useState<string[]>([]);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const lastStampPos = useRef<{x: number, y: number} | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
    }
  }, []);

  const getCoordinates = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: (e.clientX - rect.left) * (canvas.width / rect.width), y: (e.clientY - rect.top) * (canvas.height / rect.height) };
  };

  const drawStamp = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.font = "36px Arial"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    const icons = { kitty: '🎀', star: '⭐', heart: '❤️' };
    ctx.fillText(icons[pattern], x, y);
    lastStampPos.current = { x, y };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const { x, y } = getCoordinates(e);
    if (tool === 'pattern') { drawStamp(ctx, x, y); }
    else {
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineCap = 'round';
      ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
      ctx.lineWidth = tool === 'marker' ? markerSize * 6 : tool === 'highlighter' ? markerSize * 8 : tool === 'eraser' ? 35 : markerSize;
      if (tool === 'highlighter') ctx.globalAlpha = 0.4;
    }
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const { x, y } = getCoordinates(e);
    if (tool === 'pattern') {
      if (!lastStampPos.current) return;
      const dist = Math.sqrt((x-lastStampPos.current.x)**2 + (y-lastStampPos.current.y)**2);
      if (dist > 40) drawStamp(ctx, x, y);
    } else { ctx.lineTo(x, y); ctx.stroke(); }
  };

  const stopDrawing = () => { 
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) ctx.globalAlpha = 1;
    setIsDrawing(false); 
    lastStampPos.current = null; 
  };

  const obliterate = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const imageData = canvas.toDataURL();
      setPastCreations(prev => [...prev, imageData]);
      setCurrentGalleryIndex(prev => prev + 1);
    }
    playRetroExplosion();
    setShake(true);
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    setTimeout(() => { 
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) { ctx.fillStyle = "#ffffff"; ctx.fillRect(0,0,2000,2000); }
        setShake(false); 
    }, 500);
  };

  return (
    <div className={`w-full min-h-screen bg-[#e0f0e0] font-mono text-[#1a2b3c] overflow-hidden select-none relative ${shake ? 'animate-bounce' : ''}`} onClick={() => setActiveMenu(null)}>
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1a2b3c 1.5px, transparent 1.5px)', backgroundSize: '6px 6px' }}></div>
      <div className="relative z-30 bg-white border-b-4 border-black px-4 py-1 flex justify-between items-center shadow-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-4 text-sm font-bold uppercase">
          <div className="relative">
            <button onClick={() => setActiveMenu(activeMenu === 'start' ? null : 'start')} className={`px-2 py-1 ${activeMenu === 'start' ? 'bg-black text-white shadow-none' : 'hover:bg-slate-200 border-2 border-black'}`}>Start</button>
            {activeMenu === 'start' && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border-4 border-black shadow-[4px_4px_0_#000] z-50">
                <div className="p-3 border-b-2 border-black bg-[#1a2b3c] text-white font-bold text-xs">Canvas Studio v1.02</div>
                <div className="p-4 bg-[#e0f0e0]">
                  <button onClick={onBack} className="w-full bg-red-500 text-white p-2 border-2 border-black hover:bg-red-600 flex items-center justify-center gap-2 text-xs font-bold uppercase shadow-[2px_2px_0_#000]"><LogOut size={14}/> LOG OFF</button>
                </div>
              </div>
            )}
          </div>
          <button className="px-2 py-1 hover:bg-slate-200 font-bold uppercase" onClick={() => { if(confirm("New Canvas?")) { const ctx = canvasRef.current?.getContext('2d'); if(ctx) { ctx.fillStyle="#fff"; ctx.fillRect(0,0,2000,2000); } } }}>File</button>
          <button className="px-2 py-1 hover:bg-slate-200 font-bold uppercase" onClick={() => alert("Help Menu: Use different tools to create your artwork - Pen, Marker, Highlighter, Patterns, or Eraser!")}>Help</button>
        </div>
        <button onClick={onBack} className="border-2 border-black px-2 font-bold hover:bg-red-500 transition-colors bg-white shadow-[2px_2px_0_#000]">X</button>
      </div>
      <div className="flex h-[calc(100vh-45px)] p-6 gap-6 relative z-10">
        <div className="w-24 bg-white border-4 border-black shadow-[6px_6px_0_#000] flex flex-col p-2 gap-3 z-20">
          <ToolBtn_Wiggly icon={<Pencil size={20}/>} active={tool==='pen'} onClick={() => setTool('pen')} />
          <ToolBtn_Wiggly icon={<Beaker size={20}/>} active={tool==='marker'} onClick={() => setTool('marker')} />
          <ToolBtn_Wiggly icon={<Highlighter size={20}/>} active={tool==='highlighter'} onClick={() => setTool('highlighter')} />
          <ToolBtn_Wiggly icon={<Sparkles size={20}/>} active={tool==='pattern'} onClick={() => setTool('pattern')} />
          <ToolBtn_Wiggly icon={<Eraser size={20}/>} active={tool==='eraser'} onClick={() => setTool('eraser')} />
          <div className="border-t-2 border-black pt-2 mt-2">
            {tool === 'pattern' && (
              <div className="flex flex-col gap-1 bg-[#f0f0f0] p-1 border-2 border-black mb-2">
                <button onClick={() => setPattern('kitty')} className={`p-1 border-2 border-black text-lg ${pattern==='kitty'?'bg-black':'bg-white'}`}>🎀</button>
                <button onClick={() => setPattern('star')} className={`p-1 border-2 border-black text-lg ${pattern==='star'?'bg-black':'bg-white'}`}>⭐</button>
                <button onClick={() => setPattern('heart')} className={`p-1 border-2 border-black text-lg ${pattern==='heart'?'bg-black':'bg-white'}`}>❤️</button>
              </div>
            )}
            <div className="grid grid-cols-2 gap-1">
              {['#1a2b3c', '#ff0055', '#00ccaa', '#ffcc00'].map(c => (
                <button key={c} onClick={() => setColor(c)} className={`w-full aspect-square border-2 border-black ${color===c?'ring-2 ring-black':''}`} style={{backgroundColor: c}} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 bg-white border-4 border-black shadow-[10px_10px_0_rgba(0,0,0,0.1)] relative overflow-hidden">
          <canvas ref={canvasRef} width={1400} height={1000} className={`w-full h-full mt-4 bg-white ${tool === 'eraser' ? 'cursor-cell' : 'cursor-crosshair'}`} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} />
        </div>
        <div className="w-56 flex flex-col gap-4">
          <div className="bg-white border-4 border-black p-3 shadow-[6px_6px_0_#1a2b3c]"><h2 className="text-xl font-black uppercase tracking-tighter">PIXEL PLAYGROUND</h2><p className="text-[10px] mt-2 italic text-pink-600 font-bold uppercase">"Create & Explore."</p></div>
          <div className="bg-white border-4 border-black p-3 shadow-[6px_6px_0_#1a2b3c]">
            <label className="block text-xs font-bold uppercase mb-2 text-black">Marker Size</label>
            <input type="range" min="5" max="50" value={markerSize} onChange={(e) => setMarkerSize(Number(e.target.value))} className="w-full" />
            <div className="text-xs text-black mt-2 font-mono text-center">{markerSize}px</div>
          </div>
          <div className="bg-white border-4 border-black shadow-[6px_6px_0_#1a2b3c] overflow-hidden flex flex-col">
            {pastCreations.length > 0 ? (
              <>
                <img src={pastCreations[currentGalleryIndex % pastCreations.length] || "/placeholder.svg"} alt="Past Creation" className="w-32 h-32 object-cover" />
                <div className="flex gap-2 p-2 bg-slate-100 text-xs font-bold uppercase justify-center">
                  <button onClick={() => setCurrentGalleryIndex(prev => prev === 0 ? pastCreations.length - 1 : prev - 1)} className="px-2 py-1 bg-black text-white border border-black hover:bg-slate-700">←</button>
                  <span className="flex-1 text-center">{currentGalleryIndex % pastCreations.length + 1}/{pastCreations.length}</span>
                  <button onClick={() => setCurrentGalleryIndex(prev => (prev + 1) % pastCreations.length)} className="px-2 py-1 bg-black text-white border border-black hover:bg-slate-700">→</button>
                </div>
              </>
            ) : (
              <div className="w-32 h-32 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="flex gap-1 mb-2">
                  <img src="/creative-brush.jpg" alt="Brush" className="w-12 h-12 object-cover border border-black" />
                  <img src="/creative-colors.jpg" alt="Palette" className="w-12 h-12 object-cover border border-black" />
                </div>
                <p className="text-[9px] font-bold text-center text-slate-500 uppercase px-1">Press DOOMSDAY to save</p>
              </div>
            )}
          </div>
          <button onClick={obliterate} className="bg-[#ff0055] text-white border-4 border-black p-4 font-black text-xl uppercase tracking-tighter shadow-[8px_8px_0_#000] active:translate-x-1 active:translate-y-1 transition-all flex flex-col items-center gap-1 group"><Bomb size={32} />DOOMSDAY</button>
        </div>
      </div>
    </div>
  );
};

const ToolBtn_Wiggly = ({ icon, active, onClick }: { icon: React.ReactNode, active: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`p-2 border-2 border-black shadow-[2px_2px_0_#000] transition-all flex items-center justify-center ${active ? 'bg-black text-white translate-x-1 translate-y-1 shadow-none' : 'bg-white text-black hover:bg-slate-100'}`}>{icon}</button>
);

// --- MODE: CHAOS ---
const ChaosMode = ({ onBack }: { onBack: () => void }) => {
    const sceneRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<Matter.Engine | null>(null);
    useEffect(() => {
      if (!sceneRef.current) return;
      const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Constraint } = Matter;
      const engine = Engine.create();
      const render = Render.create({ element: sceneRef.current, engine: engine, options: { width: window.innerWidth, height: window.innerHeight, pixelRatio: window.devicePixelRatio, wireframes: false, background: 'transparent' } });
      const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 60, window.innerWidth * 2, 120, { isStatic: true, render: { fillStyle: 'white' } });
      const ball = Bodies.circle(200, 300, 75, { density: 0.12, frictionAir: 0.002, render: { fillStyle: '#000', strokeStyle: '#fff', lineWidth: 10 } });
      const chain = Constraint.create({ pointA: { x: 200, y: 50 }, bodyB: ball, stiffness: 0.9, length: 280, render: { visible: true, lineWidth: 8, strokeStyle: '#000' } });
      const colors = ['#ff0099', '#00ffff', '#ccff00', '#ff6600'];
      const boxes = Array.from({length: 15}).map(() => Bodies.rectangle(Math.random()*window.innerWidth, 100, 80, 80, { render: { fillStyle: colors[Math.floor(Math.random()*4)], strokeStyle: 'black', lineWidth: 5 } }));
      Composite.add(engine.world, [ground, ball, chain, ...boxes]);
      const mouse = Mouse.create(render.canvas); Composite.add(engine.world, MouseConstraint.create(engine, { mouse: mouse, constraint: { stiffness: 0.2, render: { visible: false } } }));
      Render.run(render); Runner.run(Runner.create(), engine); engineRef.current = engine;
      return () => { Render.stop(render); if (render.canvas) render.canvas.remove(); Composite.clear(engine.world, false); Engine.clear(engine); };
    }, []);
    return (
      <div className="relative w-full h-screen overflow-hidden cursor-crosshair font-black" style={{ backgroundColor: '#8b5cf6', backgroundImage: 'radial-gradient(#c4b5fd 20%, transparent 20%), radial-gradient(#c4b5fd 20%, transparent 20%)', backgroundPosition: '0 0, 25px 25px', backgroundSize: '50px 50px' }}>
        <div ref={sceneRef} className="absolute inset-0" />
        <div className="absolute top-12 left-12 z-10 pointer-events-none select-none text-white drop-shadow-[8px_8px_0_#000]"><h1 className="text-7xl md:text-9xl uppercase tracking-tighter leading-[0.75] stroke-black" style={{ WebkitTextStroke: "3px black" }}>CHAOS<br/>MODE</h1></div>
        <div className="absolute bottom-12 right-12 z-10 flex gap-6"><button onClick={() => { engineRef.current && (engineRef.current.world.gravity.y *= -1); playChaosSound(); }} className="bg-black text-white px-10 py-5 text-2xl border-4 border-white shadow-[10px_10px_0px_#ccff00] active:translate-y-2 active:shadow-none">FLIP GRAVITY</button><button onClick={() => { onBack(); playChaosSound(); }} className="bg-[#ff0099] text-white px-10 py-5 text-2xl border-4 border-black hover:bg-black active:translate-y-2 active:shadow-none">EXIT</button></div>
      </div>
    );
};

const DarknessOverlay = ({ onClose }: { onClose: () => void }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const handleMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, []);
    const getPupilStyle = (eyeX: number, eyeY: number) => {
        const dx = mousePos.x - eyeX; const dy = mousePos.y - eyeY;
        const angle = Math.atan2(dy, dx); const distance = Math.min(10, Math.sqrt(dx*dx + dy*dy)); 
        return { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)` };
    };
    return (
        <div onClick={onClose} className="fixed inset-0 bg-black z-[150] flex items-center justify-center cursor-none">
            <div className="text-white absolute bottom-10 opacity-30 font-mono text-sm tracking-widest uppercase animate-pulse">Click to escape the void</div>
            <div className="flex gap-12">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center overflow-hidden relative shadow-[0_0_20px_rgba(255,255,255,0.3)]"><div className="w-9 h-9 bg-black rounded-full" style={getPupilStyle(window.innerWidth / 2 - 60, window.innerHeight / 2)} /></div>
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center overflow-hidden relative shadow-[0_0_20px_rgba(255,255,255,0.3)]"><div className="w-9 h-9 bg-black rounded-full" style={getPupilStyle(window.innerWidth / 2 + 60, window.innerHeight / 2)} /></div>
            </div>
        </div>
    );
};

const RetroMode = ({ onBack }: { onBack: () => void }) => (
  <div className="w-full h-screen bg-[#2d2d2d] font-mono text-[#76c7c0] flex flex-col items-center justify-center p-8 border-[20px] border-[#4a4a4a] relative">
      <div className="max-w-3xl w-full space-y-8 text-center z-20">
          <Gamepad2 size={64} className="mx-auto mb-4 text-[#e06c75] animate-bounce" />
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-widest text-[#e06c75] drop-shadow-[4px_4px_0_#fff]">Pixel Playground World</h1>
          <button onClick={() => { onBack(); playRetroExplosion(); }} className="mt-8 px-8 py-4 bg-[#e06c75] text-black font-black border-4 border-black shadow-[5px_5px_0_#fff] hover:translate-y-1 hover:shadow-none uppercase">EXIT TO DESKTOP</button>
      </div>
  </div>
);
