"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Copy, Check } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { createPortal } from "react-dom"
import { FaTwitter } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"

// Toy rain config
const TOY_IMAGES = ["/toy-1.png", "/toy-2.png", "/toy-3.png"];
const TOY_COUNT = 9;

function getRandom(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

type ToyConfig = {
  left: number;
  delay: number;
  duration: number;
  size: number;
  img: string;
  key: string;
};

function ToyRain() {
  const [toys, setToys] = useState<ToyConfig[]>([]);

  // Helper to create a random toy config
  function createToyConfig(i: number): ToyConfig {
    const left = getRandom(0, 100); // vw
    const delay = getRandom(0, 12); // seconds
    const duration = getRandom(60, 80); // seconds (super slow)
    const size = getRandom(48, 96); // px
    const img = TOY_IMAGES[Math.floor(Math.random() * TOY_IMAGES.length)];
    return { left, delay, duration, size, img, key: i + '-' + Math.random() };
  }

  useEffect(() => {
    setToys(Array.from({ length: TOY_COUNT }, (_, i) => createToyConfig(i)));
  }, []);

  // Handler to re-randomize a toy after each animation iteration
  const handleAnimationIteration = (i: number) => {
    setToys((prevToys) => {
      const newToys = [...prevToys];
      newToys[i] = createToyConfig(i);
      return newToys;
    });
  };

  return (
    <>
      {toys.map(({ left, delay, duration, size, img, key }, i) => (
        <img
          key={key}
          src={img}
          alt="toy"
          style={{
            position: "absolute",
            left: `${left}vw`,
            top: -120,
            width: size,
            height: size,
            pointerEvents: "none",
            zIndex: 1,
            animation: `toy-fall ${duration}s linear ${delay}s 1`,
            opacity: 0.85,
            filter: "drop-shadow(0 0 12px #fff8)"
          }}
          onAnimationEnd={() => handleAnimationIteration(i)}
        />
      ))}
    </>
  );
}

export default function Component() {
  const [copied, setCopied] = useState(false)
  const contractAddress = "0xC09f76D2b66ff5C90CE8E1C33cB30B6F7cdB4686"
  // DEBUG: Always show the plane for testing
  // const [planeVisible, setPlaneVisible] = useState(true)
  const [planeKey, setPlaneKey] = useState(0)
  const [mounted, setMounted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
      if (!audioRef.current.paused) return;
      audioRef.current.play().catch(() => {});
    }
  }, [isMuted, volume]);

  // Remove useEffect for planeVisible

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  // Manual animation state
  const [planeLeft, setPlaneLeft] = useState(0)
  const [planeTop, setPlaneTop] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setAnimating(true);
    let left = window.innerWidth;
    let frame = 0;
    setPlaneLeft(left);
    const baseTop = window.innerHeight * 0.3;
    const interval = setInterval(() => {
      left -= 4;
      frame++;
      setPlaneLeft(left);
      // Wavy motion: amplitude 40px, period 120px
      setPlaneTop(baseTop + Math.sin(left / 60) * 40);
      if (left < -220) {
        clearInterval(interval);
        setTimeout(() => {
          setAnimating(false);
          setTimeout(() => {
            setPlaneLeft(window.innerWidth);
            setPlaneTop(baseTop);
            setAnimating(true);
          }, 2000); // wait 2s before next flyby
        }, 1000);
      }
    }, 16);
    return () => clearInterval(interval);
  }, [animating]);

  return (
    <div className="min-h-screen bg-[url('/walmart-toy-coin.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center p-6 relative overflow-visible">
      {/* Auto-playing looping audio */}
      <audio ref={audioRef} src="/happy flippers - never stop.mp3" autoPlay loop hidden />
      {/* Audio controls */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-black/60 rounded-full px-4 py-2 shadow-lg backdrop-blur-md">
        <button
          onClick={() => setIsMuted((m) => !m)}
          className="text-white text-lg focus:outline-none"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l6 6m0-6l-6 6" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9v6h4l5 5V4L7 9H3z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9v6h4l5 5V4L7 9H3z" />
            </svg>
          )}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={isMuted ? 0 : volume}
          onChange={e => {
            setVolume(Number(e.target.value));
            if (Number(e.target.value) === 0) setIsMuted(true);
            else setIsMuted(false);
          }}
          className="w-24 accent-blue-400"
          aria-label="Volume"
        />
      </div>
      {/* Raining toys background */}
      {mounted && <ToyRain />}
      <div className="absolute inset-0 backdrop-blur-sm"></div>
      {/* Penguin in bottom-left (desktop only) */}
      <a href="https://www.walmart.com/browse/0?facet=brand:Pudgy+Penguins" target="_blank" rel="noopener noreferrer" className="hidden md:block absolute bottom-12 left-12 z-20">
        <button className="transition-all duration-300 hover:scale-125 hover:drop-shadow-[0_0_40px_rgba(255,255,255,0.8)] focus:outline-none">
          <Image src="/pengu.png" alt="Penguin" width={320} height={320} className="rounded-full w-[320px]" />
        </button>
      </a>
      {/* Whale in bottom-right (desktop only) */}
      <a href="https://finance.yahoo.com/news/walmart-toy-coin-outpaces-bitcoin-010959573.html" target="_blank" rel="noopener noreferrer" className="hidden md:block absolute bottom-14 right-14 z-20">
        <button className="transition-all duration-300 hover:scale-125 hover:drop-shadow-[0_0_40px_rgba(255,255,255,0.8)] focus:outline-none select-none">
          <Image src="/whale.png" alt="Whale" width={320} height={320} className="rounded-full w-[320px]" />
        </button>
      </a>
      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto w-full flex flex-col justify-start -mt-8" style={{minHeight: '60vh'}}>
        {/* Logo/Brand */}
        <div className="flex justify-center items-center mb-4">
          <div className="w-96 h-96 flex items-center justify-center">
            <Image src="/WTC.png" alt="WTC Logo" width={384} height={384} className="object-contain" />
          </div>
        </div>
        {/* Tagline and Contract Address */}
        <div className="flex flex-col items-center gap-2 mb-4 mt-2">
          <div className="flex justify-center items-center">
            <span className="text-3xl font-bold text-white rounded-full font-sans" style={{letterSpacing: '0.02em'}}>
              Walmart Toy Coin
            </span>
            <Image src="/abstract.png" alt="Abstract Logo" width={48} height={48} className="ml-3 inline-block align-middle" />
          </div>
          <button
            onClick={copyToClipboard}
            className="group bg-white/30 backdrop-blur-sm border border-white/40 rounded-full px-6 py-3 flex items-center space-x-3 mx-auto hover:bg-white/40 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <span className="text-sm font-mono text-white truncate max-w-[200px] sm:max-w-none">
              {contractAddress}
            </span>
            <div className="flex-shrink-0">
              {copied ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <Copy className="w-4 h-4 text-white group-hover:text-white transition-colors" />
              )}
            </div>
          </button>
          {copied && <p className="text-sm text-white mt-2 font-medium">Contract address copied!</p>}
        </div>
        {/* Toys Row - mobile only */}
        <div className="flex justify-center items-end gap-8 mb-4 md:hidden">
          <a href="https://www.walmart.com/browse/0?facet=brand:Pudgy+Penguins" target="_blank" rel="noopener noreferrer">
            <button className="transition-all duration-300 hover:scale-125 hover:drop-shadow-[0_0_40px_rgba(255,255,255,0.8)] focus:outline-none">
              <Image src="/pengu.png" alt="Penguin" width={320} height={320} className="rounded-full w-20" />
            </button>
          </a>
          <a href="https://finance.yahoo.com/news/walmart-toy-coin-outpaces-bitcoin-010959573.html" target="_blank" rel="noopener noreferrer">
            <button className="transition-all duration-300 hover:scale-125 hover:drop-shadow-[0_0_40px_rgba(255,255,255,0.8)] focus:outline-none select-none">
              <Image src="/whale.png" alt="Whale" width={320} height={320} className="rounded-full w-20" />
            </button>
          </a>
        </div>
        {/* Social Icons with extra margin above and break line */}
        <div className="mt-0 pt-3 border-t border-white/30">
          <div className="flex justify-center items-center space-x-12 text-3xl text-white">
            <a href="https://x.com/WalmartToyCoin" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://dexscreener.com/" target="_blank" rel="noopener noreferrer" aria-label="Dexscreener">
              <Image src="/dexscreenr.png" alt="Dexscreener" width={36} height={36} className="object-contain" />
            </a>
            <a href="https://x.com/i/communities/1943879118862319830" target="_blank" rel="noopener noreferrer" aria-label="X Community">
              <FaXTwitter />
            </a>
          </div>
        </div>
      </div>
      {/* Subtle background element */}
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
      {/* Minimal footer */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <p className="text-xs text-white">© 2025 Walmart Toy Coin</p>
      </div>
      {/* Animated Plane - manual animation for debugging */}
      {mounted && createPortal(
        <div style={{
          position: 'fixed',
          top: planeTop + 'px',
          left: planeLeft + 'px',
          zIndex: 9999,
          pointerEvents: 'none',
        }}>
          <Image src="/PudgyAir-w-flames.gif" alt="Plane" width={200} height={100} />
        </div>,
        document.body
      )}
    </div>
  )
}
