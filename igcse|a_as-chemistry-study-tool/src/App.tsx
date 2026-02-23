/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  GraduationCap, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  RefreshCcw, 
  Atom, 
  Info,
  ArrowLeft,
  Trophy,
  Lightbulb,
  Search,
  Database,
  Sparkles,
  Loader2,
  MessageCircle,
  LogOut,
  Send,
  Zap
} from 'lucide-react';
import { questions, Question } from './questions';
import { generateMoreQuestions, GeneratedQuestion } from './services/geminiService';

type ViewMode = 'home' | 'study' | 'quiz' | 'result' | 'bank';

export default function App() {
  const [view, setView] = useState<ViewMode>('home');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  
  // Question Bank State
  const [allQuestions, setAllQuestions] = useState<Question[]>(questions);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [bankChapterFilter, setBankChapterFilter] = useState<number | null>(null);

  // Zalo Auth & Chat State
  const [zaloUser, setZaloUser] = useState<any>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: 'Xin chào! Tôi là trợ lý học tập IGCSE. Bạn cần hỏi gì về môn Hóa học không?' }
  ]);

  useEffect(() => {
    // Check if user is already logged in
    fetch('/api/user')
      .then(res => res.ok ? res.json() : null)
      .then(user => {
        if (user) setZaloUser(user);
      });

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'ZALO_AUTH_SUCCESS') {
        setZaloUser(event.data.user);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleZaloLogin = async () => {
    try {
      const response = await fetch('/api/auth/zalo/url');
      const { url } = await response.json();
      window.open(url, 'zalo_login', 'width=600,height=700');
    } catch (error) {
      console.error('Failed to get Zalo login URL', error);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    setZaloUser(null);
    setIsChatOpen(false);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    const newHistory = [...chatHistory, { role: 'user' as const, text: chatMessage }];
    setChatHistory(newHistory);
    setChatMessage('');

    // Simulate bot response
    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        role: 'bot', 
        text: 'Cảm ơn bạn đã đặt câu hỏi. Giáo viên YENTHANH sẽ phản hồi bạn sớm nhất qua Zalo 0868 466 486!' 
      }]);
    }, 1000);
  };

  const startQuiz = (chapter: number | null = null) => {
    setSelectedChapter(chapter);
    // Filter questions by chapter if selected
    const pool = chapter 
      ? allQuestions.filter(q => q.chapter === chapter)
      : allQuestions;
    
    // Pick 30 random questions from the bank (or all if less than 30)
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 30);
    setQuizQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setView('quiz');
  };

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === quizQuestions[currentQuestionIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setView('result');
    }
  };

  const handleGenerateMore = async (count: number = 10) => {
    setIsGenerating(true);
    try {
      const newQuestions = await generateMoreQuestions(count);
      if (newQuestions.length > 0) {
        const formatted = newQuestions.map((q, i) => ({
          ...q,
          id: allQuestions.length + i + 1
        }));
        setAllQuestions(prev => [...prev, ...formatted]);
      }
    } catch (error) {
      console.error("Failed to generate questions", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredQuestions = useMemo(() => {
    return allQuestions.filter(q => {
      const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           q.topic.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesChapter = bankChapterFilter === null || q.chapter === bankChapterFilter;
      return matchesSearch && matchesChapter;
    });
  }, [allQuestions, searchTerm, bankChapterFilter]);

  const visibleQuestions = useMemo(() => {
    return filteredQuestions.slice(0, visibleCount);
  }, [filteredQuestions, visibleCount]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Sticky Watermark Banner */}
      <div className="sticky top-0 z-[60] bg-indigo-600 text-white py-2 px-4 shadow-lg border-b border-indigo-500/30">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] sm:text-xs font-black tracking-[0.15em] uppercase flex items-center gap-2">
            <span className="bg-white text-indigo-600 px-2 py-0.5 rounded text-[9px]">OFFICIAL</span>
            YENTHANH | Zalo: 0868 466 486 | IGCSE | A/AS | IB | ENGLISH
          </p>
          <div className="flex items-center gap-4">
            <a 
              href="https://zalo.me/0868466486" 
              target="_blank" 
              rel="noreferrer"
              className="text-[10px] font-bold underline hover:text-indigo-100 transition-colors"
            >
              Liên hệ Zalo trực tiếp
            </a>
            {zaloUser ? (
              <div className="flex items-center gap-2">
                <img src={zaloUser.picture?.data?.url || zaloUser.picture} alt="" className="w-5 h-5 rounded-full border border-white/20" />
                <span className="text-[10px] font-bold">{zaloUser.name}</span>
                <button onClick={handleLogout} className="text-[10px] opacity-60 hover:opacity-100"><LogOut size={12} /></button>
              </div>
            ) : (
              <button 
                onClick={handleZaloLogin}
                className="bg-white text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider hover:bg-indigo-50 transition-all shadow-sm"
              >
                Đăng nhập Zalo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-[40px] sm:top-[32px] z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setView('home')}
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Atom size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Atomic Structure</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">IGCSE|A/AS Chemistry</p>
            </div>
          </div>
          
          {view !== 'home' && (
            <button 
              onClick={() => setView('home')}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft size={18} />
              <span>Back to Home</span>
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 gap-8 items-center py-12"
            >
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest">
                  Chapter 1: AS Level Summary
                </div>
                <h2 className="text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                  The <span className="text-indigo-600">Building Blocks</span> of Chemistry.
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed max-w-md">
                  A comprehensive study guide and question bank designed for IGCSE students to ace Atomic Structure.
                </p>
                <div className="flex flex-col gap-6 pt-4">
                  <div className="space-y-3">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Study Mode</p>
                    <div className="flex flex-wrap gap-3">
                      <button 
                        onClick={() => { setSelectedChapter(1); setView('study'); }}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
                      >
                        <BookOpen size={18} />
                        Chapter 1
                      </button>
                      <button 
                        onClick={() => { setSelectedChapter(2); setView('study'); }}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
                      >
                        <BookOpen size={18} />
                        Chapter 2
                      </button>
                      <button 
                        onClick={() => { setSelectedChapter(3); setView('study'); }}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
                      >
                        <BookOpen size={18} />
                        Chapter 3
                      </button>
                      <button 
                        onClick={() => { setSelectedChapter(4); setView('study'); }}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
                      >
                        <BookOpen size={18} />
                        Chapter 4
                      </button>
                      <button 
                        onClick={() => { setSelectedChapter(5); setView('study'); }}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-700 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
                      >
                        <BookOpen size={18} />
                        Chapter 5
                      </button>
                      <button 
                        onClick={() => { setSelectedChapter(null); setView('study'); }}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 border-2 border-transparent rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-all"
                      >
                        All Chapters
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Practice Quiz</p>
                    <div className="flex flex-wrap gap-3">
                      <button 
                        onClick={() => startQuiz(1)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 rounded-xl font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                      >
                        <GraduationCap size={18} />
                        Quiz Ch. 1
                      </button>
                      <button 
                        onClick={() => startQuiz(2)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 rounded-xl font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                      >
                        <GraduationCap size={18} />
                        Quiz Ch. 2
                      </button>
                      <button 
                        onClick={() => startQuiz(3)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 rounded-xl font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                      >
                        <GraduationCap size={18} />
                        Quiz Ch. 3
                      </button>
                      <button 
                        onClick={() => startQuiz(4)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 rounded-xl font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                      >
                        <GraduationCap size={18} />
                        Quiz Ch. 4
                      </button>
                      <button 
                        onClick={() => startQuiz(5)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 rounded-xl font-bold text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                      >
                        <GraduationCap size={18} />
                        Quiz Ch. 5
                      </button>
                      <button 
                        onClick={() => startQuiz(null)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-all"
                      >
                        Full Quiz
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={() => setView('bank')}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 rounded-2xl font-bold text-white hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 w-full sm:w-auto"
                  >
                    <Database size={20} />
                    Question Bank
                  </button>
                </div>
              </div>
              <div className="relative hidden md:block">
                <div className="absolute -inset-4 bg-indigo-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <div className="relative bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                        <CheckCircle2 size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Subatomic Particles</p>
                        <p className="text-xs text-slate-500">Protons, Neutrons, Electrons</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                      <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                        <Info size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Ionisation Energy</p>
                        <p className="text-xs text-slate-500">Trends & Definitions</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                        <RefreshCcw size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Isotopes & Ions</p>
                        <p className="text-xs text-slate-500">Formation & Rules</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'study' && (
            <motion.div 
              key="study"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12 pb-20"
            >
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                      <BookOpen size={20} />
                    </div>
                    <h3 className="text-2xl font-bold">
                      {selectedChapter ? `Chapter ${selectedChapter} Review` : 'Full Course Review'}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    {[null, 1, 2].map((ch) => (
                      <button
                        key={String(ch)}
                        onClick={() => setSelectedChapter(ch)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedChapter === ch ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-300'}`}
                      >
                        {ch === null ? 'All' : `Ch. ${ch}`}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="grid gap-6">
                  {/* Chapter 1 Summary Table */}
                  {(selectedChapter === null || selectedChapter === 1) && (
                    <>
                      <div className="flex items-center gap-3 mt-4">
                        <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                          <Atom size={16} />
                        </div>
                        <h4 className="text-xl font-bold">Chapter 1: Atomic Structure</h4>
                      </div>
                      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50 border-bottom border-slate-200">
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Topic</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">English Explanation</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Giải thích Tiếng Việt</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {[
                                { t: "Subatomic particles", en: "Atom contains protons (+1), neutrons (0), electrons (−1).", vi: "Nguyên tử gồm proton (+1), neutron (0), electron (−1)." },
                                { t: "Atomic number (Z)", en: "Z = number of protons.", vi: "Z = số proton." },
                                { t: "Mass number (A)", en: "A = protons + neutrons.", vi: "A = proton + neutron." },
                                { t: "Isotopes", en: "Same protons, different neutrons.", vi: "Cùng proton, khác neutron." },
                                { t: "Relative atomic mass (Ar)", en: "Weighted average of isotopic masses.", vi: "Trung bình có tính độ phổ biến đồng vị." },
                                { t: "Ion formation", en: "Losing e⁻ → positive ion. Gaining e⁻ → negative ion.", vi: "Mất e⁻ → ion dương. Nhận e⁻ → ion âm." },
                                { t: "Ionisation Energy", en: "Energy required to remove 1 mole of e⁻ from 1 mole of gaseous atoms.", vi: "Năng lượng cần để tách 1 mol e khỏi 1 mol nguyên tử khí." },
                                { t: "IE Trend (Period)", en: "Increases due to higher nuclear charge and smaller radius.", vi: "Tăng do điện tích hạt nhân tăng và bán kính giảm." },
                                { t: "IE Trend (Group)", en: "Decreases due to shielding and greater distance.", vi: "Giảm do che chắn và khoảng cách lớn hơn." },
                              ].map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="p-4 font-bold text-sm text-indigo-600">{row.t}</td>
                                  <td className="p-4 text-sm text-slate-600">{row.en}</td>
                                  <td className="p-4 text-sm text-slate-500 italic">{row.vi}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Chapter 2 Summary Table */}
                  {(selectedChapter === null || selectedChapter === 2) && (
                    <>
                      <div className="flex items-center gap-3 mt-8">
                        <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                          <Sparkles size={16} />
                        </div>
                        <h4 className="text-xl font-bold">Chapter 2: Stoichiometry</h4>
                      </div>

                      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50 border-bottom border-slate-200">
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Topic</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Formula / Rule</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Giải thích Tiếng Việt</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Example</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {[
                                { t: "Mole Concept", f: "1 mol = 6.02 × 10²³ particles", vi: "1 mol = 6.02 × 10²³ hạt", ex: "1 mol Na = 6.02 × 10²³ atoms" },
                                { t: "Basic Formula", f: "n = m / Mr", vi: "n = m / Mr", ex: "18g H₂O = 1 mol" },
                                { t: "Gas at r.t.p", f: "1 mol = 24 dm³", vi: "1 mol khí = 24 dm³", ex: "48 dm³ O₂ = 2 mol" },
                                { t: "Concentration", f: "c = n / V (dm³)", vi: "c = n / V (V tính dm³)", ex: "0.5 mol in 0.25 dm³ = 2M" },
                                { t: "Limiting Reagent", f: "Smallest mol/coeff ratio", vi: "Chia mol cho hệ số; nhỏ nhất là giới hạn", ex: "2H₂ + O₂ → O₂ limiting" },
                                { t: "Percentage Yield", f: "(Actual / Theoretical) × 100", vi: "%H = (Thực tế / Lý thuyết) × 100", ex: "4.2g / 5.6g = 75%" },
                                { t: "Atom Economy", f: "(Mr Desired / Total Mr) × 100", vi: "AE = (Mr SP / Tổng Mr SP) × 100", ex: "Addition = 100% AE" },
                                { t: "Empirical Formula", f: "% → mol → divide by smallest", vi: "Giả sử 100g → mol → chia số nhỏ nhất", ex: "40%C, 6.7%H, 53.3%O → CH₂O" },
                              ].map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="p-4 font-bold text-sm text-emerald-600">{row.t}</td>
                                  <td className="p-4 text-sm text-slate-600">{row.f}</td>
                                  <td className="p-4 text-sm text-slate-500 italic">{row.vi}</td>
                                  <td className="p-4 text-sm text-slate-500">{row.ex}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Advanced Examples */}
                  {(selectedChapter === null || selectedChapter === 2) && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
                        <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <Database size={24} className="text-emerald-400" />
                          Hydrated Salt Calculation
                        </h4>
                        <div className="space-y-2 text-sm opacity-90 font-mono">
                          <p>5.00g CuSO₄·xH₂O heated → 3.20g</p>
                          <p>Water lost = 1.80g</p>
                          <p>n(H₂O) = 1.80/18 = 0.100 mol</p>
                          <p>n(CuSO₄) = 3.20/160 = 0.020 mol</p>
                          <p className="text-emerald-400 font-bold">Ratio 5:1 → CuSO₄·5H₂O</p>
                        </div>
                      </div>

                      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                        <h4 className="text-xl font-bold mb-4 text-slate-900">Exam Traps</h4>
                        <ul className="space-y-4 text-sm">
                          <li className="flex flex-col gap-1">
                            <div className="flex items-start gap-2">
                              <XCircle size={16} className="text-rose-500 mt-1 shrink-0" />
                              <span>Using <b>22.4 dm³</b> (STP) instead of <b>24 dm³</b> (RTP).</span>
                            </div>
                            <span className="text-slate-400 italic ml-6 text-xs">Dùng 22.4 dm³ (STP) thay vì 24 dm³ (RTP).</span>
                          </li>
                          <li className="flex flex-col gap-1">
                            <div className="flex items-start gap-2">
                              <XCircle size={16} className="text-rose-500 mt-1 shrink-0" />
                              <span>Forgetting to convert <b>cm³ to dm³</b> (divide by 1000).</span>
                            </div>
                            <span className="text-slate-400 italic ml-6 text-xs">Quên đổi cm³ sang dm³ (chia cho 1000).</span>
                          </li>
                          <li className="flex flex-col gap-1">
                            <div className="flex items-start gap-2">
                              <XCircle size={16} className="text-rose-500 mt-1 shrink-0" />
                              <span>Not <b>balancing</b> the equation before calculations.</span>
                            </div>
                            <span className="text-slate-400 italic ml-6 text-xs">Không cân bằng phương trình trước khi tính toán.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Advanced Problem Solving */}
                  {(selectedChapter === null || selectedChapter === 2) && (
                    <section className="space-y-6 mt-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                          <GraduationCap size={20} />
                        </div>
                        <h3 className="text-2xl font-bold">Advanced Problem Solving</h3>
                      </div>

                      <div className="grid gap-6">
                        {[
                          { 
                            t: "Limiting Reagent", 
                            viT: "Chất giới hạn",
                            steps: ["Convert all reactants to moles", "Divide moles by coefficient", "Smallest value = limiting reagent", "Use it to find product"],
                            viSteps: ["Đổi chất phản ứng sang mol", "Chia mol cho hệ số", "Nhỏ nhất là chất giới hạn", "Dùng nó tính sản phẩm"],
                            ex: "2H₂ + O₂ → 2H₂O. 5 mol H₂, 2 mol O₂. O₂ is limiting (2/1 < 5/2)."
                          },
                          { 
                            t: "% Purity", 
                            viT: "% Độ tinh khiết",
                            steps: ["Find mass of pure substance from reaction", "Divide by total mass of sample", "Multiply by 100"],
                            viSteps: ["Tìm m chất nguyên chất", "Chia cho tổng khối lượng mẫu", "Nhân với 100"],
                            ex: "5.00g impure CaCO₃ gives 1.76g CO₂. Pure CaCO₃ = 4.00g. Purity = 80%."
                          },
                          { 
                            t: "Empirical Formula", 
                            viT: "Công thức đơn giản nhất",
                            steps: ["Assume 100g sample", "Convert % to moles (n = m/Ar)", "Divide all by smallest mole value", "Convert to whole number ratio"],
                            viSteps: ["Giả sử mẫu 100g", "Đổi % sang mol", "Chia cho mol nhỏ nhất", "Đưa về tỉ lệ số nguyên"],
                            ex: "40%C, 6.7%H, 53.3%O → CH₂O"
                          }
                        ].map((item, i) => (
                          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center gap-2 mb-3">
                              <h4 className="font-bold text-lg text-slate-900">{item.t}</h4>
                              <span className="text-sm text-slate-400 font-medium italic">({item.viT})</span>
                            </div>
                            <div className="space-y-4">
                              <div className="flex flex-wrap gap-2">
                                {item.steps.map((step, si) => (
                                  <span key={si} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full border border-slate-200">
                                    {si + 1}. {step}
                                  </span>
                                ))}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {item.viSteps.map((step, si) => (
                                  <span key={si} className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-medium rounded-full border border-indigo-100 italic">
                                    {si + 1}. {step}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-slate-100 mt-4">
                              <b>Example:</b> {item.ex}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Chapter 3 Summary Table */}
                  {(selectedChapter === null || selectedChapter === 3) && (
                    <>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                          <BookOpen size={20} />
                        </div>
                        <h3 className="text-2xl font-bold">Chapter 3: Chemical Bonding</h3>
                      </div>

                      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden mb-8">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Topic</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">English Explanation</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Giải thích Tiếng Việt</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Example</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {[
                                { t: "Ionic Bonding", f: "Transfer of electrons from metal to non-metal", vi: "Chuyển electron từ kim loại sang phi kim", ex: "Na + Cl → Na⁺ + Cl⁻" },
                                { t: "Why ionic forms?", f: "Metal loses e, non-metal gains e for full shell", vi: "Kim loại mất e, phi kim nhận e để đạt cấu hình bền", ex: "Na (2,8,1) → Na⁺ (2,8)" },
                                { t: "Ionic Properties", f: "High melting point, conduct when molten/dissolved", vi: "Nóng chảy cao, dẫn điện khi lỏng/tan", ex: "NaCl melts at high temp" },
                                { t: "Covalent Bonding", f: "Sharing of electron pairs between atoms", vi: "Chia sẻ cặp electron", ex: "H₂, O₂, H₂O" },
                                { t: "Bond Types", f: "Single = 1 pair, Double = 2, Triple = 3", vi: "Đơn = 1 cặp, Đôi = 2, Ba = 3", ex: "O=O, N≡N" },
                                { t: "Dative Bond", f: "Both electrons in shared pair come from one atom", vi: "Cả 2 e do 1 nguyên tử cung cấp", ex: "NH₃ + H⁺ → NH₄⁺" },
                                { t: "Electronegativity", f: "Ability of atom to attract bonding electrons", vi: "Khả năng hút cặp e liên kết", ex: "F is most electronegative" },
                                { t: "Bond Polarity", f: "Large EN difference → polar bond", vi: "Chênh lệch độ âm điện lớn → phân cực", ex: "O–H is polar" },
                                { t: "Intermolecular", f: "Hydrogen bonding, permanent dipole, London forces", vi: "Liên kết H, lưỡng cực vĩnh viễn, lực London", ex: "H₂O has hydrogen bonding" },
                                { t: "H-Bonding", f: "Occurs when H bonded to N, O or F", vi: "Xảy ra khi H liên kết với N, O hoặc F", ex: "H₂O, NH₃" },
                                { t: "VSEPR Theory", f: "Electron pairs repel to minimise repulsion", vi: "Các cặp e đẩy nhau để giảm lực đẩy", ex: "CH₄ tetrahedral (109.5°)" },
                                { t: "Lone Pair Effect", f: "Lone pair repels more strongly than bonding pair", vi: "Cặp e tự do đẩy mạnh hơn cặp liên kết", ex: "NH₃ 107°, H₂O 104.5°" },
                                { t: "Metallic Bonding", f: "Positive ions in sea of delocalised electrons", vi: "Ion dương trong biển electron tự do", ex: "Conductivity of metals" },
                                { t: "Bond Enthalpy", f: "Energy to break 1 mol of bonds (g)", vi: "Năng lượng phá 1 mol liên kết (khí)", ex: "ΔH = Σbroken - Σformed" },
                              ].map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="p-4 font-bold text-sm text-indigo-600">{row.t}</td>
                                  <td className="p-4 text-sm text-slate-600">{row.f}</td>
                                  <td className="p-4 text-sm text-slate-500 italic">{row.vi}</td>
                                  <td className="p-4 text-sm text-slate-500">{row.ex}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
                          <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Database size={24} className="text-emerald-400" />
                            Bond Enthalpy Calculation
                          </h4>
                          <div className="space-y-2 text-sm opacity-90 font-mono">
                            <p className="text-emerald-400">H₂ + Cl₂ → 2HCl</p>
                            <p>Broken: H–H(436) + Cl–Cl(243) = 679</p>
                            <p>Formed: 2 × H–Cl(431) = 862</p>
                            <p className="text-emerald-400 font-bold">ΔH = 679 - 862 = -183 kJ/mol</p>
                            <p className="text-xs italic opacity-70">Exothermic / Phản ứng tỏa nhiệt</p>
                          </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                          <h4 className="text-xl font-bold mb-4 text-slate-900">Exam Traps (Ch. 3)</h4>
                          <ul className="space-y-4 text-sm">
                            <li className="flex flex-col gap-1">
                              <div className="flex items-start gap-2">
                                <XCircle size={16} className="text-rose-500 mt-1 shrink-0" />
                                <span>Calling <b>Hydrogen bond</b> a covalent bond.</span>
                              </div>
                              <span className="text-slate-400 italic ml-6 text-xs">Nó là lực liên phân tử, không phải liên kết cộng hóa trị.</span>
                            </li>
                            <li className="flex flex-col gap-1">
                              <div className="flex items-start gap-2">
                                <XCircle size={16} className="text-rose-500 mt-1 shrink-0" />
                                <span>Forgetting <b>gaseous state</b> in bond enthalpy.</span>
                              </div>
                              <span className="text-slate-400 italic ml-6 text-xs">Định nghĩa yêu cầu trạng thái khí (g).</span>
                            </li>
                            <li className="flex flex-col gap-1">
                              <div className="flex items-start gap-2">
                                <XCircle size={16} className="text-rose-500 mt-1 shrink-0" />
                                <span>Confusing <b>bond polarity</b> with molecular polarity.</span>
                              </div>
                              <span className="text-slate-400 italic ml-6 text-xs">Hình dạng phân tử ảnh hưởng đến độ phân cực tổng.</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <section className="space-y-6 mb-8">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                            <GraduationCap size={20} />
                          </div>
                          <h3 className="text-2xl font-bold">VSEPR: Shapes & Angles</h3>
                        </div>

                        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Domains (B+L)</th>
                                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Shape (EN/VI)</th>
                                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Angle</th>
                                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Example</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {[
                                  { d: "2 (2+0)", s: "Linear / Thẳng", a: "180°", ex: "CO₂" },
                                  { d: "3 (3+0)", s: "Trigonal planar / Tam giác phẳng", a: "120°", ex: "BF₃" },
                                  { d: "3 (2+1)", s: "Bent / Gấp khúc", a: "<120°", ex: "SO₂" },
                                  { d: "4 (4+0)", s: "Tetrahedral / Tứ diện", a: "109.5°", ex: "CH₄" },
                                  { d: "4 (3+1)", s: "Trigonal pyramidal / Chóp tam giác", a: "107°", ex: "NH₃" },
                                  { d: "4 (2+2)", s: "Bent / Gấp khúc", a: "104.5°", ex: "H₂O" },
                                  { d: "5 (5+0)", s: "Trigonal bipyramidal / Lưỡng tháp", a: "90°/120°", ex: "PCl₅" },
                                  { d: "6 (6+0)", s: "Octahedral / Bát diện", a: "90°", ex: "SF₆" },
                                ].map((row, i) => (
                                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 font-mono text-sm text-slate-600">{row.d}</td>
                                    <td className="p-4 font-bold text-sm text-indigo-600">{row.s}</td>
                                    <td className="p-4 text-sm text-slate-600">{row.a}</td>
                                    <td className="p-4 text-sm text-slate-500">{row.ex}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                            <h5 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                              <Info size={18} />
                              Lone Pair Effect
                            </h5>
                            <p className="text-sm text-indigo-700 leading-relaxed">
                              Lone pairs repel more strongly than bonding pairs. 
                              <b> Each lone pair reduces the bond angle by approx 2.5°.</b>
                            </p>
                            <p className="text-xs text-indigo-500 italic mt-2">
                              Cặp e tự do đẩy mạnh hơn cặp liên kết. Mỗi lone pair làm giảm góc khoảng 2.5°.
                            </p>
                          </div>
                          <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                            <h5 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                              <Sparkles size={18} />
                              Polarity Rule
                            </h5>
                            <p className="text-sm text-emerald-700 leading-relaxed">
                              Symmetrical shape (Linear, Tetrahedral, etc.) with identical atoms → <b>Non-polar</b>. 
                              Asymmetrical shape (Bent, Pyramidal) → <b>Polar</b>.
                            </p>
                            <p className="text-xs text-emerald-500 italic mt-2">
                              Hình đối xứng → Không phân cực. Hình không đối xứng → Phân cực.
                            </p>
                          </div>
                        </div>
                      </section>

                      {/* Polarity & Hybridisation */}
                      <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                          <h4 className="text-xl font-bold mb-4 text-slate-900 flex items-center gap-2">
                            <Sparkles size={20} className="text-emerald-500" />
                            Polarity Table
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                              <thead>
                                <tr className="border-b border-slate-100">
                                  <th className="pb-2 font-bold text-slate-500">Molecule</th>
                                  <th className="pb-2 font-bold text-slate-500">Shape</th>
                                  <th className="pb-2 font-bold text-slate-500">Overall</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                {[
                                  { m: "CO₂", s: "Linear", p: "Non-polar", r: "Dipoles cancel" },
                                  { m: "BF₃", s: "Trigonal planar", p: "Non-polar", r: "Symmetrical" },
                                  { m: "CH₄", s: "Tetrahedral", p: "Non-polar", r: "Symmetrical" },
                                  { m: "NH₃", s: "Pyramidal", p: "Polar", r: "Asymmetrical" },
                                  { m: "H₂O", s: "Bent", p: "Polar", r: "Dipoles don't cancel" },
                                ].map((row, i) => (
                                  <tr key={i}>
                                    <td className="py-2 font-bold">{row.m}</td>
                                    <td className="py-2">{row.s}</td>
                                    <td className={`py-2 font-bold ${row.p === 'Polar' ? 'text-rose-500' : 'text-emerald-600'}`}>{row.p}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm">
                          <h4 className="text-xl font-bold mb-4 text-slate-900 flex items-center gap-2">
                            <Zap size={20} className="text-amber-500" />
                            Hybridisation (Extension)
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                              <thead>
                                <tr className="border-b border-slate-200">
                                  <th className="pb-2 font-bold text-slate-500">Domains</th>
                                  <th className="pb-2 font-bold text-slate-500">Hybrid</th>
                                  <th className="pb-2 font-bold text-slate-500">Example</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200">
                                {[
                                  { d: "2", h: "sp", ex: "CO₂" },
                                  { d: "3", h: "sp²", ex: "BF₃" },
                                  { d: "4", h: "sp³", ex: "CH₄" },
                                  { d: "5", h: "sp³d", ex: "PCl₅" },
                                  { d: "6", h: "sp³d²", ex: "SF₆" },
                                ].map((row, i) => (
                                  <tr key={i}>
                                    <td className="py-2 font-mono">{row.d}</td>
                                    <td className="py-2 font-bold text-indigo-600">{row.h}</td>
                                    <td className="py-2">{row.ex}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-4 italic">
                            Count total electron domains (bonding + lone pairs) to identify hybridisation.
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Chapter 4 Summary Table */}
                  {(selectedChapter === null || selectedChapter === 4) && (
                    <>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                          <BookOpen size={20} />
                        </div>
                        <h3 className="text-2xl font-bold">Chapter 4: States of Matter</h3>
                      </div>

                      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden mb-8">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Concept</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">English Explanation</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Giải thích Tiếng Việt</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Example</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {[
                                { t: "Solid", f: "Particles closely packed, fixed positions, vibrate only", vi: "Các hạt xếp khít, vị trí cố định, chỉ dao động", ex: "NaCl crystal" },
                                { t: "Liquid", f: "Particles close but can move past each other", vi: "Hạt gần nhau nhưng có thể trượt qua nhau", ex: "Water" },
                                { t: "Gas", f: "Particles far apart, move randomly and rapidly", vi: "Hạt cách xa, chuyển động ngẫu nhiên nhanh", ex: "O₂ gas" },
                                { t: "IMF", f: "Forces between molecules (London, dipole, H-bond)", vi: "Lực giữa các phân tử", ex: "H₂O has H-bonding" },
                                { t: "Boiling Point", f: "Temp where vapor pressure = external pressure", vi: "Nhiệt độ mà áp suất hơi = áp suất ngoài", ex: "Strong IMF → high b.p" },
                                { t: "Vapor Pressure", f: "Pressure exerted by vapor in equilibrium", vi: "Áp suất do hơi tạo ra khi cân bằng", ex: "Temp ↑ → Pressure ↑" },
                                { t: "Volatility", f: "Weaker IMF evaporates more easily", vi: "Lực liên phân tử yếu bay hơi dễ hơn", ex: "Ether vs water" },
                                { t: "Sublimation", f: "Solid → gas directly", vi: "Rắn → khí trực tiếp", ex: "I₂ solid" },
                              ].map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="p-4 font-bold text-sm text-indigo-600">{row.t}</td>
                                  <td className="p-4 text-sm text-slate-600">{row.f}</td>
                                  <td className="p-4 text-sm text-slate-500 italic">{row.vi}</td>
                                  <td className="p-4 text-sm text-slate-500">{row.ex}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                          <h4 className="text-xl font-bold mb-4 text-slate-900 flex items-center gap-2">
                            <Zap size={20} className="text-amber-500" />
                            Gas Laws & Formulas
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                              <thead>
                                <tr className="border-b border-slate-100">
                                  <th className="pb-2 font-bold text-slate-500">Law</th>
                                  <th className="pb-2 font-bold text-slate-500">Formula</th>
                                  <th className="pb-2 font-bold text-slate-500">Condition</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                {[
                                  { l: "Boyle's", f: "P₁V₁ = P₂V₂", c: "Constant T" },
                                  { l: "Charles'", f: "V₁/T₁ = V₂/T₂", c: "Constant P" },
                                  { l: "Avogadro's", f: "V ∝ n", c: "Constant T & P" },
                                  { l: "Ideal Gas", f: "PV = nRT", c: "R = 8.31" },
                                ].map((row, i) => (
                                  <tr key={i}>
                                    <td className="py-3 font-bold text-indigo-600">{row.l}</td>
                                    <td className="py-3 font-mono">{row.f}</td>
                                    <td className="py-3 text-slate-500">{row.c}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-xs font-bold text-slate-700 mb-1">Temperature Reminder:</p>
                            <p className="text-sm text-indigo-600 font-mono">K = °C + 273</p>
                          </div>
                        </div>

                        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
                          <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Database size={24} className="text-emerald-400" />
                            Maxwell-Boltzmann
                          </h4>
                          <div className="space-y-4 text-sm opacity-90">
                            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                              <p className="font-bold text-emerald-400 mb-1">Higher Temperature:</p>
                              <p>Curve lower & broader, peak shifts right. More molecules exceed Ea.</p>
                            </div>
                            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                              <p className="font-bold text-emerald-400 mb-1">Catalyst:</p>
                              <p>Lowers Activation Energy (Ea). Does NOT change distribution curve.</p>
                            </div>
                            <p className="text-xs italic opacity-70">Area under curve = Total molecules (Stays constant)</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                          <h4 className="text-xl font-bold mb-4 text-slate-900">Exam Traps (Ch. 4)</h4>
                          <ul className="space-y-4 text-sm">
                            <li className="flex flex-col gap-1">
                              <div className="flex items-start gap-2">
                                <XCircle size={16} className="text-rose-500 mt-1 shrink-0" />
                                <span>Using <b>°C</b> in gas equation.</span>
                              </div>
                              <span className="text-slate-400 italic ml-6 text-xs">Phải đổi sang Kelvin (K).</span>
                            </li>
                            <li className="flex flex-col gap-1">
                              <div className="flex items-start gap-2">
                                <XCircle size={16} className="text-rose-500 mt-1 shrink-0" />
                                <span>Thinking <b>Temp ↑</b> increases area under curve.</span>
                              </div>
                              <span className="text-slate-400 italic ml-6 text-xs">Diện tích không đổi vì tổng số phân tử không đổi.</span>
                            </li>
                            <li className="flex flex-col gap-1">
                              <div className="flex items-start gap-2">
                                <XCircle size={16} className="text-rose-500 mt-1 shrink-0" />
                                <span>Confusing <b>boiling</b> with evaporation.</span>
                              </div>
                              <span className="text-slate-400 italic ml-6 text-xs">Bay hơi xảy ra ở mọi nhiệt độ, sôi chỉ tại b.p.</span>
                            </li>
                          </ul>
                        </div>

                        <div className="bg-indigo-600 text-white p-8 rounded-3xl shadow-xl shadow-indigo-100">
                          <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Lightbulb size={24} />
                            Core Summary
                          </h4>
                          <ul className="space-y-3 opacity-90 text-sm">
                            <li className="flex items-start gap-2">
                              <ChevronRight size={16} className="mt-1 shrink-0" />
                              <span>Strong IMF → High boiling point</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <ChevronRight size={16} className="mt-1 shrink-0" />
                              <span>High temp → Higher kinetic energy</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <ChevronRight size={16} className="mt-1 shrink-0" />
                              <span>High P + Low T → Deviates from Ideal Gas</span>
                            </li>
                            <li className="mt-4 pt-4 border-t border-white/20 font-medium italic">
                              Khí thực lệch khỏi khí lý tưởng ở áp suất cao, nhiệt độ thấp.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Chapter 5 Summary Table */}
                  {(selectedChapter === null || selectedChapter === 5) && (
                    <>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                          <BookOpen size={20} />
                        </div>
                        <h3 className="text-2xl font-bold">Chapter 5: Periodicity</h3>
                      </div>

                      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden mb-8">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Concept</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">English Explanation</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Giải thích Tiếng Việt</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Example</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {[
                                { t: "Period", f: "Horizontal row in periodic table", vi: "Hàng ngang trong bảng tuần hoàn", ex: "Period 3: Na → Ar" },
                                { t: "Group", f: "Vertical column with same valence electrons", vi: "Cột dọc có cùng số e lớp ngoài", ex: "Group 1: Li, Na, K" },
                                { t: "Atomic Radius", f: "Distance from nucleus to outermost shell", vi: "Khoảng cách từ hạt nhân đến lớp e ngoài", ex: "Decreases across period" },
                                { t: "Ionic Radius", f: "Size of ion after losing/gaining e", vi: "Kích thước ion sau khi mất/nhận e", ex: "Na⁺ smaller than Na" },
                                { t: "1st IE", f: "Energy to remove 1 mol of e from gaseous atoms", vi: "Năng lượng tách 1 mol e khỏi nguyên tử khí", ex: "Increases across period" },
                                { t: "Electronegativity", f: "Ability to attract bonding electrons", vi: "Khả năng hút cặp e liên kết", ex: "F highest" },
                                { t: "Shielding", f: "Inner electrons reduce nuclear attraction", vi: "e lớp trong che chắn lực hút hạt nhân", ex: "Increases down group" },
                                { t: "Nuclear Charge", f: "Total positive charge of nucleus (protons)", vi: "Tổng điện tích dương của hạt nhân", ex: "Increases across period" },
                              ].map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="p-4 font-bold text-sm text-indigo-600">{row.t}</td>
                                  <td className="p-4 text-sm text-slate-600">{row.f}</td>
                                  <td className="p-4 text-sm text-slate-500 italic">{row.vi}</td>
                                  <td className="p-4 text-sm text-slate-500">{row.ex}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                          <h4 className="text-xl font-bold mb-4 text-slate-900 flex items-center gap-2">
                            <Zap size={20} className="text-amber-500" />
                            Trends Across Period (→)
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                              <thead>
                                <tr className="border-b border-slate-100">
                                  <th className="pb-2 font-bold text-slate-500">Property</th>
                                  <th className="pb-2 font-bold text-slate-500">Trend</th>
                                  <th className="pb-2 font-bold text-slate-500">Reason</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                {[
                                  { p: "Atomic Radius", t: "Decreases", r: "Nuclear charge ↑, same shielding" },
                                  { p: "Ionisation Energy", t: "Increases", r: "Stronger nuclear attraction" },
                                  { p: "Electronegativity", t: "Increases", r: "Smaller radius, higher charge" },
                                  { p: "Oxide Nature", t: "Basic → Acidic", r: "Na₂O (basic) to Cl₂O₇ (acidic)" },
                                ].map((row, i) => (
                                  <tr key={i}>
                                    <td className="py-3 font-bold text-indigo-600">{row.p}</td>
                                    <td className="py-3 font-bold text-rose-500">{row.t}</td>
                                    <td className="py-3 text-slate-500">{row.r}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm">
                          <h4 className="text-xl font-bold mb-4 text-slate-900 flex items-center gap-2">
                            <Zap size={20} className="text-emerald-500" />
                            Trends Down Group (↓)
                          </h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                              <thead>
                                <tr className="border-b border-slate-100">
                                  <th className="pb-2 font-bold text-slate-500">Property</th>
                                  <th className="pb-2 font-bold text-slate-500">Trend</th>
                                  <th className="pb-2 font-bold text-slate-500">Reason</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                {[
                                  { p: "Atomic Radius", t: "Increases", r: "More shells, more shielding" },
                                  { p: "Ionisation Energy", t: "Decreases", r: "Outer e further away" },
                                  { p: "Electronegativity", t: "Decreases", r: "Larger radius" },
                                  { p: "Metallic Character", t: "Increases", r: "Easier to lose electrons" },
                                ].map((row, i) => (
                                  <tr key={i}>
                                    <td className="py-3 font-bold text-indigo-600">{row.p}</td>
                                    <td className="py-3 font-bold text-emerald-600">{row.t}</td>
                                    <td className="py-3 text-slate-500">{row.r}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl mb-8">
                        <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                          <Database size={24} className="text-emerald-400" />
                          Group 2 vs Group 7 Comparison
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left">
                            <thead>
                              <tr className="border-b border-white/10">
                                <th className="pb-2 font-bold text-white/50">Feature</th>
                                <th className="pb-2 font-bold text-white/50">Group 2 (Mg, Ca)</th>
                                <th className="pb-2 font-bold text-white/50">Group 7 (Cl, Br)</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                              {[
                                { f: "Outer electrons", g2: "2 (Lose 2e)", g7: "7 (Gain 1e)" },
                                { f: "Ion formed", g2: "2+", g7: "1−" },
                                { f: "Reactivity", g2: "Increases down", g7: "Decreases down" },
                                { f: "Oxides", g2: "Basic", g7: "Acidic behavior" },
                                { f: "Melting point", g2: "Decreases down", g7: "Decreases down (IMF)" },
                              ].map((row, i) => (
                                <tr key={i}>
                                  <td className="py-3 font-bold text-emerald-400">{row.f}</td>
                                  <td className="py-3">{row.g2}</td>
                                  <td className="py-3">{row.g7}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                          <p className="text-sm font-bold text-emerald-400 mb-2">Displacement Reaction Example:</p>
                          <p className="font-mono text-xs">Cl₂ + 2Br⁻ → 2Cl⁻ + Br₂</p>
                          <p className="text-xs mt-1 opacity-70">Chlorine more reactive than bromine → displaces bromide.</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                          <h4 className="text-xl font-bold mb-4 text-slate-900">Exam Traps (Ch. 5)</h4>
                          <ul className="space-y-4 text-sm">
                            <li className="flex flex-col gap-1">
                              <div className="flex items-start gap-2">
                                <XCircle size={16} className="text-rose-500 mt-1 shrink-0" />
                                <span>Saying atomic radius <b>increases</b> across period.</span>
                              </div>
                              <span className="text-slate-400 italic ml-6 text-xs">Bán kính giảm do điện tích hạt nhân tăng.</span>
                            </li>
                            <li className="flex flex-col gap-1">
                              <div className="flex items-start gap-2">
                                <XCircle size={16} className="text-rose-500 mt-1 shrink-0" />
                                <span>Forgetting <b>shielding</b> explanation.</span>
                              </div>
                              <span className="text-slate-400 italic ml-6 text-xs">Phải nhắc đến che chắn (shielding) khi giải thích IE.</span>
                            </li>
                            <li className="flex flex-col gap-1">
                              <div className="flex items-start gap-2">
                                <XCircle size={16} className="text-rose-500 mt-1 shrink-0" />
                                <span>Saying halogen reactivity <b>increases</b> down group.</span>
                              </div>
                              <span className="text-slate-400 italic ml-6 text-xs">Phản ứng của Halogen giảm dần khi đi xuống.</span>
                            </li>
                          </ul>
                        </div>

                        <div className="bg-indigo-600 text-white p-8 rounded-3xl shadow-xl shadow-indigo-100">
                          <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Lightbulb size={24} />
                            Super Summary
                          </h4>
                          <ul className="space-y-3 opacity-90 text-sm">
                            <li className="flex items-start gap-2">
                              <ChevronRight size={16} className="mt-1 shrink-0" />
                              <span>Across period → smaller atoms, higher IE, more electronegative</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <ChevronRight size={16} className="mt-1 shrink-0" />
                              <span>Down group → bigger atoms, lower IE, more metallic</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <ChevronRight size={16} className="mt-1 shrink-0" />
                              <span>Group 2 → +2 | Group 7 → −1</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Memory Rules */}
                  {(selectedChapter === null || selectedChapter === 1) && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-indigo-600 text-white p-8 rounded-3xl shadow-xl shadow-indigo-100">
                        <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <Lightbulb size={24} />
                          Memory Rules
                        </h4>
                        <ul className="space-y-3 opacity-90">
                          <li className="flex items-center gap-2">
                            <ChevronRight size={16} />
                            <span>Group 1 → <b>+1</b></span>
                          </li>
                          <li className="flex items-center gap-2">
                            <ChevronRight size={16} />
                            <span>Group 2 → <b>+2</b></span>
                          </li>
                          <li className="flex items-center gap-2">
                            <ChevronRight size={16} />
                            <span>Group 7 → <b>-1</b></span>
                          </li>
                          <li className="mt-4 pt-4 border-t border-white/20 font-medium">
                            Mất e → dương (Positive)<br/>
                            Nhận e → âm (Negative)
                          </li>
                        </ul>
                      </div>

                      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                        <h4 className="text-xl font-bold mb-4 text-slate-900">Exam Tip: (g) State</h4>
                        <p className="text-slate-600 leading-relaxed mb-2">
                          In the definition of Ionisation Energy, you <b>MUST</b> include the gaseous state <b>(g)</b>.
                        </p>
                        <p className="text-slate-400 text-sm italic mb-4">
                          Trong định nghĩa Năng lượng ion hóa, bạn <b>BẮT BUỘC</b> phải bao gồm trạng thái khí <b>(g)</b>.
                        </p>
                        <div className="bg-slate-50 p-4 rounded-2xl font-mono text-sm text-indigo-600 border border-slate-100">
                          Mg(g) → Mg⁺(g) + e⁻
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </motion.div>
          )}

          {view === 'quiz' && (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-3xl mx-auto"
            >
              <div className="mb-8 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Question {currentQuestionIndex + 1} of {quizQuestions.length}</p>
                  <div className="w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-indigo-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 font-bold text-indigo-600">
                  Score: {score}
                </div>
              </div>

              <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-8">
                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest rounded-lg">
                    {quizQuestions[currentQuestionIndex].topic}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 leading-snug">
                    {quizQuestions[currentQuestionIndex].question}
                  </h3>
                </div>

                <div className="grid gap-3">
                  {quizQuestions[currentQuestionIndex].options.map((option, idx) => {
                    const isCorrect = idx === quizQuestions[currentQuestionIndex].correctAnswer;
                    const isSelected = idx === selectedOption;
                    
                    let variantClass = "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30";
                    if (isAnswered) {
                      if (isCorrect) variantClass = "border-emerald-500 bg-emerald-50 text-emerald-700";
                      else if (isSelected) variantClass = "border-rose-500 bg-rose-50 text-rose-700";
                      else variantClass = "border-slate-100 opacity-50";
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => handleOptionSelect(idx)}
                        className={`w-full p-5 text-left rounded-2xl border-2 font-medium transition-all flex items-center justify-between group ${variantClass}`}
                      >
                        <span>{option}</span>
                        {isAnswered && isCorrect && <CheckCircle2 className="text-emerald-500" size={20} />}
                        {isAnswered && isSelected && !isCorrect && <XCircle className="text-rose-500" size={20} />}
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {isAnswered && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="pt-6 border-t border-slate-100"
                    >
                      <div className="bg-indigo-50/50 p-6 rounded-2xl space-y-2">
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                          <Info size={14} />
                          Explanation
                        </p>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {quizQuestions[currentQuestionIndex].explanation}
                        </p>
                      </div>
                      <button
                        onClick={nextQuestion}
                        className="w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                      >
                        {currentQuestionIndex === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                        <ChevronRight size={20} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {view === 'bank' && (
            <motion.div 
              key="bank"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8 pb-20"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                    <Database size={20} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Question Bank</h3>
                    <p className="text-sm text-slate-500 font-medium">{allQuestions.length} Questions Available</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="flex bg-white border border-slate-200 rounded-xl p-1">
                    {[null, 1, 2].map((ch) => (
                      <button
                        key={String(ch)}
                        onClick={() => setBankChapterFilter(ch)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${bankChapterFilter === ch ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                      >
                        {ch === null ? 'All' : `Ch. ${ch}`}
                      </button>
                    ))}
                  </div>
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text"
                      placeholder="Search questions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleGenerateMore(10)}
                      disabled={isGenerating}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
                      title="Generate 10 questions"
                    >
                      {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                      <span className="hidden sm:inline">+10</span>
                    </button>
                    <button 
                      onClick={() => handleGenerateMore(30)}
                      disabled={isGenerating}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-all disabled:opacity-50"
                      title="Generate 30 questions"
                    >
                      {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Database size={18} />}
                      <span className="hidden sm:inline">+30</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                {visibleQuestions.map((q, i) => (
                  <motion.div 
                    key={q.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.02, 0.5) }}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
                  >
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div className="space-y-1">
                          <div className="flex gap-2">
                            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest px-2 py-0.5 bg-indigo-50 rounded-md">
                              Ch. {q.chapter}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 py-0.5 bg-slate-100 rounded-md">
                              {q.topic}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-900 leading-tight">
                            {q.question}
                          </h4>
                        </div>
                        <span className="text-xs font-mono text-slate-400">#{q.id}</span>
                      </div>
                    
                    <div className="grid sm:grid-cols-2 gap-2 mb-4">
                      {q.options.map((opt, idx) => (
                        <div 
                          key={idx}
                          className={`p-3 rounded-xl text-sm border ${idx === q.correctAnswer ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold' : 'bg-slate-50 border-slate-100 text-slate-500'}`}
                        >
                          {String.fromCharCode(65 + idx)}. {opt}
                        </div>
                      ))}
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-500 leading-relaxed border border-slate-100">
                      <span className="font-bold text-slate-700 uppercase tracking-tighter mr-2">Explanation:</span>
                      {q.explanation}
                    </div>
                  </motion.div>
                ))}
                
                {filteredQuestions.length > visibleCount && (
                  <button 
                    onClick={() => setVisibleCount(prev => prev + 50)}
                    className="w-full py-4 bg-white border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-bold hover:border-indigo-300 hover:text-indigo-600 transition-all"
                  >
                    Load More Questions ({filteredQuestions.length - visibleCount} remaining)
                  </button>
                )}

                {filteredQuestions.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                    <p className="text-slate-400 font-medium">No questions found matching your search.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {view === 'result' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto text-center space-y-8 py-12"
            >
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-indigo-200 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                <div className="relative w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center mx-auto border-4 border-indigo-50">
                  <Trophy size={64} className="text-indigo-600" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-4xl font-extrabold text-slate-900">Quiz Complete!</h3>
                <p className="text-slate-500 font-medium">You've completed the quiz successfully.</p>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                <div className="text-6xl font-black text-indigo-600 mb-2">
                  {Math.round((score / quizQuestions.length) * 100)}%
                </div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                  Final Score: {score} / {quizQuestions.length}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => startQuiz(selectedChapter)}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
                >
                  <RefreshCcw size={20} />
                  Try Again
                </button>
                <button 
                  onClick={() => setView('home')}
                  className="w-full py-4 bg-white text-slate-600 border-2 border-slate-200 rounded-2xl font-bold hover:border-slate-300 transition-all"
                >
                  Back to Home
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Chat Bot UI */}
      <div className="fixed bottom-6 right-6 z-[100]">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-20 right-0 w-[320px] sm:w-[380px] bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
            >
              <div className="bg-indigo-600 p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold">Hỏi bài YENTHANH</h4>
                  <button onClick={() => setIsChatOpen(false)} className="opacity-60 hover:opacity-100">
                    <XCircle size={20} />
                  </button>
                </div>
                <p className="text-xs opacity-80">Trợ lý học tập IGCSE|A/AS Chemistry</p>
              </div>

              <div className="flex-1 h-[300px] overflow-y-auto p-4 space-y-4 bg-slate-50">
                {!zaloUser ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                      <MessageCircle size={24} />
                    </div>
                    <p className="text-sm font-medium text-slate-600">Vui lòng đăng nhập Zalo để bắt đầu hỏi bài giáo viên.</p>
                    <button 
                      onClick={handleZaloLogin}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-full text-sm font-bold shadow-lg shadow-indigo-100"
                    >
                      Đăng nhập Zalo
                    </button>
                  </div>
                ) : (
                  <>
                    {chatHistory.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {zaloUser && (
                <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Nhập câu hỏi..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 px-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-all"
                  >
                    <Send size={18} />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all active:scale-95 group relative"
        >
          <MessageCircle size={28} />
          {!isChatOpen && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 border-2 border-white rounded-full animate-bounce"></span>
          )}
        </button>
      </div>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 py-12 border-t border-slate-200 mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <Atom size={24} />
            </div>
            <div>
              <p className="font-bold text-slate-900">IGCSE|A/AS Chemistry</p>
              <p className="text-xs text-slate-500">© 2025 YENTHANH. All rights reserved.</p>
            </div>
          </div>
          <div className="flex gap-6">
            <a href="https://zalo.me/0868466486" target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">Zalo</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="https://zalo.me/0868466486" target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
