import type { WeddingData } from '../types/wedding';

export const defaultWeddingData: WeddingData = {
  hero: {
    devanagariGreeting: '॥ शुभ विवाह ॥',
    groomName: 'Dr. Siddhartha Regmi',
    brideName: 'Dr. Prashamsa Parajuli',
    weddingDate: 'December 5, 2026',
    subheading: 'Together with their families, invite you to share in their joy',
    openInvitationButtonText: 'Open Invitation',
  },
  couple: {
    groom: {
      name: 'Dr. Siddhartha Regmi',
      role: 'The Groom',
      title: 'Doctor',
      attire: 'Traditional White Daura Surwal with Dhaka Topi',
      description:
        'With the blessings of our families, we invite you to celebrate the beginning of our new journey together.',
      image: '/images/groom.jpg',
    },
    bride: {
      name: 'Dr. Prashamsa Parajuli',
      role: 'The Bride',
      title: 'Doctor',
      attire: 'Traditional Crimson Red Bridal Saree with Gold Zari',
      description:
        'With love in our hearts and gratitude to our parents, we look forward to your gracious presence on our auspicious day.',
      image: '/images/bride.jpg',
    },
  },
  family: {
    groomFamily: {
      heading: 'With the blessings of',
      father: 'Mr. Giri Raj Regmi',
      mother: 'Mrs. Sarita Khaniya',
      note: "Groom's Family",
    },
    brideFamily: {
      heading: 'With the blessings of',
      father: 'Mr. Phanindra Prasad Parajuli',
      mother: 'Mrs. Yasoda Devi Nepal',
      note: "Bride's Family",
    },
  },
  events: {
    showReception: true,
    wedding: {
      id: 'wedding',
      title: 'Wedding Ceremony',
      nepaliTitle: 'शुभ विवाह संस्कार',
      nepaliDate: 'मंसिर २०, २०८३',
      muhurat: 'Auspicious Lagna',
      date: 'December 5, 2026',
      dayOfWeek: 'Saturday',
      time: '10:00 AM',
      venue: '[Add Venue]',
      address: '[Add Location]',
      googleMapsUrl: 'https://maps.google.com/?q=Kathmandu+Nepal',
      description:
        'The sacred Vedic Vivaha ceremony joining two souls and two families in eternal love and commitment.',
      decorStyle: 'wedding',
    },
    reception: {
      id: 'reception',
      title: 'Reception Party',
      nepaliTitle: 'शुभ प्रीतिभोज',
      date: 'December 6, 2026',
      dayOfWeek: 'Sunday',
      time: '10:00 AM',
      venue: '[Add Venue]',
      address: '[Add Location]',
      googleMapsUrl: 'https://maps.google.com/?q=Kathmandu+Nepal',
      description:
        'A celebratory morning gathering of joy, greetings, and festive feast with family and esteemed guests.',
      decorStyle: 'reception',
    },
  },
  music: {
    title: 'Ullam Paadum',
    subtitle: '2 States',
    audioUrl: 'https://www.youtube.com/watch?v=MbLpZXIZZOg',
    autoplay: false,
    startTime: 0,
    endTime: 0,
  },
  galleryDisplayLimit: 4,
  gallery: [
    {
      id: 'groom-photo',
      title: 'The Groom',
      caption: 'Dr. Siddhartha Regmi in traditional White Daura Surwal',
      url: '/images/groom.jpg',
      hidden: false,
    },
    {
      id: 'bride-photo',
      title: 'The Bride',
      caption: 'Dr. Prashamsa Parajuli in traditional Red Bridal Saree',
      url: '/images/bride.jpg',
      hidden: false,
    },
    {
      id: 'couple-photo',
      title: 'Together in Love',
      caption: 'Pre-wedding moments shared amidst timeless Kathmandu gardens',
      url: '/images/couple-1.jpg',
      hidden: false,
    },
    {
      id: 'ceremony-photo',
      title: 'Sacred Rituals',
      caption: 'Celebrating sacred union with Vedic rituals and family blessings',
      url: '/images/couple-2.jpg',
      hidden: false,
    },
    {
      id: 'celebration-photo',
      title: 'Timeless Joy',
      caption: 'Celebrating sacred union with eternal vows and joyful family smiles',
      url: '/images/hero-couple.jpg',
      hidden: false,
    },
  ],
  countdown: {
    targetDate: '2026-12-05T09:00:00',
    title: 'Counting Down to Our Special Day',
    completedMessage: 'The celebration has begun! Thank you for blessing our union.',
  },
  calendar: {
    monthYear: 'December 2026',
    weddingDay: 5,
    receptionDay: 6,
  },
  invitation: {
    heading: 'With the blessings of our families',
    mainMessage:
      'With immense joy and the blessings of our beloved families, we invite you to join us as we celebrate the wedding of Dr. Siddhartha Regmi and Dr. Prashamsa Parajuli.',
    closingMessage: 'Your presence will make our celebration even more special.',
    familySignature: 'Regmi & Parajuli Families',
  },
  appearance: {
    primaryRed: '#8B1D24',
    primaryGold: '#C59B27',
    backgroundColor: '#FDFCF9',
    cardBackground: '#FFFFFF',
    showFloralDecorations: true,
    showMarigoldGarlands: true,
    showFallingRoses: true,
    heroIllustrationUrl: '/images/hero-couple.jpg',
  },
};
