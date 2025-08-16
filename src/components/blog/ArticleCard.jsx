import { Clock, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedCard from '@/components/AnimatedCard';

const ArticleCard = ({ article }) => {
  return (
    <AnimatedCard>
      <article className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md h-full flex flex-col border border-gray-200 dark:border-gray-700">
        <div className="relative h-48">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-white px-2 py-1 rounded-full text-xs">
            {article.category}
          </div>
        </div>
        
        <div className="p-6 flex-grow">
          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
            <span>{article.date}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.readTime}
            </span>
          </div>
          
          <h3 className="text-xl font-bold mb-3">{article.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{article.excerpt}</p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {article.tags.slice(0, 2).map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">
                #{tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="px-6 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
            <span className="text-sm">{article.author}</span>
          </div>
          
          <Button variant="ghost" className="text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
            Lire
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </article>
    </AnimatedCard>
  );
};

export default ArticleCard;