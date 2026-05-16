import { useEffect, useRef } from 'react';
import * as skinview3d from 'skinview3d';

interface Skin3DViewerProps {
  skinUrl?: string;
  capeUrl?: string;
  width?: number;
  height?: number;
  className?: string;
  animation?: 'walk' | 'run' | 'fly' | 'idle' | 'none';
  playing?: boolean;
  autoRotate?: boolean;
}

export default function Skin3DViewer({ 
  skinUrl, 
  capeUrl, 
  width = 300, 
  height = 400, 
  className = "",
  animation = 'walk',
  playing = true,
  autoRotate = false
}: Skin3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<skinview3d.SkinViewer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!viewerRef.current) {
      viewerRef.current = new skinview3d.SkinViewer({
        canvas: document.createElement("canvas"),
        width: containerRef.current.clientWidth || width,
        height: containerRef.current.clientHeight || height,
        skin: skinUrl || "https://textures.minecraft.net/texture/4abeee6d1f1489e240212f71f6bedeaa4ae2baeb3e31c81cc6574f260be7fa01", // Default Steve skin if none
      });
      viewerRef.current.canvas.style.display = "block";
      viewerRef.current.canvas.style.width = "100%";
      viewerRef.current.canvas.style.height = "100%";
      viewerRef.current.canvas.style.objectFit = "contain";
      containerRef.current.appendChild(viewerRef.current.canvas);

      // Setup initial state
      viewerRef.current.autoRotate = autoRotate;
      viewerRef.current.zoom = 0.8;
    }

    const viewer = viewerRef.current;
    
    // Update Animation
    if (animation === 'walk') {
      viewer.animation = new skinview3d.WalkingAnimation();
    } else if (animation === 'run') {
      viewer.animation = new skinview3d.RunningAnimation();
    } else if (animation === 'fly') {
      viewer.animation = new skinview3d.FlyingAnimation();
    } else if (animation === 'idle') {
      viewer.animation = new skinview3d.IdleAnimation();
    } else {
      viewer.animation = null;
    }

    if (viewer.animation) {
      viewer.animation.paused = !playing;
    }

    viewer.autoRotate = autoRotate;
    
    // Resize Observer
    const observer = new ResizeObserver((entries) => {
      if (viewerRef.current && entries[0]) {
        const { width: newWidth, height: newHeight } = entries[0].contentRect;
        if (newWidth > 0 && newHeight > 0) {
          viewerRef.current.width = newWidth;
          viewerRef.current.height = newHeight;
        }
      }
    });
    
    observer.observe(containerRef.current);

    if (skinUrl) {
      viewer.loadSkin(skinUrl);
    } else {
      viewer.resetSkin();
    }

    if (capeUrl) {
      viewer.loadCape(capeUrl);
    } else {
      viewer.resetCape();
    }

    return () => {
      observer.disconnect();
      // In strict mode cleanup might destroy canvas, so we optionally handle cleanup
      // But typically we can just leave it if it's the same component lifespan
      if (viewerRef.current) {
         viewerRef.current.dispose();
         if (containerRef.current?.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild);
         }
         viewerRef.current = null;
      }
    };
  }, [skinUrl, capeUrl, width, height, animation, playing, autoRotate]);

  return <div ref={containerRef} className={`w-full h-full relative overflow-hidden ${className}`} />;
}
