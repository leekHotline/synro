'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code2, MessageSquare, FileText, Palette, Wand2, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const tools = [
  { icon: Code2, name: 'Code', desc: '智能代码生成', color: 'from-cyan-400 to-blue-500' },
  { icon: MessageSquare, name: 'Chat', desc: '自然对话交流', color: 'from-purple-400 to-pink-500' },
  { icon: FileText, name: 'Docs', desc: '文档智能处理', color: 'from-amber-400 to-orange-500' },
  { icon: Palette, name: 'Design', desc: '创意设计辅助', color: 'from-emerald-400 to-teal-500' },
  { icon: Wand2, name: 'Create', desc: '内容创作生成', color: 'from-rose-400 to-red-500' },
  { icon: Globe, name: 'Search', desc: '联网实时搜索', color: 'from-indigo-400 to-violet-500' },
];

export default function ToolSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const toolsContainer = toolsRef.current;
    if (!section || !title || !toolsContainer) return;

    const ctx = gsap.context(() => {
      // 标题动画 - 缩放 + 淡入
      gsap.fromTo(
        title,
        { 
          scale: 0.8, 
          opacity: 0,
          y: 40,
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: title,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // 工具卡片 - 从中心向外扩散
      const toolCards = toolsContainer.querySelectorAll('.tool-card');
      toolCards.forEach((card, index) => {
        const isLeft = index % 2 === 0;
        gsap.fromTo(
          card,
          { 
            x: isLeft ? -80 : 80, 
            opacity: 0,
            scale: 0.6,
            rotate: isLeft ? -10 : 10,
          },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 0.7,
            delay: index * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: toolsContainer,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // 工具卡片 hover 效果
      toolCards.forEach((card) => {
        const icon = card.querySelector('.tool-icon');
        
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -15,
            scale: 1.08,
            duration: 0.4,
            ease: 'power2.out',
          });
          gsap.to(icon, {
            rotate: 360,
            scale: 1.1,
            duration: 0.6,
            ease: 'power2.out',
          });
        });
        
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: 'power2.out',
          });
          gsap.to(icon, {
            rotate: 0,
            scale: 1,
            duration: 0.4,
          });
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-6 bg-gradient-to-b from-transparent via-gray-50/50 to-transparent">
      <div className="max-w-5xl mx-auto">
        <h2 
          ref={titleRef}
          className="text-center text-4xl md:text-5xl font-bold text-gray-800 mb-16"
        >
          Powerful Tools
        </h2>

        <div ref={toolsRef} className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="tool-card group flex flex-col items-center gap-4 p-8 rounded-3xl cursor-pointer bg-white/50 backdrop-blur-sm border border-white/60 shadow-lg shadow-gray-100/50 transition-shadow hover:shadow-2xl hover:shadow-purple-200/30"
            >
              <div
                className={`tool-icon w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-lg`}
              >
                <tool.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <span className="block text-lg font-semibold text-gray-800 mb-1">
                  {tool.name}
                </span>
                <span className="text-sm text-gray-500">
                  {tool.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
