import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState(""); // <-- état pour message d'erreur visible
  const navigate = useNavigate();
  const { hash } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // reset avant nouvelle tentative

    console.log("Données envoyées au backend :", credentials);

    try {
      const response = await fetch(
        "https://kofgo-consulting.com/api/admin/login.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Email ou mot de passe incorrect");
        toast.error(data.message || "Email ou mot de passe incorrect");
        throw new Error(data.message || "Erreur de connexion");
      }

      // Stocke l'email
      localStorage.setItem("adminEmail", data.email);

      localStorage.setItem("adminToken", data.token);
      document.cookie = `adminToken=${data.token}; path=/; secure; samesite=strict`;

      toast.success("Connexion réussie");
      navigate(`/admin/${hash}`);
    } catch (error) {
      console.error("Erreur connexion admin :", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900/80 via-gray-900 to-teal-900/80 flex items-center justify-center">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl p-10 w-full max-w-md text-white relative">
        <div className="absolute top-4 right-4 text-xs text-gray-300">
          Kof Go Accesss
        </div>
        <h2 className="text-3xl font-extrabold text-center mb-6 text-white drop-shadow">
          Connexion administrateur
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-200"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 w-full px-4 py-2 bg-white/10 text-white border border-gray-500 rounded-md placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin@example.com"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-200"
              >
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 w-full px-4 py-2 bg-white/10 text-white border border-gray-500 rounded-md placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
              />
            </div>
          </div>

          {/* Message d'erreur affiché sous le formulaire */}
          {errorMessage && (
            <p className="text-red-500 text-center font-medium mt-2">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 px-6 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-md"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
