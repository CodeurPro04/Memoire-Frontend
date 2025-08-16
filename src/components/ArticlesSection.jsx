import { motion } from "framer-motion";
import { Clock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const AnimatedCard = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -10 }}
      className="hover:shadow-xl transition-shadow duration-300"
    >
      {children}
    </motion.div>
  );
};

function decodeHtmlEntities(text) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

const ArticlesSection = ({
  categories = [],
  filteredArticles = [],
  activeCategory,
  setActiveCategory,
  setSearchQuery,
}) => {
  return (
    <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((category, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setActiveCategory(category);
                setSearchQuery("");
              }}
              className={`px-6 py-2 rounded-full border transition-colors ${
                activeCategory === category
                  ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-white"
                  : "border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
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

        {/* Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <AnimatedCard key={article.id}>
              <article className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md h-full flex flex-col border border-gray-200 dark:border-gray-700">
                {/* Image */}
                <div className="relative h-48">
                  <img
                    src={article.image_url || "/default-blog.jpg"}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-white px-2 py-1 rounded-full text-xs">
                    {article.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-grow">
                  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <span>
                      {new Date(article.published_at).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.readTime || "3 min"} de lecture
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-3">{article.title}</h3>

                  {/* Affichage HTML interprété */}
                  <div
                    className="text-gray-600 dark:text-gray-300 mb-4 prose dark:prose-invert max-w-none text-sm"
                    dangerouslySetInnerHTML={{
                      __html: decodeHtmlEntities(article.excerpt),
                    }}
                  ></div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <span className="text-sm">{article.author}</span>
                  </div>

                  <a
                    href={`/blog/${article.slug}`}
                    className="text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-3 py-2 rounded-md flex items-center text-sm font-medium transition"
                  >
                    Lire
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </article>
            </AnimatedCard>
          ))}
        </div>

        {/* Empty state */}
        {filteredArticles.length === 0 && (
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
            <Button
              onClick={() => {
                setActiveCategory("Tous");
                setSearchQuery("");
              }}
              className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400"
            >
              Réinitialiser les filtres
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ArticlesSection;
