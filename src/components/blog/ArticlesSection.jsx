import ArticleCategories from '@/components/blog/ArticleCategories';
import React, { useState, useEffect, useRef } from 'react';
import ArticlesGrid from '@/components/blog/ArticlesGrid';

const ArticlesSection = ({
  categories,
  activeCategory,
  setActiveCategory,
  filteredArticles,
  searchQuery,
  setSearchQuery
}) => {
  return (
    <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <ArticleCategories 
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
        
        <ArticlesGrid 
          articles={filteredArticles}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
    </section>
  );
};