import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <section id="pricing" className="px-5 py-18 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-6 py-12 text-center text-slate-900 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 dark:text-white sm:px-10"
        >
          <div className="pointer-events-none absolute -left-20 top-0 h-52 w-52 rounded-full bg-blue-200/35 blur-3xl dark:bg-blue-500/10" />
          <div className="pointer-events-none absolute -right-16 bottom-0 h-52 w-52 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-400/10" />

          <h2 className="relative text-3xl font-semibold tracking-tight sm:text-4xl">Start accepting bookings in minutes</h2>
          <p className="relative mx-auto mt-4 max-w-2xl text-sm text-slate-600 dark:text-slate-300 sm:text-base">
            Launch a reliable appointment workflow with modern scheduling tools built for speed and growth.
          </p>

          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              Get Started Free
            </Link>
            <a
              href="#features"
              className="inline-flex items-center rounded-xl border border-slate-300 bg-white/70 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white dark:border-slate-600 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Explore Features
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
