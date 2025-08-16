import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContactSection from "@/components/ContactSection";
import ArticlesSection from "@/components/ArticlesSection";
import BlogHero from "@/components/BlogHero";
import FeaturedArticle from "@/components/FeaturedArticle";

const BlogPage = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(
          "https://kofgo-consulting.com/api/getBlogsall.php"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        const result = JSON.parse(text);

        if (result.success && Array.isArray(result.data)) {
          const formatted = result.data.map((item) => ({
            ...item,
            id: item.id,
            title: item.title || "Sans titre",
            excerpt: item.excerpt || "",
            image_url: item.image_url || "/default-blog-image.jpg",
            category: item.category_name || "Non catégorisé",
            author: item.author || "Auteur inconnu",
            published_at: item.published_at || null,
            slug: item.slug || `post-${item.id}`,
            tags: item.tags
              ? item.tags.split(",").map((tag) => tag.trim())
              : [],
            readTime: item.read_time || "2 min",
          }));

          setArticles(formatted);
          setFilteredArticles(formatted);
          const uniqueCategories = [
            "Tous",
            ...new Set(formatted.map((a) => a.category)),
          ];
          setCategories(uniqueCategories);
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

  useEffect(() => {
    let filtered = articles;

    if (activeCategory !== "Tous") {
      filtered = filtered.filter(
        (article) => article.category === activeCategory
      );
    }

    if (searchQuery.trim() !== "") {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(lowerQuery) ||
          article.excerpt.toLowerCase().includes(lowerQuery)
      );
    }

    setFilteredArticles(filtered);
  }, [activeCategory, searchQuery, articles]);

  if (loading) {
    return <p className="text-center py-20">Chargement des articles...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-20">Erreur : {error}</p>;
  }

  return (
    <section className="py-20 bg-white dark:bg-gray-900" id="HomeBlog">
      <BlogHero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      {filteredArticles.length > 0 && (
        <FeaturedArticle article={filteredArticles[0]} />
      )}
      <ArticlesSection
        categories={categories}
        filteredArticles={filteredArticles}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        setSearchQuery={setSearchQuery}
      />
      <ContactSection />
    </section>
  );
};

export default BlogPage;
