import { motion } from 'framer-motion';

const cards = [
  {
    title: 'User Booking Page',
    description: 'Fast, guided booking experience with service and slot selection.',
    image: '/previews/screenshot-2.svg',
  },
  {
    title: 'Provider Dashboard',
    description: 'See upcoming appointments and key booking metrics at a glance.',
    image: '/previews/screenshot-3.svg',
  },
  {
    title: 'Slot Selection UI',
    description: 'Smart slot rendering with available windows and instant confirmations.',
    image: '/previews/screenshot-4.svg',
  },
];

export default function ProductPreview() {
  return (
    <section id="product" className="px-5 py-18 transition-colors duration-300 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 transition-colors duration-300 dark:text-neutral-100 sm:text-4xl">
            Product preview
          </h2>
          <p className="mt-4 text-base text-neutral-600 transition-colors duration-300 dark:text-neutral-400">
            Explore key interfaces that power seamless appointment booking and management.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card, index) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-colors duration-300 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <div className="aspect-[16/10] overflow-hidden border-b border-neutral-200 bg-neutral-100 transition-colors duration-300 dark:border-neutral-700 dark:bg-neutral-950">
                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-all duration-300 grayscale brightness-125 contrast-90 dark:grayscale-0 dark:brightness-100 dark:contrast-100"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-neutral-900 transition-colors duration-300 dark:text-neutral-100">{card.title}</h3>
                <p className="mt-2 text-base text-neutral-600 transition-colors duration-300 dark:text-neutral-400">{card.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
