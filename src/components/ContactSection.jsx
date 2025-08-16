import React from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';

const NewsletterSection = () => {
  const { t } = useTranslation();

  const handleNewsletterSubmit = async (e) => {
  e.preventDefault();
  const email = e.target.email.value;

  try {
    const response = await fetch("https://kofgo-consulting.com/api/saveEmail.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();

    if (data.success) {
      toast({
        title: t('Inscription réussie 🎉'),
        description: t('Merci de vous être inscrit à notre newsletter ! Vous recevrez bientôt nos dernières nouveautés directement dans votre boîte mail.'),
        variant: "default",
      });
      e.target.reset();
    } else {
      toast({
        title: "Erreur",
        description: data.message || "Une erreur est survenue",
        variant: "destructive",
      });
    }
  } catch (err) {
    toast({
      title: "Erreur réseau",
      description: "Impossible de contacter le serveur",
      variant: "destructive",
    });
  }
};


  const inputClass = `
    w-full px-5 py-3
    border border-sky-300 rounded-md
    text-gray-800 dark:text-gray-100
    placeholder-gray-400 dark:placeholder-gray-500
    focus:outline-none focus:ring-2 focus:ring-teal-400
    transition
  `;

  const labelClass = "sr-only";

  return (
    <section id="NewsLetter" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl font-extrabold mb-6 bg-gradient-to-r from-sky-500 to-teal-400 text-transparent bg-clip-text drop-shadow-lg"
        >
          {t('newsletter.sectionTitle')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-kofgo-gray-300 dark:text-gray-300 mb-10"
        >
          {t('newsletter.sectionSubtitle')}
        </motion.p>

        <motion.form
          onSubmit={handleNewsletterSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <label htmlFor="email" className={labelClass}>
            {t('newsletter.form.email')}
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder={t('newsletter.form.emailPlaceholder')}
            className={inputClass + " flex-grow"}
            aria-label={t('newsletter.form.email')}
          />
          <Button
            type="submit"
            size="lg"
            className="
              bg-gradient-to-r from-sky-500 to-teal-400
              text-white font-semibold
              rounded-xl px-6 py-3
              flex items-center justify-center
              transition-all duration-300 transform hover:scale-[1.02]
            "
          >
            {t('newsletter.form.submitButton')}
            <Send className="ml-3 w-5 h-5" />
          </Button>
        </motion.form>
      </div>
    </section>
  );
};

export default NewsletterSection;
