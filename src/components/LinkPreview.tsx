'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface LinkPreviewProps {
  content: string;
  type: string;
}

export default function LinkPreview({ content, type }: LinkPreviewProps) {
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = content.match(urlRegex);

    if (urls && urls.length > 0) {
      const url = urls[0];

      if (type === 'image' || url.match(/\.(jpeg|jpg|gif|png)$/)) {
        setPreview(url);
      } else if (type === 'audio' || url.match(/\.(mp3|wav|ogg)$/)) {
        setPreview(url);
      }
    }
  }, [content, type]);

  if (!preview) return null;

  if (type === 'image') {
    return (
      <div className="mt-2">
        <Image
          src={preview}
          alt="Preview"
          width={200}
          height={200}
          className="rounded-lg"
        />
      </div>
    );
  }

  if (type === 'audio') {
    console.log(preview);
    return (
      <div className="mt-2 w-full">
        <audio controls src={preview}>
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }

  return null;
}
