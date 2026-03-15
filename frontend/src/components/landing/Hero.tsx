import { motion } from 'framer-motion';
import { CalendarDays, CheckCircle2, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const slots = ['10:00 AM', '11:30 AM', '1:00 PM', '2:30 PM', '4:00 PM'];

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-18 sm:px-6 md:pb-20 md:pt-22 lg:px-8 lg:pt-26">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-8 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl dark:bg-blue-400/20" />
        <div className="absolute right-8 top-24 h-56 w-56 rounded-full bg-purple-500/15 blur-3xl dark:bg-purple-500/20" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="max-w-xl"
        >
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
            Easy scheduling for modern businesses
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Create services, manage availability, and let customers book appointments instantly.
          </p>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Simple, fast, and reliable appointment booking.</p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:from-blue-500 hover:to-indigo-500"
            >
              Get Started Free
            </Link>
            <a
              href="#product"
              className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-500"
            >
              View Demo
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="relative"
        >
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/40 sm:p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Book a Session</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Choose your preferred slot</p>
              </div>
              <CalendarDays className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Calendar</p>
                <div className="mt-3 grid grid-cols-7 gap-2 text-center text-xs text-slate-500 dark:text-slate-400">
                  {Array.from({ length: 14 }, (_, i) => (
                    <div
                      key={i}
                      className={`rounded-lg py-2 ${i === 6 ? 'bg-indigo-600 text-white dark:bg-indigo-500' : 'bg-slate-100 dark:bg-slate-800'}`}
                    >
                      {i + 12}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <p className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <Clock3 className="h-4 w-4" /> Available
                </p>
                <div className="mt-3 space-y-2">
                  {slots.map((slot, index) => (
                    <motion.button
                      key={slot}
                      type="button"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 + index * 0.08, duration: 0.25 }}
                      className="block w-full rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/20"
                    >
                      {slot}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              <CheckCircle2 className="h-4 w-4" /> Confirm Booking
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
