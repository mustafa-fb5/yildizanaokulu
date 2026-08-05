"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Lock,
  User,
  X,
  LogOut,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Search,
  Calendar,
  AlertCircle,
  FileText,
  Users,
  Zap,
  ChevronRight,
  Settings,
  Image as ImageIcon,
  Plus,
  Save,
  FolderPlus,
  Tag,
  SlidersHorizontal,
  Layout,
  Globe,
  Check,
  Edit3,
  Layers,
  Sparkles,
  Inbox,
  Upload,
  Link as LinkIcon
} from "lucide-react";
import { db } from "@/lib/firebase";
import { 
  collection, 
  getDocs, 
  doc, 
  deleteDoc, 
  updateDoc, 
  setDoc, 
  getDoc, 
  addDoc,
  orderBy, 
  query,
  onSnapshot
} from "firebase/firestore";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Registration {
  id: string;
  parentName: string;
  phone: string;
  email: string;
  ageGroup: string;
  note: string;
  status: string;
  createdAt: any;
}

export interface GalleryCategory {
  id: string;
  name: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  img: string;
}

export interface SiteTextSettings {
  heroBadgeText: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaBtnText: string;
  heroWhatsappBtnText: string;
  
  // Hero Stat Cards (3 Öğün vb.)
  stat1Val: string;
  stat1Label: string;
  stat2Val: string;
  stat2Label: string;
  stat3Val: string;
  stat3Label: string;

  // Hero Card Visual Texts
  heroCardBadge: string;
  heroCardTitle: string;
  heroCardDesc: string;
  heroFloat1Title: string;
  heroFloat1Sub: string;
  heroFloat2Title: string;
  heroFloat2Sub: string;

  phone: string;
  whatsappPhone: string;
  email: string;
  address: string;
  workingHours: string;
  
  aboutBadgeText: string;
  aboutTitle: string;
  aboutText: string;
  aboutItem1: string;
  aboutItem2: string;
  aboutItem3: string;

  whyUsBadge: string;
  whyUsTitle: string;
  whyUsSubtitle: string;
  
  galleryBadge: string;
  galleryTitle: string;
  gallerySubtitle: string;
  
  contactTitle: string;
  contactSubtitle: string;
  navCtaBtnText: string;
}

export const DEFAULT_SITE_TEXTS: SiteTextSettings = {
  heroBadgeText: "Mahmutbey Yıldız Anaokulu — 2026-2027 Kayıtları Açık!",
  heroTitle: "Geleceğin Yıldızları Buradayız Yetişiyor",
  heroSubtitle: "Mahmutbey Yıldız Anaokulu'nda çocuklarımız güvenli, sevgi dolu ve yenilikçi bir ortamda keşfederek öğreniyor.",
  heroCtaBtnText: "Hemen Ön Kayıt Oluştur",
  heroWhatsappBtnText: "WhatsApp'tan Bilgi Al",
  
  // Default Stats
  stat1Val: "%100",
  stat1Label: "MEB Uyumlu",
  stat2Val: "2-6 Yaş",
  stat2Label: "Özel Program",
  stat3Val: "3 Öğün",
  stat3Label: "Taze & Helal",

  // Default Photo Badges
  heroCardBadge: "Sevgi & Değerler Odaklı Eğitim",
  heroCardTitle: "Mutlu Çocuklar, Güvenli Gelecek",
  heroCardDesc: "Modern sınıflarımız ve uzman kadromuzla her minik yüreğe dokunuyoruz.",
  heroFloat1Title: "7/24 Güvenlikli",
  heroFloat1Sub: "Kamera & Hijyen",
  heroFloat2Title: "MEB Onaylı",
  heroFloat2Sub: "Müfredat",

  phone: "0552 150 64 10",
  whatsappPhone: "05414470608",
  email: "info@mahmutbeyyildizanaokulu.k12.tr",
  address: "Mahmutbey Mh. İnönü Cd. No: 42, Bağcılar / İSTANBUL",
  workingHours: "Hafta içi: 09:00 - 18:00 | Hafta sonu: 10:00 - 15:00",
  
  aboutBadgeText: "Hakkımızda",
  aboutTitle: "Sevgi, Güven ve Kaliteli Eğitimle Yarınlara",
  aboutText: "Yıldız Anaokulu olarak, çocuklarımızın zihinsel, duygusal ve sosyal gelişimlerini bütüncül bir yaklaşımla destekliyoruz. Modern sınıflarımız, uzman kadromuz ve MEB onaylı müfredatımızla miniklerimizin potansiyellerini ortaya çıkarıyoruz.",
  aboutItem1: "Çok yönlü gelişim sağlayan modern branş dersleri",
  aboutItem2: "Pedagojik formasyon sahibi uzman öğretmen kadrosu",
  aboutItem3: "Ferah, aydınlık, hijyenik ve depreme dayanıklı kampüs",

  whyUsBadge: "Yıldız'da Eğitim",
  whyUsTitle: "Ayrıcalıklı Eğitim Modelimiz & Farklarımız",
  whyUsSubtitle: "Değerlerle büyüyen, bilimle gelişen, sevgiyle öğrenen bir nesil için hazırladığımız özel eğitim yaklaşımımız.",
  
  galleryBadge: "Galeri",
  galleryTitle: "Okulumuzdan Kareler",
  gallerySubtitle: "Her fotoğraf, sevgiyle büyüyen ve keşfeden bir hikayenin parçası...",
  
  contactTitle: "Mahmutbey Yıldız Anaokulu’nu Keşfedin",
  contactSubtitle: "2–6 yaş arası çocuklar için değer, dil, oyun ve teknolojiyi buluşturan özel bir öğrenme ortamı. Sorularınız ve kayıt talepleriniz için kapımız her zaman açık!",
  navCtaBtnText: "Ön Kayıt Yap"
};

export const DEFAULT_GALLERY_CATEGORIES: GalleryCategory[] = [
  { id: "siniflar", name: "Sınıflarımız" },
  { id: "bahce", name: "Bahçe & Oyun" },
  { id: "etkinlik", name: "Etkinlikler" },
  { id: "tesis", name: "Tesis & Yemekhane" }
];

export const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "1",
    title: "Aydınlık & Ferah Sınıflarımız",
    category: "siniflar",
    img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "2",
    title: "Güvenli ve Eğlenceli Oyun Parkı",
    category: "bahce",
    img: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "3",
    title: "Robotik Kodlama Atölyesi",
    category: "etkinlik",
    img: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "4",
    title: "Sanat ve Hayal Gücü Köşesi",
    category: "etkinlik",
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "5",
    title: "Hijyenik & Sağlıklı Yemekhane",
    category: "tesis",
    img: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "6",
    title: "Akıl Oyunları ve Satranç Odası",
    category: "etkinlik",
    img: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80"
  }
];

export default function AdminModal({ isOpen, onClose }: AdminModalProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Active Tab: 'registrations' | 'site_texts' | 'gallery' | 'security'
  const [activeTab, setActiveTab] = useState<"registrations" | "site_texts" | "gallery" | "security">("registrations");

  // Admin Credentials State
  const [adminUser, setAdminUser] = useState("admin");
  const [adminPass, setAdminPass] = useState("123456");
  const [newAdminUser, setNewAdminUser] = useState("");
  const [newAdminPass, setNewAdminPass] = useState("");
  const [confirmAdminPass, setConfirmAdminPass] = useState("");
  const [savingCreds, setSavingCreds] = useState(false);
  const [credSaveSuccess, setCredSaveSuccess] = useState(false);
  const [credError, setCredError] = useState("");

  // Registrations State
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "yeni" | "tamamlandi">("all");
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);

  // Site Texts State
  const [siteTexts, setSiteTexts] = useState<SiteTextSettings>(DEFAULT_SITE_TEXTS);
  const [savingTexts, setSavingTexts] = useState(false);
  const [textSaveSuccess, setTextSaveSuccess] = useState(false);

  // Gallery Management State
  const [categories, setCategories] = useState<GalleryCategory[]>(DEFAULT_GALLERY_CATEGORIES);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(DEFAULT_GALLERY_ITEMS);
  const [newCatName, setNewCatName] = useState("");
  const [newCatId, setNewCatId] = useState("");
  const [newImgTitle, setNewImgTitle] = useState("");
  const [newImgUrl, setNewImgUrl] = useState("");
  const [newImgCat, setNewImgCat] = useState("");
  const [savingGallery, setSavingGallery] = useState(false);
  const [gallerySaveSuccess, setGallerySaveSuccess] = useState(false);

  useEffect(() => {
    fetchAdminCredentials();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !isLoggedIn) return;

    setLoadingRegs(true);
    const q = query(collection(db, "pre_registrations"), orderBy("createdAt", "desc"));
    const unsubRegs = onSnapshot(q, (querySnapshot) => {
      const data: Registration[] = [];
      querySnapshot.forEach((docSnap) => {
        data.push({ id: docSnap.id, ...docSnap.data() } as Registration);
      });
      setRegistrations(data);
      setLoadingRegs(false);
    }, (err) => {
      console.warn("Pre-registrations realtime error:", err);
      setLoadingRegs(false);
    });

    fetchSiteSettings();
    fetchGallerySettings();

    return () => unsubRegs();
  }, [isOpen, isLoggedIn]);

  const fetchAdminCredentials = async () => {
    let validUser = "admin";
    let validPass = "123456";

    try {
      if (typeof window !== "undefined") {
        const localU = localStorage.getItem("admin_username_cache");
        const localP = localStorage.getItem("admin_password_cache");
        if (localU) validUser = localU;
        if (localP) validPass = localP;
      }
    } catch (e) {
      console.error("Local cred error:", e);
    }

    try {
      const snap = await getDoc(doc(db, "settings", "admin_credentials"));
      if (snap.exists()) {
        const data = snap.data();
        if (data.username) validUser = data.username;
        if (data.password) validPass = data.password;
        if (typeof window !== "undefined") {
          localStorage.setItem("admin_username_cache", validUser);
          localStorage.setItem("admin_password_cache", validPass);
        }
      }
    } catch (e) {
      console.error("Firestore cred fetch error:", e);
    }

    setAdminUser(validUser);
    setAdminPass(validPass);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setLoginError("");

    setTimeout(() => {
      if (username.trim() === adminUser && password === adminPass) {
        setIsLoggedIn(true);
        setLoginError("");
        setPassword("");
        setNewAdminUser(adminUser);
      } else {
        setLoginError("Kullanıcı adı veya şifre hatalı!");
      }
      setIsAuthenticating(false);
    }, 300);
  };

  const handleSaveAdminCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredError("");
    setCredSaveSuccess(false);

    if (!newAdminUser.trim()) {
      setCredError("Lütfen geçerli bir kullanıcı adı giriniz.");
      return;
    }

    if (newAdminPass && newAdminPass !== confirmAdminPass) {
      setCredError("Yeni şifreler eşleşmiyor!");
      return;
    }

    const updatedUser = newAdminUser.trim();
    const updatedPass = newAdminPass ? newAdminPass : adminPass;

    setSavingCreds(true);

    // 1. LocalStorage Güncellemesi (0 ms)
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("admin_username_cache", updatedUser);
        localStorage.setItem("admin_password_cache", updatedPass);
      }
    } catch (err) {
      console.error("LocalStorage save cred error:", err);
    }

    setAdminUser(updatedUser);
    setAdminPass(updatedPass);
    setCredSaveSuccess(true);
    setSavingCreds(false);
    setNewAdminPass("");
    setConfirmAdminPass("");
    setTimeout(() => setCredSaveSuccess(false), 4000);

    // 2. Firestore Arka Plan Güncellemesi
    try {
      const savePromise = setDoc(doc(db, "settings", "admin_credentials"), {
        username: updatedUser,
        password: updatedPass
      }, { merge: true });
      const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 2500));
      await Promise.race([savePromise, timeoutPromise]);
    } catch (e) {
      console.warn("Firestore cred background save warning:", e);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    setSelectedReg(null);
  };

  // Firestore Fetching
  const fetchRegistrations = async () => {
    setLoadingRegs(true);
    try {
      const q = query(collection(db, "pre_registrations"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data: Registration[] = [];
      querySnapshot.forEach((docSnap) => {
        data.push({ id: docSnap.id, ...docSnap.data() } as Registration);
      });
      setRegistrations(data);
    } catch (err) {
      console.error("Firestore kayitlar hatasi:", err);
    } finally {
      setLoadingRegs(false);
    }
  };

  const fetchSiteSettings = async () => {
    try {
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem("site_texts_cache");
        if (cached) {
          setSiteTexts({ ...DEFAULT_SITE_TEXTS, ...JSON.parse(cached) });
          return;
        }
      }
      const docRef = doc(db, "settings", "site_texts");
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setSiteTexts({ ...DEFAULT_SITE_TEXTS, ...snap.data() });
      }
    } catch (e) {
      console.error("Metin ayarları yükleme hatası:", e);
    }
  };

  const fetchGallerySettings = async () => {
    try {
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem("gallery_cache");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.categories) setCategories(parsed.categories);
          if (parsed.items) setGalleryItems(parsed.items);
          return;
        }
      }
      const docRef = doc(db, "settings", "gallery");
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        if (data.categories) setCategories(data.categories);
        if (data.items) setGalleryItems(data.items);
      }
    } catch (e) {
      console.error("Galeri verileri yükleme hatası:", e);
    }
  };

  // Registration Actions
  const handleDelete = async (id: string) => {
    if (!confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;
    try {
      await deleteDoc(doc(db, "pre_registrations", id));
      setRegistrations((prev) => prev.filter((r) => r.id !== id));
      if (selectedReg?.id === id) setSelectedReg(null);
    } catch (err) {
      alert("Silme işlemi sırasında hata oluştu.");
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "tamamlandi" ? "yeni" : "tamamlandi";
    try {
      await updateDoc(doc(db, "pre_registrations", id), { status: newStatus });
      setRegistrations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      if (selectedReg?.id === id) {
        setSelectedReg((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      alert("Durum güncellenemedi.");
    }
  };

  // Site Texts Action
  const handleSaveSiteTexts = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingTexts(true);
    setTextSaveSuccess(false);

    try {
      // Undefined değerleri temizle
      const sanitizedTexts = JSON.parse(JSON.stringify(siteTexts));
      
      // FIRESTORE BULUT KAYDI (Gerçek zamanlı tüm cihazlara eşzamanlanır)
      await setDoc(doc(db, "settings", "site_texts"), sanitizedTexts, { merge: true });
      if (typeof window !== "undefined") {
        localStorage.setItem("site_texts_cache", JSON.stringify(sanitizedTexts));
      }
      setTextSaveSuccess(true);
      setTimeout(() => setTextSaveSuccess(false), 4000);
    } catch (err: any) {
      console.error("Firestore kaydı sırasında hata:", err);
      alert("Ayarlar kaydedilirken hata oluştu: " + (err?.message || "Bilinmeyen hata"));
    } finally {
      setSavingTexts(false);
    }
  };

  // Gallery Actions
  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    const catId = newCatId.trim() || newCatName.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (categories.some((c) => c.id === catId)) {
      alert("Bu kategori KODU zaten mevcut!");
      return;
    }
    const updated = [...categories, { id: catId, name: newCatName.trim() }];
    setCategories(updated);
    setNewCatName("");
    setNewCatId("");
  };

  const handleDeleteCategory = (catId: string) => {
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;
    setCategories(categories.filter((c) => c.id !== catId));
  };

  // Cloudinary Upload Handler
  const [uploadingCloudinary, setUploadingCloudinary] = useState(false);

  const handleCloudinaryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCloudinary(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      const targetCat = newImgCat || (categories[0] ? categories[0].id : "siniflar");
      const title = newImgTitle.trim() || file.name.replace(/\.[^/.]+$/, "");

      const newItem: GalleryItem = {
        id: Date.now().toString(),
        title: title,
        category: targetCat,
        img: imageUrl
      };

      setGalleryItems((prev) => [newItem, ...prev]);
      setNewImgTitle("");
      setNewImgUrl("");
      setUploadingCloudinary(false);
      alert("Görsel listeye eklendi! Kalıcı olması için 'Galeri Ayarlarını Kaydet' butonuna basınız.");
    };

    reader.readAsDataURL(file);
  };

  const handleAddGalleryItem = () => {
    if (!newImgTitle.trim() || !newImgUrl.trim()) {
      alert("Lütfen görsel başlığı ve URL adresini giriniz.");
      return;
    }
    const targetCat = newImgCat || (categories[0] ? categories[0].id : "genel");
    const newItem: GalleryItem = {
      id: Date.now().toString(),
      title: newImgTitle.trim(),
      category: targetCat,
      img: newImgUrl.trim()
    };
    setGalleryItems([newItem, ...galleryItems]);
    setNewImgTitle("");
    setNewImgUrl("");
  };

  const handleDeleteGalleryItem = (itemId: string) => {
    setGalleryItems(galleryItems.filter((i) => i.id !== itemId));
  };

  const handleSaveGallerySettings = async () => {
    setSavingGallery(true);
    setGallerySaveSuccess(false);

    try {
      // FIRESTORE BULUT KAYDI (Gerçek zamanlı tüm cihazlara eşzamanlanır)
      await setDoc(doc(db, "settings", "gallery"), {
        categories,
        items: galleryItems
      }, { merge: true });
      setGallerySaveSuccess(true);
      setTimeout(() => setGallerySaveSuccess(false), 4000);
    } catch (e: any) {
      console.error("Firestore galeri kaydı uyarısı:", e);
      alert("Galeri ayarları kaydedilirken hata oluştu: " + e?.message);
    } finally {
      setSavingGallery(false);
    }
  };


  if (!isOpen) return null;

  const filteredRegistrations = registrations.filter((item) => {
    const matchesSearch =
      item.parentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone?.includes(searchTerm) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.note?.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "all") return matchesSearch;
    if (statusFilter === "tamamlandi") return matchesSearch && item.status === "tamamlandi";
    if (statusFilter === "yeni") return matchesSearch && item.status !== "tamamlandi";
    return matchesSearch;
  });

  const totalCount = registrations.length;
  const newCount = registrations.filter((r) => r.status !== "tamamlandi").length;
  const completedCount = registrations.filter((r) => r.status === "tamamlandi").length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md transition-all duration-300 animate-in fade-in">
      <div className="bg-slate-900 w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden border border-slate-800 flex flex-col h-[94vh] max-h-[880px] text-slate-100 font-sans">
        
        {/* TOP BAR / HEADER */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3.5">
            <img src="/logo.svg" alt="Yıldız Anaokulu Logo" className="h-10 w-auto object-contain" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg text-white tracking-tight">Yönetici Paneli</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Mahmutbey Yıldız Anaokulu Yönetimi</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 border border-slate-700/60 hover:border-rose-500/30 text-xs font-semibold flex items-center gap-2 transition-all duration-200"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Çıkış Yap</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors border border-slate-700/40"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MAIN BODY AREA */}
        {!isLoggedIn ? (
          /* LOGIN SCREEN */
          <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 relative overflow-hidden">
            <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-800/80 shadow-2xl space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700/60 text-amber-400 mb-2">
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">Yönetici Girişi</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Tüm içerik, metin ve başvuru yönetimine erişmek için kullanıcı bilgilerinizi giriniz.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {loginError && (
                  <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">Kullanıcı Adı</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="admin"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 focus:border-amber-500/80 text-white text-sm font-medium transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">Şifre</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 focus:border-amber-500/80 text-white text-sm font-medium transition-all outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mt-4"
                >
                  {isAuthenticating ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Giriş Yap</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* DASHBOARD LAYOUT WITH LEFT SIDEBAR */
          <div className="flex-1 flex flex-col md:flex-row min-h-0 bg-slate-950/60">
            
            {/* LEFT SIDEBAR NAVIGATION */}
            <div className="w-full md:w-64 bg-slate-900/90 border-b md:border-b-0 md:border-r border-slate-800 p-4 space-y-2 shrink-0 flex flex-row md:flex-col justify-between md:justify-start overflow-x-auto">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2 hidden md:block">
                Yönetim Menüsü
              </div>

              <div className="flex md:flex-col gap-2 w-full">
                {/* 1. İsim Listesi */}
                <button
                  onClick={() => setActiveTab("registrations")}
                  className={`w-full px-4 py-3 rounded-2xl font-bold text-xs flex items-center gap-3 transition-all ${
                    activeTab === "registrations"
                      ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <Users className="w-4 h-4 shrink-0" />
                  <span className="truncate">İsim Listesi</span>
                  {newCount > 0 && (
                    <span
                      className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        activeTab === "registrations" ? "bg-slate-950 text-amber-400" : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      {newCount}
                    </span>
                  )}
                </button>

                {/* 2. Site Metin Ayarları */}
                <button
                  onClick={() => setActiveTab("site_texts")}
                  className={`w-full px-4 py-3 rounded-2xl font-bold text-xs flex items-center gap-3 transition-all ${
                    activeTab === "site_texts"
                      ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <Settings className="w-4 h-4 shrink-0" />
                  <span className="truncate">Site Ayarları & Yazılar</span>
                </button>

                {/* 3. Galeri Yönetimi */}
                <button
                  onClick={() => setActiveTab("gallery")}
                  className={`w-full px-4 py-3 rounded-2xl font-bold text-xs flex items-center gap-3 transition-all ${
                    activeTab === "gallery"
                      ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <ImageIcon className="w-4 h-4 shrink-0" />
                  <span className="truncate">Galeri Yönetimi</span>
                </button>

                {/* 4. Giriş & Güvenlik Ayarları */}
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full px-4 py-3 rounded-2xl font-bold text-xs flex items-center gap-3 transition-all ${
                    activeTab === "security"
                      ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <Lock className="w-4 h-4 shrink-0" />
                  <span className="truncate">Giriş & Güvenlik</span>
                </button>
              </div>
            </div>

            {/* RIGHT CONTENT TAB PANELS */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-slate-950/40">
              
              {/* TAB 1: İSİM LİSTESİ / PRE-REGISTRATIONS */}
              {activeTab === "registrations" && (
                <div className="flex-1 flex flex-col min-h-0">
                  {/* Top Stats */}
                  <div className="p-4 bg-slate-900/50 border-b border-slate-800/70 grid grid-cols-3 gap-3 shrink-0">
                    <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-semibold text-slate-400">Toplam Başvuru</p>
                        <p className="text-xl font-black text-white">{totalCount}</p>
                      </div>
                      <Users className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-semibold text-amber-400">Bekleyenler</p>
                        <p className="text-xl font-black text-amber-400">{newCount}</p>
                      </div>
                      <Zap className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-semibold text-emerald-400">Görüşülenler</p>
                        <p className="text-xl font-black text-emerald-400">{completedCount}</p>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                  </div>

                  {/* Filter & Controls */}
                  <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        placeholder="İsim, tel veya e-posta ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/70 border border-slate-700/60 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/80"
                      />
                    </div>

                    <div className="flex items-center p-1 bg-slate-800/80 rounded-xl border border-slate-700/60">
                      <button
                        onClick={() => setStatusFilter("all")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          statusFilter === "all" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Tümü
                      </button>
                      <button
                        onClick={() => setStatusFilter("yeni")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          statusFilter === "yeni" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Bekleyen ({newCount})
                      </button>
                      <button
                        onClick={() => setStatusFilter("tamamlandi")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          statusFilter === "tamamlandi" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Tamamlanan ({completedCount})
                      </button>
                    </div>

                    <button
                      onClick={fetchRegistrations}
                      className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-medium text-xs flex items-center gap-1.5 border border-slate-700/60"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingRegs ? "animate-spin text-amber-400" : ""}`} />
                      <span>Yenile</span>
                    </button>
                  </div>

                  {/* List View */}
                  <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
                    <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${selectedReg ? "hidden md:block" : ""}`}>
                      {loadingRegs ? (
                        <div className="py-20 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                          <RefreshCw className="w-8 h-8 animate-spin text-amber-400" />
                          <span className="text-xs font-medium">Başvurular yükleniyor...</span>
                        </div>
                      ) : filteredRegistrations.length === 0 ? (
                        <div className="py-16 text-center text-slate-500 flex flex-col items-center justify-center gap-2 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800">
                          <Inbox className="w-10 h-10 text-slate-600" />
                          <span className="text-xs font-bold">Kayıt Bulunmuyor</span>
                        </div>
                      ) : (
                        filteredRegistrations.map((item) => {
                          const isDone = item.status === "tamamlandi";
                          const isSelected = selectedReg?.id === item.id;
                          return (
                            <div
                              key={item.id}
                              onClick={() => setSelectedReg(item)}
                              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                                isSelected
                                  ? "bg-slate-800 border-amber-500/80 ring-1 ring-amber-500/40"
                                  : isDone
                                  ? "bg-slate-900/40 border-slate-800/80"
                                  : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                              }`}
                            >
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-bold text-white text-sm">{item.parentName}</h4>
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                    {item.ageGroup} Yaş Grubu
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      isDone ? "bg-emerald-500/10 text-emerald-400" : "bg-sky-500/10 text-sky-400"
                                    }`}
                                  >
                                    {isDone ? "Görüşüldü" : "Yeni"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-400">
                                  <span className="font-mono">{item.phone}</span>
                                  {item.email && <span className="truncate max-w-[150px]">{item.email}</span>}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusToggle(item.id, item.status);
                                  }}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                    isDone
                                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                                      : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                                  }`}
                                >
                                  {isDone ? "Geri Al" : "Tamamla"}
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(item.id);
                                  }}
                                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Registration Detail Panel */}
                    {selectedReg && (
                      <div className="w-full md:w-80 bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 p-5 flex flex-col space-y-4 shrink-0 overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <span className="text-xs font-bold uppercase text-slate-400">Başvuru Detayı</span>
                          <button onClick={() => setSelectedReg(null)} className="text-slate-400 hover:text-white">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 uppercase font-semibold">Veli Adı</label>
                          <p className="text-base font-bold text-white">{selectedReg.parentName}</p>
                        </div>
                        <div className="space-y-2">
                          <a href={`tel:${selectedReg.phone}`} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800 text-xs text-white">
                            <Phone className="w-4 h-4 text-amber-400" />
                            {selectedReg.phone}
                          </a>
                          {selectedReg.email && (
                            <a href={`mailto:${selectedReg.email}`} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800 text-xs text-white truncate">
                              <Mail className="w-4 h-4 text-sky-400" />
                              {selectedReg.email}
                            </a>
                          )}
                        </div>
                        {selectedReg.note && (
                          <div>
                            <label className="text-[10px] text-slate-500 uppercase font-semibold">Not</label>
                            <p className="p-3 rounded-xl bg-slate-950 text-xs text-slate-300 italic">{selectedReg.note}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: SİTE YAZILARI & AYARLARI */}
              {activeTab === "site_texts" && (
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Edit3 className="w-5 h-5 text-amber-400" />
                        Sitedeki Tüm Yazıları Düzenle
                      </h3>
                      <p className="text-xs text-slate-400">
                        Burada yaptığınız değişiklikler doğrudan ana sayfadaki başlıklara ve iletişim bilgilerine yansır.
                      </p>
                    </div>
                    {textSaveSuccess && (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                        <Check className="w-4 h-4" /> Değişiklikler Kaydedildi!
                      </span>
                    )}
                  </div>

                  <form onSubmit={handleSaveSiteTexts} className="space-y-5 max-w-3xl">
                    {/* Header & Button Texts */}
                    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                      <h4 className="text-xs font-bold uppercase text-amber-400 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> Genel Butonlar & Üst Menü
                      </h4>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Menü / Üst Bar Ön Kayıt Buton Metni</label>
                        <input
                          type="text"
                          value={siteTexts.navCtaBtnText || "Ön Kayıt Yap"}
                          onChange={(e) => setSiteTexts({ ...siteTexts, navCtaBtnText: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:border-amber-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Hero Section Texts */}
                    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                      <h4 className="text-xs font-bold uppercase text-amber-400 flex items-center gap-2">
                        <Globe className="w-4 h-4" /> Ana Sayfa Karşılama (Hero) Bölümü
                      </h4>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Üst Duyuru Rozet Metni</label>
                        <input
                          type="text"
                          value={siteTexts.heroBadgeText || "Mahmutbey Yıldız Anaokulu — 2026-2027 Kayıtları Açık!"}
                          onChange={(e) => setSiteTexts({ ...siteTexts, heroBadgeText: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:border-amber-500 outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Ana Başlık</label>
                        <input
                          type="text"
                          value={siteTexts.heroTitle}
                          onChange={(e) => setSiteTexts({ ...siteTexts, heroTitle: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:border-amber-500 outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Alt Açıklama (Hero Subtitle)</label>
                        <textarea
                          rows={2}
                          value={siteTexts.heroSubtitle}
                          onChange={(e) => setSiteTexts({ ...siteTexts, heroSubtitle: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:border-amber-500 outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300">Ön Kayıt Buton Yazısı</label>
                          <input
                            type="text"
                            value={siteTexts.heroCtaBtnText || "Hemen Ön Kayıt Oluştur"}
                            onChange={(e) => setSiteTexts({ ...siteTexts, heroCtaBtnText: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:border-amber-500 outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300">WhatsApp Buton Yazısı</label>
                          <input
                            type="text"
                            value={siteTexts.heroWhatsappBtnText || "WhatsApp'tan Bilgi Al"}
                            onChange={(e) => setSiteTexts({ ...siteTexts, heroWhatsappBtnText: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:border-amber-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Hero Stat Cards (3 Öğün vb.) */}
                    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                      <h4 className="text-xs font-bold uppercase text-amber-400 flex items-center gap-2">
                        <Zap className="w-4 h-4" /> Karşılama İstatistik Kutuları (3 Öğün vb.)
                      </h4>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-slate-300">1. Kutu Değer (%100)</label>
                          <input
                            type="text"
                            value={siteTexts.stat1Val || "%100"}
                            onChange={(e) => setSiteTexts({ ...siteTexts, stat1Val: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:border-amber-500 outline-none"
                          />
                          <label className="text-[10px] text-slate-400">Etiket</label>
                          <input
                            type="text"
                            value={siteTexts.stat1Label || "MEB Uyumlu"}
                            onChange={(e) => setSiteTexts({ ...siteTexts, stat1Label: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:border-amber-500 outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-slate-300">2. Kutu Değer (2-6 Yaş)</label>
                          <input
                            type="text"
                            value={siteTexts.stat2Val || "2-6 Yaş"}
                            onChange={(e) => setSiteTexts({ ...siteTexts, stat2Val: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:border-amber-500 outline-none"
                          />
                          <label className="text-[10px] text-slate-400">Etiket</label>
                          <input
                            type="text"
                            value={siteTexts.stat2Label || "Özel Program"}
                            onChange={(e) => setSiteTexts({ ...siteTexts, stat2Label: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:border-amber-500 outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-semibold text-amber-400 font-bold">3. Kutu Değer (3 Öğün)</label>
                          <input
                            type="text"
                            value={siteTexts.stat3Val || "3 Öğün"}
                            onChange={(e) => setSiteTexts({ ...siteTexts, stat3Val: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-amber-500/60 text-white text-xs font-medium focus:border-amber-500 outline-none"
                          />
                          <label className="text-[10px] text-amber-300">Etiket (Taze & Helal)</label>
                          <input
                            type="text"
                            value={siteTexts.stat3Label || "Taze & Helal"}
                            onChange={(e) => setSiteTexts({ ...siteTexts, stat3Label: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-amber-500/60 text-white text-xs font-medium focus:border-amber-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Hero Visual Card Texts */}
                    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                      <h4 className="text-xs font-bold uppercase text-amber-400 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" /> Fotoğraf Kartı Rozet & Yazıları
                      </h4>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Fotoğraf Üst Üst Rozet</label>
                        <input
                          type="text"
                          value={siteTexts.heroCardBadge || "Sevgi & Değerler Odaklı Eğitim"}
                          onChange={(e) => setSiteTexts({ ...siteTexts, heroCardBadge: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:border-amber-500 outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300">Fotoğraf Üst Başlık</label>
                          <input
                            type="text"
                            value={siteTexts.heroCardTitle || "Mutlu Çocuklar, Güvenli Gelecek"}
                            onChange={(e) => setSiteTexts({ ...siteTexts, heroCardTitle: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:border-amber-500 outline-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300">Fotoğraf Üst Açıklama</label>
                          <input
                            type="text"
                            value={siteTexts.heroCardDesc || "Modern sınıflarımız ve..."}
                            onChange={(e) => setSiteTexts({ ...siteTexts, heroCardDesc: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:border-amber-500 outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-300">Sol Alt Rozet Başlık / Alt</label>
                          <input
                            type="text"
                            value={siteTexts.heroFloat1Title || "7/24 Güvenlikli"}
                            onChange={(e) => setSiteTexts({ ...siteTexts, heroFloat1Title: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium mb-1"
                          />
                          <input
                            type="text"
                            value={siteTexts.heroFloat1Sub || "Kamera & Hijyen"}
                            onChange={(e) => setSiteTexts({ ...siteTexts, heroFloat1Sub: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-300">Sağ Üst Rozet Başlık / Alt</label>
                          <input
                            type="text"
                            value={siteTexts.heroFloat2Title || "MEB Onaylı"}
                            onChange={(e) => setSiteTexts({ ...siteTexts, heroFloat2Title: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium mb-1"
                          />
                          <input
                            type="text"
                            value={siteTexts.heroFloat2Sub || "Müfredat"}
                            onChange={(e) => setSiteTexts({ ...siteTexts, heroFloat2Sub: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    {/* About Section Texts */}
                    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                      <h4 className="text-xs font-bold uppercase text-amber-400 flex items-center gap-2">
                        <Layout className="w-4 h-4" /> Hakkımızda Bölümü Yazıları
                      </h4>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Rozet Metni</label>
                        <input
                          type="text"
                          value={siteTexts.aboutBadgeText || "Hakkımızda"}
                          onChange={(e) => setSiteTexts({ ...siteTexts, aboutBadgeText: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:border-amber-500 outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Hakkımızda Başlığı</label>
                        <input
                          type="text"
                          value={siteTexts.aboutTitle}
                          onChange={(e) => setSiteTexts({ ...siteTexts, aboutTitle: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:border-amber-500 outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Hakkımızda Detay Metni</label>
                        <textarea
                          rows={3}
                          value={siteTexts.aboutText}
                          onChange={(e) => setSiteTexts({ ...siteTexts, aboutText: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:border-amber-500 outline-none"
                        />
                      </div>

                      <div className="space-y-2 pt-1">
                        <label className="text-xs font-semibold text-amber-400 block">Hakkımızda 3 Madde Metni</label>
                        <input
                          type="text"
                          value={siteTexts.aboutItem1 || "Çok yönlü gelişim sağlayan modern branş dersleri"}
                          onChange={(e) => setSiteTexts({ ...siteTexts, aboutItem1: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium"
                          placeholder="1. Madde"
                        />
                        <input
                          type="text"
                          value={siteTexts.aboutItem2 || "Pedagojik formasyon sahibi uzman öğretmen kadrosu"}
                          onChange={(e) => setSiteTexts({ ...siteTexts, aboutItem2: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium"
                          placeholder="2. Madde"
                        />
                        <input
                          type="text"
                          value={siteTexts.aboutItem3 || "Ferah, aydınlık, hijyenik ve depreme dayanıklı kampüs"}
                          onChange={(e) => setSiteTexts({ ...siteTexts, aboutItem3: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium"
                          placeholder="3. Madde"
                        />
                      </div>
                    </div>

                    {/* Why Us Section Texts */}
                    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                      <h4 className="text-xs font-bold uppercase text-amber-400 flex items-center gap-2">
                        <Tag className="w-4 h-4" /> Yıldız&apos;da Eğitim (Farklarımız) Bölümü
                      </h4>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Rozet Metni</label>
                        <input
                          type="text"
                          value={siteTexts.whyUsBadge || "Yıldız'da Eğitim"}
                          onChange={(e) => setSiteTexts({ ...siteTexts, whyUsBadge: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:border-amber-500 outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Bölüm Başlığı</label>
                        <input
                          type="text"
                          value={siteTexts.whyUsTitle || "Ayrıcalıklı Eğitim Modelimiz & Farklarımız"}
                          onChange={(e) => setSiteTexts({ ...siteTexts, whyUsTitle: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:border-amber-500 outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Bölüm Alt Açıklaması</label>
                        <textarea
                          rows={2}
                          value={siteTexts.whyUsSubtitle || "Değerlerle büyüyen, bilimle gelişen..."}
                          onChange={(e) => setSiteTexts({ ...siteTexts, whyUsSubtitle: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:border-amber-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Gallery Section Texts */}
                    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                      <h4 className="text-xs font-bold uppercase text-amber-400 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" /> Galeri Bölümü Yazıları
                      </h4>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Rozet Metni</label>
                        <input
                          type="text"
                          value={siteTexts.galleryBadge || "Galeri"}
                          onChange={(e) => setSiteTexts({ ...siteTexts, galleryBadge: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:border-amber-500 outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Galeri Başlığı</label>
                        <input
                          type="text"
                          value={siteTexts.galleryTitle || "Okulumuzdan Kareler"}
                          onChange={(e) => setSiteTexts({ ...siteTexts, galleryTitle: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:border-amber-500 outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Galeri Alt Açıklaması</label>
                        <textarea
                          rows={2}
                          value={siteTexts.gallerySubtitle || "Her fotoğraf, sevgiyle büyüyen ve keşfeden bir hikayenin parçası..."}
                          onChange={(e) => setSiteTexts({ ...siteTexts, gallerySubtitle: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:border-amber-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Contact Info & Section Texts */}
                    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                      <h4 className="text-xs font-bold uppercase text-amber-400 flex items-center gap-2">
                        <Phone className="w-4 h-4" /> İletişim Bölümü & Bilgileri
                      </h4>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">İletişim Bölüm Başlığı</label>
                        <input
                          type="text"
                          value={siteTexts.contactTitle || "Mahmutbey Yıldız Anaokulu’nu Keşfedin"}
                          onChange={(e) => setSiteTexts({ ...siteTexts, contactTitle: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:border-amber-500 outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">İletişim Bölüm Açıklaması</label>
                        <textarea
                          rows={2}
                          value={siteTexts.contactSubtitle || "2–6 yaş arası çocuklar için değer..."}
                          onChange={(e) => setSiteTexts({ ...siteTexts, contactSubtitle: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:border-amber-500 outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300">Telefon Numarası</label>
                          <input
                            type="text"
                            value={siteTexts.phone}
                            onChange={(e) => setSiteTexts({ ...siteTexts, phone: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:border-amber-500 outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300">WhatsApp Numarası</label>
                          <input
                            type="text"
                            value={siteTexts.whatsappPhone || "05414470608"}
                            onChange={(e) => setSiteTexts({ ...siteTexts, whatsappPhone: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:border-amber-500 outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">E-Posta Adresi</label>
                        <input
                          type="text"
                          value={siteTexts.email}
                          onChange={(e) => setSiteTexts({ ...siteTexts, email: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:border-amber-500 outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Açık Adres</label>
                        <input
                          type="text"
                          value={siteTexts.address}
                          onChange={(e) => setSiteTexts({ ...siteTexts, address: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:border-amber-500 outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Çalışma Saatleri</label>
                        <input
                          type="text"
                          value={siteTexts.workingHours}
                          onChange={(e) => setSiteTexts({ ...siteTexts, workingHours: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:border-amber-500 outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={savingTexts}
                      className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
                    >
                      {savingTexts ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      <span>Tüm Yazıları Kaydet ve Yayınla</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 3: GALERİ VE KATEGORİ YÖNETİMİ */}
              {activeTab === "gallery" && (
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-amber-400" />
                        Galeri ve Görsel Kategorileri
                      </h3>
                      <p className="text-xs text-slate-400">
                        Kategorileri yönetin ve web sitesindeki galeri bölümüne yeni fotoğraflar ekleyin.
                      </p>
                    </div>
                    {gallerySaveSuccess && (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                        <Check className="w-4 h-4" /> Galeri Değişiklikleri Kaydedildi!
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Categories Column */}
                    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                      <h4 className="text-xs font-bold uppercase text-amber-400 flex items-center gap-2">
                        <FolderPlus className="w-4 h-4" /> Görsel Kategorileri
                      </h4>

                      <div className="space-y-2">
                        {categories.map((cat) => (
                          <div
                            key={cat.id}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-white"
                          >
                            <span className="font-semibold">{cat.name} <span className="text-[10px] text-slate-500">({cat.id})</span></span>
                            <button
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="text-slate-400 hover:text-rose-400 p-1"
                              title="Kategoriyi Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add New Category */}
                      <div className="pt-3 border-t border-slate-800 space-y-2">
                        <label className="text-[11px] font-semibold text-slate-300 block">Yeni Kategori Ekle</label>
                        <input
                          type="text"
                          placeholder="Kategori Adı (ör: Bahçe Şenliği)"
                          value={newCatName}
                          onChange={(e) => setNewCatName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                        />
                        <button
                          onClick={handleAddCategory}
                          className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs flex items-center justify-center gap-1.5 border border-amber-500/30"
                        >
                          <Plus className="w-3.5 h-3.5" /> Listeye Kategori Ekle
                        </button>
                      </div>
                    </div>

                    {/* Add Image & Gallery Items List */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Add Image Form */}
                      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                        <h4 className="text-xs font-bold uppercase text-amber-400 flex items-center gap-2">
                          <Plus className="w-4 h-4" /> Yeni Fotoğraf / Görsel Ekle
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Görsel Başlığı / Açıklaması"
                            value={newImgTitle}
                            onChange={(e) => setNewImgTitle(e.target.value)}
                            className="px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                          />
                          <select
                            value={newImgCat}
                            onChange={(e) => setNewImgCat(e.target.value)}
                            className="px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                          >
                            {categories.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Direct File Upload UI */}
                        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                          <label className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Upload className="w-4 h-4" /> Bilgisayardan Doğrudan Görsel Ekle
                          </label>

                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <label className="cursor-pointer px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20">
                              {uploadingCloudinary ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 text-slate-950" />}
                              <span>Bilgisayardan Fotoğraf Seç</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleCloudinaryFileUpload}
                                className="hidden"
                              />
                            </label>
                            <span className="text-xs text-slate-400">Seçtiğiniz fotoğraf doğrudan galeri listesine eklenir.</span>
                          </div>
                        </div>

                        <div className="relative">
                          <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                          <input
                            type="text"
                            placeholder="veya alternatif Görsel URL Adresi (https://...)"
                            value={newImgUrl}
                            onChange={(e) => setNewImgUrl(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        {newImgUrl && (
                          <button
                            onClick={handleAddGalleryItem}
                            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs flex items-center gap-1.5 border border-emerald-500/30"
                          >
                            <Plus className="w-4 h-4" /> URL Adresini Listeye Ekle
                          </button>
                        )}
                      </div>

                      {/* Current Gallery Grid */}
                      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold uppercase text-amber-400 flex items-center gap-2">
                            <Layers className="w-4 h-4" /> Mevcut Galeri Fotoğrafları ({galleryItems.length})
                          </h4>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {galleryItems.map((item) => (
                            <div key={item.id} className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video">
                              <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90 p-2 flex flex-col justify-between">
                                <button
                                  onClick={() => handleDeleteGalleryItem(item.id)}
                                  className="self-end p-1 rounded-lg bg-rose-500/80 text-white hover:bg-rose-600 transition-colors"
                                  title="Fotoğrafı Sil"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <div>
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                    {categories.find((c) => c.id === item.category)?.name || item.category}
                                  </span>
                                  <p className="text-[11px] font-bold text-white truncate leading-tight mt-0.5">{item.title}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Global Save Button for Gallery */}
                      <button
                        onClick={handleSaveGallerySettings}
                        disabled={savingGallery}
                        className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
                      >
                        {savingGallery ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span>Galeri & Kategori Değişikliklerini Kaydet</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: GİRİŞ & GÜVENLİK AYARLARI */}
              {activeTab === "security" && (
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Lock className="w-5 h-5 text-amber-400" />
                        Yönetici Giriş Bilgilerini Değiştir
                      </h3>
                      <p className="text-xs text-slate-400">
                        Yönetici paneline giriş yaparken kullandığınız kullanıcı adı ve şifreyi buradan güncelleyebilirsiniz.
                      </p>
                    </div>
                    {credSaveSuccess && (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                        <Check className="w-4 h-4" /> Giriş Bilgileri Güncellendi!
                      </span>
                    )}
                  </div>

                  <form onSubmit={handleSaveAdminCredentials} className="space-y-5 max-w-xl">
                    {credError && (
                      <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{credError}</span>
                      </div>
                    )}

                    <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Yönetici Kullanıcı Adı *</label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                          <input
                            type="text"
                            required
                            value={newAdminUser}
                            onChange={(e) => setNewAdminUser(e.target.value)}
                            placeholder="örn: admin veya yıldızadmin"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:border-amber-500 outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Yeni Şifre (Değiştirmek istemiyorsanız boş bırakın)</label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                          <input
                            type="password"
                            value={newAdminPass}
                            onChange={(e) => setNewAdminPass(e.target.value)}
                            placeholder="Yeni şifreniz"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:border-amber-500 outline-none"
                          />
                        </div>
                      </div>

                      {newAdminPass && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300">Yeni Şifre (Tekrar)</label>
                          <div className="relative">
                            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                            <input
                              type="password"
                              value={confirmAdminPass}
                              onChange={(e) => setConfirmAdminPass(e.target.value)}
                              placeholder="Yeni şifrenizi tekrar girin"
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:border-amber-500 outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={savingCreds}
                      className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
                    >
                      {savingCreds ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      <span>Giriş Bilgilerini Kaydet ve Güncelle</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
