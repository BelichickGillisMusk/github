/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, 
  Lock, 
  Camera, 
  AlertTriangle, 
  UserCheck, 
  MapPin, 
  CheckCircle2,
  Cpu,
  FileText,
  Download,
  Mail,
  Plus,
  LogOut,
  LogIn,
  Loader2,
  X,
  History,
  Settings,
  Activity,
  Zap,
  Clock,
  Palette,
  Bell
} from "lucide-react";
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  setDoc, 
  getDoc,
  updateDoc,
  where,
  limit,
  User
} from "./firebase";
import { GoogleGenAI } from "@google/genai";

// --- Types ---
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

interface EventLog {
  id?: string;
  timestamp: string;
  type: 'theft' | 'break-in' | 'sublease_violation' | 'general_activity' | 'weirdness_alert';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location?: string;
  aiAnalysis?: string;
}

interface WeirdnessConfig {
  normalHours: number[];
  motionThreshold: number;
  lingeringThreshold: number;
  emailTo: string;
  smtpServer: string;
  rtspUrl?: string;
  rtspUsername?: string;
  rtspPassword?: string;
}

interface SecurityReport {
  id?: string;
  generatedAt: string;
  period: 'daily' | 'weekly' | 'monthly';
  summary: string;
  eventCount: number;
  highSeverityCount: number;
  status: 'generated' | 'emailed' | 'downloaded';
}

// --- Presentation Component ---
function PresentationView({ onClose, currentSlide, setCurrentSlide }: { onClose: () => void, currentSlide: number, setCurrentSlide: (s: number) => void }) {
  const slides = [
    {
      title: "SILVERBACK AI",
      subtitle: "Next-Generation Security Systems",
      content: "Protecting 3875 Ruby St with intelligent camera recognition and real-time weirdness detection. Secure, private, and compliant.",
      bg: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200"
    },
    {
      title: "The Challenge",
      subtitle: "Vintage Property Security",
      content: "Vintage 24-unit, 3-story apartment buildings present unique security challenges. Silverback AI provides proactive monitoring while respecting tenant privacy.",
      bg: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200"
    },
    {
      title: "AI Tracking Demo",
      subtitle: "Front Door & Mailboxes",
      isDemo: true,
      content: "Our AI tracks activity at the front door and mailboxes. Tenants are identified only by numeric IDs. Owners only receive footage during 'outside normal operations' alerts.",
      bg: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
    },
    {
      title: "Data Sovereignty",
      subtitle: "Oakland Law Compliance",
      content: "All footage is stored on a secure Virtual Machine (VM). Access is restricted: footage is only passed to police upon their official request for an incident, in accordance with Oakland laws and tenant rights.",
      bg: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=1200"
    }
  ];

  const nextSlide = () => setCurrentSlide((currentSlide + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col overflow-hidden font-sans">
      <div className="absolute top-6 right-6 z-[110] flex gap-4">
        <button 
          onClick={onClose}
          className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-full transition-all border border-white/10"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative flex-1 flex items-center justify-center p-12"
        >
          {/* Background Image */}
          <div className="absolute inset-0 overflow-hidden">
            <img 
              src={slides[currentSlide].bg} 
              className="w-full h-full object-cover opacity-40 scale-105"
              alt="Background"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          </div>

          <div className="relative z-10 max-w-4xl w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-brand-orange font-mono tracking-[0.3em] uppercase text-sm mb-4 block">
                {slides[currentSlide].subtitle}
              </span>
              <h1 className="text-7xl font-extrabold tracking-tighter text-white mb-8 leading-none">
                {slides[currentSlide].title}
              </h1>
              
              {slides[currentSlide].isDemo ? (
                <div className="relative aspect-video bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl mb-8 group">
                  <img 
                    src={slides[currentSlide].bg} 
                    className="w-full h-full object-cover"
                    alt="Lobby Demo"
                    referrerPolicy="no-referrer"
                  />
                  {/* AI Tracking Overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Person 1 */}
                    <motion.div 
                      animate={{ 
                        x: [100, 150, 120, 100],
                        y: [150, 160, 140, 150]
                      }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="absolute w-32 h-48 border-2 border-brand-orange bg-brand-orange/10 rounded-lg flex flex-col items-center"
                    >
                      <div className="absolute -top-10 left-0 bg-brand-orange text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        Person #042 - Tracking
                      </div>
                      {/* Privacy Box (Shoulders Up) */}
                      <div className="w-full h-16 bg-brand-orange/80 backdrop-blur-md mt-0 rounded-t-lg flex items-center justify-center">
                        <span className="text-[8px] text-black font-bold uppercase tracking-widest">Privacy Shield</span>
                      </div>
                    </motion.div>

                    {/* Person 2 */}
                    <motion.div 
                      animate={{ 
                        x: [600, 550, 580, 600],
                        y: [200, 220, 210, 200]
                      }}
                      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                      className="absolute w-28 h-40 border-2 border-zinc-400 bg-zinc-400/10 rounded-lg flex flex-col items-center"
                    >
                      <div className="absolute -top-10 left-0 bg-zinc-400 text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        Person #109 - Tracking
                      </div>
                      {/* Privacy Box (Shoulders Up) */}
                      <div className="w-full h-14 bg-zinc-400/80 backdrop-blur-md mt-0 rounded-t-lg flex items-center justify-center">
                        <span className="text-[8px] text-black font-bold uppercase tracking-widest">Privacy Shield</span>
                      </div>
                    </motion.div>

                    {/* Scanning Line */}
                    <motion.div 
                      animate={{ y: ["0%", "100%", "0%"] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="absolute top-0 left-0 w-full h-0.5 bg-brand-orange/50 shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                    />
                  </div>
                  
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-mono text-white/80 uppercase tracking-widest">Live Feed - Front Door & Mailboxes</span>
                  </div>
                </div>
              ) : (
                <p className="text-2xl text-zinc-300 leading-relaxed max-w-2xl mb-12">
                  {slides[currentSlide].content}
                </p>
              )}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="h-24 bg-zinc-900/50 backdrop-blur-xl border-t border-white/5 flex items-center justify-between px-12">
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-brand-orange' : 'w-2 bg-white/20'}`} 
            />
          ))}
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={prevSlide}
            className="text-white/40 hover:text-white transition-colors"
          >
            <Clock className="w-8 h-8 rotate-180" />
          </button>
          <button 
            onClick={nextSlide}
            className="bg-brand-orange text-black px-8 py-3 rounded-xl font-bold hover:bg-brand-orange/90 transition-all flex items-center gap-2"
          >
            Next Slide
            <Zap className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Error Handling ---
function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- Components ---
function NotificationToast({ notification, onClose }: { notification: EventLog, onClose: () => void, key?: string | number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      className="fixed bottom-6 right-6 z-[200] w-96 bg-zinc-900/90 backdrop-blur-xl border-2 border-brand-orange/50 rounded-2xl p-6 shadow-[0_0_40px_rgba(249,115,22,0.3)] overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-brand-orange" />
      <div className="flex items-start gap-4">
        <div className="p-3 bg-brand-orange/20 rounded-xl border border-brand-orange/30">
          <AlertTriangle className="w-6 h-6 text-brand-orange animate-pulse" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono text-brand-orange uppercase tracking-widest font-bold">High Severity Alert</span>
            <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <h4 className="text-lg font-bold text-white mb-2 leading-tight capitalize">
            {notification.type.replace('_', ' ')}
          </h4>
          <p className="text-sm text-zinc-400 mb-4 leading-relaxed">
            {notification.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono uppercase">
              <MapPin className="w-3 h-3" />
              {notification.location || 'Unknown Location'}
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">
              {new Date(notification.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
      
      {/* Animated Scanning Bar */}
      <motion.div 
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-brand-orange to-transparent opacity-50"
      />
    </motion.div>
  );
}

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      try {
        const parsed = JSON.parse(e.message);
        if (parsed.error) {
          setError(`Security Error: ${parsed.error} during ${parsed.operationType} on ${parsed.path}`);
        }
      } catch {
        setError(e.message);
      }
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (error) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6 backdrop-blur-sm">
        <div className="bg-zinc-900 border border-red-500/50 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">System Error</h2>
          <p className="text-zinc-400 mb-6 text-sm leading-relaxed">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-600 transition-colors"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<SecurityReport[]>([]);
  const [events, setEvents] = useState<EventLog[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [dashboardTab, setDashboardTab] = useState<'overview' | 'weirdness' | 'branding' | 'config'>('overview');
  const [isGeneratingAsset, setIsGeneratingAsset] = useState(false);
  const [generatedAssetUrl, setGeneratedAssetUrl] = useState<string | null>(null);
  const [selectedAssetType, setSelectedAssetType] = useState('App Icon');
  const [selectedStyle, setSelectedStyle] = useState('High-Tech');
  const [weirdnessConfig, setWeirdnessConfig] = useState<WeirdnessConfig>({
    normalHours: Array.from({ length: 16 }, (_, i) => i + 6), // 6am-10pm
    motionThreshold: 0.05,
    lingeringThreshold: 30,
    emailTo: "bryan@norcalcarbmobile.com",
    smtpServer: "smtp.gmail.com",
    rtspUrl: "",
    rtspUsername: "",
    rtspPassword: ""
  });

  const [view, setView] = useState<'dashboard' | 'presentation'>('dashboard');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [notifications, setNotifications] = useState<EventLog[]>([]);

  // --- WebSocket Connection ---
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('Connected to real-time notification server');
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'ALERT') {
          const alert = data.payload as EventLog;
          setNotifications(prev => [alert, ...prev]);
          
          // Play alert sound if possible
          try {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.volume = 0.5;
            audio.play().catch(() => {});
          } catch (e) {
            console.warn("Audio playback failed", e);
          }

          // Auto-remove notification after 10 seconds
          setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== alert.id));
          }, 10000);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socket.onclose = () => {
      console.log('Disconnected from notification server');
    };

    return () => socket.close();
  }, []);

  // --- Auth ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Sync user profile to Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        try {
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            await setDoc(userRef, {
              uid: currentUser.uid,
              email: currentUser.email,
              role: currentUser.email === "bryan@norcalcarbmobile.com" ? 'admin' : 'viewer'
            });
          }
        } catch (error) {
          console.error("Error syncing user profile:", error);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- Data Fetching ---
  useEffect(() => {
    if (!user) return;

    const reportsQuery = query(collection(db, 'security_reports'), orderBy('generatedAt', 'desc'), limit(10));
    const eventsQuery = query(collection(db, 'event_logs'), orderBy('timestamp', 'desc'), limit(20));

    const unsubReports = onSnapshot(reportsQuery, (snapshot) => {
      setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SecurityReport)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'security_reports'));

    const unsubEvents = onSnapshot(eventsQuery, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EventLog)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'event_logs'));

    const configRef = doc(db, 'config', 'weirdness');
    const unsubConfig = onSnapshot(configRef, (snapshot) => {
      if (snapshot.exists()) {
        setWeirdnessConfig(snapshot.data() as WeirdnessConfig);
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'config/weirdness'));

    return () => {
      unsubReports();
      unsubEvents();
      unsubConfig();
    };
  }, [user]);

  const saveWeirdnessConfig = async (newConfig: Partial<WeirdnessConfig>) => {
    if (!user) return;
    const configRef = doc(db, 'config', 'weirdness');
    try {
      await setDoc(configRef, { ...weirdnessConfig, ...newConfig });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'config/weirdness');
    }
  };

  const analyzeEvent = async (event: EventLog) => {
    if (!user || !event.id) return;
    setIsAnalyzing(event.id);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this security event clip description and provide a more detailed, professional security assessment. 
        Event Type: ${event.type}
        Initial Description: ${event.description}
        Severity: ${event.severity}
        
        Provide a detailed breakdown of what might be happening, potential risks, and recommended actions. Keep it concise but professional.`,
      });

      const analysis = response.text || "No analysis available.";
      
      const eventRef = doc(db, 'event_logs', event.id);
      await updateDoc(eventRef, { aiAnalysis: analysis });
    } catch (error) {
      console.error("AI Analysis failed:", error);
      handleFirestoreError(error, OperationType.UPDATE, `event_logs/${event.id}`);
    } finally {
      setIsAnalyzing(null);
    }
  };

  const generateBrandingAsset = async () => {
    if (isGeneratingAsset) return;
    
    setIsGeneratingAsset(true);
    try {
      // Check for API key
      if (!(await (window as any).aistudio.hasSelectedApiKey())) {
        await (window as any).aistudio.openSelectKey();
      }
      
      const ai = new GoogleGenAI({ apiKey: (process.env as any).API_KEY });
      const prompt = `A professional, modern, and minimalist ${selectedAssetType} for an AI security company named "Silverback AI". The style should be ${selectedStyle}. The logo should feature a powerful and sleek silverback gorilla head integrated with digital or circuit patterns to represent AI. Use a color palette of silver, charcoal gray, and a vibrant security orange. The style should be clean, high-tech, and authoritative. No text in the image.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          },
        },
      });

      let foundImage = false;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          setGeneratedAssetUrl(`data:image/png;base64,${base64Data}`);
          foundImage = true;
          break;
        }
      }
      
      if (!foundImage) {
        console.warn("No image data found in response");
      }
    } catch (error) {
      console.error("Error generating branding asset:", error);
      // If requested entity not found, reset key
      if (error instanceof Error && error.message.includes("Requested entity was not found")) {
        await (window as any).aistudio.openSelectKey();
      }
    } finally {
      setIsGeneratingAsset(false);
    }
  };

  const downloadReportCSV = (report: SecurityReport) => {
    const reportDate = new Date(report.generatedAt);
    let startDate = new Date(reportDate);
    
    if (report.period === 'daily') {
      startDate.setDate(reportDate.getDate() - 1);
    } else if (report.period === 'weekly') {
      startDate.setDate(reportDate.getDate() - 7);
    } else if (report.period === 'monthly') {
      startDate.setMonth(reportDate.getMonth() - 1);
    }

    const filteredEvents = events.filter(event => {
      const eventDate = new Date(event.timestamp);
      return eventDate >= startDate && eventDate <= reportDate;
    });

    if (filteredEvents.length === 0) {
      alert("No events found for this report period.");
      return;
    }

    const headers = ["ID", "Timestamp", "Type", "Severity", "Description", "Location", "AI Analysis"];
    const csvContent = [
      headers.join(","),
      ...filteredEvents.map(e => [
        `"${(e.id || "").replace(/"/g, '""')}"`,
        `"${e.timestamp.replace(/"/g, '""')}"`,
        `"${e.type.replace(/"/g, '""')}"`,
        `"${e.severity.replace(/"/g, '""')}"`,
        `"${e.description.replace(/"/g, '""')}"`,
        `"${(e.location || "").replace(/"/g, '""')}"`,
        `"${(e.aiAnalysis || "").replace(/"/g, '""')}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Silverback_Report_${report.period}_${report.generatedAt.split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => signOut(auth);

  const generateReport = async (period: 'daily' | 'weekly' | 'monthly') => {
    if (!user) return;
    setIsGenerating(true);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const highSeverityCount = events.filter(e => e.severity === 'high').length;
      
      const newReport: Omit<SecurityReport, 'id'> = {
        generatedAt: new Date().toISOString(),
        period,
        summary: `AI Analysis complete for 3875 Ruby St. Detected ${events.length} total events. ${highSeverityCount} high-priority alerts require immediate attention. Perimeter integrity remains stable.`,
        eventCount: events.length,
        highSeverityCount,
        status: 'generated'
      };

      await addDoc(collection(db, 'security_reports'), newReport);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'security_reports');
    } finally {
      setIsGenerating(false);
    }
  };

  const addMockEvent = async (typeOverride?: EventLog['type']) => {
    if (!user) return;
    const types: EventLog['type'][] = ['theft', 'break-in', 'sublease_violation', 'general_activity', 'weirdness_alert'];
    const severities: EventLog['severity'][] = ['low', 'medium', 'high', 'critical'];
    
    const type = typeOverride || types[Math.floor(Math.random() * types.length)];
    const isWeird = type === 'weirdness_alert';

    const mockEvent: Omit<EventLog, 'id'> = {
      timestamp: new Date().toISOString(),
      type: type,
      description: isWeird 
        ? "WEIRD: Lingering stranger detected near the rear entrance for >30s." 
        : "AI detected suspicious movement near the rear entrance of 3875 Ruby St.",
      severity: isWeird ? 'high' : severities[Math.floor(Math.random() * severities.length)],
      location: "Rear Entrance"
    };

    try {
      const docRef = await addDoc(collection(db, 'event_logs'), mockEvent);
      
      // If high severity, trigger real-time alert via server
      if (mockEvent.severity === 'high' || mockEvent.severity === 'critical') {
        fetch('/api/trigger-alert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...mockEvent, id: docRef.id })
        }).catch(err => console.error("Failed to trigger server alert:", err));
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'event_logs');
    }
  };

  if (view === 'presentation') {
    return (
      <PresentationView 
        onClose={() => setView('dashboard')} 
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-brand-black text-zinc-100 font-sans selection:bg-brand-orange/30 security-gradient">
        {/* Real-time Notifications */}
        <AnimatePresence>
          {notifications.map((notification, idx) => (
            <NotificationToast 
              key={notification.id || `notif-${idx}`} 
              notification={notification} 
              onClose={() => setNotifications(prev => prev.filter(n => (n.id || n.timestamp) !== (notification.id || notification.timestamp)))} 
            />
          ))}
        </AnimatePresence>

        {/* Navigation */}
        <nav className="border-b border-white/5 bg-brand-black/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowDashboard(false)}>
              <div className="w-10 h-10 bg-brand-orange/20 rounded-xl flex items-center justify-center border border-brand-orange/30 shadow-[0_0_20px_rgba(249,115,22,0.2)]">
                <span className="text-brand-orange font-black text-xl tracking-tighter">SAI</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tighter leading-none">SILVERBACK AI</span>
                <span className="text-[10px] text-brand-orange font-mono tracking-[0.2em] uppercase opacity-80">Security Systems</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <button 
                    onClick={() => setView('presentation')}
                    className="hidden md:flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    Presentation
                  </button>
                  <button 
                    onClick={() => setShowDashboard(!showDashboard)}
                    className="hidden md:flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                  >
                    <History className="w-4 h-4" />
                    Dashboard
                  </button>
                  <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                    <img src={user.photoURL || ""} alt="" className="w-8 h-8 rounded-full border border-white/10" />
                    <button onClick={handleLogout} className="text-zinc-400 hover:text-white transition-colors">
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <button 
                  onClick={handleLogin}
                  className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-zinc-200 transition-colors flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" /> Sign In
                </button>
              )}
            </div>
          </div>
        </nav>

        {!showDashboard ? (
          <>
            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
              </div>

              <div className="max-w-7xl mx-auto px-6 relative">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="max-w-3xl"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-xs font-medium text-brand-orange mb-6">
                    <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                    SILVERBACK AI - SECURITY: Secure and Smart
                  </div>
                  <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-6 leading-[0.95] text-white">
                    Advanced AI Security for <span className="text-brand-orange">3875 Ruby St.</span>
                  </h1>
                  <p className="text-xl text-zinc-400 mb-10 leading-relaxed">
                    Protecting Oakland property with intelligent camera recognition. 
                    Stop theft, prevent break-ins, and verify subleases without compromising resident privacy.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {user ? (
                      <button 
                        onClick={() => setShowDashboard(true)}
                        className="bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-500 transition-all flex items-center justify-center gap-2 group"
                      >
                        Access Dashboard <Shield className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </button>
                    ) : (
                      <button 
                        onClick={handleLogin}
                        className="bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-500 transition-all flex items-center justify-center gap-2 group"
                      >
                        Get Started <Shield className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </button>
                    )}
                    <button className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all">
                      View Demo
                    </button>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Stats/Location Bar */}
            <section className="border-y border-white/10 bg-white/[0.02]">
              <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <MapPin className="text-orange-500 w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-zinc-500 font-medium uppercase tracking-wider">Deployment Site</div>
                    <div className="text-lg font-semibold">3875 Ruby St, Oakland</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <Cpu className="text-orange-500 w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-zinc-500 font-medium uppercase tracking-wider">AI Engine</div>
                    <div className="text-lg font-semibold">Silverback Edge V2.0</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <CheckCircle2 className="text-orange-500 w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-zinc-500 font-medium uppercase tracking-wider">Status</div>
                    <div className="text-lg font-semibold">Active & Monitoring</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-32 bg-black">
              <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                  <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for Modern Security</h2>
                  <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                    Traditional cameras just record. Silverback AI understands. 
                    Our software identifies patterns and anomalies in real-time.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      icon: <Shield className="w-6 h-6 text-orange-500" />,
                      title: "Theft Prevention",
                      description: "Real-time AI monitoring to detect and deter theft before it happens."
                    },
                    {
                      icon: <AlertTriangle className="w-6 h-6 text-orange-500" />,
                      title: "Break-in Protection",
                      description: "Smart perimeter alerts that distinguish between residents and intruders."
                    },
                    {
                      icon: <UserCheck className="w-6 h-6 text-orange-500" />,
                      title: "Sublease Verification",
                      description: "Identify unauthorized occupants and prove sublease violations with visual evidence."
                    },
                    {
                      icon: <AlertTriangle className="w-6 h-6 text-orange-500" />,
                      title: "Weirdness Detection",
                      description: "Proprietary algorithm to detect 'weird' behavior like lingering strangers or high-speed motion after hours."
                    },
                    {
                      icon: <Lock className="w-6 h-6 text-orange-500" />,
                      title: "Privacy First",
                      description: "Edge-processed AI ensures recognition happens locally. No data leaks, total privacy."
                    }
                  ].map((feature, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ y: -5 }}
                      className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-500/50 transition-all group"
                    >
                      <div className="mb-6 p-3 bg-orange-500/10 rounded-xl inline-block group-hover:bg-orange-500/20 transition-colors">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                      <p className="text-zinc-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Hardware Strategy Section */}
            <section id="hardware" className="py-32 bg-zinc-900/50 border-y border-white/5">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16 items-start">
                  <div className="flex-1">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8">The Hardware Strategy</h2>
                    <p className="text-xl text-zinc-400 mb-12 leading-relaxed">
                      Silverback AI is designed to run on what you already own. While many systems require expensive proprietary hubs, 
                      we recommend the "Old Laptop" approach for 3875 Ruby St.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                        <h4 className="font-bold text-orange-500 mb-2">Why Old Laptops?</h4>
                        <ul className="text-sm text-zinc-400 space-y-2">
                          <li>• Zero cost (repurpose old gear)</li>
                          <li>• Built-in battery backup (UPS)</li>
                          <li>• Superior cooling for garage environments</li>
                          <li>• Integrated screen for easy debugging</li>
                        </ul>
                      </div>
                      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                        <h4 className="font-bold text-blue-500 mb-2">The Tapo Advantage</h4>
                        <ul className="text-sm text-zinc-400 space-y-2">
                          <li>• Tapo C120: High-res, low-light</li>
                          <li>• RTSP support for AI integration</li>
                          <li>• USB-C power simplicity</li>
                          <li>• Magnetic mount for quick positioning</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 bg-black rounded-3xl p-8 border border-white/10 shadow-2xl">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                      <CheckCircle2 className="text-orange-500 w-6 h-6" />
                      Deployment Checklist
                    </h3>
                    <div className="space-y-6">
                      {[
                        { step: "01", title: "Prep the Base", desc: "Dust off that old laptop, plug it in a secure garage corner." },
                        { step: "02", title: "Install Core", desc: "Python + OpenCV, NumPy, and Schedule. Takes less than 5 mins." },
                        { step: "03", title: "Mount Camera", desc: "Place Tapo C120 high near mailboxes. Hide cord behind trim." },
                        { step: "04", title: "Enable RTSP", desc: "Get the URL from the Tapo app. Note the local IP address." },
                        { step: "05", title: "Run Silverback", desc: "Paste RTSP URL into the script and launch the AI engine." }
                      ].map((item, i) => (
                        <div key={i} className="flex gap-4">
                          <span className="font-mono text-orange-500 font-bold">{item.step}</span>
                          <div>
                            <h5 className="font-bold text-sm mb-1">{item.title}</h5>
                            <p className="text-xs text-zinc-500">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/10">
                      <div className="bg-orange-500/10 p-4 rounded-xl flex items-center gap-3">
                        <AlertTriangle className="text-orange-500 w-5 h-5 shrink-0" />
                        <p className="text-[10px] text-orange-200/70 font-mono uppercase tracking-wider">
                          PRO TIP: Ensure the laptop is set to "Never Sleep" when lid is closed for 24/7 monitoring.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Privacy Section */}
            <section id="privacy" className="py-32 bg-[#0a0a0a] relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
                <div className="flex-1">
                  <h2 className="text-3xl md:text-5xl font-bold mb-8">Security Without Surveillance</h2>
                  <p className="text-xl text-zinc-400 mb-8 leading-relaxed">
                    We believe privacy is a human right. Silverback AI uses advanced anonymization 
                    techniques to track events and behaviors without storing personal identity data 
                    unless a security breach is detected.
                  </p>
                  <ul className="space-y-4">
                    {[
                      "Local-only data processing",
                      "Automatic face blurring for non-events",
                      "Encrypted evidence storage",
                      "GDPR & CCPA compliant architecture"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-zinc-300">
                        <CheckCircle2 className="text-green-500 w-5 h-5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 relative">
                  <div className="aspect-square bg-gradient-to-br from-orange-600/20 to-blue-600/20 rounded-3xl border border-white/10 flex items-center justify-center p-12">
                    <div className="relative w-full h-full bg-black/40 rounded-2xl border border-white/20 backdrop-blur-xl flex flex-col items-center justify-center text-center p-8">
                      <Camera className="w-16 h-16 text-orange-500 mb-6 animate-pulse" />
                      <div className="font-mono text-xs text-zinc-500 mb-2">SYSTEM_LOG: ENCRYPTED</div>
                      <div className="text-sm font-medium text-zinc-300">
                        Privacy Shield Active. <br />
                        Monitoring 3875 Ruby St.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-32">
              <div className="max-w-5xl mx-auto px-6">
                <div className="bg-gradient-to-r from-orange-600 to-orange-800 rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                  <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 relative z-10">
                    Ready to secure your property?
                  </h2>
                  <p className="text-xl text-orange-100 mb-10 max-w-2xl mx-auto relative z-10">
                    Join the future of Oakland property management. Secure, smart, and privacy-focused.
                  </p>
                  <button className="bg-white text-orange-700 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-zinc-100 transition-all relative z-10 shadow-2xl">
                    Contact Sales
                  </button>
                </div>
              </div>
            </section>
          </>
        ) : (
          /* Dashboard Section */
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-6 py-12"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Security Dashboard</h2>
                <p className="text-zinc-400">Manage reports and monitor events for 3875 Ruby St.</p>
              </div>
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                {(['overview', 'weirdness', 'branding', 'config'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setDashboardTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                      dashboardTab === tab 
                        ? 'bg-brand-orange text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => addMockEvent('weirdness_alert')}
                  className="bg-brand-orange/10 border border-brand-orange/30 text-brand-orange px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-orange/20 transition-all flex items-center gap-2"
                >
                  <Bell className="w-4 h-4" /> Trigger Real-time Alert
                </button>
                <button 
                  onClick={() => addMockEvent()}
                  className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Mock Event
                </button>
                <div className="relative group">
                  <button 
                    disabled={isGenerating}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-500 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                    Generate Report
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                    {(['daily', 'weekly', 'monthly'] as const).map(p => (
                      <button 
                        key={p}
                        onClick={() => generateReport(p)}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors capitalize"
                      >
                        {p} Report
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {dashboardTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Reports List */}
                <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <FileText className="text-orange-500 w-5 h-5" />
                    Recent Reports
                  </h3>
                  <div className="grid gap-4">
                    <AnimatePresence mode="popLayout">
                      {reports.map((report) => (
                        <motion.div 
                          key={report.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-orange-500/30 transition-all"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-orange-500/10 rounded-lg">
                                <FileText className="text-orange-500 w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-bold capitalize">{report.period} Security Summary</h4>
                                <p className="text-xs text-zinc-500">{new Date(report.generatedAt).toLocaleString()}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => downloadReportCSV(report)}
                                className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors"
                                title="Download CSV"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors">
                                <Mail className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{report.summary}</p>
                          <div className="flex gap-4">
                            <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                              {report.eventCount} Events
                            </div>
                            <div className="px-3 py-1 bg-red-500/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-red-400">
                              {report.highSeverityCount} High Priority
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {reports.length === 0 && (
                      <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-2xl">
                        <FileText className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                        <p className="text-zinc-500">No reports generated yet.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Live Events Feed */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <History className="text-orange-500 w-5 h-5" />
                    Live Event Feed
                  </h3>
                  <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
                    <div className="max-h-[600px] overflow-y-auto p-4 space-y-4">
                      {events.map((event) => (
                        <div key={event.id} className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                          <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                            event.severity === 'high' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 
                            event.severity === 'medium' ? 'bg-orange-500' : 'bg-blue-500'
                          }`} />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold uppercase tracking-tighter text-zinc-300">
                                {event.type.replace('_', ' ')}
                              </span>
                              <span className="text-[10px] text-zinc-600">
                                {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-500 leading-snug mb-2">{event.description}</p>
                            
                            {event.aiAnalysis ? (
                              <div className="mt-2 p-3 bg-orange-500/5 border border-orange-500/10 rounded-lg">
                                <div className="flex items-center gap-2 mb-1">
                                  <Cpu className="w-3 h-3 text-orange-500" />
                                  <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">AI Analysis</span>
                                </div>
                                <p className="text-[10px] text-zinc-400 leading-relaxed italic">
                                  {event.aiAnalysis}
                                </p>
                              </div>
                            ) : (
                              <button 
                                onClick={() => analyzeEvent(event)}
                                disabled={isAnalyzing === event.id}
                                className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 hover:text-orange-500 transition-colors uppercase tracking-widest disabled:opacity-50"
                              >
                                {isAnalyzing === event.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Zap className="w-3 h-3" />
                                )}
                                {isAnalyzing === event.id ? 'Analyzing...' : 'Analyze Clip'}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      {events.length === 0 && (
                        <p className="text-center py-10 text-zinc-600 text-sm italic">Waiting for events...</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {dashboardTab === 'weirdness' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-bold flex items-center gap-3">
                        <Zap className="text-orange-500 w-6 h-6" />
                        Weirdness Monitor
                      </h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-bold text-green-500 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Algorithm Active
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-2">Current Activity Level</div>
                        <div className="text-3xl font-mono font-bold text-white">0.024%</div>
                        <div className="mt-2 text-[10px] text-zinc-400">Normal baseline: &lt; 0.03%</div>
                      </div>
                      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-2">Last Detection</div>
                        <div className="text-3xl font-mono font-bold text-zinc-400">None</div>
                        <div className="mt-2 text-[10px] text-zinc-400">No weirdness in last 24h</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Active Detection Rules</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/5">
                          <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-zinc-500" />
                            <span className="text-sm">Off-Hours Motion (&gt;5% change)</span>
                          </div>
                          <span className="text-[10px] font-mono text-orange-500">ACTIVE</span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/5">
                          <div className="flex items-center gap-3">
                            <Activity className="w-4 h-4 text-zinc-500" />
                            <span className="text-sm">Lingering Stranger (&gt;30s detection)</span>
                          </div>
                          <span className="text-[10px] font-mono text-orange-500">ACTIVE</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black border border-white/10 rounded-2xl p-6">
                    <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4">Algorithm Logic (weird_detector.py)</h4>
                    <pre className="text-[10px] font-mono text-zinc-500 bg-zinc-950 p-4 rounded-lg overflow-x-auto leading-relaxed">
{`def is_weird(frame, timestamp):
    # ... processing ...
    motion_level = cv2.countNonZero(thresh) / total_pixels
    
    # "Weird" rules:
    if motion_level > 0.05 and hour not in NORMAL_HOURS:
        return True, "Fast motion after hours"
    if motion_level > 0.03 and lingering_time > 30:
        return True, "Lingering stranger"
    return False, None`}
                    </pre>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <AlertTriangle className="text-orange-500 w-5 h-5" />
                    Weirdness Alerts
                  </h3>
                  <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="text-zinc-700 w-6 h-6" />
                    </div>
                    <p className="text-zinc-500 text-sm">No weird events detected in the current session.</p>
                    <button 
                      onClick={() => addMockEvent('weirdness_alert')}
                      className="mt-6 text-xs font-bold text-orange-500 hover:text-orange-400 transition-colors"
                    >
                      Simulate Weird Event
                    </button>
                  </div>
                </div>
              </div>
            )}

            {dashboardTab === 'branding' && (
              <div className="space-y-8">
                <div className="glass-card p-8 security-gradient">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                      <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <Palette className="text-brand-orange w-8 h-8" />
                        Silverback Branding Studio
                      </h2>
                      <p className="text-zinc-400">Generate high-quality branding assets for your Silverback security systems.</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-orange/10 border border-brand-orange/20 text-xs font-bold text-brand-orange uppercase tracking-widest">
                      <Cpu className="w-4 h-4" />
                      Powered by Nano Banana
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">Asset Type</label>
                        <div className="grid grid-cols-2 gap-3">
                          {['App Icon', 'Security Sign', 'Vehicle Decal', 'Uniform Patch'].map(type => (
                            <button 
                              key={type} 
                              onClick={() => setSelectedAssetType(type)}
                              className={`px-4 py-3 rounded-xl border text-sm text-left transition-all group ${
                                selectedAssetType === type 
                                  ? 'border-brand-orange bg-brand-orange/10' 
                                  : 'border-white/5 bg-white/[0.02] hover:border-brand-orange/30 hover:bg-brand-orange/5'
                              }`}
                            >
                              <div className={`font-bold mb-1 transition-colors ${selectedAssetType === type ? 'text-brand-orange' : 'group-hover:text-brand-orange'}`}>{type}</div>
                              <div className="text-[10px] text-zinc-500">Professional {type.toLowerCase()}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">Style Preference</label>
                        <div className="flex flex-wrap gap-2">
                          {['High-Tech', 'Minimalist', 'Aggressive', 'Professional', 'Futuristic'].map(style => (
                            <button 
                              key={style} 
                              onClick={() => setSelectedStyle(style)}
                              className={`px-4 py-2 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all ${
                                selectedStyle === style
                                  ? 'border-brand-orange text-brand-orange bg-brand-orange/10'
                                  : 'border-white/10 text-zinc-400 hover:border-brand-orange hover:text-brand-orange'
                              }`}
                            >
                              {style}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <button 
                          onClick={generateBrandingAsset}
                          disabled={isGeneratingAsset}
                          className="w-full bg-brand-orange text-white py-5 rounded-2xl font-bold text-lg hover:bg-orange-500 transition-all shadow-[0_0_30px_rgba(249,115,22,0.3)] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isGeneratingAsset ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Zap className="w-5 h-5" />
                          )}
                          {isGeneratingAsset ? 'Generating...' : 'Generate Branding Asset'}
                        </button>
                        <p className="text-[10px] text-zinc-600 text-center mt-4 font-mono uppercase tracking-widest">
                          Estimated generation time: 12.4s
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-brand-orange to-brand-silver rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                      <div className="relative glass-card bg-black/60 border-dashed border-white/10 flex flex-col items-center justify-center p-4 text-center aspect-square overflow-hidden">
                        {generatedAssetUrl ? (
                          <div className="w-full h-full relative group/img">
                            <img 
                              src={generatedAssetUrl} 
                              alt="Generated Branding Asset" 
                              className="w-full h-full object-contain rounded-xl"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-4">
                              <button 
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = generatedAssetUrl;
                                  link.download = `silverback-${selectedAssetType.toLowerCase().replace(' ', '-')}.png`;
                                  link.click();
                                }}
                                className="p-3 bg-brand-orange rounded-full text-white hover:scale-110 transition-transform"
                                title="Download Asset"
                              >
                                <Download className="w-6 h-6" />
                              </button>
                              <button 
                                onClick={() => setGeneratedAssetUrl(null)}
                                className="p-3 bg-white/10 rounded-full text-white hover:scale-110 transition-transform"
                                title="Clear"
                              >
                                <X className="w-6 h-6" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                              <Palette className="w-10 h-10 text-zinc-700" />
                            </div>
                            <h4 className="text-lg font-bold mb-2">Ready to Generate</h4>
                            <p className="text-zinc-500 text-sm max-w-[200px] mx-auto">Select an asset type and style to begin the AI branding process.</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-card p-6 border-brand-orange/20">
                    <div className="text-brand-orange font-mono text-[10px] uppercase tracking-widest mb-2">Active Palette</div>
                    <div className="flex gap-2 h-12">
                      <div className="flex-1 bg-brand-black rounded-lg border border-white/10" title="Charcoal Black"></div>
                      <div className="flex-1 bg-brand-orange rounded-lg" title="Security Orange"></div>
                      <div className="flex-1 bg-brand-silver rounded-lg" title="Silverback Gray"></div>
                      <div className="flex-1 bg-white rounded-lg" title="Pure White"></div>
                    </div>
                  </div>
                  <div className="glass-card p-6 flex items-center justify-between">
                    <div>
                      <div className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-1">Brand Font</div>
                      <div className="text-xl font-bold tracking-tighter">Inter Display</div>
                    </div>
                    <div className="text-4xl font-bold text-zinc-800">Aa</div>
                  </div>
                  <div className="glass-card p-6 flex items-center justify-between">
                    <div>
                      <div className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-1">Mono Font</div>
                      <div className="text-xl font-mono font-bold tracking-tighter">JetBrains</div>
                    </div>
                    <div className="text-4xl font-mono font-bold text-zinc-800">01</div>
                  </div>
                </div>
              </div>
            )}

            {dashboardTab === 'config' && (
              <div className="max-w-3xl mx-auto">
                <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <Settings className="text-zinc-400 w-6 h-6" />
                    Algorithm Configuration
                  </h3>

                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Normal Hours (Start)</label>
                        <input 
                          type="number" 
                          value={weirdnessConfig.normalHours[0]}
                          onChange={(e) => {
                            const start = parseInt(e.target.value);
                            const end = weirdnessConfig.normalHours[weirdnessConfig.normalHours.length - 1];
                            const newHours = Array.from({ length: end - start + 1 }, (_, i) => i + start);
                            setWeirdnessConfig({ ...weirdnessConfig, normalHours: newHours });
                          }}
                          className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Normal Hours (End)</label>
                        <input 
                          type="number" 
                          value={weirdnessConfig.normalHours[weirdnessConfig.normalHours.length - 1]}
                          onChange={(e) => {
                            const end = parseInt(e.target.value);
                            const start = weirdnessConfig.normalHours[0];
                            const newHours = Array.from({ length: end - start + 1 }, (_, i) => i + start);
                            setWeirdnessConfig({ ...weirdnessConfig, normalHours: newHours });
                          }}
                          className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Motion Threshold (%)</label>
                      <input 
                        type="range" 
                        min="1" 
                        max="20" 
                        value={weirdnessConfig.motionThreshold * 100}
                        onChange={(e) => setWeirdnessConfig({ ...weirdnessConfig, motionThreshold: parseInt(e.target.value) / 100 })}
                        className="w-full accent-orange-500"
                      />
                      <div className="flex justify-between text-[10px] text-zinc-500 mt-2 font-mono">
                        <span>1% (Sensitive)</span>
                        <span>{Math.round(weirdnessConfig.motionThreshold * 100)}% (Current)</span>
                        <span>20% (Low)</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Alert Email</label>
                      <input 
                        type="email" 
                        value={weirdnessConfig.emailTo}
                        onChange={(e) => setWeirdnessConfig({ ...weirdnessConfig, emailTo: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none transition-all"
                      />
                    </div>

                    <div className="pt-8 border-t border-white/10">
                      <h4 className="text-lg font-bold mb-6 text-zinc-300">Camera Stream Configuration</h4>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">RTSP URL</label>
                          <input 
                            type="text" 
                            placeholder="rtsp://192.168.1.100:554/stream1"
                            value={weirdnessConfig.rtspUrl || ""}
                            onChange={(e) => setWeirdnessConfig({ ...weirdnessConfig, rtspUrl: e.target.value })}
                            className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none transition-all"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Username</label>
                            <input 
                              type="text" 
                              value={weirdnessConfig.rtspUsername || ""}
                              onChange={(e) => setWeirdnessConfig({ ...weirdnessConfig, rtspUsername: e.target.value })}
                              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Password</label>
                            <input 
                              type="password" 
                              value={weirdnessConfig.rtspPassword || ""}
                              onChange={(e) => setWeirdnessConfig({ ...weirdnessConfig, rtspPassword: e.target.value })}
                              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-orange-500 outline-none transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-white/10">
                      <button 
                        onClick={() => saveWeirdnessConfig(weirdnessConfig)}
                        className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-all"
                      >
                        Save Configuration
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy & Compliance Section */}
            <div className="mt-8 p-6 bg-zinc-900/50 rounded-2xl border border-white/5 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-brand-orange" />
                <h3 className="font-bold text-lg">Privacy & Compliance</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-zinc-400 leading-relaxed">
                <div className="space-y-3">
                  <p>
                    <span className="text-white font-medium">Tenant Privacy:</span> Tenants are identified only by anonymized numeric IDs. No facial data or PII is stored in the primary detection database.
                  </p>
                  <p>
                    <span className="text-white font-medium">Data Sovereignty:</span> All footage is stored on a secure, isolated Virtual Machine (VM). Owners only receive footage alerts for "outside normal operations" events.
                  </p>
                </div>
                <div className="space-y-3">
                  <p>
                    <span className="text-white font-medium">Law Enforcement:</span> Footage is only shared with police upon official request for specific incidents, ensuring full compliance with Oakland surveillance ordinances.
                  </p>
                  <p>
                    <span className="text-white font-medium">Rights:</span> Our systems are designed to respect tenant rights and local laws while maintaining property security.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Footer */}
        <footer className="border-t border-white/10 py-12 bg-black mt-20">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-orange/20 rounded-lg flex items-center justify-center border border-brand-orange/30">
                <span className="text-brand-orange font-black text-xs tracking-tighter">SAI</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold tracking-tight text-white">SILVERBACK AI</span>
                <span className="text-[8px] text-brand-orange font-mono tracking-widest uppercase">Security</span>
              </div>
            </div>
            <div className="text-zinc-500 text-sm text-center md:text-left">
              © 2026 SILVERBACK AI - SECURITY. Secure and Smart. 3875 Ruby St, Oakland.<br/>
              <span className="text-[10px] opacity-60">Compliant with Oakland Surveillance Ordinances & Tenant Rights.</span>
            </div>
            <div className="flex gap-6 text-zinc-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
