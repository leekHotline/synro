'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Shield, Sparkles, Brain } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Instant responses powered by advanced AI',
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data stays yours, always encrypted',
    gradient: 'from-emerald-400 to-teal-500',
  },
  {
    icon: Sparkles,
    title: 'Intelligent',
    description: 'Context-aware assistance that learns',
    gradient: 'from-purple-400 to-pink-500',
  },
  {
    icon: Brain,
    title: 'Multi-Model',
    description: 'GPT, Claude, Gemini - choose your AI',
    gradient: 'from-cyan-400 to-blue-500',
  },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const cards = cardsRef.current;
    if (!section || !title || !cards) return;

    const ctx = gsap.context(() => {
      // 标题动画 - 从下方滑入 + 模糊到清晰
      gsap.fromTo(
        title.children,
        { 
          y: 60, 
          opacity: 0,
          filter: 'blur(10px)',
        },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: title,
            start: 'top 85%',
            end: 'top 50%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // 卡片动画 - 交错从底部弹出
      const cardElements = cards.querySelectorAll('.feature-card');
      gsap.fromTo(
        cardElements,
        { 
          y: 100, 
          opacity: 0,
          scale: 0.8,
          rotateX: 15,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: cards,
            start: 'top 80%',
            end: 'top 40%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // 卡片 hover 效果
      cardElements.forEach((card) => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -10,
            scale: 1.03,
            duration: 0.3,
            ease: 'power2.out',
          });
          gsap.to(card.querySelector('.card-icon'), {
            scale: 1.2,
            rotate: 5,
            duration: 0.3,
          });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          });
          gsap.to(card.querySelector('.card-icon'), {
            scale: 1,
            rotate: 0,
            duration: 0.3,
          });
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-6 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Why Synro?
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            A minimal, powerful AI assistant designed for creators who value simplicity and efficiency
          </p>
        </div>

        {/* Features Grid */}
        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="feature-card group p-8 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg shadow-gray-200/50 cursor-pointer"
              style={{ perspective: '1000px' }}
            >
              <div
                className={`card-icon w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
