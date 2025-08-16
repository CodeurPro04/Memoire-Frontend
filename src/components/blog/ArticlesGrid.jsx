import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import ArticleCard from '@/components/blog/ArticleCard';

const ArticlesGrid = ({ 
  articles,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
      
      {articles.length === 0 && (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-xl font-medium mb-4">Aucun article trouvé</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Essayez de modifier vos critères de recherche
          </p>
          <Button onClick={() => {
            setActiveCategory('Tous');
            setSearchQuery('');
          }}>
            Réinitialiser les filtres
          </Button>
        </motion.div>
      )}
    </>
  );
};

export default ArticlesGrid;