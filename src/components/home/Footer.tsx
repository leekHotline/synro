'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Logo from './Logo';
import { Github, Twitter } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const links = [
  { label: 'About', href: '/about' },
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Contact', href: '#' },
];

const socials = [
  { icon: Github, href: 'https://github.com/leekHotline/synro', label: 'GitHub' },
  { icon: Twitter, href: '#', label: 'Twitter' },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const ctx = gsap.context(() => {
      const elements = footer.querySelectorAll('.footer-item');
      gsap.fromTo(
        elements,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, footer);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="py-16 px-6 border-t border-gray-100 bg-white/30 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="footer-item">
            <Logo size={28} />
          </div>
          
          {/* Links */}
          <div className="footer-item flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-gray-500 hover:text-gray-800 transition-colors hover:-translate-y-0.5 transform duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Socials */}
          <div className="footer-item flex items-center gap-4">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all hover:scale-110"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-item mt-12 pt-8 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-400">
            © 2025 Synro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
