import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, serverTimestamp } from 'firebase/firestore';
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Users, 
  Clock, 
  TrendingUp,
  Target,
  Mail,
  Search,
  CreditCard,
  MessageSquare,
  History,
  ClipboardCheck,
  Calendar,
  Sparkles,
  PlayCircle,
  BarChart4,
  Fingerprint,
  Cpu,
  Workflow,
  ShieldAlert,
  ZapOff,
  LineChart,
  Activity,
  Award,
  Check,
  ArrowUpRight,
  Database,
  Layers,
  Star,
  Banknote,
  Binary,
  Microscope,
  Box,
  Globe,
  Settings,
  Lock,
  List,
  Download,
  AlertCircle,
  X,
  ChevronRight,
  TrendingDown
} from 'lucide-react';

// --- CONFIGURATION FIREBASE ---
const firebaseConfig = typeof __firebase_config !== 'undefined' 
  ? JSON.parse(__firebase_config) 
  : { apiKey: "", authDomain: "", projectId: "", storageBucket: "", messagingSenderId: "", appId: "" };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [user, setUser] = useState(null);
  const [leads, setLeads] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ email: '', module: 'KYC & Onboarding Autonome' });
  const [formError, setFormError] = useState('');

  // Charte graphique comete.ai
  const theme = {
    yellow: "#ffde59",
    deepBlue: "#002d62", 
    lightBlue: "#5170ff",
    white: "#ffffff"
  };

  const LOGO_URL = "https://cdn.convrrt.com/apps/sendinblue/6761372/ab4f2f8e-3e94-4b4e-8ff8-e21271d4b3f4.png";
  const WEBSITE_URL = "https://comete.ai/";

  const images = {
    hero: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=2000", 
    kyc: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
    credit: "https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&q=80&w=1200",
    cx: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200",
    recovery: "https://images.unsplash.com/photo-1560472355-536de3962603?auto=format&fit=crop&q=80&w=1200",
    reporting: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
    meeting: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1000",
    data: "https://images.unsplash.com/photo-1551288049-bbb653283b78?auto=format&fit=crop&q=80&w=800"
  };

  // --- AUTHENTIFICATION ---
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth error:", error);
      }
    };
    
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  // --- RÉCUPÉRATION DES LEADS (Admin) ---
  useEffect(() => {
    if (!user) return;
    const leadsRef = collection(db, 'artifacts', appId, 'public', 'data', 'leads');
    const unsubscribe = onSnapshot(leadsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLeads(data);
    }, (error) => console.error("Snapshot error:", error));
    return () => unsubscribe();
  }, [user]);

  const handleCtaClick = (e) => {
    e.preventDefault();
    setIsSubmitted(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsSubmitted(false);
    setFormError('');
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const common = ['gmail.com', 'yahoo.fr', 'hotmail.com', 'outlook.com', 'orange.fr', 'free.fr'];
    if (!re.test(email)) return "Veuillez entrer un email valide.";
    const domain = email.split('@')[1];
    if (common.includes(domain.toLowerCase())) return "Veuillez utiliser un email professionnel.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateEmail(formData.email);
    if (error) {
      setFormError(error);
      return;
    }
    
    if (!user) return;
    
    setIsSubmitting(true);
    setFormError('');
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'leads'), {
        ...formData,
        timestamp: serverTimestamp(),
        userId: user.uid,
        source: 'Landing Page v2.0'
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ ...formData, email: '' });
    } catch (err) {
      console.error("Submission error:", err);
      setIsSubmitting(false);
      setFormError("Erreur technique. Veuillez réessayer.");
    }
  };

  const exportToCSV = () => {
    if (leads.length === 0) return;
    const headers = ["Date", "Email", "Module"];
    const rows = leads.map(l => [
      l.timestamp ? new Date(l.timestamp.seconds * 1000).toLocaleString() : '',
      l.email,
      l.module
    ]);
    let csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `comete_leads_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-[#002d62] overflow-x-hidden text-left">
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } }
        @keyframes scan { 0% { top: -10%; opacity: 0; } 50% { opacity: 0.5; } 100% { top: 110%; opacity: 0; } }
        @keyframes pulse-glow { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.05); } }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 30s linear infinite; }
        .tech-grid { background-image: radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0); background-size: 40px 40px; }
        .tech-grid-dark { background-image: radial-gradient(circle at 1px 1px, rgba(0, 45, 98, 0.05) 1px, transparent 0); background-size: 40px 40px; }
      `}} />

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-[60] transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-xl border-b border-slate-100 py-3 shadow-sm' : 'bg-transparent py-4 md:py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center text-left">
          <div className="flex items-center gap-4">
            <a href={WEBSITE_URL} target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">
              <img src={LOGO_URL} alt="comete.ai" className={`transition-all duration-300 object-contain ${isScrolled ? 'h-7 md:h-8' : 'h-8 md:h-12'}`} style={!isScrolled ? { filter: 'brightness(0) invert(1)' } : {}} />
            </a>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <button onClick={() => setShowAdmin(!showAdmin)} className={`p-2 rounded-full border transition-colors ${isScrolled ? 'border-slate-200 text-slate-400 hover:text-[#002d62]' : 'border-white/20 text-white/40 hover:text-white'}`}>
                <List className="w-4 h-4" />
              </button>
            )}
            <button onClick={handleCtaClick} className={`flex items-center gap-2 px-4 md:px-7 py-2 md:py-3 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all transform hover:-translate-y-0.5 active:scale-95 shadow-xl ${isScrolled ? 'bg-[#002d62] text-white hover:bg-[#5170ff]' : 'bg-white text-[#002d62] hover:bg-[#ffde59]'}`}>
              <Calendar className="w-3 h-3 md:w-4 md:h-4" />
              <span>Planifier un rendez-vous</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-40 md:pb-40 overflow-hidden bg-[#002d62] text-left">
        <div className="absolute inset-0 z-0">
          <img src={images.hero} alt="Intelligence Artificielle" className="w-full h-full object-cover opacity-50 mix-blend-screen scale-105 object-center md:object-right transition-transform duration-[10s]" />
          <div className="absolute inset-0 tech-grid opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#002d62] via-[#002d62]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#002d62] via-transparent to-transparent"></div>
          <div className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#5170ff]/40 to-transparent animate-[scan_8s_linear_infinite] z-1"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 text-left text-white">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-md px-4 md:px-5 py-2 md:py-2.5 rounded-2xl mb-8 animate-in fade-in slide-in-from-top duration-1000">
              <Banknote className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#ffde59] animate-pulse" />
              <span className="text-white font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em]">BANQUE DE DÉTAIL : TOP 5 DES TÂCHES AUTOMATISABLES</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-[84px] font-extrabold leading-[1] mb-8 tracking-tighter drop-shadow-2xl">
              L'IA qui orchestre <br className="hidden md:block"/>
              <span className="text-[#ffde59]">votre back-office.</span>
            </h1>
            
            <p className="text-base md:text-xl lg:text-2xl text-blue-50/80 mb-12 max-w-2xl font-light leading-relaxed">
              Passez à l'IA hybride pour automatiser vos processus les plus complexes. Réduisez vos coûts de traitement de 42% avec les <span className="font-bold text-white underline decoration-[#ffde59] underline-offset-8">Agents Augmentés</span> comete.ai.
            </p>

            <button onClick={handleCtaClick} className="group relative bg-[#ffde59] hover:bg-white text-[#002d62] font-black px-8 md:px-12 py-4 md:py-6 rounded-xl md:rounded-2xl text-lg md:text-xl flex items-center justify-center gap-4 transition-all shadow-2xl shadow-black/20 hover:scale-105 active:scale-95">
              Planifier un rendez-vous
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:translate-x-2" />
            </button>
          </div>
        </div>

        {/* Trust Bar / Logo Loop */}
        <div className="absolute bottom-0 left-0 w-full bg-black/20 backdrop-blur-md py-6 border-t border-white/10 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap items-center">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="flex items-center gap-20 px-10">
                <span className="text-white/40 font-black text-sm uppercase tracking-widest flex items-center gap-3"><Globe className="w-4 h-4"/> BNP PARIBAS</span>
                <span className="text-white/40 font-black text-sm uppercase tracking-widest flex items-center gap-3"><Globe className="w-4 h-4"/> SOCIÉTÉ GÉNÉRALE</span>
                <span className="text-white/40 font-black text-sm uppercase tracking-widest flex items-center gap-3"><Globe className="w-4 h-4"/> CRÉDIT AGRICOLE</span>
                <span className="text-white/40 font-black text-sm uppercase tracking-widest flex items-center gap-3"><Globe className="w-4 h-4"/> BPCE</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admin Leads View */}
      {showAdmin && (
        <section className="bg-slate-50 py-12 border-b border-slate-200 animate-in slide-in-from-top duration-500">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Lock className="w-6 h-6 text-[#002d62]" />
                <h2 className="text-2xl font-black text-[#002d62] uppercase tracking-widest">Liste des Inscrits</h2>
              </div>
              <button onClick={exportToCSV} className="flex items-center gap-2 bg-[#002d62] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase hover:bg-[#5170ff] transition-all active:scale-95 shadow-xl">
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
            <div className="bg-white rounded-3xl shadow-xl overflow-x-auto border border-slate-200">
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-[#002d62] text-white text-[10px] font-black uppercase tracking-widest">
                  <tr><th className="p-6">Date</th><th className="p-6">Email Professionnel</th><th className="p-6">Module Prioritaire</th></tr>
                </thead>
                <tbody className="text-sm">
                  {leads.length === 0 ? (
                    <tr><td colSpan="3" className="p-12 text-center text-slate-400 italic">Aucun inscrit pour le moment...</td></tr>
                  ) : (
                    leads.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)).map((lead) => (
                      <tr key={lead.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="p-6 text-slate-400 font-mono">{lead.timestamp ? new Date(lead.timestamp.seconds * 1000).toLocaleString('fr-FR') : 'En cours...'}</td>
                        <td className="p-6 font-bold text-[#002d62]">{lead.email}</td>
                        <td className="p-6 text-[#5170ff] font-medium">{lead.module}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Comparison Section - New Value Optimization */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 text-left">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-[#002d62] tracking-tight leading-tight">La performance sans <br/><span className="text-[#5170ff]">compromis technique.</span></h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-200">
              <div className="flex items-center gap-4 mb-8 text-slate-400 uppercase font-black text-xs tracking-widest">
                <TrendingDown className="w-5 h-5 text-red-400" /> Back-office Traditionnel
              </div>
              <ul className="space-y-6">
                {["Traitement documentaire manuel (2-3j)", "Saisie Core-Banking sujette aux erreurs", "Audit par échantillonnage (1.5% flux)", "Coûts de structure rigides"].map((t, i) => (
                  <li key={i} className="flex items-center gap-4 text-slate-500 font-medium"><X className="w-5 h-5 text-red-300 shrink-0" /> {t}</li>
                ))}
              </ul>
            </div>
            <div className="bg-[#002d62] p-10 rounded-[40px] shadow-2xl border border-white/10 text-white">
              <div className="flex items-center gap-4 mb-8 text-[#ffde59] uppercase font-black text-xs tracking-widest">
                <TrendingUp className="w-5 h-5" /> Orchestration comete.ai
              </div>
              <ul className="space-y-6">
                {["Analyse sémantique temps réel (< 10min)", "Automatisation des actes via API sécurisée", "Audit exhaustif permanent (100% flux)", "Scalabilité infinie sans recrutement"].map((t, i) => (
                  <li key={i} className="flex items-center gap-4 text-blue-50 font-medium"><CheckCircle2 className="w-5 h-5 text-[#ffde59] shrink-0" /> {t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="relative group perspective-1000">
              <div className="relative z-10 bg-[#ffde59] text-[#002d62] p-10 md:p-14 rounded-[40px] shadow-2xl max-w-md mx-auto border-8 border-white transition-all transform hover:rotate-y-6 duration-500">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 opacity-70">Impact financier observé :</p>
                <p className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-none animate-[pulse-glow_3s_infinite]">-42%</p>
                <p className="text-base font-bold leading-tight">de réduction directe sur vos frais de traitement back-office bancaire grâce à l'IA.</p>
              </div>
            </div>
            <div className="space-y-8 text-left">
              <div className="inline-flex items-center gap-2 bg-[#002d62] text-white px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl animate-[float_6s_infinite]"><Cpu className="w-4 h-4 text-[#ffde59]" /> Technologie Core-Banking</div>
              <h2 className="text-4xl md:text-6xl font-extrabold text-[#002d62] tracking-tight leading-[1.1]">Éliminez l'inefficacité structurelle.</h2>
              <p className="text-slate-500 text-lg md:text-xl font-light italic leading-relaxed border-l-4 border-[#5170ff] pl-8">"Le Smart CX commence par l'excellence opérationnelle. comete.ai permet d'automatiser 100% de la complexité sans compromis sur la conformité."</p>
            </div>
          </div>
        </div>
      </section>

      {/* THE 5 MODULES */}
      <section className="py-24 bg-[#002d62] relative overflow-hidden text-left">
        <div className="absolute inset-0 tech-grid opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <h2 className="text-3xl md:text-7xl font-extrabold mb-16 tracking-tighter text-white">Le Top 5 de la <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffde59] to-amber-200">Transformation IA.</span></h2>
          <div className="space-y-16">
            {[
              { image: images.kyc, icon: <Fingerprint className="w-6 h-6" />, id: "01", title: "KYC & Onboarding Autonome", subtitle: "Réduction des délais de 48h à 10min.", content: "L'orchestration IA déploie des modèles de vision et de langage pour authentifier les pièces d'identité et croiser les données en temps réel.", benefits: ["Extraction OCR/LLM haute fidélité", "Vérification biométrique", "Scoring AML dynamique", "Taux d'abandon réduit de 28%"], metric: "10 min", metricLabel: "Délai moyen d'onboarding" },
              { image: images.credit, icon: <TrendingUp className="w-6 h-6" />, id: "02", title: "Instruction de Crédit Augmentée", subtitle: "Aide à la décision motivée sous 4 heures.", content: "Nos agents IA analysent 100% des relevés bancaires et avis d'imposition pour générer un Credit Memo identifiant les signaux faibles.", benefits: ["Moteur de pré-analyse financière", "Génération auto de rapports", "Détection des falsifications", "Productivité analyste x3.5"], metric: "x3.5", metricLabel: "Capacité d'analyse" },
              { image: images.cx, icon: <Workflow className="w-6 h-6" />, id: "03", title: "Gestion des Actes & Flux Clients", subtitle: "Zéro saisie manuelle pour le back-office N1.", content: "60% des flux mails concernent des actes répétitifs. Nos agents IA qualifient l'intention et exécutent l'acte via vos API.", benefits: ["Tri sémantique intelligent", "Automatisation actes (RIB/Plafonds)", "Réponses haute-fidélité", "Routage dynamique expert"], metric: "-65%", metricLabel: "Frais de traitement" },
              { image: images.recovery, icon: <History className="w-6 h-6" />, id: "04", title: "Recouvrement Amiable Empathique", subtitle: "Optimisez la performance sans briser la LTV.", content: "Notre IA analyse les patterns de paiement pour prédire les fragilités et orchestre des parcours de relance adaptés au profil client.", benefits: ["Segmentation prédictive débiteurs", "Relances omnicanales autonomes", "Plans d'apurement auto-négociés", "Passages contentieux -22%"], metric: "+18%", metricLabel: "Efficacité recouvrement" },
              { image: images.reporting, icon: <BarChart4 className="w-6 h-6" />, id: "05", title: "Reporting & Audit Permanent", subtitle: "Vigilance réglementaire 100% automatisée.", content: "comete.ai agit comme un superviseur permanent, auditant 100% de votre production contre les exigences BCE/ACPR.", benefits: ["Dashboards conformité 'Live'", "Génération dossiers d'audit", "Alertes instantanées dérives", "Zéro risque de sanctions"], metric: "100%", metricLabel: "Couverture d'audit" },
            ].map((item, idx) => (
              <div key={idx} className="group flex flex-col lg:flex-row bg-white rounded-[40px] shadow-2xl overflow-hidden transition-all duration-500 border border-transparent hover:border-[#ffde59]/20">
                <div className="lg:w-[30%] relative h-64 lg:h-auto overflow-hidden shrink-0 bg-slate-900">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-50 mix-blend-luminosity group-hover:scale-110 transition-transform duration-[4s]" />
                  <div className="absolute top-8 left-8 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center text-[#ffde59]">{item.icon}</div>
                </div>
                <div className="flex-1 p-10 lg:p-14 flex flex-col justify-between bg-white text-left">
                  <div>
                    <h3 className="text-[#002d62] text-3xl font-black mb-2 tracking-tight group-hover:translate-x-1 transition-transform">{item.title}</h3>
                    <p className="text-[#5170ff] text-lg font-bold mb-6">{item.subtitle}</p>
                    <p className="text-slate-600 text-base leading-relaxed mb-8 border-l-4 border-[#ffde59] pl-6 italic">{item.content}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {item.benefits.map((b, i) => <div key={i} className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-500 mt-1 shrink-0" /><span className="text-slate-700 text-sm font-medium">{b}</span></div>)}
                    </div>
                  </div>
                  <div className="pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-10 mt-10">
                    <div className="flex items-center gap-6 self-start sm:self-center">
                      <div className="text-6xl font-black text-[#002d62] tracking-tighter leading-none">{item.metric}</div>
                      <div className="h-10 w-[2px] bg-[#ffde59] hidden sm:block"></div>
                      <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest max-w-[100px] leading-tight">{item.metricLabel}</p>
                    </div>
                    <button onClick={handleCtaClick} className="w-full sm:w-auto flex items-center justify-center gap-3 text-[#002d62] font-black uppercase tracking-[0.2em] text-[10px] py-5 px-10 bg-slate-50 rounded-2xl hover:bg-[#002d62] hover:text-white transition-all shadow-sm">Planifier un RDV <ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Action Section */}
      <section className="py-32 bg-white overflow-hidden relative text-left">
        <div className="absolute inset-0 tech-grid-dark opacity-[0.05]"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 text-left">
          <div className="flex flex-col items-center lg:items-start mb-20">
            <div className="inline-flex items-center gap-2 text-[#5170ff] font-black text-[10px] md:text-xs uppercase tracking-widest mb-8 animate-[float_6s_infinite]"><Award className="w-5 h-5" /> Vision comete.ai</div>
            <h2 className="text-4xl md:text-8xl font-extrabold mb-8 text-[#002d62] tracking-tighter text-left">Activez votre levier IA.</h2>
            <p className="text-slate-500 text-lg md:text-2xl font-light mb-8 max-w-3xl leading-relaxed text-left">Transformons ensemble vos gisements de valeur en gains de profitabilité lors d'une session de diagnostic stratégique.</p>
          </div>
          <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto text-left">
            <div className="lg:col-span-3 bg-slate-950 rounded-[48px] p-10 md:p-20 border border-white/5 shadow-2xl flex flex-col justify-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#002d62]/30 blur-[150px] rounded-full animate-pulse"></div>
              <h3 className="text-xl md:text-2xl font-black text-[#ffde59] mb-12 uppercase tracking-[0.3em] text-left">Audit Stratégique (30 min) :</h3>
              <ul className="space-y-8">
                {[ { title: "Éligibilité IA", desc: "Audit flash de vos processus back-office." }, { title: "Modélisation ROI", desc: "Chiffrage précis des gains sur 12 mois." }, { title: "Schéma Directeur", desc: "Roadmap d'implémentation sans rupture." }, { title: "Démo Prototype", desc: "Test sur l'un de vos propres cas d'usage." } ].map((item, i) => (
                  <li key={i} className="flex gap-6 items-center text-left">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-[#ffde59] border border-white/10 shrink-0"><ArrowUpRight className="w-6 h-6" /></div>
                    <div className="text-left"><h4 className="font-bold text-white text-lg mb-1">{item.title}</h4><p className="text-slate-400 text-sm font-light">{item.desc}</p></div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-2 relative h-full min-h-[500px]">
              <div className="bg-[#002d62] rounded-[48px] p-10 md:p-14 text-center relative overflow-hidden shadow-2xl h-full flex flex-col justify-center border-b-[15px] border-[#ffde59]">
                <div className="absolute inset-0 z-0"><img src={images.meeting} className="w-full h-full object-cover opacity-20 grayscale" alt="Meeting" /><div className="absolute inset-0 bg-[#002d62]/80"></div></div>
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 bg-[#ffde59] rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl rotate-3"><Calendar className="w-10 h-10 text-[#002d62]" /></div>
                  <h4 className="text-3xl font-black text-white mb-6 uppercase tracking-widest text-center">Diagnostic <br/>Gratuit</h4>
                  <p className="text-blue-200 mb-12 font-bold uppercase tracking-widest text-[10px] text-center">Session Stratégique • Sous 24h</p>
                  <button onClick={handleCtaClick} className="w-full bg-[#ffde59] hover:bg-white text-[#002d62] font-black px-8 py-8 rounded-[32px] text-xl transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3">Réserver <ArrowRight className="w-6 h-6" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 py-10 border-t border-slate-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-4 text-left">
            <a href={WEBSITE_URL} target="_blank" rel="noopener noreferrer"><img src={LOGO_URL} className="h-6 md:h-7 object-contain opacity-80" alt="comete.ai" /></a>
            <div className="h-4 w-[1px] bg-slate-300 hidden md:block"></div>
            <p className="text-slate-400 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-left">L'IA Opérationnelle pour la Banque de Détail.</p>
          </div>
          <div className="flex gap-8 text-slate-400 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em]">
            <span>© 2026 comete.ai</span>
            <a href={WEBSITE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#002d62] transition-colors">comete.ai</a>
            <a href="#" className="hover:text-[#002d62] transition-colors">Confidentialité</a>
          </div>
        </div>
      </footer>

      {/* Modal - Enhanced Success & Validation */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#002d62]/95 backdrop-blur-md animate-in fade-in duration-300" onClick={closeModal}></div>
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-xl relative z-10 overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500 border border-slate-100">
            <div className="bg-[#ffde59] h-2 w-full"></div>
            <div className="p-10 md:p-14 text-left">
              {!isSubmitted ? (
                <>
                  <div className="flex justify-between items-center mb-10">
                    <img src={LOGO_URL} alt="comete.ai" className="h-6 md:h-7 object-contain" />
                    <button onClick={closeModal} className="text-slate-300 hover:text-slate-900 transition-all p-2 hover:bg-slate-50 rounded-full"><X className="w-8 h-8"/></button>
                  </div>
                  <h3 className="text-3xl md:text-5xl font-black text-[#002d62] mb-4 tracking-tighter text-center uppercase">Diagnostic <br/>Stratégique.</h3>
                  <p className="text-slate-500 text-lg md:text-xl font-light text-center mb-10">Notre équipe reviendra vers vous sous 24h.</p>
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Email Professionnel</label>
                      <div className="relative">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-6 h-6" />
                        <input type="email" required placeholder="nom.prenom@votre-banque.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={`w-full pl-16 pr-8 py-5 rounded-[28px] border-2 focus:border-[#5170ff] outline-none transition-all text-lg font-medium ${formError ? 'border-red-200 bg-red-50' : 'border-slate-100 bg-slate-50'}`} />
                      </div>
                      {formError && <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase mt-2 px-2"><AlertCircle className="w-3 h-3" /> {formError}</div>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Module Prioritaire</label>
                      <select value={formData.module} onChange={(e) => setFormData({...formData, module: e.target.value})} className="w-full px-8 py-5 rounded-[28px] border-2 border-slate-100 focus:border-[#5170ff] outline-none transition-all bg-slate-50 text-lg font-medium appearance-none cursor-pointer">
                        <option>KYC & Onboarding Autonome</option>
                        <option>Instruction de Crédit Augmentée</option>
                        <option>Back-office & Flux Transactionnels</option>
                        <option>Audit, Risque & Conformité</option>
                      </select>
                    </div>
                    <button type="submit" disabled={isSubmitting || !user} className="w-full bg-[#002d62] hover:bg-[#5170ff] text-white font-black py-7 rounded-[32px] shadow-2xl transition-all active:scale-[0.98] mt-6 text-2xl flex items-center justify-center gap-5 disabled:opacity-50">
                      {isSubmitting ? "Enregistrement..." : "CONFIRMER LE RDV"} <Calendar className="w-7 h-7" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-12 text-center animate-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl shadow-emerald-500/10">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h3 className="text-4xl font-black text-[#002d62] mb-6 uppercase tracking-tighter">Demande confirmée.</h3>
                  <p className="text-slate-500 text-xl font-light leading-relaxed mb-10 px-8">Nous avons bien reçu votre demande de diagnostic. Un responsable de compte <strong>comete.ai</strong> vous contactera dans les prochaines 24h.</p>
                  <button onClick={closeModal} className="bg-[#002d62] text-white font-black px-12 py-5 rounded-full uppercase text-xs tracking-widest hover:bg-[#5170ff] transition-all active:scale-95">Fermer</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
