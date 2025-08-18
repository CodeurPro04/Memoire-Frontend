import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Tag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const BlogSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleViewAll = () => {
    navigate("/blog#HomeBlog");
    setTimeout(() => {
      const element = document.getElementById("HomeBlog");
      if (element) {
        const offset = 120;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementPosition - offset,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  const handleReadMore = (post) => {
  navigate(`/blog/${post.slug}`, { state: { article: post } });
};

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("https://kofgo-consulting.com/api/getBlogs.php");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const text = await response.text();
        const result = JSON.parse(text);

        if (result.success && Array.isArray(result.data)) {
          const formattedPosts = result.data.map((post) => ({
            id: post.id,
            title: post.title || "Sans titre",
            excerpt: post.excerpt || "",
            image_url: post.image_url || "/blog_default.webp",
            category: post.category_name || "Non catégorisé",
            author: post.author || "Auteur inconnu",
            date: post.published_at
              ? new Date(post.published_at).toLocaleDateString("fr-FR")
              : "Date inconnue",
            slug: post.slug || `post-${post.id}`,
          }));

          setPosts(formattedPosts);
        } else {
          throw new Error(result.message || "Structure de données invalide");
        }
      } catch (err) {
        console.error("Erreur:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
    }),
    hover: {
      y: -5,
      boxShadow: "0 20px 25px -5px rgba(16, 185, 129, 0.2)",
      transition: { duration: 0.3 },
    },
  };

  if (loading) {
    return (
      <section className="py-24 bg-gray-900">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <p>Chargement des articles...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-gray-900">
        <div className="max-w-screen-xl mx-auto px-4 text-center text-red-400">
          <p>Erreur: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-24 bg-kofgo-gray-900">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-teal-400 drop-shadow-lg">
              {t("blog.title")}
            </span>
          </h2>
          <p className="text-xl text-kofgo-gray-300 max-w-3xl mx-auto">
            {t("blog.subtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true, amount: 0.1 }}
              className="bg-kofgo-gray-800 rounded-xl shadow-lg overflow-hidden border border-kofgo-gray-700 hover:border-kofgo-blue-500/50 transition-all duration-300 group flex flex-col"
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={post.image_url}
                  alt={post.title}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <span className="absolute top-4 left-4 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 text-white text-kofgo-gray-900 text-xs font-bold px-3 py-1 rounded-full flex items-center">
                  <Tag className="w-3 h-3 mr-1.5" /> {post.category}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-3 text-kofgo-gold-400 group-hover:text-kofgo-blue-400 transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="text-kofgo-gray-300 text-sm mb-4 leading-relaxed flex-grow">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-xs text-kofgo-gray-500 mb-5 space-x-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1.5 text-kofgo-blue-400" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1.5 text-kofgo-blue-400" />
                    <span>{post.author}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleReadMore(post)}
                  className="mt-auto inline-flex items-center text-kofgo-blue-400 group-hover:text-kofgo-blue-300 font-medium transition-colors duration-300 self-start"
                >
                  {t("blog.readMore")}{" "}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="mt-20 text-center"
        >
          <Button
            onClick={handleViewAll}
            size="lg"
            className="bg-gradient-to-r from-sky-500 to-teal-400 text-white font-semibold text-lg px-10 py-4 rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 transform hover:scale-[1.02]"
          >
            {t("blog.viewAll")}
            <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;