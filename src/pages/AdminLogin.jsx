import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { authService } from "../api/authService";

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      // 1. Appel au backend Laravel via Axios
      const data = await authService.login(credentials);

      // 2. Vérification du rôle
      if (data.user.role !== 'admin') {
        setErrorMessage("Accès refusé : Vous n'êtes pas administrateur.");
        toast.error("Accès non autorisé");
        // Déconnecter immédiatement si le rôle n'est pas bon
        localStorage.clear(); 
        return;
      }

      toast.success("Connexion réussie");
      
      // 3. Redirection vers le dashboard admin propre
      navigate("/admin/dashboard");

    } catch (error) {
      console.error("Erreur connexion admin :", error);
      
      // Gestion des erreurs Axios
      const message = error.response?.data?.message || "Identifiants incorrects";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900/80 via-gray-900 to-teal-900/80 flex items-center justify-center">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-10 w-full max-w-md text-white relative">
        <div className="absolute top-4 right-4 text-xs text-gray-300">
          MeetMed Admin Access
        </div>
        
        <h2 className="text-3xl font-extrabold text-center mb-6 text-white drop-shadow">
          Portail Administrateur
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                Email Professionnel
              </label>
              <input
                id="email"
                type="email"
                required
                disabled={isLoading}
                className="mt-1 w-full px-4 py-2 bg-white/10 text-white border border-gray-500 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                placeholder="admin@meetmed.com"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="password" title="Mot de passe" className="block text-sm font-medium text-gray-200">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                disabled={isLoading}
                className="mt-1 w-full px-4 py-2 bg-white/10 text-white border border-gray-500 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                placeholder="••••••••"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
            </div>
          </div>

          {errorMessage && (
            <p className="text-red-400 text-sm text-center font-medium bg-red-900/20 py-2 rounded">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-md disabled:grayscale disabled:cursor-not-allowed"
          >
            {isLoading ? "Vérification..." : "Entrer dans l'espace Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}