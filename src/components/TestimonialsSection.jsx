import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TestimonialsSection = () => {
  const { t } = useTranslation();

  const testimonialsData = [
    {
      nameKey: "testimonials.client1.name",
      positionKey: "testimonials.client1.position",
      contentKey: "testimonials.client1.content",
      rating: 5,
      avatar: "https://img.freepik.com/photos-premium/sticker-femme-afro-americaine-heureuse-fond-transparent_53876-1044456.jpg?uid=R36722598&ga=GA1.1.1540057430.1738812532&semt=ais_hybrid&w=740"
    },
    {
      nameKey: "testimonials.client2.name",
      positionKey: "testimonials.client2.position",
      contentKey: "testimonials.client2.content",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6"
    },
    {
      nameKey: "testimonials.client3.name",
      positionKey: "testimonials.client3.position",
      contentKey: "testimonials.client3.content",
      rating: 5,
      avatar: "https://img.freepik.com/photos-gratuite/homme-souriant-pret-voyager_23-2149380154.jpg?uid=R36722598&ga=GA1.1.1540057430.1738812532&semt=ais_hybrid&w=740"
    }
  ];

  const TestimonialCard = ({ nameKey, positionKey, contentKey, rating, avatar, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 60, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
      className="bg-white/5 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-sky-300/10 flex flex-col h-full hover:scale-[1.02] transition-transform duration-300"
    >
      <Quote className="w-12 h-12 text-emerald-300 mb-6 transform -scale-x-100 opacity-80" />
      <p className="text-gray-100 mb-8 italic text-[17px] leading-relaxed flex-grow">"{t(contentKey)}"</p>
      <div className="mt-auto">
        <div className="flex items-center mb-3">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400 drop-shadow-sm" />
          ))}
        </div>
        <div className="flex items-center">
          <img 
            className="w-16 h-16 rounded-full object-cover mr-5 border-2 border-sky-400 shadow-lg ring-2 ring-sky-600"
            alt={t(nameKey)}
            src={avatar}
          />
          <div>
            <div className="font-semibold text-lg text-white tracking-wide">{t(nameKey)}</div>
            <div className="text-sm text-gray-400">{t(positionKey)}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <section
      id="temoignages"
      className="py-28 px-6 sm:px-10 bg-gradient-to-br from-sky-600 via-sky-800 to-sky-600 text-white"
    >
      <div className="max-w-screen-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 bg-gradient-to-r from-sky-500 to-teal-400 text-transparent bg-clip-text drop-shadow-lg">
            {t('testimonials.sectionTitle')}
          </h2>
          <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto opacity-90">
            {t('testimonials.sectionSubtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {testimonialsData.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
