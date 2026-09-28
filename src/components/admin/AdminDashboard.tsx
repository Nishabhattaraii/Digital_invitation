import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import {
  Users,
  HeartHandshake,
  Flame,
  PartyPopper,
  Image,
  ScrollText,
  Calendar,
  Palette,
  Eye,
  EyeOff,
  LogOut,
  Save,
  RotateCcw,
  Upload,
  Trash2,
  X,
  Download,
  UploadCloud,
  Lock,
  Music,
} from 'lucide-react';
import { compressImage } from '../../utils/imageCompressor';

interface AdminDashboardProps {
  isRoute?: boolean;
  onNavigateHome?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isRoute = false,
  onNavigateHome,
}) => {
  const {
    data,
    updateData,
    resetToDefault,
    isAdminOpen,
    setIsAdminOpen,
    isAuthenticated,
    login,
    logout,
    showToast,
    exportDataJson,
    importDataJson,
  } = useWedding();

  const handleClose = () => {
    // Automatically save any pending changes before navigating back to the main invitation
    updateData(() => formData);
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      setIsAdminOpen(false);
      if (isRoute) {
        window.history.pushState({}, '', '/');
        window.location.href = '/';
      }
    }
  };

  const [activeTab, setActiveTab] = useState<
    | 'couple'
    | 'family'
    | 'wedding'
    | 'reception'
    | 'photos'
    | 'music'
    | 'invitation'
    | 'calendar'
    | 'appearance'
    | 'backup'
  >('couple');

  const [showPasscode, setShowPasscode] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [passcodeInput, setPasscodeInput] = useState('');
  const [formData, setFormData] = useState(data);

  // Sync formData with context when data changes
  React.useEffect(() => {
    setFormData(data);
  }, [data]);

  if (!isRoute && !isAdminOpen) return null;

  // Login Modal if not authenticated
  if (!isAuthenticated) {
    const handleLoginSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const success = login(passcodeInput);
      if (!success) {
        setLoginError('Incorrect passcode. Please try again.');
      } else {
        setLoginError('');
      }
    };

    return (
      <div className={`${isRoute ? 'min-h-screen' : 'fixed inset-0 z-50'} bg-[#2A080D]/90 backdrop-blur-md flex items-center justify-center p-4`}>
        <div className="bg-[#FAF6F0] rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-2 border-[#5E121E]/30 relative text-stone-800">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
            title="Return to wedding invitation"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-[var(--primary-red-soft)] border border-[var(--primary-red)]/30 flex items-center justify-center mx-auto mb-3 text-[var(--primary-red)]">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-serif-cormorant font-bold text-2xl text-stone-900">
              Admin Authentication
            </h3>
            <p className="text-xs text-stone-600 mt-1">
              Please enter the administrator passcode to customize the wedding website.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-stone-700 font-semibold mb-1">
                Passcode
              </label>
              <div className="relative">
                <input
                  type={showPasscode ? 'text' : 'password'}
                  value={passcodeInput}
                  onChange={(e) => {
                    setPasscodeInput(e.target.value);
                    if (loginError) setLoginError('');
                  }}
                  placeholder="Enter passcode"
                  className={`w-full pl-4 pr-11 py-2.5 rounded-lg border ${
                    loginError ? 'border-red-500 bg-red-50/40' : 'border-stone-300 bg-white'
                  } text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#5E121E] focus:ring-1 focus:ring-[#5E121E] text-base sm:text-sm font-medium shadow-2xs transition-colors`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-800 p-1.5 cursor-pointer rounded-md hover:bg-stone-100 transition-colors"
                  title={showPasscode ? 'Hide passcode' : 'Show passcode'}
                >
                  {showPasscode ? <EyeOff className="w-4 h-4 text-stone-600" /> : <Eye className="w-4 h-4 text-stone-600" />}
                </button>
              </div>

              {loginError && (
                <p className="text-xs text-red-600 font-medium mt-1.5 flex items-center gap-1">
                  <span>{loginError}</span>
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#5E121E] hover:bg-[#4E0B14] text-white text-xs font-semibold uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
              >
                Sign In
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-200 text-center">
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
              >
                <span>← Return to Wedding Invitation</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Handle Gallery Photo Upload with Automatic Canvas Compression
  const handlePhotoUpload = async (slotIndex: number, file: File) => {
    try {
      const compressed = await compressImage(file, 1200, 0.84);
      const updatedGallery = [...formData.gallery];
      if (updatedGallery[slotIndex]) {
        updatedGallery[slotIndex] = {
          ...updatedGallery[slotIndex],
          url: compressed,
        };
        setFormData((prev) => ({ ...prev, gallery: updatedGallery }));
        updateData((prev) => ({
          ...prev,
          gallery: updatedGallery,
        }));
        showToast(`Photo slot #${slotIndex + 1} updated and saved!`, 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Error processing gallery image', 'error');
    }
  };

  // Handle Hero Couple Portrait Upload with Canvas Compression
  const handleHeroUpload = async (file: File) => {
    try {
      const compressed = await compressImage(file, 1200, 0.85);
      setFormData((prev) => ({
        ...prev,
        appearance: { ...prev.appearance, heroIllustrationUrl: compressed },
      }));
      updateData((prev) => ({
        ...prev,
        appearance: { ...prev.appearance, heroIllustrationUrl: compressed },
      }));
      showToast('First page couple portrait photo updated and saved!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error uploading couple portrait photo', 'error');
    }
  };

  // Handle Groom Photo Upload with Canvas Compression
  const handleGroomPhotoUpload = async (file: File) => {
    try {
      const compressed = await compressImage(file, 900, 0.84);
      setFormData((prev) => ({
        ...prev,
        couple: {
          ...prev.couple,
          groom: { ...prev.couple.groom, image: compressed },
        },
      }));
      updateData((prev) => ({
        ...prev,
        couple: {
          ...prev.couple,
          groom: { ...prev.couple.groom, image: compressed },
        },
      }));
      showToast('Groom photo updated and saved!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error uploading groom photo', 'error');
    }
  };

  // Handle Bride Photo Upload with Canvas Compression
  const handleBridePhotoUpload = async (file: File) => {
    try {
      const compressed = await compressImage(file, 900, 0.84);
      setFormData((prev) => ({
        ...prev,
        couple: {
          ...prev.couple,
          bride: { ...prev.couple.bride, image: compressed },
        },
      }));
      updateData((prev) => ({
        ...prev,
        couple: {
          ...prev.couple,
          bride: { ...prev.couple.bride, image: compressed },
        },
      }));
      showToast('Bride photo updated and saved!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error uploading bride photo', 'error');
    }
  };

  // Handle Wedding Music Audio Upload
  const handleAudioFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFormData((prev) => ({
        ...prev,
        music: { ...prev.music, audioUrl: result },
      }));
      updateData((prev) => ({
        ...prev,
        music: { ...prev.music, audioUrl: result },
      }));
      showToast('Custom audio file uploaded and saved!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAll = () => {
    updateData(() => formData);
    showToast('All wedding details saved successfully!');
  };

  const navItems = [
    { id: 'couple', label: 'Couple Info', icon: Users },
    { id: 'family', label: 'Family Blessings', icon: HeartHandshake },
    { id: 'wedding', label: 'Wedding Ceremony', icon: Flame },
    { id: 'reception', label: 'Reception Party', icon: PartyPopper },
    { id: 'photos', label: '4 Photos Gallery', icon: Image },
    { id: 'music', label: 'Wedding Song', icon: Music },
    { id: 'invitation', label: 'Invitation Text', icon: ScrollText },
    { id: 'calendar', label: 'Calendar & Countdown', icon: Calendar },
    { id: 'appearance', label: 'Theme & Colors', icon: Palette },
    { id: 'backup', label: 'Backup & Restore', icon: UploadCloud },
  ] as const;

  return (
    <div className={`${isRoute ? 'min-h-screen py-3 sm:py-6' : 'fixed inset-0 z-50'} bg-black/75 backdrop-blur-sm flex items-center justify-center p-1 sm:p-4`}>
      <div className="bg-white rounded-2xl w-full max-w-5xl h-[95vh] sm:h-[92vh] shadow-2xl flex flex-col overflow-hidden border border-[var(--primary-gold)]/40">
        {/* Top Header Bar - fully responsive */}
        <div className="px-3 sm:px-6 py-3 bg-white border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--primary-gold-soft)] border border-[var(--primary-gold)] flex items-center justify-center text-[var(--primary-red)] font-bold text-xs sm:text-sm shrink-0">
              ॥
            </div>
            <div>
              <h2 className="font-serif-cormorant font-bold text-base sm:text-xl text-stone-800 leading-tight">
                Admin Panel
              </h2>
              <p className="hidden sm:block text-[11px] text-stone-500">
                {formData.hero.groomName} &amp; {formData.hero.brideName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleClose}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-medium cursor-pointer"
              title="Return to wedding invitation"
            >
              <Eye className="w-3.5 h-3.5 text-[var(--primary-gold)]" />
              <span className="hidden sm:inline">View Invitation</span>
            </button>

            <button
              onClick={handleSaveAll}
              className="inline-flex items-center gap-1 px-3 sm:px-4 py-1.5 rounded-lg bg-[var(--primary-red)] hover:bg-[var(--primary-red-deep)] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-stone-100 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>

            <button
              onClick={handleClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer"
              title="Return to wedding invitation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Navigation Tabs */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto px-2 py-2 bg-stone-100/90 border-b border-stone-200 shrink-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-[var(--primary-red)] text-white shadow-xs font-semibold'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-200' : 'text-stone-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Body: Desktop Sidebar + Tab Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Desktop Sidebar */}
          <aside className="hidden md:flex w-52 sm:w-60 bg-stone-50 border-r border-stone-200 p-3 flex-col justify-between shrink-0 overflow-y-auto">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 px-3 py-1 block">
                Manage Content
              </span>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-[var(--primary-red)] text-white font-semibold shadow-xs'
                        : 'text-stone-600 hover:bg-stone-200/60 hover:text-stone-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-200' : 'text-stone-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-stone-200 space-y-2">
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to reset all data back to original defaults?')) {
                    resetToDefault();
                  }
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Defaults</span>
              </button>
            </div>
          </aside>

          {/* Form Content Area */}
          <main className="flex-1 p-6 overflow-y-auto bg-white">
            {/* TAB 1: COUPLE INFO */}
            {activeTab === 'couple' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="font-serif-cormorant font-bold text-2xl text-stone-800">
                    Couple Information
                  </h3>
                  <p className="text-xs text-stone-500">
                    Customize the names, titles, traditional attire notes, and introductions for both the Groom and Bride.
                  </p>
                </div>

                {/* Hero section names */}
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--primary-red)]">
                    Hero Announcement
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Groom Name (Hero)</label>
                      <input
                        type="text"
                        value={formData.hero.groomName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hero: { ...formData.hero, groomName: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Bride Name (Hero)</label>
                      <input
                        type="text"
                        value={formData.hero.brideName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hero: { ...formData.hero, brideName: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-stone-600 mb-1">Devanagari Header Greeting</label>
                    <input
                      type="text"
                      value={formData.hero.devanagariGreeting}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, devanagariGreeting: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white font-devanagari"
                    />
                  </div>
                </div>

                {/* First Page (Hero) Couple Portrait Photo */}
                <div className="p-4 sm:p-5 rounded-xl border-2 border-[#5E121E]/20 bg-[#FAF6F0] space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#5E121E] flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#5E121E]" />
                      First Page (Hero) Couple Portrait Photo
                    </h4>
                    <span className="text-[10px] text-[#B89352] font-semibold uppercase tracking-wider bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      Displayed on Main Invitation
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 bg-white rounded-xl border border-stone-200">
                    {/* Circular preview matching Hero medallion */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#B89352] p-1 bg-[#F5EDE1] shrink-0 shadow-sm overflow-hidden">
                      <img
                        src={formData.appearance.heroIllustrationUrl || '/images/hero-couple.jpg'}
                        alt="Hero Couple Portrait"
                        className="w-full h-full object-cover object-top rounded-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/hero-couple.jpg';
                        }}
                      />
                    </div>

                    <div className="flex-1 space-y-2.5 w-full text-center sm:text-left">
                      <div>
                        <span className="block text-xs font-bold text-stone-800">
                          First Page Couple Portrait (Circular Medallion)
                        </span>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          This photo appears inside the gold ring on the first page of the wedding invitation.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                        <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#5E121E] hover:bg-[#4A0812] text-white rounded-lg text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-xs transition-colors">
                          <Upload className="w-3.5 h-3.5 text-amber-200" />
                          <span>Upload Couple Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleHeroUpload(file);
                            }}
                            className="hidden"
                          />
                        </label>

                        {formData.appearance.heroIllustrationUrl &&
                          formData.appearance.heroIllustrationUrl !== '/images/hero-couple.jpg' && (
                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  appearance: { ...prev.appearance, heroIllustrationUrl: '/images/hero-couple.jpg' },
                                }));
                                updateData((prev) => ({
                                  ...prev,
                                  appearance: { ...prev.appearance, heroIllustrationUrl: '/images/hero-couple.jpg' },
                                }));
                                showToast('Reset couple photo to default', 'info');
                              }}
                              className="px-3 py-2 border border-stone-300 text-stone-600 hover:bg-stone-50 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                            >
                              Reset to Default
                            </button>
                          )}
                      </div>

                      <div className="pt-1">
                        <input
                          type="text"
                          value={
                            formData.appearance.heroIllustrationUrl?.startsWith('data:')
                              ? '[Custom uploaded photo file]'
                              : formData.appearance.heroIllustrationUrl || ''
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            if (!val.startsWith('[')) {
                              setFormData((prev) => ({
                                ...prev,
                                appearance: { ...prev.appearance, heroIllustrationUrl: val },
                              }));
                              updateData((prev) => ({
                                ...prev,
                                appearance: { ...prev.appearance, heroIllustrationUrl: val },
                              }));
                            }
                          }}
                          placeholder="Or paste image URL (e.g. /images/hero-couple.jpg)"
                          className="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs bg-stone-50 text-stone-700"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Groom Details */}
                <div className="p-4 rounded-xl border border-stone-200 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--primary-red)]" />
                    Groom Profile &amp; Photo
                  </h4>

                  {/* Groom Photo Upload & Preview */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="w-20 h-20 rounded-full border-2 border-[var(--primary-gold)] overflow-hidden shrink-0 bg-white shadow-xs">
                      <img
                        src={formData.couple.groom.image || '/images/groom.jpg'}
                        alt="Groom Preview"
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/groom.jpg';
                        }}
                      />
                    </div>
                    <div className="flex-1 space-y-2 w-full text-center sm:text-left">
                      <label className="block text-xs font-semibold text-stone-700">
                        Groom Portrait Photo
                      </label>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-100 cursor-pointer shadow-2xs transition-colors">
                          <Upload className="w-3.5 h-3.5 text-[var(--primary-red)]" />
                          <span>Upload Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleGroomPhotoUpload(file);
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              couple: {
                                ...prev.couple,
                                groom: { ...prev.couple.groom, image: '/images/groom.jpg' },
                              },
                            }));
                            updateData((prev) => ({
                              ...prev,
                              couple: {
                                ...prev.couple,
                                groom: { ...prev.couple.groom, image: '/images/groom.jpg' },
                              },
                            }));
                            showToast('Groom photo reset to default');
                          }}
                          className="px-2.5 py-1.5 border border-stone-200 rounded-lg text-xs text-stone-500 hover:text-stone-800 bg-white"
                        >
                          Default Photo
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Or enter image URL (e.g. /images/groom.jpg)"
                        value={formData.couple.groom.image || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            couple: {
                              ...formData.couple,
                              groom: { ...formData.couple.groom, image: e.target.value },
                            },
                          })
                        }
                        className="w-full px-2.5 py-1 text-xs border rounded-lg bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={formData.couple.groom.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            couple: {
                              ...formData.couple,
                              groom: { ...formData.couple.groom, name: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Role / Subtitle</label>
                      <input
                        type="text"
                        value={formData.couple.groom.role}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            couple: {
                              ...formData.couple,
                              groom: { ...formData.couple.groom, role: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-stone-600 mb-1">Attire Note</label>
                    <input
                      type="text"
                      value={formData.couple.groom.attire || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          couple: {
                            ...formData.couple,
                            groom: { ...formData.couple.groom, attire: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-600 mb-1">Introduction / Description</label>
                    <textarea
                      rows={2}
                      value={formData.couple.groom.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          couple: {
                            ...formData.couple,
                            groom: { ...formData.couple.groom, description: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>

                {/* Bride Details */}
                <div className="p-4 rounded-xl border border-stone-200 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--primary-gold)]" />
                    Bride Profile &amp; Photo
                  </h4>

                  {/* Bride Photo Upload & Preview */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="w-20 h-20 rounded-full border-2 border-[var(--primary-gold)] overflow-hidden shrink-0 bg-white shadow-xs">
                      <img
                        src={formData.couple.bride.image || '/images/bride.jpg'}
                        alt="Bride Preview"
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/bride.jpg';
                        }}
                      />
                    </div>
                    <div className="flex-1 space-y-2 w-full text-center sm:text-left">
                      <label className="block text-xs font-semibold text-stone-700">
                        Bride Portrait Photo
                      </label>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-100 cursor-pointer shadow-2xs transition-colors">
                          <Upload className="w-3.5 h-3.5 text-[var(--primary-red)]" />
                          <span>Upload Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleBridePhotoUpload(file);
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              couple: {
                                ...prev.couple,
                                bride: { ...prev.couple.bride, image: '/images/bride.jpg' },
                              },
                            }));
                            updateData((prev) => ({
                              ...prev,
                              couple: {
                                ...prev.couple,
                                bride: { ...prev.couple.bride, image: '/images/bride.jpg' },
                              },
                            }));
                            showToast('Bride photo reset to default');
                          }}
                          className="px-2.5 py-1.5 border border-stone-200 rounded-lg text-xs text-stone-500 hover:text-stone-800 bg-white"
                        >
                          Default Photo
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Or enter image URL (e.g. /images/bride.jpg)"
                        value={formData.couple.bride.image || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            couple: {
                              ...formData.couple,
                              bride: { ...formData.couple.bride, image: e.target.value },
                            },
                          })
                        }
                        className="w-full px-2.5 py-1 text-xs border rounded-lg bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={formData.couple.bride.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            couple: {
                              ...formData.couple,
                              bride: { ...formData.couple.bride, name: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Role / Subtitle</label>
                      <input
                        type="text"
                        value={formData.couple.bride.role}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            couple: {
                              ...formData.couple,
                              bride: { ...formData.couple.bride, role: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-stone-600 mb-1">Attire Note</label>
                    <input
                      type="text"
                      value={formData.couple.bride.attire || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          couple: {
                            ...formData.couple,
                            bride: { ...formData.couple.bride, attire: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-600 mb-1">Introduction / Description</label>
                    <textarea
                      rows={2}
                      value={formData.couple.bride.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          couple: {
                            ...formData.couple,
                            bride: { ...formData.couple.bride, description: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: FAMILY BLESSINGS */}
            {activeTab === 'family' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="font-serif-cormorant font-bold text-2xl text-stone-800">
                    Family Information &amp; Blessings
                  </h3>
                  <p className="text-xs text-stone-500">
                    Edit the parents' names and blessings for both families.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Groom's Family */}
                  <div className="p-4 rounded-xl border border-stone-200 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--primary-red)]">
                      Groom's Family
                    </h4>
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Heading</label>
                      <input
                        type="text"
                        value={formData.family.groomFamily.heading}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            family: {
                              ...formData.family,
                              groomFamily: { ...formData.family.groomFamily, heading: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Father's Name</label>
                      <input
                        type="text"
                        value={formData.family.groomFamily.father}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            family: {
                              ...formData.family,
                              groomFamily: { ...formData.family.groomFamily, father: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Mother's Name</label>
                      <input
                        type="text"
                        value={formData.family.groomFamily.mother}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            family: {
                              ...formData.family,
                              groomFamily: { ...formData.family.groomFamily, mother: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  {/* Bride's Family */}
                  <div className="p-4 rounded-xl border border-stone-200 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--primary-red)]">
                      Bride's Family
                    </h4>
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Heading</label>
                      <input
                        type="text"
                        value={formData.family.brideFamily.heading}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            family: {
                              ...formData.family,
                              brideFamily: { ...formData.family.brideFamily, heading: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Father's Name</label>
                      <input
                        type="text"
                        value={formData.family.brideFamily.father}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            family: {
                              ...formData.family,
                              brideFamily: { ...formData.family.brideFamily, father: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Mother's Name</label>
                      <input
                        type="text"
                        value={formData.family.brideFamily.mother}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            family: {
                              ...formData.family,
                              brideFamily: { ...formData.family.brideFamily, mother: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: WEDDING CEREMONY */}
            {activeTab === 'wedding' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="font-serif-cormorant font-bold text-2xl text-stone-800">
                    Wedding Ceremony Details
                  </h3>
                  <p className="text-xs text-stone-500">
                    Update the date, time, venue, and Google Maps location for the sacred Vivaha rituals.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Event Title</label>
                      <input
                        type="text"
                        value={formData.events.wedding.title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            events: {
                              ...formData.events,
                              wedding: { ...formData.events.wedding, title: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Nepali Title</label>
                      <input
                        type="text"
                        value={formData.events.wedding.nepaliTitle || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            events: {
                              ...formData.events,
                              wedding: { ...formData.events.wedding, nepaliTitle: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm font-devanagari"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Date (English)</label>
                      <input
                        type="text"
                        value={formData.events.wedding.date}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            events: {
                              ...formData.events,
                              wedding: { ...formData.events.wedding, date: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Nepali Date (e.g. मंसिर २०, २०८३)</label>
                      <input
                        type="text"
                        value={formData.events.wedding.nepaliDate || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            events: {
                              ...formData.events,
                              wedding: { ...formData.events.wedding, nepaliDate: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm font-devanagari"
                        placeholder="मंसिर २०, २०८३"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Time (e.g. 10:00 AM)</label>
                      <input
                        type="text"
                        value={formData.events.wedding.time}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            events: {
                              ...formData.events,
                              wedding: { ...formData.events.wedding, time: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Muhurat / Timing Subtitle</label>
                      <input
                        type="text"
                        value={formData.events.wedding.muhurat || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            events: {
                              ...formData.events,
                              wedding: { ...formData.events.wedding, muhurat: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        placeholder="Auspicious Lagna"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Venue (e.g. [Add Venue])</label>
                      <input
                        type="text"
                        value={formData.events.wedding.venue}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            events: {
                              ...formData.events,
                              wedding: { ...formData.events.wedding, venue: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Address / Location</label>
                      <input
                        type="text"
                        value={formData.events.wedding.address}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            events: {
                              ...formData.events,
                              wedding: { ...formData.events.wedding, address: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-stone-600 mb-1">Google Maps URL</label>
                    <input
                      type="url"
                      value={formData.events.wedding.googleMapsUrl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          events: {
                            ...formData.events,
                            wedding: { ...formData.events.wedding, googleMapsUrl: e.target.value },
                          },
                        })
                      }
                      placeholder="https://maps.google.com/..."
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-600 mb-1">Ceremony Description</label>
                    <textarea
                      rows={2}
                      value={formData.events.wedding.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          events: {
                            ...formData.events,
                            wedding: { ...formData.events.wedding, description: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: RECEPTION PARTY */}
            {activeTab === 'reception' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="font-serif-cormorant font-bold text-2xl text-stone-800">
                    Reception Party Settings
                  </h3>
                  <p className="text-xs text-stone-500">
                    Choose whether to include the Reception Party event or display only the Wedding Ceremony on the website.
                  </p>
                </div>

                {/* Inclusion Toggle Switch */}
                <div className="p-4 sm:p-5 rounded-xl border border-[var(--primary-gold)]/40 bg-[var(--primary-gold-soft)]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-stone-800">
                      Include Reception Party on Invitation?
                    </h4>
                    <p className="text-xs text-stone-600">
                      {formData.events.showReception !== false
                        ? 'Both Wedding Ceremony & Reception Party are currently active.'
                        : 'Only the Wedding Ceremony is currently displayed to guests.'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={formData.events.showReception !== false}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData((prev) => ({
                          ...prev,
                          events: { ...prev.events, showReception: checked },
                        }));
                        updateData((prev) => ({
                          ...prev,
                          events: { ...prev.events, showReception: checked },
                        }));
                        showToast(
                          checked
                            ? 'Reception Party enabled on invitation'
                            : 'Reception Party hidden; Wedding Ceremony only active'
                        );
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-red)]"></div>
                  </label>
                </div>

                {formData.events.showReception === false && (
                  <div className="p-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs">
                    <p className="font-semibold mb-1">Reception Party is currently hidden</p>
                    <p>
                      Guests will only see the Wedding Ceremony (Vedic Vivaha Sanskar) on the website, calendar, and countdown. You can switch this back on at any time using the toggle above.
                    </p>
                  </div>
                )}

                <div className="p-4 rounded-xl border border-stone-200 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Event Title</label>
                      <input
                        type="text"
                        value={formData.events.reception.title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            events: {
                              ...formData.events,
                              reception: { ...formData.events.reception, title: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Nepali Title</label>
                      <input
                        type="text"
                        value={formData.events.reception.nepaliTitle || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            events: {
                              ...formData.events,
                              reception: { ...formData.events.reception, nepaliTitle: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm font-devanagari"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Date</label>
                      <input
                        type="text"
                        value={formData.events.reception.date}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            events: {
                              ...formData.events,
                              reception: { ...formData.events.reception, date: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Time</label>
                      <input
                        type="text"
                        value={formData.events.reception.time}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            events: {
                              ...formData.events,
                              reception: { ...formData.events.reception, time: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Venue (e.g. [Add Venue])</label>
                      <input
                        type="text"
                        value={formData.events.reception.venue}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            events: {
                              ...formData.events,
                              reception: { ...formData.events.reception, venue: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Address / Location</label>
                      <input
                        type="text"
                        value={formData.events.reception.address}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            events: {
                              ...formData.events,
                              reception: { ...formData.events.reception, address: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-stone-600 mb-1">Google Maps URL</label>
                    <input
                      type="url"
                      value={formData.events.reception.googleMapsUrl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          events: {
                            ...formData.events,
                            reception: { ...formData.events.reception, googleMapsUrl: e.target.value },
                          },
                        })
                      }
                      placeholder="https://maps.google.com/..."
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-600 mb-1">Reception Description</label>
                    <textarea
                      rows={2}
                      value={formData.events.reception.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          events: {
                            ...formData.events,
                            reception: { ...formData.events.reception, description: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: 4-PHOTO GALLERY */}
            {activeTab === 'photos' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h3 className="font-serif-cormorant font-bold text-2xl text-stone-800">
                    4-Photo Gallery Manager
                  </h3>
                  <p className="text-xs text-stone-500">
                    Upload, replace, and edit titles/captions for exactly four photo slots (Groom, Bride, Couple, Wedding).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {formData.gallery.map((photo, index) => (
                    <div
                      key={photo.id || index}
                      className="p-4 rounded-xl border border-stone-200 bg-stone-50/40 space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[var(--primary-red)] uppercase tracking-wider">
                          Slot #{index + 1}: {photo.title}
                        </span>
                        <button
                          onClick={() => {
                            const updated = [...formData.gallery];
                            updated[index].url = '/images/hero-couple.jpg';
                            setFormData({ ...formData, gallery: updated });
                            updateData((prev) => ({ ...prev, gallery: updated }));
                            showToast(`Reset photo slot #${index + 1}`);
                          }}
                          title="Reset to default image"
                          className="text-stone-400 hover:text-red-500 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Photo Thumbnail */}
                      <div className="aspect-square w-full rounded-lg overflow-hidden bg-stone-200 relative border border-stone-300">
                        <img
                          src={photo.url}
                          alt={photo.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Upload / Replace Controls */}
                      <div className="flex items-center gap-2">
                        <label className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary-gold-soft)] border border-[var(--primary-gold)]/60 text-stone-800 hover:bg-amber-100 text-xs font-medium cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5 text-[var(--primary-gold)]" />
                          <span>Upload File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handlePhotoUpload(index, file);
                            }}
                          />
                        </label>
                      </div>

                      {/* Or image URL */}
                      <div>
                        <label className="block text-[11px] text-stone-500 mb-0.5">
                          Or Image URL
                        </label>
                        <input
                          type="text"
                          value={photo.url.startsWith('data:') ? '[Uploaded Image File]' : photo.url}
                          onChange={(e) => {
                            if (!e.target.value.startsWith('[')) {
                              const updated = [...formData.gallery];
                              updated[index].url = e.target.value;
                              setFormData({ ...formData, gallery: updated });
                            }
                          }}
                          className="w-full px-2.5 py-1.5 border rounded-lg text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-stone-500 mb-0.5">Title</label>
                        <input
                          type="text"
                          value={photo.title}
                          onChange={(e) => {
                            const updated = [...formData.gallery];
                            updated[index].title = e.target.value;
                            setFormData({ ...formData, gallery: updated });
                          }}
                          className="w-full px-2.5 py-1.5 border rounded-lg text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-stone-500 mb-0.5">Caption</label>
                        <input
                          type="text"
                          value={photo.caption}
                          onChange={(e) => {
                            const updated = [...formData.gallery];
                            updated[index].caption = e.target.value;
                            setFormData({ ...formData, gallery: updated });
                          }}
                          className="w-full px-2.5 py-1.5 border rounded-lg text-xs bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: WEDDING SONG & MUSIC */}
            {activeTab === 'music' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="font-serif-cormorant font-bold text-2xl text-stone-800">
                    Wedding Music &amp; Song Manager
                  </h3>
                  <p className="text-xs text-stone-500">
                    Customize the background wedding song played to guests on the website. Currently set to the auspicious wedding song <strong>“Ullam Paadum”</strong> from the movie <em>2 States</em>.
                  </p>
                </div>

                {/* Current Track Card */}
                <div className="p-4 sm:p-5 rounded-xl border border-[var(--primary-gold)]/40 bg-gradient-to-r from-amber-50/60 to-rose-50/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[var(--primary-red)] text-white flex items-center justify-center">
                        <Music className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                          Active Wedding Song
                        </span>
                        <h4 className="font-serif-cormorant font-bold text-lg text-stone-800 leading-tight">
                          {formData.music?.title || 'Ullam Paadum'}
                        </h4>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white border border-[var(--primary-gold)]/40 text-[var(--primary-red)]">
                      {formData.music?.subtitle || '2 States'}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600">
                    Source: <code className="bg-white/80 px-1.5 py-0.5 rounded border border-stone-200 text-[11px] truncate inline-block max-w-[280px] sm:max-w-md align-middle">{formData.music?.audioUrl || 'https://www.youtube.com/watch?v=MbLpZXIZZOg'}</code>
                  </p>
                </div>

                {/* Song Details Edit Form */}
                <div className="p-4 rounded-xl border border-stone-200 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--primary-red)]">
                    Song Information
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Song Title</label>
                      <input
                        type="text"
                        value={formData.music?.title || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            music: { ...formData.music, title: e.target.value },
                          })
                        }
                        placeholder="e.g. Ullam Paadum"
                        className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Movie / Artist / Subtitle</label>
                      <input
                        type="text"
                        value={formData.music?.subtitle || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            music: { ...formData.music, subtitle: e.target.value },
                          })
                        }
                        placeholder="e.g. 2 States"
                        className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-stone-600 mb-1">
                      Audio Source Link (YouTube Video URL or Direct MP3 Link)
                    </label>
                    <input
                      type="url"
                      value={formData.music?.audioUrl || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          music: { ...formData.music, audioUrl: e.target.value },
                        })
                      }
                      placeholder="https://www.youtube.com/watch?v=MbLpZXIZZOg"
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                    />
                    <p className="text-[11px] text-stone-400 mt-1">
                      Paste any YouTube URL (e.g. <em>https://www.youtube.com/watch?v=...</em>) or direct audio URL (.mp3).
                    </p>
                  </div>

                  {/* Or Upload Custom Audio File */}
                  <div className="pt-2 border-t border-stone-200">
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Or Upload Custom Audio File (.mp3, .m4a, .wav)
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-50 cursor-pointer shadow-2xs">
                        <Upload className="w-3.5 h-3.5 text-[var(--primary-red)]" />
                        <span>Select Audio File</span>
                        <input
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleAudioFileUpload(file);
                          }}
                        />
                      </label>
                      <span className="text-[11px] text-stone-400">
                        Uploads directly from your device (saved locally)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Quick Song Presets
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const newMusic = {
                          title: 'Ullam Paadum',
                          subtitle: '2 States',
                          audioUrl: 'https://www.youtube.com/watch?v=MbLpZXIZZOg',
                        };
                        setFormData((prev) => ({ ...prev, music: newMusic }));
                        updateData((prev) => ({ ...prev, music: newMusic }));
                        showToast('Set wedding song to Ullam Paadum (2 States)');
                      }}
                      className="p-2.5 rounded-lg border border-amber-300/70 bg-white hover:bg-amber-50 text-left transition-colors cursor-pointer"
                    >
                      <p className="font-serif-cormorant font-bold text-sm text-[var(--primary-red)]">
                        Ullam Paadum (Default)
                      </p>
                      <p className="text-[11px] text-stone-500">From the movie 2 States</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const newMusic = {
                          title: 'Ullam Paadum Paadal',
                          subtitle: '2 States (Acoustic)',
                          audioUrl: 'https://www.youtube.com/watch?v=RcLNQgelZgs',
                        };
                        setFormData((prev) => ({ ...prev, music: newMusic }));
                        updateData((prev) => ({ ...prev, music: newMusic }));
                        showToast('Set wedding song to Ullam Paadum Paadal (Alternate)');
                      }}
                      className="p-2.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-left transition-colors cursor-pointer"
                    >
                      <p className="font-serif-cormorant font-bold text-sm text-stone-800">
                        Ullam Paadum (Alternate)
                      </p>
                      <p className="text-[11px] text-stone-500">2 States Wedding Sequence</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const newMusic = {
                          title: 'Mangal Dhun',
                          subtitle: 'Traditional Shehnai',
                          audioUrl: 'traditional-shehnai-dhun',
                        };
                        setFormData((prev) => ({ ...prev, music: newMusic }));
                        updateData((prev) => ({ ...prev, music: newMusic }));
                        showToast('Set wedding song to Traditional Shehnai Mangal Dhun');
                      }}
                      className="p-2.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-left transition-colors cursor-pointer"
                    >
                      <p className="font-serif-cormorant font-bold text-sm text-stone-800">
                        Traditional Mangal Dhun
                      </p>
                      <p className="text-[11px] text-stone-500">Auspicious Vedic Flute &amp; Shehnai</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const newMusic = {
                          title: 'Din Shagna Da',
                          subtitle: 'Phillauri',
                          audioUrl: 'https://www.youtube.com/watch?v=MbLpZXIZZOg',
                        };
                        setFormData((prev) => ({ ...prev, music: newMusic }));
                        updateData((prev) => ({ ...prev, music: newMusic }));
                        showToast('Preset loaded');
                      }}
                      className="p-2.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-left transition-colors cursor-pointer"
                    >
                      <p className="font-serif-cormorant font-bold text-sm text-stone-800">
                        Din Shagna Da
                      </p>
                      <p className="text-[11px] text-stone-500">Acoustic Bridal Entry</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: INVITATION TEXT */}
            {activeTab === 'invitation' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="font-serif-cormorant font-bold text-2xl text-stone-800">
                    Invitation Text &amp; Headings
                  </h3>
                  <p className="text-xs text-stone-500">
                    Customize the sacred invitation wording and family signatures.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 space-y-4">
                  <div>
                    <label className="block text-xs text-stone-600 mb-1">Invitation Heading</label>
                    <input
                      type="text"
                      value={formData.invitation.heading}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          invitation: { ...formData.invitation, heading: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-600 mb-1">Main Invitation Message</label>
                    <textarea
                      rows={3}
                      value={formData.invitation.mainMessage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          invitation: { ...formData.invitation, mainMessage: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-600 mb-1">Closing Line</label>
                    <input
                      type="text"
                      value={formData.invitation.closingMessage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          invitation: { ...formData.invitation, closingMessage: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-600 mb-1">Family Signature</label>
                    <input
                      type="text"
                      value={formData.invitation.familySignature}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          invitation: { ...formData.invitation, familySignature: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: CALENDAR & COUNTDOWN */}
            {activeTab === 'calendar' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="font-serif-cormorant font-bold text-2xl text-stone-800">
                    Calendar &amp; Countdown Target
                  </h3>
                  <p className="text-xs text-stone-500">
                    Configure the countdown target timestamp and highlighted calendar days.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--primary-red)]">
                    Countdown Timer
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Target Date &amp; Time (ISO)</label>
                      <input
                        type="datetime-local"
                        value={formData.countdown.targetDate.slice(0, 16)}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            countdown: { ...formData.countdown, targetDate: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Countdown Title</label>
                      <input
                        type="text"
                        value={formData.countdown.title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            countdown: { ...formData.countdown, title: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-stone-600 mb-1">Passed Date Celebration Message</label>
                    <input
                      type="text"
                      value={formData.countdown.completedMessage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          countdown: { ...formData.countdown, completedMessage: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--primary-gold)]">
                    Calendar Highlights
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Month &amp; Year Label</label>
                      <input
                        type="text"
                        value={formData.calendar.monthYear}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            calendar: { ...formData.calendar, monthYear: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Wedding Day (Dec)</label>
                      <input
                        type="number"
                        min={1}
                        max={31}
                        value={formData.calendar.weddingDay}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            calendar: {
                              ...formData.calendar,
                              weddingDay: parseInt(e.target.value) || 5,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Reception Day (Dec)</label>
                      <input
                        type="number"
                        min={1}
                        max={31}
                        value={formData.calendar.receptionDay}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            calendar: {
                              ...formData.calendar,
                              receptionDay: parseInt(e.target.value) || 6,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 8: APPEARANCE & THEME */}
            {activeTab === 'appearance' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="font-serif-cormorant font-bold text-2xl text-stone-800">
                    Website Appearance &amp; Aesthetics
                  </h3>
                  <p className="text-xs text-stone-500">
                    Adjust primary red, subtle gold accents, background tints, and floral garland decorations.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Color Palette
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Primary Red Accent</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.appearance.primaryRed}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              appearance: { ...formData.appearance, primaryRed: e.target.value },
                            })
                          }
                          className="w-9 h-9 rounded-lg border cursor-pointer p-0"
                        />
                        <input
                          type="text"
                          value={formData.appearance.primaryRed}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              appearance: { ...formData.appearance, primaryRed: e.target.value },
                            })
                          }
                          className="flex-1 px-2.5 py-1.5 border rounded-lg text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Subtle Gold Accent</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.appearance.primaryGold}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              appearance: { ...formData.appearance, primaryGold: e.target.value },
                            })
                          }
                          className="w-9 h-9 rounded-lg border cursor-pointer p-0"
                        />
                        <input
                          type="text"
                          value={formData.appearance.primaryGold}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              appearance: { ...formData.appearance, primaryGold: e.target.value },
                            })
                          }
                          className="flex-1 px-2.5 py-1.5 border rounded-lg text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-stone-600 mb-1">Background Tint</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.appearance.backgroundColor}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              appearance: { ...formData.appearance, backgroundColor: e.target.value },
                            })
                          }
                          className="w-9 h-9 rounded-lg border cursor-pointer p-0"
                        />
                        <input
                          type="text"
                          value={formData.appearance.backgroundColor}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              appearance: { ...formData.appearance, backgroundColor: e.target.value },
                            })
                          }
                          className="flex-1 px-2.5 py-1.5 border rounded-lg text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hero Illustration */}
                <div className="p-4 rounded-xl border border-stone-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Hero Section Illustration
                  </h4>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full border overflow-hidden shrink-0 bg-stone-100">
                      <img
                        src={formData.appearance.heroIllustrationUrl || '/images/hero-couple.jpg'}
                        alt="Hero Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2 flex-1">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--primary-gold-soft)] border border-[var(--primary-gold)]/60 text-stone-800 hover:bg-amber-100 text-xs font-medium cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5 text-[var(--primary-gold)]" />
                        <span>Upload New Illustration</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleHeroUpload(file);
                          }}
                        />
                      </label>
                      <input
                        type="text"
                        value={
                          formData.appearance.heroIllustrationUrl?.startsWith('data:')
                            ? '[Uploaded Custom Illustration]'
                            : formData.appearance.heroIllustrationUrl || ''
                        }
                        onChange={(e) => {
                          if (!e.target.value.startsWith('[')) {
                            setFormData({
                              ...formData,
                              appearance: {
                                ...formData.appearance,
                                heroIllustrationUrl: e.target.value,
                              },
                            });
                          }
                        }}
                        placeholder="Image URL"
                        className="w-full px-2.5 py-1.5 border rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Floral & Motifs Toggles */}
                <div className="p-4 rounded-xl border border-stone-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Decorations &amp; Cultural Motifs
                  </h4>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.appearance.showFloralDecorations}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          appearance: {
                            ...formData.appearance,
                            showFloralDecorations: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 rounded text-[var(--primary-red)] focus:ring-[var(--primary-red)] cursor-pointer"
                    />
                    <span className="text-sm text-stone-700">
                      Enable floral dividers &amp; red/white rose garlands
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.appearance.showFallingRoses !== false}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          appearance: {
                            ...formData.appearance,
                            showFallingRoses: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 rounded text-[var(--primary-red)] focus:ring-[var(--primary-red)] cursor-pointer"
                    />
                    <span className="text-sm text-stone-700">
                      Enable floating red &amp; white rose petals animation
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* TAB 9: BACKUP & RESTORE */}
            {activeTab === 'backup' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="font-serif-cormorant font-bold text-2xl text-stone-800">
                    Backup &amp; Configuration Export
                  </h3>
                  <p className="text-xs text-stone-500">
                    Download your complete customized wedding setup as a JSON file or restore a previous backup.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-stone-800">
                        Export Website Configuration
                      </h4>
                      <p className="text-xs text-stone-500">
                        Save all photos, events, ceremony details, and custom colors to a backup file.
                      </p>
                    </div>
                    <button
                      onClick={exportDataJson}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--primary-red)] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[var(--primary-red-deep)] cursor-pointer transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download JSON</span>
                    </button>
                  </div>

                  <div className="pt-4 border-t border-stone-200">
                    <h4 className="text-sm font-semibold text-stone-800 mb-1">
                      Restore from JSON Backup
                    </h4>
                    <p className="text-xs text-stone-500 mb-3">
                      Select a previously exported JSON backup file to instantly restore all data.
                    </p>
                    <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 text-xs font-medium cursor-pointer transition-colors">
                      <UploadCloud className="w-4 h-4 text-[var(--primary-gold)]" />
                      <span>Select JSON Backup File</span>
                      <input
                        type="file"
                        accept=".json,application/json"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const content = event.target?.result as string;
                              importDataJson(content);
                            };
                            reader.readAsText(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
