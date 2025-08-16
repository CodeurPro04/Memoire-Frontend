import { motion } from 'framer-motion';

const ArticleCategories = ({ 
  categories, 
  activeCategory, 
  setActiveCategory 
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-16">
      {categories.map((category, index) => (
        <motion.button
          key={index}
          onClick={() => setActiveCategory(category)}
          className={`px-6 py-2 rounded-full border transition-colors ${
            activeCategory === category 
              ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-white' 
              : 'border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {category}
        </motion.button>
      ))}
    </div>
  );
};

export default ArticleCategories;