import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Quill } from "react-quill";
// Ajouter l'alignement si ce n'est pas encore actif
import { AlignClass } from "quill/formats/align";
Quill.register(AlignClass, true);
import { convert } from "html-to-text";
import {
  Users,
  FileText,
  Briefcase,
  LogOut,
  PieChart,
  BarChart2,
  Calendar,
  MessageSquare,
  Settings,
  DollarSign,
  Globe,
  Clipboard,
  Edit,
  Trash2,
  Plus,
  Check,
  X,
  Folder,
  TrendingUp,
  Search,
  Image,
  Tag,
  User,
  Mail,
  Clock,
  Award,
  AlertCircle,
  CheckCircle,
  CalendarCheck,
  FolderKanban,
  UserPlus,
  PenLine,
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [projects, setProjects] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [realisations, setRealisations] = useState([]); // Nouvel état pour les réalisations
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({
    realisations: { count: 0, change: "+0" },
    appointments: { count: 0, change: "+0" },
    projects: { count: 0, change: "+0" },
    blogPosts: { count: 0, change: "+0" },
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // <- NEW
  const [editingPostId, setEditingPostId] = useState(null); // <- NEW
  const [categories, setCategories] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    excerpt: "",
    image: null,
    category: "", // ID de la catégorie
    author: "",
    published_at: "",
  });

  // Options de la toolbar personnalisée
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }], // alignements
      [{ color: [] }, { background: [] }],
      ["link"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "color",
    "background",
    "link",
    "image",
  ];

  const openEditModal = (post) => {
    setNewPost({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category ? post.category.toString() : "", // string ici
      author: post.author,
      published_at: post.published_at?.slice(0, 16),
      image: null,
    });
    setEditingPostId(post.id);
    setIsEditing(true);
    setShowAddModal(true);
  };

  const [showAddRealisationModal, setShowAddRealisationModal] = useState(false);
  const [editingRealisationId, setEditingRealisationId] = useState(null);
  const [newRealisation, setNewRealisation] = useState({
    title: "",
    subtitle: "",
    category: "",
    image: null,
  });

  const handleEditRealisation = (realisation) => {
    setIsEditing(true);
    setEditingRealisationId(realisation.id);
    setNewRealisation({
      title: realisation.title,
      subtitle: realisation.subtitle,
      category: realisation.category,
      image: null, // optionnel si tu veux prévisualiser
    });
    setShowAddRealisationModal(true);
  };

  function stripHtml(html) {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
  }

  // Charger les catégories à l'ouverture du modal
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://kofgo-consulting.com/api/admin/categories.php"
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
        toast.error("Erreur lors du chargement des catégories");
      }
    };

    if (showAddModal) fetchCategories();
  }, [showAddModal]);

  const handleSubmitNewPost = async () => {
    if (
      !newPost.title ||
      !newPost.content ||
      !newPost.category ||
      !newPost.author ||
      !newPost.published_at
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const formData = new FormData();
    formData.append("title", newPost.title);
    formData.append(
      "excerpt",
      newPost.excerpt ||
        newPost.content.slice(0, 100) +
          (newPost.content.length > 100 ? "..." : "")
    );
    formData.append("content", newPost.content);
    formData.append("category", newPost.category); // ID de la catégorie
    formData.append("author", newPost.author);
    formData.append("published_at", newPost.published_at);
    if (newPost.image) {
      formData.append("image", newPost.image);
    }

    try {
      const response = await fetch(
        "https://kofgo-consulting.com/api/admin/posts_add.php",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.message || "Erreur lors de la création");
      }

      toast.success("Article ajouté avec succès !");
      setShowAddModal(false);
      setNewPost({
        title: "",
        content: "",
        excerpt: "",
        image: null,
        category: "",
        author: "",
        published_at: "",
      });

      // Recharge les articles
      if (typeof fetchBlogPosts === "function") {
        fetchBlogPosts();
      } else {
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'ajout de l'article");
    }
  };

  // Envoi formulaire ajout
  const handleSubmitNewRealisation = async () => {
    if (!newRealisation.title || !newRealisation.category) {
      toast.error("Veuillez remplir les champs titre et catégorie.");
      return;
    }

    const formData = new FormData();
    formData.append("title", newRealisation.title);
    formData.append("subtitle", newRealisation.subtitle);
    formData.append("category", newRealisation.category);
    if (newRealisation.image) formData.append("image", newRealisation.image);

    try {
      const response = await fetch(
        "https://kofgo-consulting.com/api/admin/achievements_add.php",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.message || "Erreur lors de la création");
      }

      toast.success("Réalisation ajoutée avec succès !");
      setShowAddModal(false);
      setNewRealisation({
        title: "",
        subtitle: "",
        category: "",
        image: null,
      });
      if (typeof fetchRealisations === "function") {
        fetchRealisations();
      } else {
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'ajout de la réalisation");
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "https://kofgo-consulting.com/api/admin/stats.php"
        );

        if (!response.ok)
          throw new Error("Erreur lors de la récupération des statistiques");

        const data = await response.json();

        // ✅ On stocke à la fois count et change
        setStats({
          realisations: {
            count: data.realisations.count,
            change: data.realisations.change,
          },
          appointments: {
            count: data.appointments.count,
            change: data.appointments.change,
          },
          projects: {
            count: data.projects.count,
            change: data.projects.change,
          },
          blogPosts: {
            count: data.blogPosts.count,
            change: data.blogPosts.change,
          },
        });
      } catch (err) {
        setError(err.message);
        toast.error("Erreur lors du chargement des statistiques");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Récupération des projets
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "https://kofgo-consulting.com/api/admin/projects.php"
        );

        if (!response.ok)
          throw new Error("Erreur lors de la récupération des projets");

        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err.message);
        toast.error("Erreur lors du chargement des projets");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Récupération des articles de blog
  useEffect(() => {
    const fetchBlogPosts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "https://kofgo-consulting.com/api/admin/posts.php"
        );

        if (!response.ok)
          throw new Error("Erreur lors de la récupération des articles");

        const data = await response.json();
        setBlogPosts(data);
      } catch (err) {
        setError(err.message);
        toast.error("Erreur lors du chargement des articles");
      } finally {
        setIsLoading(false);
      }
    };

    if (activeTab === "blog") {
      fetchBlogPosts();
    }
  }, [activeTab]);

  // Récupération des réalisations
  useEffect(() => {
    const fetchRealisations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "https://kofgo-consulting.com/api/admin/realisations.php"
        );

        if (!response.ok)
          throw new Error("Erreur lors de la récupération des réalisations");

        const data = await response.json();
        setRealisations(data);
      } catch (err) {
        setError(err.message);
        toast.error("Erreur lors du chargement des réalisations");
      } finally {
        setIsLoading(false);
      }
    };

    if (activeTab === "achievements") {
      fetchRealisations();
    }
  }, [activeTab]);

  const handleUpdateRealisation = async () => {
    try {
      const response = await fetch(
        `https://kofgo-consulting.com/api/admin/realisations.php?id=${editingRealisationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...newRealisation,
          }),
        }
      );

      if (!response.ok) throw new Error("Échec de la mise à jour");

      toast.success("Réalisation mise à jour avec succès");
      setShowAddRealisationModal(false);
      setIsEditing(false);
      setEditingRealisationId(null);
      // Recharger les réalisations ici si besoin
    } catch (err) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    document.cookie = "adminToken=; Max-Age=0; path=/; secure; samesite=strict";
    toast.success("Déconnexion réussie");
    navigate("/admin/login");
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      try {
        const response = await fetch(
          `https://kofgo-consulting.com/api/admin/projects.php?id=${id}`,
          { method: "DELETE" }
        );

        if (!response.ok) throw new Error("Échec de la suppression");

        setProjects(projects.filter((project) => project.id !== id));
        toast.success("Projet supprimé avec succès");
      } catch (err) {
        toast.error("Erreur lors de la suppression du projet");
      }
    }
  };

  const handleDeletePost = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      try {
        const response = await fetch(
          `https://kofgo-consulting.com/api/admin/posts.php?id=${id}`,
          { method: "DELETE" } // <- méthode DELETE obligatoire
        );

        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "Échec de la suppression");

        setBlogPosts(blogPosts.filter((post) => post.id !== id));
        toast.success(data.success || "Article supprimé avec succès");
      } catch (err) {
        toast.error(
          "Erreur lors de la suppression de l'article : " + err.message
        );
      }
    }
  };

  const handleUpdatePost = async () => {
    try {
      // Créer un élément DOM temporaire pour extraire le texte brut
      const temp = document.createElement("div");
      temp.innerHTML = newPost.content;
      const plainText = temp.textContent || temp.innerText || "";

      const response = await fetch(
        `https://kofgo-consulting.com/api/admin/posts.php?id=${editingPostId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...newPost,
            excerpt:
              plainText.slice(0, 100) + (plainText.length > 100 ? "..." : ""),
          }),
        }
      );

      if (!response.ok) throw new Error("Échec de la mise à jour");

      toast.success("Article mis à jour avec succès");
      setShowAddModal(false);
      setIsEditing(false);
      setEditingPostId(null);
      // Recharger les articles ici si besoin
    } catch (err) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  // Ajoutez ce useEffect pour charger les rendez-vous
  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "https://kofgo-consulting.com/api/admin/appointments.php"
        );

        if (!response.ok)
          throw new Error("Erreur lors de la récupération des rendez-vous");

        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        setError(err.message);
        toast.error("Erreur lors du chargement des rendez-vous");
      } finally {
        setIsLoading(false);
      }
    };

    if (activeTab === "appointments") {
      fetchAppointments();
    }
  }, [activeTab]);

  // Ajoutez cette fonction de suppression
  const handleDeleteAppointment = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce rendez-vous ?")) {
      try {
        const response = await fetch(
          `https://kofgo-consulting.com/api/admin/appointments.php?id=${id}`,
          { method: "DELETE" }
        );

        if (!response.ok) throw new Error("Échec de la suppression");

        setAppointments(
          appointments.filter((appointment) => appointment.id !== id)
        );
        toast.success("Rendez-vous supprimé avec succès");
      } catch (err) {
        toast.error("Erreur lors de la suppression du rendez-vous");
      }
    }
  };

  // Ajoutez cette fonction de filtrage
  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.date_time.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteRealisation = async (id) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cette réalisation ?")
    ) {
      try {
        const response = await fetch(
          `https://kofgo-consulting.com/api/admin/realisations.php?id=${id}`,
          { method: "DELETE" }
        );

        if (!response.ok) throw new Error("Échec de la suppression");

        setRealisations(
          realisations.filter((realisation) => realisation.id !== id)
        );
        toast.success("Réalisation supprimée avec succès");
      } catch (err) {
        toast.error("Erreur lors de la suppression de la réalisation");
      }
    }
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.objectif.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.besoin &&
        project.besoin.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredBlogPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.excerpt &&
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (post.author &&
        post.author.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("adminEmail");
    if (email) {
      setAdminEmail(email);
    }
  }, []);

  const [admins, setAdmins] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  // Charger la liste des admins au chargement
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        "https://kofgo-consulting.com/api/admin/list.php"
      ); // API qui retourne la liste des admins
      if (!res.ok)
        throw new Error("Erreur lors du chargement des administrateurs");
      const data = await res.json();
      setAdmins(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async () => {
    if (!email || !password) {
      setError("Email et mot de passe sont obligatoires");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await fetch(
        "https://kofgo-consulting.com/api/admin/add.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Erreur lors de l'ajout");
      }
      setSuccessMsg("Administrateur ajouté avec succès !");
      setEmail("");
      setPassword("");
      fetchAdmins(); // rafraîchir la liste
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (id) => {
    try {
      const response = await fetch(
        "https://kofgo-consulting.com/api/admin/delete.php",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      toast.success("Administrateur supprimé");
      fetchAdmins(); // rafraîchir la liste
    } catch (error) {
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Luxe */}
      <div className="w-80 bg-gradient-to-br from-emerald-900/80 via-gray-900 to-teal-900/80 text-white shadow-2xl transition-all duration-500 hover:shadow-3xl relative overflow-hidden">
        {/* Effet de lumière subtile */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>

        {/* Logo avec effet neon */}
        <div className="p-6 flex items-center justify-center border-b border-gray-700 relative">
          <div className="absolute inset-0 bg-blue-500 opacity-10 blur-xl"></div>
          <img
            src="https://kofgo-consulting.com/kofgologo.png"
            alt="Consulting Logo"
            className="h-16 filter brightness-0 invert drop-shadow-lg"
          />
          <span className="ml-3 text-2xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 animate-text-shimmer">
            KOFGO CONSULTING
          </span>
        </div>

        <div className="p-6 flex items-center space-x-4 border-b border-gray-700 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-xl ring-2 ring-white/20 ring-offset-2 ring-offset-gray-800 transform group-hover:scale-105 transition-transform">
            <User size={24} className="text-white/90" />
          </div>
          <div>
            <p className="font-medium text-lg">{adminEmail || "Utilisateur"}</p>
            <p className="text-xs text-blue-300/80 font-light">
              Administrateur connecté
            </p>
          </div>
        </div>

        {/* Navigation avec effets lumineux */}
        <nav className="p-4 space-y-2 relative z-10">
          <SidebarItem
            icon={
              <PieChart
                size={20}
                className="text-blue-400 group-hover:text-white transition-colors"
              />
            }
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
            glowColor="blue"
          >
            Tableau de bord
          </SidebarItem>

          <SidebarItem
            icon={
              <Briefcase
                size={20}
                className="text-purple-400 group-hover:text-white transition-colors"
              />
            }
            active={activeTab === "projects"}
            onClick={() => setActiveTab("projects")}
            glowColor="purple"
          >
            Projets clients
          </SidebarItem>

          <SidebarItem
            icon={
              <FileText
                size={20}
                className="text-emerald-400 group-hover:text-white transition-colors"
              />
            }
            active={activeTab === "blog"}
            onClick={() => setActiveTab("blog")}
            glowColor="emerald"
          >
            Blog & Publications
          </SidebarItem>

          <SidebarItem
            icon={
              <Award
                size={20}
                className="text-amber-400 group-hover:text-white transition-colors"
              />
            }
            active={activeTab === "achievements"}
            onClick={() => setActiveTab("achievements")}
            glowColor="amber"
          >
            Nos Réalisations
          </SidebarItem>

          <SidebarItem
            icon={
              <Calendar
                size={20}
                className="text-rose-400 group-hover:text-white transition-colors"
              />
            }
            active={activeTab === "appointments"}
            onClick={() => setActiveTab("appointments")}
            glowColor="rose"
          >
            Rendez-vous
          </SidebarItem>

          {/* Onglet Ajout Administrateur uniquement pour admin@gmail.com */}
          {adminEmail === "admin@gmail.com" && (
            <SidebarItem
              icon={
                <UserPlus
                  size={20}
                  className="text-pink-400 group-hover:text-white transition-colors"
                />
              }
              active={activeTab === "addAdmin"}
              onClick={() => setActiveTab("addAdmin")}
              glowColor="pink"
            >
              Ajouter un administrateur
            </SidebarItem>
          )}
        </nav>

        {/* Déconnexion avec effet de profondeur */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700/50 bg-gradient-to-t from-gray-800/50 to-transparent">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-rose-600 to-rose-800 text-white rounded-xl hover:from-rose-700 hover:to-rose-900 transition-all duration-300 shadow-lg hover:shadow-rose-500/20 transform hover:-translate-y-0.5"
          >
            <LogOut
              size={18}
              className="transform group-hover:rotate-180 transition-transform"
            />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Main Content Luxe */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Top Navigation Luxe */}
        <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200/70">
          <div className="flex items-center justify-between px-8 py-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {activeTab === "dashboard" && (
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Tableau de bord
                </span>
              )}
              {activeTab === "projects" && (
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Gestion des projets
                </span>
              )}
              {activeTab === "blog" && (
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Gestion du blog
                </span>
              )}
              {activeTab === "achievements" && (
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Nos réalisations
                </span>
              )}
              {activeTab === "appointments" && (
                <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  Calendrier des rendez-vous
                </span>
              )}
            </h1>

            <div className="flex items-center space-x-6">
              {/* Barre de recherche avec effet de verre */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400/80" />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="block w-full pl-10 pr-4 py-2.5 border border-gray-300/70 rounded-xl leading-5 bg-white/70 backdrop-blur-sm placeholder-gray-500/70 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30 sm:text-sm transition-all duration-300 shadow-sm hover:shadow-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content Luxe */}
        <main className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-gray-50/50 via-white to-gray-100/50">
          {/* Dashboard Overview */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Cartes de statistiques avec effets 3D */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Realisations"
                  value={stats.realisations.count}
                  change={stats.realisations.change}
                  icon={<CheckCircle className="text-blue-500" size={24} />}
                  gradient="from-blue-50/80 to-blue-100/80"
                  borderColor="border-blue-200/70"
                  hoverEffect="hover:shadow-blue-500/20 hover:-translate-y-1"
                />
                <StatCard
                  title="Rendez-vous"
                  value={stats.appointments.count}
                  change={stats.appointments.change}
                  icon={
                    <CalendarCheck className="text-emerald-500" size={24} />
                  }
                  gradient="from-emerald-50/80 to-emerald-100/80"
                  borderColor="border-emerald-200/70"
                  hoverEffect="hover:shadow-emerald-500/20 hover:-translate-y-1"
                />
                <StatCard
                  title="Projets clients"
                  value={stats.projects.count}
                  change={stats.projects.change}
                  icon={<FolderKanban className="text-purple-500" size={24} />}
                  gradient="from-purple-50/80 to-purple-100/80"
                  borderColor="border-purple-200/70"
                  hoverEffect="hover:shadow-purple-500/20 hover:-translate-y-1"
                />
                <StatCard
                  title="Blog & Publications"
                  value={stats.blogPosts.count}
                  change={stats.blogPosts.change}
                  icon={<PenLine className="text-amber-500" size={24} />}
                  gradient="from-amber-50/80 to-amber-100/80"
                  borderColor="border-amber-200/70"
                  hoverEffect="hover:shadow-amber-500/20 hover:-translate-y-1"
                />
              </div>

              {/* Graphique avec effet de verre */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-200/50 col-span-2 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <h3 className="font-semibold text-lg text-gray-800">
                      Performance Globale
                    </h3>
                    <select className="text-sm border border-gray-200/70 rounded-xl px-3 py-1.5 bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/30 focus:border-transparent shadow-sm">
                      <option>12 derniers mois</option>
                      <option>6 derniers mois</option>
                      <option>3 derniers mois</option>
                    </select>
                  </div>

                  {loading ? (
                    <div className="h-80 flex items-center justify-center text-gray-500">
                      Chargement...
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-6 relative z-10">
                      <StatBox
                        icon={<Folder className="text-blue-500" />}
                        title="Projets clients"
                        value={stats.projects.count}
                        change={stats.projects.change}
                      />
                      <StatBox
                        icon={<TrendingUp className="text-purple-500" />}
                        title="Réalisations"
                        value={stats.realisations.count}
                        change={stats.realisations.change}
                      />
                      <StatBox
                        icon={<Calendar className="text-pink-500" />}
                        title="Rendez-vous"
                        value={stats.appointments.count}
                        change={stats.appointments.change}
                      />
                      <StatBox
                        icon={<FileText className="text-emerald-500" />}
                        title="Articles de blog"
                        value={stats.blogPosts.count}
                        change={stats.blogPosts.change}
                      />
                    </div>
                  )}
                </div>

                {/* Liste projets avec effet de survol */}
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-200/50 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <h3 className="font-semibold text-lg text-gray-800">
                      Projets Récemment Ajoutés
                    </h3>
                    <button className="text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent hover:text-purple-700 transition-all">
                      Voir tout
                    </button>
                  </div>
                  <div className="space-y-4 relative z-10">
                    {projects.slice(0, 3).map((project) => (
                      <div
                        key={project.id}
                        className="border-b border-gray-100/70 pb-4 last:border-0 last:pb-0 group"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900 group-hover:text-purple-700 transition-colors">
                              {project.fullname}
                            </h4>
                            <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                              {project.objectif}
                            </p>
                          </div>
                          <span className="px-2.5 py-1 text-xs rounded-full bg-blue-100/80 text-blue-800 group-hover:bg-blue-200/70 transition-colors">
                            Réception
                          </span>
                        </div>
                        <div className="mt-2 flex justify-between text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                          <span>Date: {project.created_at}</span>
                          <span>{project.email}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grille inférieure */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Articles avec effet de lumière */}
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-200/50 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <h3 className="font-semibold text-lg text-gray-800">
                      Articles Récents
                    </h3>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl hover:from-blue-700 hover:to-blue-900 flex items-center shadow-md"
                    >
                      <Plus size={16} className="inline mr-1" />
                      Nouvel article
                    </button>
                  </div>
                  <div className="space-y-4 relative z-10">
                    {blogPosts.slice(0, 3).map((post) => (
                      <div
                        key={post.id}
                        className="border-b border-gray-100/70 pb-4 last:border-0 last:pb-0 group hover:bg-gray-50/50 -mx-2 px-2 py-1 rounded-lg transition-all duration-300"
                      >
                        <div className="flex justify-between">
                          <h4 className="font-medium text-gray-900 group-hover:text-emerald-700 transition-colors">
                            {post.title}
                          </h4>
                          <span
                            className={`px-2.5 py-1 text-xs rounded-full ${
                              post.status === "Publié"
                                ? "bg-emerald-100/80 text-emerald-800"
                                : "bg-gray-100/80 text-gray-800"
                            }`}
                          >
                            {post.author}
                          </span>
                        </div>
                        <div className="mt-1 flex justify-between text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                          <span>Par {post.author}</span>
                          <span>
                            {new Date(post.published_at).toLocaleDateString(
                              "fr-FR"
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rendez-vous avec effet de profondeur */}
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-200/50 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-pink-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <h3 className="font-semibold text-lg text-gray-800">
                      Rendez-vous à Venir
                    </h3>
                    <button className="text-sm font-medium bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent hover:text-rose-700 transition-all">
                      Voir tout
                    </button>
                  </div>
                  <div className="space-y-4 relative z-10">
                    {appointments.slice(0, 3).map((appointment) => (
                      <div
                        key={appointment.id}
                        className="border-b border-gray-100/70 pb-4 last:border-0 last:pb-0 group hover:bg-gray-50/50 -mx-2 px-2 py-1 rounded-lg transition-all duration-300"
                      >
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900 group-hover:text-rose-700 transition-colors">
                              {appointment.client}
                            </h4>
                            <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                              {appointment.subject}
                            </p>
                          </div>
                          <span className="px-2.5 py-1 text-xs rounded-full bg-green-100/80 text-green-800 group-hover:bg-blue-200/70 transition-colors">
                            Réception
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-500 group-hover:text-gray-600 transition-colors flex items-center">
                          <Clock
                            size={14}
                            className="mr-1.5 text-rose-400/80"
                          />
                          {appointment.date_time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Projects Management Redesign */}
          {activeTab === "projects" && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-semibold text-gray-800">
                  Gestion des Projets Clients
                </h2>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 flex items-center">
                    <FileText size={16} className="mr-2" />
                    Exporter (PDF)
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div className="relative w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Rechercher un projet..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="flex space-x-3">
                    <select className="border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Tous les statuts</option>
                      <option>En cours</option>
                      <option>Terminé</option>
                      <option>En revue</option>
                    </select>
                    <select className="border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Trier par</option>
                      <option>Date récente</option>
                      <option>Date ancienne</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Projet
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date création
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {isLoading ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-8 text-center">
                            <div className="flex flex-col items-center justify-center space-y-3">
                              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                              <p className="text-gray-500">
                                Chargement des projets...
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 text-center">
                            <div className="bg-red-50 border-l-4 border-red-500 p-4">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <AlertCircle className="h-5 w-5 text-red-500" />
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm text-red-700">
                                    {error}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : filteredProjects.length > 0 ? (
                        filteredProjects.map((project) => (
                          <tr
                            key={project.id}
                            className="hover:bg-gray-50 transition"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <User className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                  <div className="font-medium text-gray-900">
                                    {project.fullname}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {project.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-gray-900 font-medium">
                                {project.objectif}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-500 line-clamp-2">
                                {project.description}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                              {project.created_at}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                Reception
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                  className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                                  onClick={() =>
                                    handleDeleteProject(project.id)
                                  }
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-6 py-8 text-center">
                            <div className="flex flex-col items-center justify-center space-y-2">
                              <Briefcase className="h-10 w-10 text-gray-400" />
                              <p className="text-gray-500">
                                Aucun projet trouvé
                              </p>
                              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                Ajouter un nouveau projet
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Affichage <span className="font-medium">1</span> à{" "}
                    <span className="font-medium">
                      {filteredProjects.length}
                    </span>{" "}
                    sur <span className="font-medium">{projects.length}</span>{" "}
                    projets
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 disabled:opacity-50"
                      disabled
                    >
                      Précédent
                    </button>
                    <button
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 disabled:opacity-50"
                      disabled
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Blog Management */}
          {activeTab === "blog" && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  Gestion du Blog
                </h2>
                <button
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl hover:from-blue-700 hover:to-blue-900 flex items-center shadow-md"
                  onClick={() => setShowAddModal(true)}
                >
                  <Plus size={18} className="mr-2" />
                  Nouvel Article
                </button>
              </div>

              <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div className="relative w-64">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="Rechercher un article..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <select className="border rounded-lg px-3 py-2 text-sm bg-gray-50">
                      <option>Tous les statuts</option>
                      <option>Publié</option>
                      <option>Brouillon</option>
                    </select>
                    <select className="border rounded-lg px-3 py-2 text-sm bg-gray-50">
                      <option>Trier par</option>
                      <option>Date récente</option>
                      <option>Date ancienne</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Titre
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Auteur
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Catégorie
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Image
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {isLoading ? (
                        <tr>
                          <td colSpan="7" className="px-6 py-4 text-center">
                            <div className="flex justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                          </td>
                        </tr>
                      ) : error ? (
                        <tr>
                          <td
                            colSpan="7"
                            className="px-6 py-4 text-center text-red-500"
                          >
                            {error}
                          </td>
                        </tr>
                      ) : filteredBlogPosts.length > 0 ? (
                        filteredBlogPosts.map((post) => (
                          <tr key={post.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="font-medium text-gray-900">
                                {post.title}
                              </div>
                              <div className="text-sm text-gray-500 line-clamp-2">
                                {post.excerpt}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                              {post.author}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                              <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                                {post.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                              {new Date(post.published_at).toLocaleDateString(
                                "fr-FR"
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {post.image_url && (
                                <div className="w-16 h-16 rounded-md overflow-hidden border">
                                  <img
                                    src={`https://kofgo-consulting.com/${post.image_url}`}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  post.published_at &&
                                  new Date(post.published_at) <= new Date()
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {post.published_at &&
                                new Date(post.published_at) <= new Date()
                                  ? "Publié"
                                  : "Brouillon"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                className="text-blue-600 hover:text-blue-900 mr-3"
                                onClick={() => openEditModal(post)}
                              >
                                <Edit size={16} />
                              </button>

                              <button
                                className="text-red-600 hover:text-red-900"
                                onClick={() => handleDeletePost(post.id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="7"
                            className="px-6 py-4 text-center text-gray-500"
                          >
                            Aucun article trouvé
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Affichage <span className="font-medium">1</span> à{" "}
                    <span className="font-medium">
                      {filteredBlogPosts.length}
                    </span>{" "}
                    sur <span className="font-medium">{blogPosts.length}</span>{" "}
                    articles
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                      disabled
                    >
                      Précédent
                    </button>
                    <button
                      className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                      disabled
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showAddModal && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-xl relative">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {isEditing
                    ? "Modifier l'article"
                    : "Ajouter un nouvel article"}
                </h3>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Titre"
                    value={newPost.title}
                    onChange={(e) =>
                      setNewPost({ ...newPost, title: e.target.value })
                    }
                    className="w-full border rounded p-2"
                  />

                  <div className="max-h-[300px] overflow-auto border rounded-md">
                    <ReactQuill
                      theme="snow"
                      value={newPost.content}
                      onChange={(value) => {
                        const plainText = convert(value, {
                          wordwrap: false,
                          preserveNewlines: false,
                        });
                        setNewPost((prev) => ({
                          ...prev,
                          content: value,
                          excerpt:
                            plainText.slice(0, 100) +
                            (plainText.length > 100 ? "..." : ""),
                        }));
                      }}
                      modules={quillModules}
                      formats={quillFormats}
                      className="react-quill-editor"
                    />
                  </div>

                  {/* Catégories dynamiques */}
                  <select
                    value={newPost.category}
                    onChange={(e) =>
                      setNewPost({
                        ...newPost,
                        category: e.target.value, // reste string
                      })
                    }
                    className="w-full border rounded p-2"
                  >
                    <option value="">-- Choisir une catégorie --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Auteur"
                    value={newPost.author}
                    onChange={(e) =>
                      setNewPost({ ...newPost, author: e.target.value })
                    }
                    className="w-full border rounded p-2"
                  />

                  <input
                    type="datetime-local"
                    value={newPost.published_at}
                    onChange={(e) =>
                      setNewPost({ ...newPost, published_at: e.target.value })
                    }
                    className="w-full border rounded p-2"
                  />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setNewPost({ ...newPost, image: e.target.files[0] })
                    }
                    className="w-full"
                  />
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setIsEditing(false);
                      setEditingPostId(null);
                      setNewPost({
                        title: "",
                        content: "",
                        excerpt: "",
                        category: "",
                        author: "",
                        published_at: "",
                        image: null,
                      });
                    }}
                    className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={isEditing ? handleUpdatePost : handleSubmitNewPost}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {isEditing ? "Mettre à jour" : "Publier"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Achievements Management Redesign */}
          {activeTab === "achievements" && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-semibold text-gray-800">
                  Nos Réalisations
                </h2>
                <button
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl hover:from-blue-700 hover:to-blue-900 flex items-center shadow-md"
                  onClick={() => setShowAddRealisationModal(true)}
                >
                  <Plus size={16} className="mr-2" />
                  Ajouter une Réalisation
                </button>
              </div>

              <div className="p-6">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {realisations.map((realisation) => (
                      <div
                        key={realisation.id}
                        className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300"
                      >
                        <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden relative">
                          {realisation.image_url ? (
                            <img
                              src={`https://kofgo-consulting.com/${realisation.image_url}`}
                              alt={realisation.title}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                          ) : (
                            <Image className="text-gray-400" size={40} />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="font-semibold text-lg text-white">
                              {realisation.title}
                            </h3>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {realisation.subtitle ||
                              "Aucune description disponible"}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              Ajouté le {realisation.created_at}
                            </span>
                            <div className="flex space-x-2">
                              <button
                                className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                                onClick={() =>
                                  handleEditRealisation(realisation)
                                }
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                                onClick={() =>
                                  handleDeleteRealisation(realisation.id)
                                }
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {showAddRealisationModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-xl shadow-xl relative">
                <button
                  onClick={() => {
                    setShowAddRealisationModal(false);
                    setIsEditing(false);
                    setEditingRealisationId(null);
                  }}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                >
                  ✕
                </button>

                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {isEditing
                    ? "Modifier la Réalisation"
                    : "Nouvelle Réalisation"}
                </h2>

                <div className="space-y-4">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Titre"
                    value={newRealisation.title}
                    onChange={(e) =>
                      setNewRealisation({
                        ...newRealisation,
                        title: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Sous-titre"
                    value={newRealisation.subtitle}
                    onChange={(e) =>
                      setNewRealisation({
                        ...newRealisation,
                        subtitle: e.target.value,
                      })
                    }
                  />
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={newRealisation.category}
                    onChange={(e) =>
                      setNewRealisation({
                        ...newRealisation,
                        category: e.target.value,
                      })
                    }
                  >
                    <option value="">-- Sélectionner une catégorie --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setNewRealisation({
                        ...newRealisation,
                        image: e.target.files[0],
                      })
                    }
                  />
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg"
                    onClick={() => {
                      setShowAddRealisationModal(false);
                      setIsEditing(false);
                      setEditingRealisationId(null);
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    onClick={
                      isEditing
                        ? handleUpdateRealisation
                        : handleSubmitNewRealisation
                    }
                  >
                    {isEditing ? "Modifier" : "Enregistrer"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Appointments Management Redesign */}
          {activeTab === "appointments" && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-semibold text-gray-800">
                  Calendrier des Rendez-vous
                </h2>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl hover:from-blue-700 hover:to-blue-900 flex items-center shadow-md">
                  <Plus size={16} className="mr-2" />
                  Nouveau RDV
                </button>
              </div>

              <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div className="relative w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Rechercher un RDV..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="flex space-x-3">
                    <select className="border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Tous les statuts</option>
                      <option>Confirmé</option>
                      <option>En attente</option>
                      <option>Annulé</option>
                    </select>
                    <select className="border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Trier par</option>
                      <option>Date récente</option>
                      <option>Date ancienne</option>
                    </select>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Client
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Sujet
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date & Heure
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Statut
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAppointments.map((appointment) => (
                          <tr
                            key={appointment.id}
                            className="hover:bg-gray-50 transition"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <User className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                  <div className="font-medium text-gray-900">
                                    {appointment.client}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {appointment.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-gray-500">
                                {appointment.subject}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                              {appointment.date_time}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  appointment.status === "Confirmé"
                                    ? "bg-green-100 text-green-800"
                                    : appointment.status === "Annulé"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {appointment.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                  className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                                  onClick={() =>
                                    handleDeleteAppointment(appointment.id)
                                  }
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "addAdmin" && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-semibold text-gray-800">
                  Ajouter un administrateur
                </h2>
                <button
                  onClick={handleAddAdmin}
                  disabled={loading}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl hover:from-blue-700 hover:to-blue-900 flex items-center shadow-md disabled:opacity-50"
                >
                  <Plus size={16} className="mr-2" />
                  Ajouter
                </button>
              </div>

              {/* Formulaire */}
              <div className="p-6 space-y-4">
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  </div>
                )}
                {successMsg && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-4">
                    <p className="text-green-700 text-sm">{successMsg}</p>
                  </div>
                )}

                <input
                  type="email"
                  placeholder="Email administrateur"
                  className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
                <input
                  type="password"
                  placeholder="Mot de passe"
                  className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Liste des admins */}
              <div className="p-6">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {admins.map((admin) => (
                        <tr
                          key={admin.id}
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                            {admin.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                              onClick={() => handleDeleteAdmin(admin.id)}
                              disabled={loading}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {admins.length === 0 && (
                        <tr>
                          <td
                            colSpan={2}
                            className="px-6 py-4 text-center text-gray-500"
                          >
                            Aucun administrateur trouvé
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* Clients Management */}
          {activeTab === "clients" && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  Base Clients
                </h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
                  <Plus size={18} className="mr-2" />
                  Nouveau Client
                </button>
              </div>

              <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div className="relative w-64">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="Rechercher un client..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <select className="border rounded-lg px-3 py-2 text-sm bg-gray-50">
                      <option>Trier par</option>
                      <option>Nom A-Z</option>
                      <option>Nom Z-A</option>
                      <option>Projets croissants</option>
                      <option>Projets décroissants</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Projets
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dernier Contact
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {clients.map((client) => (
                        <tr key={client.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">
                              {client.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            {client.contact}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            {client.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            {client.projects}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            {client.lastContact}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">
                              <Edit size={16} />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleDelete("client", client.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Composants personnalisés
function SidebarItem({ icon, children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
        active
          ? "bg-blue-700 text-white shadow-md"
          : "text-blue-100 hover:bg-blue-700 hover:bg-opacity-30 hover:text-white"
      }`}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span>{children}</span>
    </button>
  );
}

function StatCard({ title, value, change, icon }) {
  const isPositive = change.startsWith("+");

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="p-2 rounded-lg bg-gray-100 text-gray-600">{icon}</div>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <span className="text-2xl font-bold text-gray-800">{value}</span>
        <span
          className={`text-sm flex items-center ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          {change}
        </span>
      </div>
    </div>
  );
}

function StatBox({ icon, title, value, change }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4 flex items-center space-x-4 hover:shadow-md transition">
      <div className="p-2 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-500">{title}</p>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-gray-800">{value}</span>
          <span className="text-sm text-green-600">{change}</span>
        </div>
      </div>
    </div>
  );
}
