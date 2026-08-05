"use client";

import React, { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  BookOpen,
  Languages,
  Utensils,
  HeartHandshake,
  Cpu,
  BrainCircuit,
  MessageCircle,
  Menu,
  X,
  Star,
  CheckCircle2,
  Award,
  ShieldCheck,
  Send,
  Loader2,
  Database
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, onSnapshot } from "firebase/firestore";

import { AceternityBalloons } from "@/components/ui/AceternityBalloons";

import AdminModal, { 
  DEFAULT_SITE_TEXTS, 
  DEFAULT_GALLERY_CATEGORIES, 
  DEFAULT_GALLERY_ITEMS, 
  SiteTextSettings, 
  GalleryCategory, 
  GalleryItem 
} from "./AdminModal";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [siteTexts, setSiteTexts] = useState<SiteTextSettings>(DEFAULT_SITE_TEXTS);
  const [galleryCategories, setGalleryCategories] = useState<GalleryCategory[]>(DEFAULT_GALLERY_CATEGORIES);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(DEFAULT_GALLERY_ITEMS);

  const [parentName, setParentName] = useState("");
  const [phone, setPhone] = useState("");
  const [ageGroup, setAgeGroup] = useState("3");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // GERÇEK ZAMANLI (REALTIME) FIRESTORE DİNLEYİCİLERİ - Tüm cihazlar arasında anında senkronize olur!
  useEffect(() => {
    // 1. Site Metinleri Canlı Dinleyicisi
    const unsubTexts = onSnapshot(doc(db, "settings", "site_texts"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSiteTexts({ ...DEFAULT_SITE_TEXTS, ...data });
      }
    }, (err) => console.warn("Texts realtime listener warning:", err));

    // 2. Galeri Canlı Dinleyicisi
    const unsubGallery = onSnapshot(doc(db, "settings", "gallery"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.categories) setGalleryCategories(data.categories);
        if (data.items) setGalleryItems(data.items);
      }
    }, (err) => console.warn("Gallery realtime listener warning:", err));

    return () => {
      unsubTexts();
      unsubGallery();
    };
  }, []);

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "MEB Müfredatı",
      desc: "Eğitim programımız, Millî Eğitim Bakanlığı müfredatıyla tam uyumlu, çocukların yaş ve gelişim düzeylerine özel şekilde yürütülür.",
      badge: "Müfredat Uyumlu",
      bg: "from-amber-400 to-orange-500",
      light: "bg-amber-50",
      border: "border-amber-200",
      emoji: "📚"
    },
    {
      icon: <Languages className="w-8 h-8" />,
      title: "İngilizce Eğitimi",
      desc: "Oyun, şarkı, tiyatro ve interaktif etkinliklerle zenginleştirilmiş erken yaş İngilizce eğitimiyle çocuklar dili doğal bir süreçte öğrenir.",
      badge: "Erken Yaş Dil",
      bg: "from-sky-400 to-blue-500",
      light: "bg-sky-50",
      border: "border-sky-200",
      emoji: "🌍"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Sanat & Drama Atölyeleri",
      desc: "Çocuklarımızın hayal gücünü geliştiren resim, müzik, orff ve yaratıcı drama etkinlikleriyle özgüven kazanmalarını sağlıyoruz.",
      badge: "Yaratıcı Gelişim",
      bg: "from-rose-400 to-pink-500",
      light: "bg-rose-50",
      border: "border-rose-200",
      emoji: "🎨"
    },
    {
      icon: <HeartHandshake className="w-8 h-8" />,
      title: "Erdem ve Değerler",
      desc: "Çocuklarımızda milli, manevi, ahlaki ve kültürel değerlerimizi yaşatarak sevgi, saygı ve paylaşma odaklı karakter gelişimini destekleriz.",
      badge: "Değerler Eğitimi",
      bg: "from-purple-400 to-violet-500",
      light: "bg-purple-50",
      border: "border-purple-200",
      emoji: "❤️"
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "Robotik & Kodlama",
      desc: "Erken yaşta eğlenceli robotik kitler ve algoritma oyunlarıyla çocuklarımızın analitik düşünme ve problem çözme yetileri gelişir.",
      badge: "STEM & Algoritma",
      bg: "from-emerald-400 to-teal-500",
      light: "bg-emerald-50",
      border: "border-emerald-200",
      emoji: "🤖"
    },
    {
      icon: <BrainCircuit className="w-8 h-8" />,
      title: "Zeka & Akıl Oyunları",
      desc: "Lisanslı zeka oyunlarıyla çocuklarımızın dikkat, strateji, odaklanma ve uzamsal algı yeteneklerini keyifle güçlendiririz.",
      badge: "Zihinsel Gelişim",
      bg: "from-indigo-400 to-blue-600",
      light: "bg-indigo-50",
      border: "border-indigo-200",
      emoji: "🧠"
    }
  ];

  const filteredGallery = galleryFilter === "all"
    ? galleryItems
    : galleryItems.filter(item => item.category === galleryFilter);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "pre_registrations"), {
        parentName, 
        phone, 
        ageGroup, 
        email: email || "", 
        note: note || "",
        status: "yeni",
        createdAt: serverTimestamp(),
      });
      setFormSubmitted(true);
      setParentName(""); setPhone(""); setEmail(""); setNote("");
      setTimeout(() => { setModalOpen(false); setFormSubmitted(false); }, 3000);
    } catch (error) {
      console.error("Ön kayıt ekleme hatası:", error);
      alert("Kayıt gönderilirken bir hata oluştu. Lütfen tekrar deneyiniz.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const balloons = [
    { left: '3%',  size: 54, color: '#f87171', duration: '9s',   delay: '0s',    opacity: 0.88 },
    { left: '9%',  size: 42, color: '#fbbf24', duration: '12s',  delay: '-4s',   opacity: 0.82 },
    { left: '16%', size: 62, color: '#60a5fa', duration: '10s',  delay: '-7s',   opacity: 0.85 },
    { left: '25%', size: 46, color: '#a78bfa', duration: '14s',  delay: '-2s',   opacity: 0.80 },
    { left: '35%', size: 38, color: '#2dd4bf', duration: '11.5s',delay: '-9s',   opacity: 0.78 },
    { left: '44%', size: 50, color: '#fb923c', duration: '8.5s', delay: '-13s',  opacity: 0.84 },
    { left: '54%', size: 36, color: '#f43f5e', duration: '10.5s',delay: '-6s',   opacity: 0.80 },
    { left: '63%', size: 52, color: '#34d399', duration: '11s',  delay: '-5s',   opacity: 0.82 },
    { left: '72%', size: 40, color: '#f472b6', duration: '13s',  delay: '-1s',   opacity: 0.86 },
    { left: '79%', size: 58, color: '#fbbf24', duration: '9.5s', delay: '-8s',   opacity: 0.80 },
    { left: '87%', size: 44, color: '#fb923c', duration: '11.5s',delay: '-3s',   opacity: 0.76 },
    { left: '93%', size: 48, color: '#818cf8', duration: '14.5s',delay: '-11s',  opacity: 0.74 },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'Nunito, sans-serif' }}>

      {/* ===== TOP BAR ===== */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 text-white text-xs py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-5 flex-wrap">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-yellow-300" />
              {siteTexts.address}
            </span>
            <a href={`tel:${siteTexts.phone}`} className="flex items-center gap-1.5 hover:text-yellow-300 transition-colors">
              <Phone className="w-3.5 h-3.5 text-yellow-300" />
              {siteTexts.phone}
            </a>
            <span className="hidden md:flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-yellow-300" />
              {siteTexts.email}
            </span>
          </div>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-yellow-300" />
            {siteTexts.workingHours}
          </span>
        </div>
      </div>

      {/* ===== NAVBAR ===== */}
      <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md shadow-md border-b-4 border-amber-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <a href="#hero" className="relative flex items-center hover:opacity-90 transition-opacity z-10">
            <img
              src="/logo.svg"
              alt="Mahmutbey Yıldız Anaokulu Logo"
              className="h-20 sm:h-24 w-auto max-w-none object-contain -my-5 drop-shadow-md"
            />
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm font-extrabold">
            {[
              { href: '#hero', label: 'ANA SAYFA', color: 'hover:text-amber-500' },
              { href: '#about', label: 'HAKKIMIZDA', color: 'hover:text-purple-500' },
              { href: '#why-us', label: "YILDIZ'DA EĞİTİM", color: 'hover:text-sky-500' },
              { href: '#galeri', label: 'GALERİ', color: 'hover:text-pink-500' },
              { href: '#info-footer', label: 'İLETİŞİM', color: 'hover:text-emerald-500' },
            ].map((link) => (
              <a key={link.href} href={link.href} className={`text-slate-700 transition-colors ${link.color}`}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setAdminModalOpen(true)}
              className="px-3.5 py-2 rounded-full border-2 border-slate-200 hover:border-purple-400 bg-slate-50 hover:bg-purple-50 text-slate-700 font-bold text-xs transition-all flex items-center gap-1.5"
              title="Yönetici Girişi"
            >
              <ShieldCheck className="w-4 h-4 text-purple-500" />
              Yönetici
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm shadow-lg shadow-amber-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              ✨ {siteTexts.navCtaBtnText || "Ön Kayıt Yap"}
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-amber-50 border-2 border-slate-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t-2 border-amber-200 px-4 pt-3 pb-6 space-y-2">
            {[
              { href: '#hero', label: '🏠 Ana Sayfa' },
              { href: '#about', label: '💜 Hakkımızda' },
              { href: '#why-us', label: '⭐ Yıldız\'da Eğitim' },
              { href: '#galeri', label: '📸 Galeri' },
              { href: '#info-footer', label: '📞 İletişim' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => { setMobileMenuOpen(false); setAdminModalOpen(true); }}
              className="w-full py-2.5 rounded-xl border-2 border-purple-200 bg-purple-50 text-purple-700 font-bold text-sm flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              Yönetici Girişi
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); setModalOpen(true); }}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black flex items-center justify-center gap-2 shadow-md"
            >
              ✨ {siteTexts.navCtaBtnText || "Ön Kayıt Yap"}
            </button>
          </div>
        )}
      </header>

      {/* ===== HERO SECTION ===== */}
      <section id="hero" className="hero-section relative overflow-hidden pt-12 pb-28 md:pt-20 md:pb-36 bg-gradient-to-b from-sky-50/50 via-amber-50/40 to-pink-50/60">

        {/* Aceternity UI Göz Alıcı Uçuşan Balonlar & Parıltılı Işıklar Background */}
        <AceternityBalloons />

        {/* İçerik */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6 animate-fade-in-up">

            {/* Rozet */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/95 text-amber-700 text-sm font-black shadow-xl border-2 border-amber-300 badge-pulse">
              <span className="text-xl">🌟</span>
              <span>{siteTexts.heroBadgeText || "Mahmutbey Yıldız Anaokulu — 2026-2027 Kayıtları Açık!"}</span>
              <span className="text-xl">🌈</span>
            </div>

            {/* Başlık */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.15] text-slate-800 max-w-4xl mx-auto">
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500" style={{ lineHeight: '1.25' }}>
                {siteTexts.heroTitle}
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-semibold">
              {siteTexts.heroSubtitle}
            </p>

            {/* Özellik etiketleri */}
            <div className="flex flex-wrap justify-center gap-2.5 pt-2">
              {[
                { emoji: '🎨', text: 'Yaratıcı Atölye', bg: 'bg-amber-100 text-amber-700 border-amber-300' },
                { emoji: '🤖', text: 'Robotik & Kodlama', bg: 'bg-sky-100 text-sky-700 border-sky-300' },
                { emoji: '🌍', text: 'İngilizce', bg: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
                { emoji: '🧠', text: 'Akıl Oyunları', bg: 'bg-rose-100 text-rose-700 border-rose-300' },
                { emoji: '🛡️', text: '7/24 Güvenlik', bg: 'bg-purple-100 text-purple-700 border-purple-300' },
              ].map((tag, i) => (
                <span
                  key={i}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs sm:text-sm font-black border-2 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 ${tag.bg}`}
                >
                  <span className="text-lg">{tag.emoji}</span>
                  <span>{tag.text}</span>
                </span>
              ))}
            </div>

            {/* CTA butonlar */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-base shadow-xl shadow-amber-400/40 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 border-b-4 border-orange-700 flex items-center justify-center gap-2"
              >
                <span className="text-xl">✨</span> {siteTexts.heroCtaBtnText || "Hemen Ön Kayıt Oluştur"}
              </button>
              <a
                href={`https://wa.me/90${(siteTexts.whatsappPhone || "05414470608").replace(/[^0-9]/g, "")}?text=Merhaba,%20Mahmutbey%20Y%C4%B1ld%C4%B1z%20Anaokulu%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum`}
                target="_blank" rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-black text-base shadow-xl shadow-emerald-400/40 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 border-b-4 border-green-700 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" /> {siteTexts.heroWhatsappBtnText || "WhatsApp'tan Bilgi Al"}
              </a>
            </div>

            {/* Trust kartları */}
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-4">
              {[
                { emoji: '🏅', val: siteTexts.stat1Val || '%100', label: siteTexts.stat1Label || 'MEB Uyumlu', bg: 'bg-amber-50 border-amber-200' },
                { emoji: '👶', val: siteTexts.stat2Val || '2-6 Yaş', label: siteTexts.stat2Label || 'Özel Program', bg: 'bg-sky-50 border-sky-200' },
              ].map((stat, i) => (
                <div key={i} className={`text-center p-3.5 rounded-2xl border-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all ${stat.bg}`}>
                  <div className="text-2xl mb-0.5">{stat.emoji}</div>
                  <div className="text-base font-black text-slate-800">{stat.val}</div>
                  <div className="text-xs text-slate-500 font-bold">{stat.label}</div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Dalga */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,45 C360,90 1080,0 1440,45 L1440,90 L0,90 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ===== HAKKIMIZDA ===== */}
      <section id="about" className="py-20 bg-white relative overflow-hidden">
        {/* Dekoratif köşe renkleri */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-bl-full -z-0" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-50 rounded-tr-full -z-0" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-amber-50/60 via-purple-50/40 to-pink-50/60 rounded-3xl p-8 sm:p-12 border-2 border-amber-200/80 shadow-xl space-y-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-purple-200/60 pb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-black border-2 border-purple-200 mb-3">
                  💜 {siteTexts.aboutBadgeText || "Hakkımızda"}
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                  {siteTexts.aboutTitle}
                </h2>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-3xl shadow-lg shrink-0 animate-bounce-gentle">
                🏆
              </div>
            </div>

            <p className="text-slate-700 leading-relaxed font-semibold text-lg max-w-4xl">
              {siteTexts.aboutText}
            </p>

            <div className="grid md:grid-cols-3 gap-4 pt-2">
              {[
                { emoji: '🎯', text: siteTexts.aboutItem1 || 'Çok yönlü gelişim sağlayan modern branş dersleri' },
                { emoji: '👩‍🏫', text: siteTexts.aboutItem2 || 'Pedagojik formasyon sahibi uzman öğretmen kadrosu' },
                { emoji: '🏫', text: siteTexts.aboutItem3 || 'Ferah, aydınlık, hijyenik ve depreme dayanıklı kampüs' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white/90 border-2 border-purple-100 shadow-sm hover:shadow-md hover:border-amber-300 transition-all">
                  <span className="text-2xl shrink-0">{item.emoji}</span>
                  <span className="text-slate-800 font-bold text-sm leading-snug text-left">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== NEDEN BİZ (ÖZELLİKLER) ===== */}
      <section id="why-us" className="py-20 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #fef9ff 0%, #f0f9ff 25%, #fff9f0 50%, #f0fff4 75%, #fff0f5 100%)'
      }}>
        {/* Büyük daire dekorasyonları */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-amber-100/60 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-sky-100/60 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-100 text-amber-800 text-sm font-black border-2 border-amber-300">
              ⭐ {siteTexts.whyUsBadge || "Yıldız'da Eğitim"}
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
              {siteTexts.whyUsTitle || "Ayrıcalıklı Eğitim Modelimiz & Farklarımız"}
            </h2>
            <p className="text-slate-600 font-semibold">
              {siteTexts.whyUsSubtitle || "Değerlerle büyüyen, bilimle gelişen, sevgiyle öğrenen bir nesil için hazırladığımız özel eğitim yaklaşımımız."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item, idx) => (
              <div
                key={idx}
                className="group relative bg-white rounded-3xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-slate-100 overflow-hidden"
              >
                {/* Üst renkli şerit */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${item.bg} rounded-t-3xl`} />

                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.bg} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${item.light} ${item.border} text-slate-600`}>
                      {item.badge}
                    </span>
                  </div>
                  <span className="text-3xl">{item.emoji}</span>
                </div>

                <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed font-semibold">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GALERİ ===== */}
      <section id="galeri" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-pink-100 text-pink-700 text-sm font-black border-2 border-pink-300">
              📸 {siteTexts.galleryBadge || "Galeri"}
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
              {siteTexts.galleryTitle || "Okulumuzdan Kareler"}
            </h2>
            <p className="text-slate-500 font-semibold">{siteTexts.gallerySubtitle || "Her fotoğraf, sevgiyle büyüyen ve keşfeden bir hikayenin parçası..."}</p>

            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <button
                onClick={() => setGalleryFilter("all")}
                className={`px-4 py-2 rounded-xl text-sm font-black border-2 transition-all ${
                  galleryFilter === "all"
                    ? "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-300/40"
                    : "bg-white text-slate-600 border-slate-200 hover:border-amber-300 hover:bg-amber-50"
                }`}
              >
                🎨 Tümü ({galleryItems.length})
              </button>
              {galleryCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setGalleryFilter(cat.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-black border-2 transition-all ${
                    galleryFilter === cat.id
                      ? "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-300/40"
                      : "bg-white text-slate-600 border-slate-200 hover:border-amber-300 hover:bg-amber-50"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedImage(item.img)}
                className="group relative rounded-3xl overflow-hidden shadow-md cursor-pointer border-3 border-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                style={{ aspectRatio: '4/3', border: '3px solid white' }}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                  <span className="text-white font-black text-sm">{item.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== İLETİŞİM FOOTER ===== */}
      <section id="info-footer" className="py-20 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4c1d95 60%, #1e1b4b 100%)'
      }}>
        {/* Dekor daireler */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 space-y-8 text-white">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/20 text-amber-300 text-sm font-black mb-5 border border-amber-400/30">
                  📞 Bizimle İletişime Geçin
                </div>
                <h2 className="text-3xl font-black text-white">
                  {siteTexts.contactTitle || "Mahmutbey Yıldız Anaokulu’nu Keşfedin"}
                </h2>
                <p className="text-indigo-200 mt-3 leading-relaxed font-semibold">
                  {siteTexts.contactSubtitle || "2–6 yaş arası çocuklar için değer, dil, oyun ve teknolojiyi buluşturan özel bir öğrenme ortamı."}
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: <MapPin className="w-5 h-5" />, label: 'Adresimiz', val: siteTexts.address, color: 'bg-amber-500' },
                  { icon: <Phone className="w-5 h-5" />, label: 'Telefon / WhatsApp', val: siteTexts.phone, color: 'bg-emerald-500', href: `tel:${siteTexts.phone}` },
                  { icon: <Mail className="w-5 h-5" />, label: 'E-Posta', val: siteTexts.email, color: 'bg-sky-500' },
                  { icon: <Clock className="w-5 h-5" />, label: 'Çalışma Saatleri', val: siteTexts.workingHours, color: 'bg-purple-500' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/15 transition-colors">
                    <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center shrink-0 text-white shadow-lg`}>
                      {item.icon}
                    </div>
                    <div>
                      <span className="block font-black text-white text-sm">{item.label}</span>
                      {item.href ? (
                        <a href={item.href} className="text-indigo-200 hover:text-amber-300 font-semibold text-sm transition-colors">{item.val}</a>
                      ) : (
                        <span className="text-indigo-200 font-semibold text-sm">{item.val}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 min-h-[350px]">
              <iframe
                title="Mahmutbey Yıldız Anaokulu Harita Konumu"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.9723049187315!2d28.825682976569115!3d41.0478142713448!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa5452d9dbd07%3A0x7d6a59bc6551b9e0!2zTWFobXV0YmV5LCDEsG7Dtm7DvCBDZC4gTm86NDIsIDM0MjE3IEJhxJ9jxLFsYXIvxLBzdGFuYnVs!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str"
                className="w-full h-full min-h-[380px] border-0 grayscale hover:grayscale-0 transition-all duration-500"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-sm text-indigo-300 gap-4">
            <p className="font-semibold">© 2026 Özel Mahmutbey Yıldız Anaokulu. Tüm hakları saklıdır. 🌟</p>
            <button onClick={() => setAdminModalOpen(true)} className="hover:text-amber-400 transition-colors font-bold">
              Yönetici Paneli Girişi
            </button>
          </div>
        </div>
      </section>

      {/* ===== ÖN KAYIT MODAL ===== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative border-4 border-amber-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2 mb-6">
              <div className="text-4xl mb-2">✨</div>
              <h3 className="text-2xl font-black text-slate-900">Ön Kayıt Formu</h3>
              <p className="text-sm text-slate-500 font-semibold">
                Lütfen aşağıdaki bilgileri doldurunuz. Eğitim danışmanımız en kısa sürede sizi arayacaktır.
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 text-emerald-800 text-center space-y-3 border-2 border-emerald-200">
                <div className="text-5xl">🎉</div>
                <h4 className="font-black text-lg">Talebiniz Alındı!</h4>
                <p className="text-sm text-emerald-700 font-semibold">
                  Ön kayıt başvurunuz başarıyla ulaştı. En kısa sürede sizinle iletişime geçeceğiz.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">Veli Adı Soyadı *</label>
                  <input
                    type="text" required value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="Ahmet Yılmaz"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-amber-400 text-slate-800 text-sm font-semibold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">Telefon *</label>
                    <input
                      type="tel" required value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="05xx xxx xx xx"
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-amber-400 text-slate-800 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">Çocuğunuzun Yaşı *</label>
                    <select
                      value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-amber-400 text-slate-800 text-sm font-semibold bg-white"
                    >
                      <option value="2">2 Yaş</option>
                      <option value="3">3 Yaş</option>
                      <option value="4">4 Yaş</option>
                      <option value="5">5 Yaş</option>
                      <option value="6">6 Yaş</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">E-Posta (Opsiyonel)</label>
                  <input
                    type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ahmet@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-amber-400 text-slate-800 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">Notunuz</label>
                  <textarea
                    rows={3} value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Belirtmek istediğiniz özel bir durum..."
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:outline-none focus:border-amber-400 text-slate-800 text-sm font-semibold"
                  />
                </div>
                <button
                  type="submit" disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm shadow-lg shadow-amber-400/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 border-b-4 border-orange-700"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Formu Gönder</>}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ===== LIGHTBOX ===== */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-slate-950/95 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img src={selectedImage} alt="Büyütülmüş Görsel" className="max-w-full max-h-[90vh] rounded-2xl object-contain shadow-2xl" />
            <button className="absolute -top-4 -right-4 p-2 bg-white rounded-full text-slate-900 shadow-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ===== ADMIN MODAL ===== */}
      <AdminModal isOpen={adminModalOpen} onClose={() => setAdminModalOpen(false)} />
    </div>
  );
}
