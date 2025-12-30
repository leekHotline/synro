'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import AuroraCharacter from '@/components/design/AuroraCharacter';
import Navbar from '@/components/home/Navbar';
import HeroInput from '@/components/home/HeroInput';
import AboutSection from '@/components/home/AboutSection';
import StatsSection from '@/components/home/StatsSection';
import ToolSection from '@/components/home/ToolSection';
import Footer from '@/components/home/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // 入场动画
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // GSAP 动画
  useEffect(() => {
    if (!heroRef.current || !isLoaded) return;

    const ctx = gsap.context(() => {
      // Aurora 单独淡入（不用 blur，避免边界问题）
      gsap.fromTo(
        '.aurora-wrapper',
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: 'power2.out' }
      );

      // 其他 Hero 元素入场动画 - 模糊到清晰
      const heroElements = heroRef.current?.querySelectorAll('.hero-element');
      if (heroElements) {
        gsap.fromTo(
          heroElements,
          { opacity: 0, filter: 'blur(10px)' },
          { 
            opacity: 1, 
            filter: 'blur(0px)',
            duration: 1, 
            stagger: 0.15,
            ease: 'power2.out',
            delay: 0.2,
          }
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, [isLoaded]);

  // 键盘刷新动画
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
        setIsLoaded(false);
        setTimeout(() => setIsLoaded(true), 100);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#FAFAF9] overflow-x-hidden"
    >
      {/* Navbar */}
      <Navbar onNewProject={() => router.push('/workspace')} />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20"
      >
        {/* Aurora Character - 不参与 blur 动画 */}
        <div className="aurora-wrapper mb-8">
          <AuroraCharacter size={260} />
        </div>

        {/* Tagline */}
        <h1 className="hero-element text-4xl md:text-5xl font-semibold text-gray-800 text-center mb-4 tracking-tight">
          Your AI Creative Partner
        </h1>

        <p className="hero-element text-gray-500 text-center mb-12 max-w-md">
          Minimal design, maximum creativity
        </p>

        {/* Input */}
        <div className="hero-element w-full max-w-2xl">
          <HeroInput />
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            className="w-6 h-10 rounded-full border-2 border-gray-300 flex justify-center pt-2"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-gray-400"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Tool Section */}
      <ToolSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
