import { motion, useAnimation, useInView } from 'framer-motion';
import { Github, Linkedin } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { BrandWordmark } from '../Brand';

function XIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4l16 16" strokeLinecap="round" />
      <path d="M20 4L4 20" strokeLinecap="round" />
    </svg>
  );
}

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/qzMalekuz', icon: Github },
  { label: 'X (Twitter)', href: 'https://x.com/qzmalekuz', icon: XIcon },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/malekuz-zafar-qadri-6b5405232/', icon: Linkedin },
];

export default function Credits() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgControls = useAnimation();
  const isInView = useInView(sectionRef, { amount: 0.12, margin: '0px 0px -12% 0px' });

  useEffect(() => {
    bgControls.start(
      isInView
        ? { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
        : { opacity: 0, y: 22, transition: { duration: 0.35, ease: 'easeInOut' } },
    );
  }, [bgControls, isInView]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-t border-slate-200 bg-slate-100/70 px-5 pb-16 pt-16 dark:border-slate-800 dark:bg-slate-900/60 sm:px-6 lg:px-8"
    >
      <motion.div
        animate={bgControls}
        initial={{ opacity: 0, y: 20 }}
        className="pointer-events-none absolute inset-x-0 -bottom-14 z-0 text-center sm:-bottom-16 lg:-bottom-20"
      >
        <div className="absolute inset-x-0 bottom-20 mx-auto h-24 w-[68%] rounded-full bg-blue-400/10 blur-[90px] dark:bg-indigo-300/14" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 mx-auto max-w-7xl"
      >
        <BrandWordmark textClassName="text-4xl sm:text-5xl" markClassName="h-12 w-12 sm:h-14 sm:w-14" />

        <p className="mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          Open-source slot-based appointment booking platform built for service providers and users.
        </p>

        <div className="mt-8 flex items-center gap-3">
          {socialLinks.map(({ label, href, icon: Icon }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-600 transition hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white"
              aria-label={label}
            >
              <Icon className="h-5 w-5" />
            </motion.a>
          ))}
        </div>

        <div className="mt-10 border-t border-slate-300/70 pt-9 dark:border-slate-700/70">
          <p className="text-xl font-medium text-slate-600 dark:text-slate-300">
            Built and designed by{' '}
            <a
              href="https://zafarr.xyz"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-slate-900 underline decoration-sky-400/40 underline-offset-4 transition duration-200 hover:text-slate-700 hover:decoration-sky-400/65 dark:text-white dark:decoration-cyan-300/35 dark:hover:text-slate-200 dark:hover:decoration-cyan-300/60"
            >
              zafarr.
            </a>
          </p>
          <p className="mt-4 text-base text-slate-500 dark:text-slate-400">© 2026 AppointmentLelo.io — All Rights Reserved</p>
        </div>
      </motion.div>
    </section>
  );
}
