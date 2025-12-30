'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      // 整体容器动画 - 从小到大 + 模糊到清晰
      gsap.fromTo(
        content,
        { 
          scale: 0.8, 
          opacity: 0,
          filter: 'blur(20px)',
        },
        {
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // 背景光晕动画
      const glows = section.querySelectorAll('.glow');
      glows.forEach((glow, index) => {
        gsap.to(glow, {
          x: index % 2 === 0 ? 30 : -30,
          y: index % 2 === 0 ? -20 : 20,
          duration: 4 + index,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });

      // 按钮 hover 效果
      const button = content.querySelector('.cta-button');
      if (button) {
        button.addEventListener('mouseenter', () => {
          gsap.to(button, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out',
          });
          gsap.to(button.querySelector('.arrow-icon'), {
            x: 5,
            duration: 0.3,
          });
        });
        button.addEventListener('mouseleave', () => {
          gsap.to(button, {
            scale: 1,
            duration: 0.3,
          });
          gsap.to(button.querySelector('.arrow-icon'), {
            x: 0,
            duration: 0.3,
          });
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-6 relative overflow-hidden">
      {/* 动态背景光晕 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="glow absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-cyan-300/40 to-purple-300/40 rounded-full blur-3xl" />
        <div className="glow absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-purple-300/40 to-pink-300/40 rounded-full blur-3xl" />
      </div>

      <div 
        ref={contentRef}
        className="max-w-4xl mx-auto relative"
      >
        <div className="text-center p-12 md:p-16 rounded-[3rem] bg-white/60 backdrop-blur-2xl border border-white/50 shadow-2xl shadow-purple-200/20">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-xl shadow-purple-300/30">
            <Sparkles className="w-10 h-10 text-white" />
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            Ready to Create<br />
            <span className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Something Amazing?
            </span>
          </h2>

          {/* Description */}
          <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
            加入数百万创作者的行列，让 AI 成为你的创意伙伴
          </p>

          {/* CTA Button */}
          <button
            onClick={() => router.push('/workspace')}
            className="cta-button inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white text-lg font-semibold shadow-xl shadow-purple-300/40 hover:shadow-2xl hover:shadow-purple-400/50 transition-shadow"
          >
            开始创作
            <ArrowRight className="arrow-icon w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
