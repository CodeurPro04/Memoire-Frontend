import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, User, Tag, ArrowLeft, Clock, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSharing, setIsSharing] = useState(false);

  const fetchArticle = async () => {
    try {
      const res = await fetch(
        `https://kofgo-consulting.com/api/getBlogBySlug.php?slug=${encodeURIComponent(
          slug
        )}`
      );
      if (!res.ok) throw new Error("Erreur lors du chargement");

      const result = await res.json();

      if (result.success && result.data) {
        setArticle(result.data);
      } else {
        throw new Error(result.message || "Aucun article trouvé");
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      setIsSharing(true);
      await navigator.share({
        title: article.title,
        text: article.excerpt || "Découvrez cet article sur KOF-GO Consulting",
        url: window.location.href,
      });
    } catch (err) {
      console.log("Partage annulé ou non supporté");
    } finally {
      setIsSharing(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  if (loading)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-b from-kofgo-gray-900 to-kofgo-gray-800"
      >
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-kofgo-gold-400"></div>
          <p className="mt-6 text-kofgo-gray-300 font-medium">
            Chargement de l'article...
          </p>
        </div>
      </motion.div>
    );

  if (error)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-b from-kofgo-gray-900 to-kofgo-gray-800"
      >
        <div className="max-w-md p-8 bg-kofgo-gray-800/50 border border-kofgo-gray-700 rounded-xl text-center">
          <h2 className="text-2xl font-bold text-kofgo-gold-400 mb-4">
            Oups !
          </h2>
          <p className="text-kofgo-gray-300 mb-6">{error}</p>
          <button
            onClick={() => navigate("/blog")}
            className="px-6 py-3 bg-kofgo-gold-500 hover:bg-kofgo-gold-600 text-kofgo-gray-900 font-semibold rounded-lg transition-all"
          >
            Retour au blog
          </button>
        </div>
      </motion.div>
    );

  if (!article)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-kofgo-gray-900 to-kofgo-gray-800">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-kofgo-gray-300 mb-2">
            Article introuvable
          </h2>
          <p className="text-kofgo-gray-400 mb-6">
            L'article demandé n'existe pas ou a été supprimé
          </p>
          <button
            onClick={() => navigate("/blog")}
            className="px-6 py-3 bg-kofgo-gold-500 hover:bg-kofgo-gold-600 text-kofgo-gray-900 font-semibold rounded-lg transition-all"
          >
            Explorer nos articles
          </button>
        </div>
      </div>
    );

  // Formatage de la date
  const publishedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date inconnue";

  // Calcul du temps de lecture
  const readingTime = article.content
    ? Math.max(1, Math.ceil(article.content.split(/\s+/).length / 200))
    : 3;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-b from-kofgo-gray-900 to-kofgo-gray-800 text-kofgo-gray-100"
    >
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-kofgo-gold-500/5 to-transparent opacity-20 -z-10"></div>

        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-kofgo-gold-400 hover:text-kofgo-gold-300 mb-12 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Retour aux articles</span>
          </button>

          <div className="max-w-3xl mx-auto">
            <span className="inline-block mb-6 px-4 py-2 bg-kofgo-gold-500/10 text-kofgo-gold-400 text-sm font-medium rounded-full border border-kofgo-gold-400/30">
              {article.category_name || "Non catégorisé"}
            </span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold mb-8 leading-tight"
            >
              {article.title}
            </motion.h1>

            <div className="flex flex-wrap gap-6 text-kofgo-gray-400 text-sm mb-12">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-kofgo-gold-400" />
                <span>{article.author || "KOF-GO Consulting"}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-kofgo-gold-400" />
                <span>{publishedDate}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-kofgo-gold-400" />
                <span>{readingTime} min de lecture</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="max-w-5xl mx-auto px-4 mb-16"
      >
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-kofgo-gray-700/50">
          <img
            src={`https://kofgo-consulting.com/${article.image_url}`}
            alt={article.title}
            className="w-full h-auto max-h-[600px] object-cover"
            loading="lazy"
          />
        </div>
      </motion.div>

      {/* Content Section */}
      <section className="max-w-3xl mx-auto px-4 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="prose prose-lg dark:prose-invert prose-headings:text-kofgo-gray-100 prose-a:text-kofgo-gold-400 hover:prose-a:text-kofgo-gold-300 prose-strong:text-kofgo-gray-200 prose-blockquote:border-l-kofgo-gold-400 prose-blockquote:text-kofgo-gray-300 max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <div className="mt-16 pt-8 border-t border-kofgo-gray-700/50">
          <button
            onClick={handleShare}
            disabled={isSharing}
            className="flex items-center gap-2 px-6 py-3 bg-kofgo-gray-800 hover:bg-kofgo-gray-700/70 rounded-full text-kofgo-gray-300 transition-all"
          >
            <Share2 className="w-5 h-5" />
            <span>
              {isSharing ? "Partage en cours..." : "Partager cet article"}
            </span>
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20 px-8 text-center">
        <div className="absolute inset-0 bg-[url('/construction-cta.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-emerald-900/90"></div>

        <motion.div
          className="relative z-10 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">
            Prêt à concrétiser{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 drop-shadow-lg">
              votre vision
            </span>{" "}
            ?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Notre équipe d'experts est à votre disposition pour discuter de
            votre projet et vous proposer des solutions sur-mesure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => {
                // 1. Naviguer vers la page
                navigate("/contact#HomeContact");

                // 2. Scroll vers la section avec décalage
                setTimeout(() => {
                  const element = document.getElementById("HomeContact");
                  if (element) {
                    // Calcul de la position avec décalage
                    const offset = 120; // Ajustez cette valeur selon vos besoins
                    const elementPosition =
                      element.getBoundingClientRect().top + window.pageYOffset;

                    window.scrollTo({
                      top: elementPosition - offset,
                      behavior: "smooth",
                    });
                  }
                }, 100);
              }}
              size="lg"
              className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-500"
            >
              Contactez-nous
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                // 1. Naviguer vers la page
                navigate("/startup#HomeStartup");

                // 2. Scroll vers la section avec décalage
                setTimeout(() => {
                  const element = document.getElementById("HomeStartup");
                  if (element) {
                    // Calcul de la position avec décalage
                    const offset = 120; // Ajustez cette valeur selon vos besoins
                    const elementPosition =
                      element.getBoundingClientRect().top + window.pageYOffset;

                    window.scrollTo({
                      top: elementPosition - offset,
                      behavior: "smooth",
                    });
                  }
                }, 100);
              }}
              className="text-black border-white hover:bg-white/10 hover:text-white"
            >
              Explorer notre espace Start-up
            </Button>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default BlogDetailPage;
