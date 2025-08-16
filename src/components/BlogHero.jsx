import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const BlogHero = ({ searchQuery, setSearchQuery }) => {
  return (
    <section className="relative py-32 px-6 bg-gradient-to-r from-gray-900 to-emerald-900 text-white overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            className="w-full h-full object-cover opacity-45 dark:opacity-50"
            autoPlay
            muted
            loop
            playsInline
          >
            <source
              src="/blog.mp4"
              type="video/mp4"
            />
            Votre navigateur ne prend pas en charge les vidéos HTML5.
          </video>
        </div>
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">Blog & Actualités</h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Analyses, conseils et tendances par nos experts
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl mx-auto relative"
        >
          <input
            type="text"
            placeholder="Rechercher des articles..."
            className="w-full px-6 py-4 pr-12 rounded-full bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white/70" />
        </motion.div>
      </div>
    </section>
  );
};

export default BlogHero;