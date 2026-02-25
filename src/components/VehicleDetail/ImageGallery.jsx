import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Play } from 'lucide-react';
import { trackEvent } from '../../utils/umengTracking';

const ImageGallery = ({ images, vehicleId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const getImageUrl = (image, index) => {
    if (imageErrors[index]) {
      // 备用图片：使用纯色背景
      return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='800' height='600' fill='%234A90E2'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='white'%3E${image.alt || '车辆图片'}%3C/text%3E%3C/svg%3E`;
    }
    return image.url;
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
    trackEvent('image_view', {
      vehicle_id: vehicleId,
      image_index: index
    });
  };

  const handleFullscreen = () => {
    setIsFullscreen(true);
    trackEvent('image_fullscreen', {
      vehicle_id: vehicleId
    });
  };

  return (
    <div className="space-y-4">
      {/* 主图区域 */}
      <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video">
        <img
          src={getImageUrl(images[currentIndex], currentIndex)}
          alt={images[currentIndex].alt || `车辆图片 ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          onError={() => handleImageError(currentIndex)}
        />

        {/* 导航按钮 */}
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* 全屏按钮 */}
        <button
          onClick={handleFullscreen}
          className="absolute right-4 bottom-4 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
        >
          <Maximize2 className="w-5 h-5" />
        </button>

        {/* 图片计数 */}
        <div className="absolute left-4 bottom-4 px-3 py-1 bg-black/50 text-white text-sm rounded-full">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* 缩略图 */}
      <div className="grid grid-cols-6 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
              index === currentIndex
                ? 'border-blue-600 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <img
              src={getImageUrl(image, index)}
              alt={image.alt || `缩略图 ${index + 1}`}
              className="w-full h-full object-cover"
              onError={() => handleImageError(index)}
            />
          </button>
        ))}
      </div>

      {/* 功能按钮 */}
      <div className="flex space-x-3">
        <button
          onClick={() => {
            trackEvent('vr_view_use', { vehicle_id: vehicleId });
            alert('VR全景功能开发中');
          }}
          className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
        >
          360° VR全景
        </button>
        <button
          onClick={() => {
            trackEvent('video_play', { vehicle_id: vehicleId });
            alert('视频播放功能开发中');
          }}
          className="flex-1 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium rounded-lg hover:from-red-700 hover:to-pink-700 transition-all flex items-center justify-center space-x-2"
        >
          <Play className="w-5 h-5" />
          <span>查看视频</span>
        </button>
      </div>

      {/* 全屏模式 */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center"
          >
            ✕
          </button>
          <img
            src={getImageUrl(images[currentIndex], currentIndex)}
            alt="全屏图片"
            className="max-w-full max-h-full object-contain"
            onError={() => handleImageError(currentIndex)}
          />
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
