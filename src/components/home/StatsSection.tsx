'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 99.9, suffix: '%', label: '可用性' },
  { value: 50, suffix: 'ms', label: '响应速度' },
  { value: 10, suffix: 'M+', label: '用户信赖' },
  { value: 24, suffix: '/7', label: '全天候服务' },
];

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // 数字计数动画
      ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        onEnter: () => {
          stats.forEach((stat, index) => {
            gsap.to({}, {
              duration: 2,
              ease: 'power2.out',
              onUpdate: function() {
                const progress = this.progress();
                setCounts(prev => {
                  const newCounts = [...prev];
                  newCounts[index] = Math.round(stat.value * progress * 10) / 10;
                  return newCounts;
                });
              },
            });
          });
        },
        once: true,
      });

      // 卡片入场动画
      const statCards = section.querySelectorAll('.stat-card');
      gsap.fromTo(
        statCards,
        { 
          y: 80, 
          opacity: 0,
          scale: 0.9,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="stat-card text-center p-8 rounded-3xl bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl border border-white/50 shadow-xl shadow-gray-200/30"
            >
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                {counts[index]}{stat.suffix}
              </div>
              <div className="text-gray-500 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
