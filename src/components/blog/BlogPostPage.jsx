import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, User, ArrowLeft, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const BlogPostPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await fetch(
          `https://kofgo-consulting.com/api/getBlogPost.php?slug=${slug}`
        );

        if (!response.ok) throw new Error("Erreur de chargement");

        const data = await response.json();

        if (data?.success && data?.data) {
          setPost({
            ...data.data,
            date: data.data.published_at
              ? new Date(data.data.published_at).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Date inconnue",
            readingTime: data.data.content
              ? Math.ceil(data.data.content.length / 1500)
              : 5,
            // Formatage des articles similaires
            relatedPosts: data.data.related_posts?.map(post => ({
              ...post,
              date: post.created_at
                ? new Date(post.created_at).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Date inconnue"
            })) || []
          });
        } else {
          throw new Error(data?.message || "Article non trouvé");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [slug]);

  if (loading) {
    return (
      <section className="min-h-screen py-32 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <div className="animate-pulse h-96 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen py-32 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <div className="bg-red-100 dark:bg-red-900/30 p-8 rounded-xl border border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400 text-xl">{error}</p>
            <Button
              onClick={() => navigate("/blog")}
              className="mt-6 bg-gradient-to-r from-emerald-500 to-teal-400"
            >
              Retour au blog
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900"
    >
      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-emerald-500/5 via-teal-400/5 to-transparent opacity-30"></div>
        </div>

        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="flex justify-start mb-8">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour aux articles
            </Button>
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block mb-4 px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium rounded-full border border-emerald-400/30">
              {post.category_name || post.category}
            </span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl font-bold mb-6 leading-tight"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                {post.title}
              </span>
            </motion.h1>

            <div className="flex flex-wrap justify-center items-center gap-4 text-gray-600 dark:text-gray-400 text-sm">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-emerald-500" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-emerald-500" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-emerald-500" />
                <span>{post.readingTime} min de lecture</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 mb-16"
      >
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-auto max-h-[500px] object-cover"
            loading="lazy"
          />
        </div>
      </motion.div>

      {/* Content Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="prose prose-lg dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-emerald-600 dark:prose-a:text-emerald-400 max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </section>

      {/* Related Posts */}
      {post.relatedPosts.length > 0 && (
        <section className="py-16 bg-gray-100 dark:bg-gray-900/50">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
                Articles similaires
              </span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {post.relatedPosts.map((relatedPost, index) => (
                <motion.div
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      src={relatedPost.image_url}
                      alt={relatedPost.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <span className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {relatedPost.category_name}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                    <Button
                      onClick={() => navigate(`/blog/${relatedPost.slug}`)}
                      variant="link"
                      className="text-emerald-600 dark:text-emerald-400 p-0 hover:no-underline"
                    >
                      Lire l'article
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 text-center">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-emerald-500/10 to-teal-400/10 p-12 rounded-2xl border border-emerald-400/20"
          >
            <h2 className="text-3xl font-bold mb-6">
              Prêt à transformer votre entreprise ?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Nos experts sont à votre disposition pour discuter de vos défis et
              objectifs.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-lg px-8 py-6 rounded-xl shadow-lg"
            >
              Contactez-nous
            </Button>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default BlogPostPage;