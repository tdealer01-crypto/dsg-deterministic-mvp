import React, { useState, useEffect, useCallback } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  Activity, Shield, AlertTriangle, CheckCircle, RefreshCw, FileText, Zap, 
  ChevronRight, Terminal, Gauge, Cpu, Github, Star, Share2, Layout, BookOpen, Rocket, Copy, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ReactMarkdown from 'react-markdown';
import { generatePatentClaims, analyzeAlgorithmSafety, generateReadme, generateSocialPosts } from './services/geminiService';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AlgoState {
  t: number;
  S_t: number[];
  S_star: number[];
  drift: number;
  oscillation: number;
  entropy: number;
  prediction: any[];
  matrix: number[][];
  decision: string;
  history: any[];
}

type Tab = 'monitor' | 'readme' | 'diagrams' | 'launch';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('monitor');
  const [state, setState] = useState<AlgoState | null>(null);
  const [isAutoStepping, setIsAutoStepping] = useState(false);
  const [patentClaims, setPatentClaims] = useState<string | null>(null);
  const [safetyReport, setSafetyReport] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [readmeContent, setReadmeContent] = useState<string | null>(null);
  const [socialPosts, setSocialPosts] = useState<string | null>(null);
  const [isGeneratingReadme, setIsGeneratingReadme] = useState(false);
  const [isGeneratingSocial, setIsGeneratingSocial] = useState(false);

  const fetchState = useCallback(async () => {
    const res = await fetch('/api/algo/state');
    const data = await res.json();
    setState(data);
  }, []);

  const step = async () => {
    const res = await fetch('/api/algo/step', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
    const data = await res.json();
    setState(data);
  };

  const reset = async () => {
    const res = await fetch('/api/algo/reset', { method: 'POST' });
    const data = await res.json();
    setState(data);
    setPatentClaims(null);
    setSafetyReport(null);
  };

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  useEffect(() => {
    let interval: any;
    if (isAutoStepping) {
      interval = setInterval(step, 800);
    }
    return () => clearInterval(interval);
  }, [isAutoStepping]);

  const handleAnalyze = async () => {
    if (!state) return;
    setIsAnalyzing(true);
    try {
      const [claims, safety] = await Promise.all([
        generatePatentClaims(`Current t: ${state.t}, Drift: ${state.drift}, Oscillation: ${state.oscillation}, Decision: ${state.decision}`),
        analyzeAlgorithmSafety(state.history)
      ]);
      setPatentClaims(claims || "Failed to generate claims.");
      setSafetyReport(safety || "Failed to generate safety report.");
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateReadme = async () => {
    setIsGeneratingReadme(true);
    try {
      const content = await generateReadme("DSG™ Canonical Algorithm: Deterministic Safety Gate for AI systems.");
      setReadmeContent(content || "Failed to generate README.");
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingReadme(false);
    }
  };

  const handleGenerateSocial = async (platform: string) => {
    setIsGeneratingSocial(true);
    try {
      const content = await generateSocialPosts(platform);
      setSocialPosts(content || "Failed to generate social posts.");
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingSocial(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Use a custom toast or just visual feedback instead of alert
  };

  if (!state) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-emerald-500 font-mono animate-pulse">BOOTING NEURAL-SAFETY KERNEL 2036...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans overflow-x-hidden relative">
      {/* Atmospheric Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 blur-md opacity-20 animate-pulse" />
                <div className="w-10 h-10 bg-black border border-emerald-500/30 rounded-xl flex items-center justify-center relative z-10">
                    <Shield className="w-6 h-6 text-emerald-500" />
                </div>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">DSG™ Neural-Safety Command</h1>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-emerald-500/60 uppercase tracking-[0.2em]">Quantum-Ready Verification</span>
                <div className="w-1 h-1 bg-emerald-500/30 rounded-full" />
                <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">Epoch 2036.03</span>
              </div>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
            <TabButton active={activeTab === 'monitor'} onClick={() => setActiveTab('monitor')} icon={<Layout className="w-4 h-4" />} label="Command" />
            <TabButton active={activeTab === 'readme'} onClick={() => setActiveTab('readme')} icon={<BookOpen className="w-4 h-4" />} label="Documentation" />
            <TabButton active={activeTab === 'diagrams'} onClick={() => setActiveTab('diagrams')} icon={<Activity className="w-4 h-4" />} label="Topography" />
            <TabButton active={activeTab === 'launch'} onClick={() => setActiveTab('launch')} icon={<Rocket className="w-4 h-4" />} label="Deployment" />
          </nav>

          <div className="flex items-center gap-6">
            <div className="hidden xl:flex flex-col items-end">
                <span className="text-[10px] font-mono text-white/30 uppercase">Neural Sync Status</span>
                <span className="text-xs font-mono text-emerald-500 font-bold">STABLE (99.98%)</span>
            </div>
            <button 
              onClick={() => setIsAutoStepping(!isAutoStepping)}
              className={cn(
                "px-6 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 uppercase tracking-widest",
                isAutoStepping ? "bg-red-500/10 text-red-500 border border-red-500/30" : "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
              )}
            >
              {isAutoStepping ? <Activity className="w-4 h-4 animate-pulse" /> : <Zap className="w-4 h-4" />}
              {isAutoStepping ? "HALT KERNEL" : "ENGAGE KERNEL"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-8 py-10">
        <AnimatePresence mode="wait">
          {activeTab === 'monitor' && (
            <motion.div key="monitor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-12 gap-8">
              
              {/* Left: Real-time Analytics */}
              <div className="col-span-12 xl:col-span-3 space-y-8">
                <section className="glass-card p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Gauge className="w-12 h-12" />
                  </div>
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-8">Core Primitives</h2>
                  <div className="space-y-8">
                    <MetricItem label="Drift Arithmetic" value={state.drift.toFixed(6)} sub="D_t Vector" color="emerald" />
                    <MetricItem label="Oscillation Index" value={state.oscillation} sub="O_t Sign-Flip" color="amber" />
                    <MetricItem label="Stability Entropy" value={state.entropy.toFixed(4)} sub="H(S) Randomness" color="blue" />
                  </div>
                </section>

                <section className="glass-card p-8">
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-8">Matrix Topography</h2>
                  <div className="grid grid-cols-4 gap-2">
                    {state.matrix.flat().map((v, i) => (
                      <div 
                        key={i} 
                        className="aspect-square rounded-sm transition-all duration-500 border border-white/5"
                        style={{ backgroundColor: `rgba(16, 185, 129, ${v * 0.8})` }}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] font-mono text-white/20 mt-4 text-center uppercase">Transition Probability Matrix F</p>
                </section>

                <section className="glass-card p-8">
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-8">System Control</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={step} className="btn-secondary py-4"><ChevronRight className="w-4 h-4" /> STEP</button>
                    <button onClick={reset} className="btn-secondary py-4"><RefreshCw className="w-4 h-4" /> RESET</button>
                    <button 
                      onClick={handleAnalyze} 
                      disabled={isAnalyzing}
                      className="col-span-2 btn-primary py-4"
                    >
                      {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                      {isAnalyzing ? "VERIFYING..." : "GENERATE PATENT CLAIMS"}
                    </button>
                  </div>
                </section>
              </div>

              {/* Center: Immersive Visualization */}
              <div className="col-span-12 xl:col-span-6 space-y-8">
                <div className="glass-card p-8 h-[500px] relative flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30">Drift Evolution & Prediction</h3>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                            <span className="text-[10px] font-mono text-white/40 uppercase">Historical</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <span className="text-[10px] font-mono text-white/40 uppercase">Predictive</span>
                        </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[...state.history, ...state.prediction]}>
                        <defs>
                          <linearGradient id="colorDrift" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                        <XAxis dataKey="t" hide />
                        <YAxis domain={[0, 1]} hide />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                            cursor={{ stroke: '#10b981', strokeWidth: 1 }}
                        />
                        <Area type="monotone" dataKey="drift" stroke="#10b981" fillOpacity={1} fill="url(#colorDrift)" strokeWidth={3} />
                        <Area type="monotone" dataKey="drift" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPred)" strokeWidth={3} strokeDasharray="5 5" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass-card p-8 h-[300px]">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-8">Entropy Flux</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={state.history}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                                <XAxis dataKey="t" hide />
                                <YAxis hide />
                                <Line type="monotone" dataKey="entropy" stroke="#3b82f6" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="glass-card p-8 h-[300px] flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />
                        <StateSphere drift={state.drift} />
                        <p className="text-[10px] font-mono text-white/20 mt-4 uppercase tracking-widest">3D State Manifold Projection</p>
                    </div>
                </div>
              </div>

              {/* Right: AI Synthesis */}
              <div className="col-span-12 xl:col-span-3 space-y-8">
                <section className="glass-card p-8 min-h-[400px]">
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-8">Neural Synthesis</h2>
                  <AnimatePresence mode="wait">
                    {patentClaims ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prose prose-invert prose-emerald max-w-none prose-xs">
                            <ReactMarkdown>{patentClaims}</ReactMarkdown>
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center opacity-30">
                            <Cpu className="w-12 h-12 mb-4" />
                            <p className="text-xs font-mono uppercase">Waiting for Synthesis Command...</p>
                        </div>
                    )}
                  </AnimatePresence>
                </section>

                <section className="glass-card p-8">
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-8">Hard Constraints</h2>
                  <div className="space-y-4">
                    <ConstraintCheck label="Temporal Continuity" status={true} />
                    <ConstraintCheck label="Collision Resistance" status={state.drift < 0.8} />
                    <ConstraintCheck label="Invariant Membership" status={state.decision !== 'BLOCK'} />
                    <ConstraintCheck label="Forbidden Transition" status={state.oscillation < 4} />
                  </div>
                </section>
              </div>
            </motion.div>
          )}

          {activeTab === 'readme' && (
            <motion.div key="readme" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-2">Neural Documentation</h2>
                  <p className="text-sm text-white/60">AI-crafted documentation optimized for 2036 standards.</p>
                </div>
                <button 
                  onClick={handleGenerateReadme}
                  disabled={isGeneratingReadme}
                  className="btn-primary px-8 py-3"
                >
                  {isGeneratingReadme ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  {isGeneratingReadme ? "SYNTHESIZING..." : "GENERATE README"}
                </button>
              </div>

              {readmeContent ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="glass-card p-8 h-[600px] overflow-y-auto font-mono text-[10px] relative">
                    <button onClick={() => copyToClipboard(readmeContent)} className="absolute top-6 right-6 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all border border-white/5"><Copy className="w-4 h-4" /></button>
                    <pre className="whitespace-pre-wrap text-emerald-400/60 leading-relaxed">{readmeContent}</pre>
                  </div>
                  <div className="glass-card p-10 h-[600px] overflow-y-auto prose prose-invert prose-emerald max-w-none prose-sm">
                    <ReactMarkdown>{readmeContent}</ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="glass-card p-24 flex flex-col items-center justify-center text-center border-dashed border-white/10">
                  <BookOpen className="w-16 h-16 text-white/5 mb-6" />
                  <p className="text-xs font-mono uppercase text-white/20 tracking-widest">Awaiting Documentation Kernel...</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'diagrams' && (
            <motion.div key="diagrams" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <DiagramCard 
                  title="Neural Architecture" 
                  description="High-level flow from AI Model to Commit State in 2036."
                  svg={<ArchitectureDiagram />}
                />
                <DiagramCard 
                  title="Gate Resolution Flow" 
                  description="Decision resolution path: ALLOW > STABILIZE > BLOCK."
                  svg={<GateLogicDiagram />}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'launch' && (
            <motion.div key="launch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-4 space-y-8">
                  <section className="glass-card p-8">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-8 flex items-center gap-2"><Share2 className="w-4 h-4" /> Deployment Planner</h3>
                    <div className="space-y-3">
                      <SocialButton label="Reddit (r/MachineLearning)" onClick={() => handleGenerateSocial('Reddit')} />
                      <SocialButton label="Hacker News (Show HN)" onClick={() => handleGenerateSocial('Hacker News')} />
                      <SocialButton label="Twitter/X Thread" onClick={() => handleGenerateSocial('Twitter')} />
                    </div>
                  </section>
                  <section className="glass-card p-8 border-emerald-500/10">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500/60 mb-8 flex items-center gap-2"><Star className="w-4 h-4" /> Star Roadmap</h3>
                    <div className="space-y-6">
                      <RoadmapStep step="01" label="v0.1 Release" desc="Core algorithm + Monitor Dashboard" active />
                      <RoadmapStep step="02" label="Reddit Launch" desc="Target 200+ stars in 24h" />
                      <RoadmapStep step="03" label="HN Front Page" desc="Target 500+ stars" />
                      <RoadmapStep step="04" label="Influencer Outreach" desc="Target 1000+ stars" />
                    </div>
                  </section>
                </div>
                <div className="col-span-12 lg:col-span-8">
                  {socialPosts ? (
                    <div className="glass-card p-10 min-h-[400px] relative prose prose-invert prose-emerald max-w-none">
                      <button onClick={() => copyToClipboard(socialPosts)} className="absolute top-8 right-8 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all border border-white/5"><Copy className="w-4 h-4" /></button>
                      <ReactMarkdown>{socialPosts}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="glass-card p-24 flex flex-col items-center justify-center text-center h-full border-dashed border-white/10">
                      <Rocket className="w-16 h-16 text-white/5 mb-6" />
                      <p className="text-xs font-mono uppercase text-white/20 tracking-widest">Select Platform for Synthesis...</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style>{`
        .glass-card {
            background: rgba(255, 255, 255, 0.02);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 24px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        }
        .btn-primary {
            background: #10b981;
            color: #000;
            border-radius: 16px;
            font-size: 11px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            transition: all 0.3s ease;
            display: flex;
            items-center: center;
            justify-content: center;
            gap: 8px;
        }
        .btn-primary:hover {
            background: #059669;
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
        }
        .btn-secondary {
            background: rgba(255, 255, 255, 0.05);
            color: #fff;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            font-size: 11px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            transition: all 0.3s ease;
            display: flex;
            items-center: center;
            justify-content: center;
            gap: 8px;
        }
        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.1);
        }
        .prose-xs {
            font-size: 10px;
            line-height: 1.6;
        }
      `}</style>
    </div>
  );
}

function StateSphere({ drift }: { drift: number }) {
    return (
        <svg width="160" height="160" viewBox="0 0 160 160" className="relative z-10">
            <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(16, 185, 129, 0.1)" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="80" cy="80" r="50" fill="none" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="1" />
            <motion.circle 
                cx="80" 
                cy="80" 
                r={20 + drift * 40} 
                fill="url(#sphereGrad)" 
                animate={{ r: 20 + drift * 40 }}
                transition={{ type: 'spring', stiffness: 100 }}
            />
            <defs>
                <radialGradient id="sphereGrad">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </radialGradient>
            </defs>
        </svg>
    );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-6 py-2.5 rounded-xl text-[11px] font-black transition-all flex items-center gap-3 uppercase tracking-widest",
        active ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" : "text-white/30 hover:text-white/60 hover:bg-white/5"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function MetricItem({ label, value, sub, color }: { label: string, value: string | number, sub: string, color: 'emerald' | 'amber' | 'blue' }) {
  const colorMap = {
    emerald: 'text-emerald-500',
    amber: 'text-amber-500',
    blue: 'text-blue-500',
  };
  return (
    <div className="flex items-center justify-between group">
      <div>
        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-[9px] font-mono text-white/10 uppercase">{sub}</p>
      </div>
      <div className={cn("font-mono font-black text-xl tracking-tighter", colorMap[color])}>{value}</div>
    </div>
  );
}

function ConstraintCheck({ label, status }: { label: string, status: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{label}</span>
      {status ? (
        <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
      ) : (
        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
      )}
    </div>
  );
}


function DiagramCard({ title, description, svg }: { title: string, description: string, svg: React.ReactNode }) {
  return (
    <div className="glass-card p-8 space-y-6">
      <div>
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/60 mb-2">{title}</h3>
        <p className="text-[10px] font-mono text-white/30 uppercase">{description}</p>
      </div>
      <div className="bg-black/20 rounded-2xl p-8 flex items-center justify-center border border-white/5">
        {svg}
      </div>
    </div>
  );
}

function ArchitectureDiagram() {
  return (
    <svg width="200" height="300" viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="50" y="20" width="100" height="40" rx="8" fill="#10b981" fillOpacity="0.1" stroke="#10b981" />
      <text x="100" y="45" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold">AI MODEL</text>
      <path d="M100 60V90" stroke="#10b981" strokeDasharray="2 2" />
      <rect x="50" y="90" width="100" height="40" rx="8" fill="#f59e0b" fillOpacity="0.1" stroke="#f59e0b" />
      <text x="100" y="115" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="bold">PROPOSED STATE</text>
      <path d="M100 130V160" stroke="#f59e0b" />
      <rect x="40" y="160" width="120" height="60" rx="8" fill="#ffffff" fillOpacity="0.05" stroke="#ffffff" strokeOpacity="0.2" />
      <text x="100" y="185" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">DSG™ GATE</text>
      <text x="100" y="205" textAnchor="middle" fill="#ffffff" fillOpacity="0.4" fontSize="8">Drift | Oscillation</text>
      <path d="M100 220V250" stroke="#10b981" />
      <rect x="50" y="250" width="100" height="40" rx="8" fill="#10b981" fillOpacity="0.2" stroke="#10b981" />
      <text x="100" y="275" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold">COMMIT STATE</text>
    </svg>
  );
}

function GateLogicDiagram() {
  return (
    <svg width="240" height="200" viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="120" cy="40" r="30" fill="#ffffff" fillOpacity="0.05" stroke="#ffffff" strokeOpacity="0.2" />
      <text x="120" y="45" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">INPUT</text>
      <path d="M120 70L60 120" stroke="#10b981" />
      <path d="M120 70L120 120" stroke="#f59e0b" />
      <path d="M120 70L180 120" stroke="#ef4444" />
      <rect x="30" y="120" width="60" height="30" rx="4" fill="#10b981" fillOpacity="0.2" stroke="#10b981" />
      <text x="60" y="140" textAnchor="middle" fill="#10b981" fontSize="8" fontWeight="bold">ALLOW</text>
      <rect x="90" y="120" width="60" height="30" rx="4" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" />
      <text x="120" y="140" textAnchor="middle" fill="#f59e0b" fontSize="8" fontWeight="bold">STABILIZE</text>
      <rect x="150" y="120" width="60" height="30" rx="4" fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" />
      <text x="180" y="140" textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="bold">BLOCK</text>
    </svg>
  );
}

function SocialButton({ label, onClick }: { label: string, onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all flex items-center justify-between group">
      <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white">{label}</span>
      <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-emerald-500" />
    </button>
  );
}

function RoadmapStep({ step, label, desc, active }: { step: string, label: string, desc: string, active?: boolean }) {
  return (
    <div className={cn("flex gap-6", active ? "opacity-100" : "opacity-20")}>
      <div className="text-xs font-mono font-black text-emerald-500">{step}</div>
      <div>
        <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{label}</h4>
        <p className="text-[9px] font-mono text-white/30 uppercase">{desc}</p>
      </div>
    </div>
  );
}
