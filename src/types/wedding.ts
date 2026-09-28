export interface PersonInfo {
  name: string;
  role: string;
  title: string;
  attire?: string;
  description: string;
  image?: string;
}

export interface FamilySide {
  heading: string;
  father: string;
  mother: string;
  note?: string;
}

export interface EventInfo {
  id: 'wedding' | 'reception';
  title: string;
  nepaliTitle?: string;
  date: string; // e.g. "December 5, 2026"
  dayOfWeek?: string;
  time: string; // e.g. "[Add Time]" or "10:00 AM"
  venue: string; // e.g. "[Add Venue]"
  address: string; // e.g. "[Add Location]"
  googleMapsUrl: string;
  description: string;
  decorStyle?: 'wedding' | 'reception';
}

export interface GalleryPhoto {
  id: string;
  title: string;
  caption: string;
  url: string;
}

export interface MusicSettings {
  title: string;
  subtitle: string;
  audioUrl: string;
  autoplay?: boolean;
}

export interface AppearanceSettings {
  primaryRed: string;
  primaryGold: string;
  backgroundColor: string;
  cardBackground: string;
  showFloralDecorations: boolean;
  showMarigoldGarlands: boolean;
  showFallingRoses?: boolean;
  heroIllustrationUrl: string;
}

export interface WeddingData {
  hero: {
    devanagariGreeting: string; // "॥ शुभ विवाह ॥"
    groomName: string;
    brideName: string;
    weddingDate: string;
    subheading: string;
    openInvitationButtonText: string;
  };
  couple: {
    groom: PersonInfo;
    bride: PersonInfo;
  };
  family: {
    groomFamily: FamilySide;
    brideFamily: FamilySide;
  };
  events: {
    showReception: boolean;
    wedding: EventInfo;
    reception: EventInfo;
  };
  music: MusicSettings;
  gallery: GalleryPhoto[];
  countdown: {
    targetDate: string; // ISO string e.g. "2026-12-05T09:00:00"
    title: string;
    completedMessage: string;
  };
  calendar: {
    monthYear: string; // "December 2026"
    weddingDay: number; // 5
    receptionDay: number; // 6
  };
  invitation: {
    heading: string; // "With the blessings of our families"
    mainMessage: string;
    closingMessage: string; // "Your presence will make our celebration even more special."
    familySignature: string;
  };
  appearance: AppearanceSettings;
}
