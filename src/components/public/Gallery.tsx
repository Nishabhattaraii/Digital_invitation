import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

export const Gallery: React.FC = () => {
  const { data } = useWedding();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  // Filter out any photos marked as hidden by the admin
  const visiblePhotos = (data.gallery || []).filter((p) => !p.hidden);

  // Admin decided limit on how many photos to display (can be 0)
  const maxDisplay =
    typeof data.galleryDisplayLimit === 'number'
      ? Math.max(0, data.galleryDisplayLimit)
      : visiblePhotos.length;

  const photosToDisplay = visiblePhotos.slice(0, maxDisplay);

  // If admin set 0 photos, or all photos are hidden, hide the gallery section completely
  if (photosToDisplay.length === 0) {
    return null;
  }

  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhotoIndex(null);
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex + 1) % photosToDisplay.length);
    }
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex(
        (selectedPhotoIndex - 1 + photosToDisplay.length) % photosToDisplay.length
      );
    }
  };

  // Determine grid layout based on number of visible photos
  const getGridClasses = () => {
    if (photosToDisplay.length === 1) {
      return 'grid grid-cols-1 max-w-md mx-auto';
    }
    if (photosToDisplay.length === 2) {
      return 'grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto';
    }
    if (photosToDisplay.length === 3) {
      return 'grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto';
    }
    return 'grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto';
  };

  return (
    <section id="gallery" className="py-16 sm:py-24 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-10 sm:mb-14">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#5E121E] font-semibold block mb-2">
          Cherished Moments
        </span>
        <h2 className="font-serif-cormorant font-bold text-3xl sm:text-4xl lg:text-5xl text-[#5E121E]">
          Moments of Joy &amp; Grace
        </h2>
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#B89352] to-transparent mx-auto mt-3" />
        <p className="text-xs sm:text-sm text-[#58333B] max-w-md mx-auto mt-2 italic font-serif-cormorant">
          Glimpses into the beautiful journey of {data.hero.groomName} and {data.hero.brideName}
        </p>
      </div>

      {/* Dynamic Photo Grid */}
      <div className={getGridClasses()}>
        {photosToDisplay.map((photo, index) => (
          <div
            key={photo.id || index}
            onClick={() => openLightbox(index)}
            className="group relative cursor-pointer rounded-xl overflow-hidden bg-white p-2.5 border-[1.5px] border-[#5E121E] shadow-sm hover:shadow-xl transition-all duration-300"
          >
            {/* Inner Border Frame */}
            <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#FAF6F0] border border-[#B89352]/40">
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover object-center filter contrast-[1.03] transition-transform duration-700 ease-out group-hover:scale-104"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/hero-couple.jpg';
                }}
              />

              {/* Rich Burgundy Shimmer Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#5E121E]/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] uppercase tracking-[0.25em] text-amber-200 font-semibold mb-1">
                  {photo.title}
                </span>
                <p className="font-serif-cormorant text-base leading-snug text-white/95 italic">
                  {photo.caption}
                </p>
              </div>

              {/* Zoom badge icon */}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#5E121E] opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xs">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhotoIndex !== null && photosToDisplay[selectedPhotoIndex] && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-[#381A20]/90 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl border-2 border-[#5E121E]"
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/90 text-[#5E121E] hover:bg-[#5E121E] hover:text-white transition-colors flex items-center justify-center shadow-xs cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {photosToDisplay.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 text-[#5E121E] hover:bg-[#5E121E] hover:text-white transition-colors flex items-center justify-center shadow-xs cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={nextPhoto}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 text-[#5E121E] hover:bg-[#5E121E] hover:text-white transition-colors flex items-center justify-center shadow-xs cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            <div className="max-h-[75vh] w-full bg-[#FAF6F0] flex items-center justify-center">
              <img
                src={photosToDisplay[selectedPhotoIndex]?.url}
                alt={photosToDisplay[selectedPhotoIndex]?.title}
                className="max-h-[75vh] w-auto object-contain mx-auto"
              />
            </div>

            <div className="p-5 bg-white border-t border-[#E8DFC8] text-center">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#5E121E] font-semibold block mb-1">
                {photosToDisplay[selectedPhotoIndex]?.title}
              </span>
              <p className="font-serif-cormorant text-lg text-[#381A20] italic">
                "{photosToDisplay[selectedPhotoIndex]?.caption}"
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
