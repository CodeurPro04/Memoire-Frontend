import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      "nav.home": "Home",
      "nav.findDoctor": "Doctor",
      "nav.services": "Expertise",
      "nav.achievements": "Achievements",
      "nav.startup": "Start UP",
      "nav.blog": "Blog",
      "nav.contact": "Contact",
      "nav.freeQuote": "Free Quote",
      "nav.language": "Language",
      "nav.openMenu": "Open menu",
      "nav.login": "Login",

      "hero.title.line1": "Boost Your Business",
      "hero.title.line2": "to New Heights",
      "hero.subtitle":
        "Experts in strategic consulting, digital marketing and digital transformation for your growth.",
      "hero.cta.explore": "Our Services",
      "hero.cta.quote": "Contact Us",
      "hero.backgroundImageAlt": "Abstract technology and network background",

      "services.mainTitle": "Our Services",
      "services.mainSubtitle": "Solutions tailored to your needs",
      "services.sectionTitle": "Our Areas of Expertise",
      "services.sectionSubtitle":
        "Premium consulting solutions designed to catalyze your success and position you as an industry leader.",
      "services.strategy.title": "Strategy Consulting",
      "services.strategy.description":
        "Vision definition, market analysis and customized growth plans for your company.",
      "services.strategy.feature1": "Strategic Diagnostic",
      "services.strategy.feature2": "Strategic Planning",
      "services.strategy.feature3": "Business Development",
      "services.strategy.feature4": "Business Model Optimization",
      "services.strategy.feature5":
        "Growth and Internationalization Strategies",
      "services.digital.title": "Digital Marketing",
      "services.digital.description":
        "Integrated digital strategies to increase your visibility and generate qualified leads.",
      "services.digital.feature1": "Omnichannel digital strategy",
      "services.digital.feature2": "High-performance advertising campaigns",
      "services.digital.feature3": "Content creation and social media",
      "services.digital.feature4": "Continuous analysis and optimization",
      "services.leadership.title": "Financial Management",
      "services.leadership.description":
        "Cash flow optimization, financial analysis and strategic tax advisory.",
      "services.leadership.feature1": "Financial audit and diagnostic",
      "services.leadership.feature2": "Cash flow optimization",
      "services.leadership.feature3": "Reporting and dashboards",
      "services.leadership.feature4": "Strategic tax advisory",
      "services.operational.title": "Digital Transformation",
      "services.operational.description":
        "Support in digitizing your processes and adopting innovative technologies.",
      "services.operational.feature1": "Digital Audit",
      "services.operational.feature2": "Digital Strategy Development",
      "services.operational.feature3": "Digital Solutions Implementation",
      "services.operational.feature4": "Business Process Digital Optimization",
      "services.operational.feature5": "Training and Support",
      "services.innovation.title": "Innovation & Product Development",
      "services.innovation.description":
        "Stimulate creativity, accelerate innovation and launch products/services that captivate your market.",
      "services.innovation.feature1": "Design Thinking & Agile",
      "services.innovation.feature2": "Innovation portfolio management",
      "services.innovation.feature3": "Technology and competitive intelligence",
      "services.security.title": "Cybersecurity & Risk Management",
      "services.security.description":
        "Protect your assets, ensure compliance and anticipate threats for bulletproof resilience.",
      "services.security.feature1": "Security audits and penetration testing",
      "services.security.feature2": "Risk governance strategy",
      "services.security.feature3": "Business continuity plan",
      "services.ctaText":
        "Ready to discuss how we can customize these services for your unique needs?",
      "services.ctaButton": "Schedule a Strategy Consultation",
      "services.contactButton": "Contact Us",
      "services.learnMoreButton": "View all services",

      "about.title.line1": "KOF-GO CONSULTING",
      "about.title.line2":
        "Act with method, Change with impact, Succeed with meaning.",
      "about.paragraph1":
        "KOF-GO CONSULTING is a strategic consulting firm co-founded by Konan Koffi and Richard Tago, supporting startups, SMEs and mid-sized companies in their growth, organizational transformation and strategic adaptation. Our approach is based on cross-sector expertise, combining innovation, agility and tailored advice. We firmly believe that every challenge hides a growth opportunity. That's why we provide our clients with concrete solutions, tailored to their specific challenges, by leveraging the levers of change and sustainable performance.",
      "about.paragraph2":
        "At KOF-GO CONSULTING, we pride ourselves on combining operational excellence, strategic vision and human proximity to build a solid and resilient future together.",
      "about.ctaButton": "Learn more",
      "about.stats.experienceValue": "25+",
      "about.stats.experienceLabel": "Strategic partners",
      "about.stats.projectsValue": "150+",
      "about.stats.projectsLabel": "Successful projects",
      "about.stats.satisfactionValue": "95%",
      "about.stats.satisfactionLabel": "Client satisfaction",
      "about.stats.expertsValue": "12+",
      "about.stats.expertsLabel": "Countries of operation",
      "about.imageAlt":
        "KofGo Consulting team in strategic brainstorming session in modern office",
      "partners.title": "Our Partners",
      "partners.subtitle": "Strategic alliances for your success",

      "realisations.title": "Our Achievements",
      "realisations.subtitle":
        "Discover the impactful projects we've delivered for our clients.",
      "realisations.project1.title": "E-commerce Platform Redesign",
      "realisations.project1.description":
        "Complete redesign of a major e-commerce platform, resulting in 40% increase in conversions and improved user experience.",
      "realisations.project1.category": "E-commerce",
      "realisations.project2.title": "Logistics Mobile App",
      "realisations.project2.description":
        "Development of a cross-platform mobile application for real-time fleet management and logistics optimization.",
      "realisations.project2.category": "Mobile App",
      "realisations.project3.title": "AI Financial Analysis",
      "realisations.project3.description":
        "Implementation of an AI dashboard for a financial institution, providing predictive analytics and risk assessment.",
      "realisations.project3.category": "Fintech AI",
      "realisations.tags.ecommerce": "E-commerce",
      "realisations.tags.uxui": "UX/UI",
      "realisations.tags.digital": "Digital",
      "realisations.tags.mobile": "Mobile",
      "realisations.tags.logistics": "Logistics",
      "realisations.tags.saas": "SaaS",
      "realisations.tags.ai": "AI",
      "realisations.tags.finance": "Finance",
      "realisations.tags.data": "Data Analysis",

      "startup.title": "Start UP Ecosystem",
      "startup.subtitle":
        "From idea to impact: Your idea deserves to become reality.",
      "startup.service1.title": "Digital start-ups",
      "startup.service1.description": "Mobile apps, web platforms, applied AI.",
      "startup.service2.title": "Snacking & Food Business",
      "startup.service2.description":
        "Innovative snacking, sustainable food concepts.",
      "startup.service3.title": "E-commerce & online solutions",
      "startup.service3.description":
        "Online solutions and specialized marketplaces.",
      "startup.service4.title": "Sustainable projects and green business",
      "startup.service4.description": "Agroecology, recycling, clean energy.",
      "startup.service5.title": "Education & Innovative Services",
      "startup.service5.description": "E-learning, coaching, academic support.",
      "startup.service6.title": "Fashion, crafts & creative economy",
      "startup.service6.description":
        "African fashion, premium crafts, design.",
      "startup.service7.title": "Connected Health & Wellness",
      "startup.service7.description":
        "Digital health solutions and holistic wellness.",
      "startup.service8.title": "Creative economy",
      "startup.service8.description":
        "African fashion, premium crafts, design.",
      "newsletter.form.submitButton": "Get Started",
      "newsletter.form.emailPlaceholder": "email",
      "newsletter.sectionTitle": "Stay informed",
      "newsletter.sectionSubtitle":
        "Subscribe to our newsletter to receive exclusive insights and updates.",

      "blog.title": "Blog & News",
      "blog.subtitle": "Our latest thoughts and analysis.",
      "blog.post1.title": "The Future of AI in Business Strategy",
      "blog.post1.excerpt":
        "Exploring how artificial intelligence is redefining strategic decision-making for modern businesses.",
      "blog.post1.date": "June 1, 2025",
      "blog.post1.author": "Dr. Eva Rostand",
      "blog.post2.title": "Navigating Digital Transformation: A CEO's Guide",
      "blog.post2.excerpt":
        "Key considerations and actionable steps for leaders embarking on digital transformation.",
      "blog.post2.date": "May 20, 2025",
      "blog.post2.author": "Marc Dubois",
      "blog.post3.title": "Innovation Culture: The Fuel for Startup Success",
      "blog.post3.excerpt":
        "How to build and nurture an innovation culture within your startup for long-term growth.",
      "blog.post3.date": "May 5, 2025",
      "blog.post3.author": "Aisha Koné",
      "blog.categories.strategy": "Strategy",
      "blog.categories.digital": "Digital",
      "blog.categories.innovation": "Innovation",
      "blog.viewAll": "View all articles",
      "blog.readMore": "Read article",

      "testimonials.sectionTitle": "The Voice of Our Satisfied Clients",
      "testimonials.sectionSubtitle": "Success stories, Our clients testify.",
      "testimonials.client1.name": "Amina Diallo",
      "testimonials.client1.position": "CEO, Innovatech Solutions",
      "testimonials.client1.content":
        "Thanks to KOF-GO CONSULTING's support in our digital transformation project (finance sector), we successfully modernized our systems in record time, increasing our operational efficiency by 30% and significantly improving customer satisfaction.",
      "testimonials.client2.name": "Thomas Lefevre",
      "testimonials.client2.position": "Marketing Director, Alpha Corp",
      "testimonials.client2.content":
        "The support in our digital transformation was exceptional. Smooth process, responsive team and concrete results.",
      "testimonials.client3.name": "Chen Zhao",
      "testimonials.client3.position": "Founder, Epsilon Start-up",
      "testimonials.client3.content":
        "As a young company, we needed expert guidance. KofGo provided us with the tools and strategy to successfully navigate the crucial first steps. Priceless!",

      "contact.sectionTitle": "Let's Get in Touch",
      "contact.sectionSubtitle":
        "Ready to initiate your transformation? Our team is available to discuss your ambitions and develop a tailored strategy.",
      "contact.formTitle": "Consultation Request",
      "contact.form.firstName": "First Name",
      "contact.form.firstNamePlaceholder": "Ex: John",
      "contact.form.lastName": "Last Name",
      "contact.form.lastNamePlaceholder": "Ex: Smith",
      "contact.form.email": "Professional Email",
      "contact.form.emailPlaceholder": "Ex: j.smith@company.com",
      "contact.form.company": "Company Name",
      "contact.form.companyPlaceholder": "Ex: My Company LLC",
      "contact.form.message": "Your Message",
      "contact.form.messagePlaceholder":
        "Briefly describe your project or questions...",
      "contact.form.submitButton": "Send Your Request",
      "contact.infoTitle": "Our Contact Information",
      "contact.info.addressTitle": "Our offices",
      "contact.info.addressLine":
        "Entrepreneurs Street, Plateau Abidjan, Ivory Coast",
      "contact.info.addressLine2":
        "21 Rue Louise Michel 78711 Mantes-la-Jolie, Paris, France",
      "contact.info.phoneTitle": "Mobile Phone",
      "contact.info.phoneNumber": "+225 07 04 84 28 43",
      "contact.info.phoneNumber2": "+33 7 43 10 12 06",
      "contact.info.emailTitle": "General Email",
      "contact.info.emailAddress": "contact@kofgo-consulting.com",
      "contact.socialTitle": "Let's Stay Connected",
      "contact.socialSubtitle": "Follow our news and analysis on social media.",
      "contact.toast.successTitle": "Message Sent!",
      "contact.toast.successDescription":
        "Thank you for your interest. We will respond within 24 hours.",
      "footer.tagline":
        "At KOF-GO CONSULTING, we believe that every company carries within it the potential for sustainable leadership. Through an approach combining strategic excellence, pragmatic innovation, and human support, we work with you to build powerful transformation paths tailored to your challenges and ambitions.",
      "footer.links.services.title": "Our Services",
      "footer.links.services.strategy": "Strategy Consulting",
      "footer.links.services.digital": "Digital Marketing",
      "footer.links.services.leadership": "Financial Management",
      "footer.links.services.innovation": "Digital Transformation",
      "footer.links.services.accompagnement":
        "Organizational Transformation Support",
      "footer.links.company.title": "The Company",
      "footer.links.company.about": "About Us",
      "footer.links.company.team": "Our Expert Team",
      "footer.links.company.careers": "Careers at KofGo",
      "footer.links.company.blog": "Blog & Analysis",
      "footer.links.legal.title": "Information",
      "footer.links.legal.mentions": "Legal Notice",
      "footer.links.legal.privacy": "Privacy Policy",
      "footer.links.legal.cgu": "Terms of Service",
      "footer.rightsReserved": "All rights reserved. Designed with passion.",
      "footer.developedBy": "Website developed by Hostinger Horizons.",

      "chatbot.header": "KofGo Assistant",
      "chatbot.welcome":
        "Hello! I'm the KofGo assistant. How can I help you today?",
      "chatbot.inputPlaceholder": "Type your message...",
      "chatbot.sendAria": "Send message",
      "chatbot.openAria": "Open chat",
      "chatbot.closeAria": "Close chat",
      "chatbot.defaultResponse":
        "I'm still learning. Could you rephrase or ask another question? For complex requests, please use the contact form.",
      "chatbot.keywords.hello": "hello",
      "chatbot.keywords.hi": "hi",
      "chatbot.keywords.services": "services",
      "chatbot.keywords.contact": "contact",
      "chatbot.keywords.quote": "quote",
      "chatbot.keywords.price": "price",
      "chatbot.keywords.thankyou": "thank you",
      "chatbot.responses.greeting": "Hello! How can I help you?",
      "chatbot.responses.servicesInfo":
        "We offer services in Business Strategy, Digital Transformation, Leadership, Operational Excellence, Innovation and Cybersecurity. Which one interests you?",
      "chatbot.responses.contactInfo":
        "You can contact us via the form on our website, by phone at +33 1 23 45 67 89 or by email at contact@kofgoconsulting.com.",
      "chatbot.responses.quoteInfo":
        "For a personalized quote, please fill out the contact form or call us. We'd be happy to discuss your project!",
      "chatbot.responses.thankyouReply":
        "You're welcome! Is there anything else I can do for you?",
    },
  },
  fr: {
    translation: {
      "nav.home": "Accueil",
      "nav.findDoctor": "Docteurs",
      "nav.specialties": "Specialités",
      "nav.howItWorks": "Infos",
      "nav.startup": "Start UP",
      "nav.blog": "Blog",
      "nav.contact": "Contact",
      "nav.freeQuote": "Devis Gratuit",
      "nav.language": "Langue",
      "nav.openMenu": "Ouvrir le menu",
      "nav.login": "Connexion",

      services: {
        mainTitle: "Nos services médicaux",
        mainSubtitle:
          "Des soins de qualité pour votre santé et votre bien-être",
        ctaText: "Découvrez comment nous pouvons vous aider",
        contactButton: "Contactez-nous",
        learnMoreButton: "En savoir plus",
        consultation: {
          title: "Consultation médicale",
          description: "Rencontrez nos médecins pour un suivi personnalisé.",
          feature1: "Consultations rapides et fiables",
          feature2: "Suivi personnalisé",
          feature3: "Dossier médical complet",
          feature4: "Plan de traitement adapté",
        },
        cardiology: {
          title: "Cardiologie",
          description: "Soins spécialisés pour la santé de votre cœur.",
          feature1: "Électrocardiogramme",
          feature2: "Échocardiographie",
          feature3: "Suivi des maladies cardiaques",
          feature4: "Prévention et conseils",
        },
        generalCare: {
          title: "Soins généraux",
          description: "Soins médicaux pour toute la famille.",
          feature1: "Consultations pédiatriques",
          feature2: "Vaccinations",
          feature3: "Suivi régulier",
        },
        followUp: {
          title: "Suivi médical",
          description: "Assurez un suivi régulier et complet.",
          feature1: "Rappels automatiques",
          feature2: "Historique des consultations",
          feature3: "Plans de soins personnalisés",
        },
      },

      login: {
        title: "Connexion Patient",
        titlee: "Connexion Médecin",
        subtitle: "Accédez à votre espace personnel",
        email: "Adresse email",
        emailPlaceholder: "Email@gmail.com",
        password: "Mot de passe",
        passwordPlaceholder: "Entrez votre mot de passe",
        loginButton: "Se connecter",
        noAccount: "Vous n'avez pas de compte ?",
        noAccountt: "Vous êtes un medécin ?",
        noAccounttt: "Vous êtes un patient ?",
        register: "Inscrivez-vous",
        registerr: "connectez-vous",
        errorEmpty: "Veuillez remplir tous les champs",
      },

      signup: {
        title: "Inscription Médecin",
        subtitle: "Créez votre compte pour rejoindre notre plateforme médicale",
        firstName: "Prénom",
        firstNamePlaceholder: "Entrez votre prénom",
        lastName: "Nom",
        lastNamePlaceholder: "Entrez votre nom",
        email: "Email",
        emailPlaceholder: "Email@gmail.com",
        password: "Minimum 8 caractères",
        passwordPlaceholder: "Minimum 8 caractères",
        specialty: "Spécialité",
        specialtyPlaceholder: "Cardiologue",
        phone: "Téléphone",
        phonePlaceholder: "Entrez votre numéro de téléphone",
        signupButton: "S'inscrire",
        errorEmpty: "Veuillez remplir tous les champs.",
        alreadyAccount: "Vous avez déjà un compte ?",
        login: "Connectez-vous",
        titleClient: "Inscription Patient",
        subtitleClient: "Créez votre compte pour accéder à nos services",
        firstName: "Prénom",
        firstNamePlaceholder: "Entrez votre prénom",
        lastName: "Nom",
        lastNamePlaceholder: "Entrez votre nom",
        email: "Email",
        emailPlaceholder: "Email@gmail.com",
        password: "Mot de passe",
        passwordPlaceholder: "Minimum 8 caractères",
        phone: "Téléphone",
        phonePlaceholder: "Entrez votre numéro de téléphone",
        address: "Adresse",
        addressPlaceholder: "Entrez votre adresse complète",
        signupButton: "S'inscrire",
        errorEmpty: "Veuillez remplir tous les champs.",
        alreadyAccount: "Vous avez déjà un compte ?",
        login: "Connectez-vous",
        adresse: "Adresse",
        adressePlaceholder: "Entrez votre adresse complète",
      },

      "about.stats.yearsExperience": "Années d'expérience",
      "about.stats.patientsServed": "Patients accompagnés",
      "about.stats.satisfactionRate": "Taux de satisfaction",
      "about.stats.partnerClinics": "Cliniques partenaires",

      "hero.title.line1": "Votre santé, notre priorité",
      "hero.title.line2": "",
      "hero.subtitle":
        "Consultation rapide, suivi personnalisé et soins de qualité.",
      "hero.cta.explore": "Nos Docteurs",
      "hero.cta.quote": "Contactez-nous",
      "hero.backgroundImageAlt":
        "Arrière-plan abstrait de technologie et de réseau",

      "services.mainTitle": "Nos Expertises",
      "services.mainSubtitle": "Des solutions adaptées à vos besoins",
      "services.sectionTitle": "Nos Domaines d'Expertise",
      "services.sectionSubtitle":
        "Des solutions de conseil premium, conçues pour catalyser votre succès et vous positionner en leader de votre industrie.",
      "services.strategy.title": "Conseil en stratégie",
      "services.strategy.description":
        "Définition de vision, analyse de marché et plans de croissance sur mesure pour votre entreprise.",
      "services.strategy.feature1": "Diagnostic Stratégique",
      "services.strategy.feature2": "Planification Stratégique",
      "services.strategy.feature3": "Développement d’Affaires",
      "services.strategy.feature4": "Optimisation des Modèles Économiques",
      "services.strategy.feature5":
        "Stratégies de Croissance et d'Internationalisation",
      "services.digital.title": "Marketing digital",
      "services.digital.description":
        "Stratégies digitales intégrées pour accroître votre visibilité et générer des leads qualifiés.",
      "services.digital.feature1": "Stratégie digitale omnicanale",
      "services.digital.feature2": "Campagnes publicitaires performantes",
      "services.digital.feature3": "Création de contenu et social media",
      "services.digital.feature4": "Analyse et optimisation continue",
      "services.leadership.title": "Gestion financière",
      "services.leadership.description":
        "Optimisation de votre trésorerie, analyse financière et accompagnement fiscal stratégique.",
      "services.leadership.feature1": "Audit et diagnostic financier",
      "services.leadership.feature2": "Optimisation de la trésorerie",
      "services.leadership.feature3": "Reporting et tableaux de bord",
      "services.leadership.feature4": "Accompagnement fiscal stratégique",
      "services.operational.title": "Transformation numérique",
      "services.operational.description":
        "Accompagnement dans la digitalisation de vos processus et l'adoption de technologies innovantes.",
      "services.operational.feature1": "Audit Digital",
      "services.operational.feature2": "Élaboration de Stratégies Digitales",
      "services.operational.feature3": "Implémentation de Solutions Numériques",
      "services.operational.feature4":
        "Optimisation des Processus Métiers par le Digital",
      "services.operational.feature5": "Formation et Supports",
      "services.innovation.title": "Innovation & Développement Produit",
      "services.innovation.description":
        "Stimulez la créativité, accélérez l'innovation et lancez des produits/services qui captivent votre marché.",
      "services.innovation.feature1": "Design Thinking & Agile",
      "services.innovation.feature2": "Gestion de portefeuille d'innovation",
      "services.innovation.feature3": "Veille technologique et concurrentielle",
      "services.security.title": "Cybersécurité & Gestion des Risques",
      "services.security.description":
        "Protégez vos actifs, assurez la conformité et anticipez les menaces pour une résilience à toute épreuve.",
      "services.security.feature1": "Audit de sécurité et tests d'intrusion",
      "services.security.feature2": "Stratégie de gouvernance des risques",
      "services.security.feature3": "Plan de continuité d'activité",
      "services.ctaText":
        "Prêt à discuter de la manière dont nous pouvons personnaliser ces services pour vos besoins uniques ?",
      "services.ctaButton": "Planifier une Consultation Stratégique",
      "services.contactButton": "Contactez-Nous",
      "services.learnMoreButton": "Voir tous les services",

      "about.title.line1": "KOF-GO CONSULTING",
      "about.title.line2":
        "Agir avec méthode, Changer avec impact, Réussir avec sens.",
      "about.paragraph1":
        "KOF-GO CONSULTING est une firme de conseil stratégique cofondée par Konan Koffi et Richard Tago, qui accompagne les startups, PME et PMI dans leur croissance, leur transformation organisationnelle et leur adaptation stratégique. Notre approche repose sur une expertise multisectorielle, alliant innovation, agilité et conseil sur mesure. Nous croyons fermement que chaque défi cache une opportunité de croissance. C’est pourquoi nous offrons à nos clients des solutions concrètes, adaptées à leurs enjeux spécifiques, en mobilisant les leviers du changement et de la performance durable.",
      "about.paragraph2":
        "Chez KOF-GO CONSULTING, nous mettons un point d’honneur à conjuguer excellence opérationnelle, vision stratégique et proximité humaine, pour bâtir ensemble un futur solide et résilient.",
      "about.ctaButton": "En savoir plus",
      "about.stats.experienceValue": "25+",
      "about.stats.experienceLabel": "Partenaires stratégiques",
      "about.stats.projectsValue": "150+",
      "about.stats.projectsLabel": "Projets réussis",
      "about.stats.satisfactionValue": "95%",
      "about.stats.satisfactionLabel": "Satisfaction client",
      "about.stats.expertsValue": "12+",
      "about.stats.expertsLabel": "Pays d'intervention",
      "about.imageAlt":
        "Équipe KofGo Consulting en session de brainstorming stratégique dans un bureau moderne",
      "partners.title": "Nos Partenaires",
      "partners.subtitle": "Des alliances stratégiques pour votre réussite",

      "realisations.title": "Nos Réalisations",
      "realisations.subtitle":
        "Découvrez les projets impactants que nous avons livrés pour nos clients.",
      "realisations.project1.title": "Refonte Plateforme E-commerce",
      "realisations.project1.description":
        "Refonte complète d'une plateforme e-commerce majeure, résultant en une augmentation de 40% des conversions et une expérience utilisateur améliorée.",
      "realisations.project1.category": "E-commerce",
      "realisations.project2.title": "App Mobile Logistique",
      "realisations.project2.description":
        "Développement d'une application mobile multiplateforme pour la gestion de flotte en temps réel et l'optimisation logistique.",
      "realisations.project2.category": "App Mobile",
      "realisations.project3.title": "IA Analyse Financière",
      "realisations.project3.description":
        "Mise en place d'un tableau de bord IA pour une institution financière, offrant analyses prédictives et évaluation des risques.",
      "realisations.project3.category": "Fintech IA",
      "realisations.tags.ecommerce": "E-commerce",
      "realisations.tags.uxui": "UX/UI",
      "realisations.tags.digital": "Digital",
      "realisations.tags.mobile": "Mobile",
      "realisations.tags.logistics": "Logistique",
      "realisations.tags.saas": "SaaS",
      "realisations.tags.ai": "IA",
      "realisations.tags.finance": "Finance",
      "realisations.tags.data": "Analyse de Données",

      "startup.title": "Écosystème Start UP",
      "startup.subtitle":
        "De l'idée à l'impact : Votre idée mérite de devenir réalité.",
      "startup.service1.title": "Start-ups digitales",
      "startup.service1.description":
        "Applications mobiles, plateformes web, IA appliquée.",
      "startup.service2.title": "Snacking & Food Business",
      "startup.service2.description":
        "Snacking innovant, concepts alimentaires durables.",
      "startup.service3.title": "E-commerce & solutions en ligne",
      "startup.service3.description":
        "Solutions en ligne et marketplaces spécialisées.",
      "startup.service4.title": "Projets durables et green business",
      "startup.service4.description":
        "Agroécologie, recyclage, énergie propre.",
      "startup.service5.title": "Éducation & Services Innovants",
      "startup.service5.description": "E-learning, coaching, soutien scolaire.",
      "startup.service6.title": "Mode, artisanat & économie créative",
      "startup.service6.description":
        "Mode africaine, artisanat premium, design.",
      "startup.service7.title": "Santé connectée & Bien-être",
      "startup.service7.description":
        "Solutions de santé numérique et bien-être global.",
      "startup.service8.title": "Économie créative",
      "startup.service8.description":
        "Mode africaine, artisanat premium, design.",
      "newsletter.form.submitButton": "Commencer",
      "newsletter.form.emailPlaceholder": "email",
      "newsletter.sectionTitle": "Restez informés",
      "newsletter.sectionSubtitle":
        "Abonnez-vous à notre newsletter pour recevoir nos analyses exclusives et actualités.",

      "blog.title": "Blog & Actualités",
      "blog.subtitle": "Nos dernières réflexions et analyses.",
      "blog.post1.title": "L'Avenir de l'IA dans la Stratégie d'Entreprise",
      "blog.post1.excerpt":
        "Exploration de la manière dont l'intelligence artificielle redéfinit la prise de décision stratégique pour les entreprises modernes.",
      "blog.post1.date": "1 Juin 2025",
      "blog.post1.author": "Dr. Eva Rostand",
      "blog.post2.title":
        "Naviguer la Transformation Digitale : Guide pour CEO",
      "blog.post2.excerpt":
        "Considérations clés et étapes actionnables pour les dirigeants s'engageant dans une transformation digitale.",
      "blog.post2.date": "20 Mai 2025",
      "blog.post2.author": "Marc Dubois",
      "blog.post3.title": "Culture d'Innovation : Carburant du Succès Startup",
      "blog.post3.excerpt":
        "Comment construire et nourrir une culture d'innovation au sein de votre startup pour une croissance à long terme.",
      "blog.post3.date": "5 Mai 2025",
      "blog.post3.author": "Aisha Koné",
      "blog.categories.strategy": "Stratégie",
      "blog.categories.digital": "Digital",
      "blog.categories.innovation": "Innovation",
      "blog.viewAll": "Voir tous les articles",
      "blog.readMore": "Lire l'article",

      "testimonials.sectionTitle": "La Voix de Nos Clients Satisfaits",
      "testimonials.sectionSubtitle":
        "Histoires de réussite, Nos clients témoignent .",
      "testimonials.client1.name": "Amina Diallo",
      "testimonials.client1.position": "CEO, Innovatech Solutions",
      "testimonials.client1.content":
        "Grâce à l'accompagnement de KOF-GO CONSULTING dans notre projet de transformation digitale (secteur de la finance), nous avons réussi à moderniser nos systèmes en un temps record, augmentant ainsi notre efficacité opérationnelle de 30% et améliorant significativement la satisfaction de nos clients.",
      "testimonials.client2.name": "Thomas Lefevre",
      "testimonials.client2.position": "Directeur Marketing, Alpha Corp",
      "testimonials.client2.content":
        "L'accompagnement dans notre transformation numérique a été exceptionnel. Processus fluide, équipe réactive et résultats concrets.",
      "testimonials.client3.name": "Chen Zhao",
      "testimonials.client3.position": "Fondateur, Epsilon Start-up",
      "testimonials.client3.content":
        "En tant que jeune entreprise, nous avions besoin d'une guidance experte. KofGo nous a fourni les outils et la stratégie pour naviguer les premières étapes cruciales avec succès. Inestimable !",

      "contact.sectionTitle": "Entrons en Contact",
      "contact.sectionSubtitle":
        "Prêt à initier votre transformation ? Notre équipe est à votre écoute pour discuter de vos ambitions et élaborer une stratégie sur mesure.",
      "contact.formTitle": "Demande de Consultation",
      "contact.form.firstName": "Prénom",
      "contact.form.firstNamePlaceholder": "Ex: Jean",
      "contact.form.lastName": "Nom",
      "contact.form.lastNamePlaceholder": "Ex: Dupont",
      "contact.form.email": "Email Professionnel",
      "contact.form.emailPlaceholder": "Ex: j.dupont@entreprise.com",
      "contact.form.company": "Nom de l'Entreprise",
      "contact.form.companyPlaceholder": "Ex: Ma Société SAS",
      "contact.form.message": "Votre Message",
      "contact.form.messagePlaceholder":
        "Décrivez brièvement votre projet ou vos questions...",
      "contact.form.submitButton": "Envoyer Votre Demande",
      "contact.infoTitle": "Nos Coordonnées",
      "contact.info.addressTitle": "Nos bureaux",
      "contact.info.addressLine":
        "Rue des Entrepreneurs, Plateau Abidjan, Côte d'Ivoire",
      "contact.info.addressLine2":
        "21 Rue Louise Michel 78711 Mantes-la-Jolie, Paris, France",
      "contact.info.phoneTitle": "Téléphone Portable",
      "contact.info.phoneNumber": "+225 07 04 84 28 43",
      "contact.info.phoneNumber2": "+33 7 43 10 12 06",
      "contact.info.emailTitle": "Email Général",
      "contact.info.emailAddress": "contact@doconline.com",
      "contact.socialTitle": "Restons Connectés",
      "contact.socialSubtitle":
        "Suivez nos actualités et analyses sur les réseaux sociaux.",
      "contact.toast.successTitle": "Message Transmis !",
      "contact.toast.successDescription":
        "Merci pour votre intérêt. Nous vous répondrons sous 24h.",

      "footer.tagline":
        "Chez Doc Online votre santé est notre priorité , rechercher , demander un rendez vous et faite vous soignez en toute facilité finis les longue fils d'attente faite vous soigner directement en ligne en prenant rendez-vous .",
      "footer.links.services.title": "Nos Services",
      "footer.links.services.strategy": "Conseil en stratégie",
      "footer.links.services.digital": "Marketing digital",
      "footer.links.services.leadership": "Gestion financière",
      "footer.links.services.innovation": "Transformation numérique",
      "footer.links.services.accompagnement":
        "Accompagnement à la transformation organisationnelle",
      "footer.links.company.title": "L'Entreprise",
      "footer.links.company.about": "À Propos de Nous",
      "footer.links.company.team": "Notre Équipe d'Experts",
      "footer.links.company.careers": "Carrières chez DocOnline",
      "footer.links.company.blog": "Blog & Analyses",
      "footer.links.legal.title": "Informations",
      "footer.links.legal.mentions": "Mentions Légales",
      "footer.links.legal.privacy": "Politique de Confidentialité",
      "footer.links.legal.cgu": "Conditions Générales d'Utilisation",
      "footer.rightsReserved": "Tous droits réservés .",
      "footer.developedBy": "Site développé par Hostinger Horizons.",

      "chatbot.header": "Assistant DocOnline",
      "chatbot.welcome":
        "Bonjour ! Je suis l'assistant DocOnline. Comment puis-je vous aider aujourd'hui ?",
      "chatbot.inputPlaceholder": "Tapez votre message...",
      "chatbot.sendAria": "Envoyer le message",
      "chatbot.openAria": "Ouvrir le chat",
      "chatbot.closeAria": "Fermer le chat",
      "chatbot.defaultResponse":
        "Je suis encore en apprentissage. Pourriez-vous reformuler ou poser une autre question ? Pour les demandes complexes, merci d'utiliser le formulaire de contact.",
      "chatbot.keywords.hello": "bonjour",
      "chatbot.keywords.hi": "salut",
      "chatbot.keywords.services": "services",
      "chatbot.keywords.contact": "contact",
      "chatbot.keywords.quote": "devis",
      "chatbot.keywords.price": "prix",
      "chatbot.keywords.thankyou": "merci",
      "chatbot.responses.greeting": "Bonjour ! Comment puis-je vous aider ?",
      "chatbot.responses.servicesInfo":
        "Nous proposons des services médicaux, plus besoin de faire la queue pour consulter un médecin. Quels services vous intéressent ?",
      "chatbot.responses.contactInfo":
        "Vous pouvez nous contacter via le formulaire sur notre site, par téléphone au +225 00 00 00 00 43 ou par email à contact@doconline.com.",
      "chatbot.responses.quoteInfo":
        "Pour un devis, veuillez contacter les docteurs via la page Docteurs !",
      "chatbot.responses.thankyouReply":
        "Je vous en prie ! Y a-t-il autre chose que je puisse faire pour vous ?",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "fr",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
