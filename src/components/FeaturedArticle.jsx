import { motion } from "framer-motion";
import {
  User,
  Calendar,
  Clock,
  MessageSquare,
  Bookmark,
  Share2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

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

const FeaturedArticle = ({ article }) => {
  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate(`/blog/${article.slug}`, { state: { article } });
  };

  const handleBookmark = () => {
    toast.success("Article ajouté aux favoris !");
    console.log("Favori ajouté :", article.title);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/blog/${article.slug}`;
    const shareData = {
      title: article.title,
      text: "Découvrez cet article sur notre blog !",
      url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Lien copié dans le presse-papier !");
      }
    } catch (error) {
      console.error("Erreur de partage :", error);
      toast.error("Le partage a échoué.");
    }
  };

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <motion.h2
        className="text-5xl font-bold mb-12 text-center drop-shadow-lg"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 drop-shadow-lg">
          Article
        </span>{" "}
        à la Une
      </motion.h2>

      <AnimatedCard>
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image Section */}
            <div className="relative h-96 lg:h-full">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-white px-3 py-1 rounded-full text-sm">
                {article.category}
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 lg:p-12">
              {/* Meta Information */}
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {article.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {article.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {article.readTime} de lecture
                </span>
              </div>

              {/* Title and Excerpt */}
              <h3 className="text-3xl font-bold mb-4">{article.title}</h3>

              {/* ✅ Affichage du HTML correctement interprété */}
              <div
                className="text-lg text-gray-600 dark:text-gray-300 mb-6 prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: article.excerpt }}
              ></div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <Button
                  onClick={handleReadMore}
                  className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:bg-emerald-700 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Lire l'article
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <div className="flex items-center gap-4">
                  <button
                    onClick={handleBookmark}
                    className="flex items-center gap-1 text-gray-500 hover:text-emerald-600"
                  >
                    <Bookmark className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1 text-gray-500 hover:text-emerald-600"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedCard>
    </section>
  );
};

export default FeaturedArticle;
