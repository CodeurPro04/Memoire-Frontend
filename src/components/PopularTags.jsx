import { motion } from 'framer-motion';

const PopularTags = () => {
  const tags = [
    'Transformation Digitale',
    'Levée de Fonds',
    'Stratégie Financière',
    'Management',
    'IA',
    'Fintech',
    'E-commerce',
    'Startup',
    'Innovation',
    'Leadership',
    'Marketing Digital',
    'Productivité'
  ];

  return (
    <section className="py-20 px-6 mx-auto bg-gradient-to-br from-emerald-900/80 via-gray-900 to-teal-900/80">
      <motion.h2
        className="text-5xl font-bold mb-12 text-center drop-shadow-lg text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <span className="text-4xl sm:text-5xl font-extrabold mb-6 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-transparent bg-clip-text drop-shadow-lg">Sujets</span> Tendances
      </motion.h2>
      
      <motion.div
        className="flex flex-wrap justify-center gap-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {tags.map((tag, index) => (
          <motion.a
            key={index}
            href="#"
            className="px-5 py-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:text-white transition-colors"
            whileHover={{ y: -3 }}
          >
            #{tag}
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
};

export default PopularTags;