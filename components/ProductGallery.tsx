'use client'

import { useState } from 'react'

interface ProductGalleryProps {
  images: string[]
  name: string
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  // Fallback if no images are available
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl border border-gray-100 flex flex-col items-center justify-center">
        <svg className="w-16 h-16 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-sm text-gray-500 font-medium">Sem imagem disponível</span>
      </div>
    )
  }

  const activeImage = images[activeIndex]

  return (
    <div className="space-y-4">
      {/* Active Hero Image Viewport */}
      <div className="w-full h-96 md:h-[450px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-100 overflow-hidden relative shadow-sm group">
        <img
          src={activeImage}
          alt={`${name} - Imagem ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Thumbnail Selector List */}
      {images.length > 1 && (
        <div className="flex flex-wrap gap-3">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all relative ${
                idx === activeIndex
                  ? 'border-primary-600 ring-2 ring-primary-100 scale-95'
                  : 'border-transparent hover:border-gray-300 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`${name} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
