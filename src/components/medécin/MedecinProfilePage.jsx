import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Calendar,
  MessageCircle,
  Star,
  MapPin,
  Award,
  Stethoscope,
  Shield,
  ArrowLeft,
  CheckCircle,
  Phone,
  Mail,
  Heart,
  Share2,
  Sparkles,
  Users,
  TrendingUp,
  AlertCircle,
  FileText,
  GraduationCap,
  Briefcase,
  Languages,
  Building2,
  User,
  Navigation,
  ThumbsUp,
  MessageSquare,
  LogIn,
  Clock,
  XCircle,
  Loader2,
  Globe,
  ShieldCheck,
} from "lucide-react";
import api from "@/api/axios";
import SafeAvatar from "@/components/common/SafeAvatar";
import { AuthContext } from "@/context/AuthContext";

// Composants optimisés
const StarRating = React.memo(
  ({ rating, onRatingChange, readonly = false, size = "md" }) => {
    const starSize = size === "lg" ? "w-8 h-8" : "w-6 h-6";

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onRatingChange(star)}
            className={`${
              readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
            } transition-transform`}
            disabled={readonly}
          >
            <Star
              className={`${starSize} ${
                star <= rating
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  }
);
StarRating.displayName = "StarRating";

const AvailabilityBadge = React.memo(({ availability }) => {
  const getStatusConfig = () => {
    switch (availability.status) {
      case "available":
        return {
          icon: CheckCircle,
          color: "text-green-400",
          bgColor: "bg-green-500/20",
          borderColor: "border-green-400/30",
          text: "Disponible",
        };
      case "later_today":
        return {
          icon: Clock,
          color: "text-amber-400",
          bgColor: "bg-amber-500/20",
          borderColor: "border-amber-400/30",
          text: "Plus tard",
        };
      case "next_day":
        return {
          icon: Calendar,
          color: "text-blue-400",
          bgColor: "bg-blue-500/20",
          borderColor: "border-blue-400/30",
          text: "Demain",
        };
      case "loading":
        return {
          icon: Loader2,
          color: "text-gray-400",
          bgColor: "bg-gray-500/20",
          borderColor: "border-gray-400/30",
          text: "Chargement...",
        };
      default:
        return {
          icon: XCircle,
          color: "text-red-400",
          bgColor: "bg-red-500/20",
          borderColor: "border-red-400/30",
          text: "Indisponible",
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div
      className={`bg-white/10 backdrop-blur-xl border ${statusConfig.borderColor} rounded-2xl p-4 hover:scale-105 transition-transform duration-200 cursor-help`}
      title={availability.message}
    >
      <div className="flex items-center gap-2 mb-2">
        <StatusIcon
          className={`w-5 h-5 ${statusConfig.color} ${
            availability.status === "loading" ? "animate-spin" : ""
          }`}
        />
        <span className="text-2xl font-bold text-white">
          {statusConfig.text}
        </span>
      </div>
      <p
        className="text-sm text-slate-300 truncate"
        title={availability.message}
      >
        {availability.message}
      </p>
    </div>
  );
});
AvailabilityBadge.displayName = "AvailabilityBadge";

// Composants de contenu des onglets
const AproposContent = React.memo(({ medecinData }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500" />
      <div className="p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
          <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
          À propos du Dr. {medecinData.prenom}
        </h2>
        <p className="text-slate-700 leading-relaxed mb-6">
          {medecinData.bio || "Aucune biographie disponible pour ce médecin."}
        </p>
        <div className="flex flex-wrap gap-3">
          <Badge className="bg-blue-100 text-blue-700 border-0 px-4 py-2">
            {medecinData.experience_years || medecinData.annees_experience
              ? `${
                  medecinData.experience_years || medecinData.annees_experience
                }+ ans d'expérience`
              : "Expérience non spécifiée"}
          </Badge>
          {medecinData.education && (
            <Badge className="bg-purple-100 text-purple-700 border-0 px-4 py-2">
              <Award className="w-4 h-4 mr-2" />
              {medecinData.education}
            </Badge>
          )}
        </div>
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500" />
      <div className="p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
          <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
          Spécialités et Domaines d'Expertise
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-800">
              Spécialités principales
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-blue-50 text-blue-700 border border-blue-200">
                {medecinData.specialite}
              </Badge>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-800">Compétences</h3>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-amber-50 text-amber-700 border border-amber-200">
                Diagnostic avancé
              </Badge>
              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">
                Suivi personnalisé
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
));
AproposContent.displayName = "AproposContent";

const ParcoursContent = React.memo(({ medecinData }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500" />
      <div className="p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full" />
          Formation et Diplômes
        </h2>
        {medecinData.education ? (
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">
                  Formation principale
                </h3>
                <p className="text-slate-700">{medecinData.education}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-slate-500 italic text-center py-8">
            Aucune information de formation renseignée
          </p>
        )}
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500" />
      <div className="p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
          Certifications et Diplômes
        </h2>
        <div className="grid gap-4">
          <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">
                Diplômes universitaires
              </h3>
              <p className="text-slate-700">
                {medecinData.education || "Diplôme de médecine générale"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
));
ParcoursContent.displayName = "ParcoursContent";

const ExperienceContent = React.memo(({ medecinData }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500" />
      <div className="p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
          Expérience Professionnelle
        </h2>
        {medecinData.professional_background ? (
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">
                  Parcours professionnel
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  {medecinData.professional_background}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-slate-500 italic text-center py-8">
            Aucun parcours professionnel renseigné
          </p>
        )}
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500" />
      <div className="p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
          Compétences Techniques
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-800">
              Expertises médicales
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-blue-50 text-blue-700 border border-blue-200">
                Consultation générale
              </Badge>
              <Badge className="bg-green-50 text-green-700 border border-green-200">
                Diagnostic précoce
              </Badge>
              <Badge className="bg-purple-50 text-purple-700 border border-purple-200">
                Suivi patient
              </Badge>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-800">
              Techniques maîtrisées
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-amber-50 text-amber-700 border border-amber-200">
                Examen clinique
              </Badge>
              <Badge className="bg-red-50 text-red-700 border border-red-200">
                Urgence médicale
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
));
ExperienceContent.displayName = "ExperienceContent";

const AvisContent = ({
  reviewStats,
  reviews,
  user,
  role,
  navigate,
  id,
  showReviewForm,
  setShowReviewForm,
  rating,
  setRating,
  comment,
  setComment,
  reviewLoading,
  submitReview,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500" />
        <div className="p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
            Avis des Patients ({reviewStats?.total_reviews || 0})
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
              <h3 className="font-semibold text-slate-800 mb-4">
                Note moyenne
              </h3>
              <div className="flex items-center gap-6">
                <div className="text-5xl font-bold text-amber-600">
                  {reviewStats?.average_rating
                    ? parseFloat(reviewStats.average_rating).toFixed(1)
                    : "0.0"}
                </div>
                <div>
                  <StarRating
                    rating={Math.round(reviewStats?.average_rating || 0)}
                    readonly
                    size="lg"
                  />
                  <p className="text-slate-600 text-sm mt-2">
                    Sur {reviewStats?.total_reviews || 0} avis
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-4">
                Détail des notes
              </h3>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const keyMap = {
                    5: "five_stars",
                    4: "four_stars",
                    3: "three_stars",
                    2: "two_stars",
                    1: "one_stars",
                  };
                  const count = reviewStats?.[keyMap[stars]] || 0;
                  const totalReviews = reviewStats?.total_reviews || 0;
                  const percentage =
                    totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                  return (
                    <div key={stars} className="flex items-center gap-3 group">
                      <div className="flex items-center gap-2 w-20">
                        <span className="text-sm font-medium text-slate-700">
                          {stars}
                        </span>
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      </div>
                      <div className="flex-1 relative">
                        <div className="bg-slate-200 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-amber-400 to-amber-500 h-3 rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm text-slate-600 font-medium w-16 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>

              {reviewStats && (
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-slate-900">
                        {reviewStats.total_reviews || 0}
                      </div>
                      <div className="text-xs text-slate-500">Total avis</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-amber-600">
                        {reviewStats.average_rating
                          ? parseFloat(reviewStats.average_rating).toFixed(1)
                          : "0.0"}
                      </div>
                      <div className="text-xs text-slate-500">Moyenne</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {reviewStats.five_stars || 0}
                      </div>
                      <div className="text-xs text-slate-500">5 étoiles</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Formulaire d'avis */}
          {user && role === "patient" ? (
            <div className="mb-8">
              {!showReviewForm ? (
                <Button
                  onClick={() => setShowReviewForm(true)}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 rounded-xl px-6 py-3 shadow-lg shadow-amber-500/25"
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Laisser un avis
                </Button>
              ) : (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                  <h3 className="font-semibold text-slate-800 mb-4">
                    Votre avis
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Note *
                      </label>
                      <StarRating rating={rating} onRatingChange={setRating} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Commentaire (optionnel)
                      </label>
                      <Textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Partagez votre expérience avec ce médecin..."
                        className="min-h-[96px] resize-y"
                        maxLength={1000}
                      />
                      <div className="text-sm text-slate-500 text-right mt-1">
                        {comment.length}/1000
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={submitReview}
                        disabled={reviewLoading || rating === 0}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 disabled:opacity-50"
                      >
                        {reviewLoading ? "Envoi..." : "Publier l'avis"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowReviewForm(false)}
                        disabled={reviewLoading}
                        className="border-amber-300 text-amber-700 hover:bg-amber-50"
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="mb-8 text-center">
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
                <LogIn className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Connectez-vous pour laisser un avis
                </h3>
                <p className="text-slate-600 mb-4">
                  Vous devez être connecté en tant que patient pour partager
                  votre expérience.
                </p>
                <Button
                  onClick={() =>
                    navigate("/login", {
                      state: { from: `/profil-medecin/${id}`, role: "patient" },
                    })
                  }
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Se connecter
                </Button>
              </div>
            </div>
          )}

          {/* Liste des avis */}
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-amber-200 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-semibold">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          {review.patient?.prenom}{" "}
                          {review.patient?.nom?.charAt(0)}.
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <StarRating rating={review.rating} readonly />
                          <span className="text-sm text-slate-500">
                            {new Date(review.created_at).toLocaleDateString(
                              "fr-FR"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-slate-700 leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-dashed border-slate-300">
                <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Aucun avis pour le moment
                </h3>
                <p className="text-slate-600 mb-6">
                  Soyez le premier à partager votre expérience avec ce médecin.
                </p>
                {user && role === "patient" ? (
                  <Button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Laisser le premier avis
                  </Button>
                ) : (
                  <Button
                    onClick={() =>
                      navigate("/login", {
                        state: {
                          from: `/profil-medecin/${id}`,
                          role: "patient",
                        },
                      })
                    }
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Se connecter pour noter
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactContent = React.memo(({ medecinData }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />
      <div className="p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <div className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
          Informations de Contact
        </h2>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-lg">
              <MapPin className="w-5 h-5 text-emerald-600" />
              Localisation
            </h3>
            <div
              className="relative bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl border-2 border-emerald-300 overflow-hidden group cursor-pointer hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 aspect-video"
              onClick={() =>
                window.open(
                  `https://maps.google.com/?q=${medecinData.address}`,
                  "_blank"
                )
              }
            >
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:30px_30px]" />
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/90 to-teal-600/90" />
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="w-10 h-10 bg-white rounded-full border-4 border-emerald-500 shadow-2xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="absolute inset-0 w-10 h-10 bg-emerald-400 rounded-full animate-ping opacity-60" />
                </div>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              <div className="absolute top-6 left-6">
                <Badge className="bg-white/90 backdrop-blur-sm text-slate-700 border-0 px-3 py-2 font-medium shadow-lg">
                  <MapPin className="w-3 h-3 mr-1" />
                  {medecinData.address}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() =>
                  window.open(
                    `https://maps.google.com/?q=${medecinData.address}`,
                    "_blank"
                  )
                }
                className="h-11 bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 rounded-xl font-semibold shadow-lg shadow-emerald-500/25"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Voir la carte
              </Button>
              <Button
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${medecinData.address}`,
                    "_blank"
                  )
                }
                variant="outline"
                className="h-11 border-2 border-emerald-200 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 rounded-xl font-semibold"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Itinéraire
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800 text-lg">
              Coordonnées
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 hover:border-blue-300 transition-colors group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">Téléphone</p>
                  <p className="text-slate-700">
                    {medecinData.telephone || "Non renseigné"}
                  </p>
                  {medecinData.telephone && (
                    <Button
                      onClick={() =>
                        window.open(`tel:${medecinData.telephone}`)
                      }
                      size="sm"
                      className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
                    >
                      <Phone className="w-3 h-3 mr-1" />
                      Appeler
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:border-green-300 transition-colors group">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">Email</p>
                  <p className="text-slate-700">
                    {medecinData.email || "Non renseigné"}
                  </p>
                  {medecinData.email && (
                    <Button
                      onClick={() => window.open(`mailto:${medecinData.email}`)}
                      size="sm"
                      className="mt-2 bg-green-600 hover:bg-green-700 text-white text-xs h-8"
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      Envoyer
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200 hover:border-purple-300 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Languages className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 mb-2">
                    Langues parlées
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {medecinData.languages?.length > 0 ? (
                      medecinData.languages.map((lang, idx) => (
                        <Badge
                          key={idx}
                          className="bg-white/80 backdrop-blur-sm text-purple-700 border-purple-200 text-xs px-3 py-1 shadow-sm"
                        >
                          {lang}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-slate-500 text-sm">
                        Non renseignées
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500" />
      <div className="p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <div className="w-2 h-8 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full" />
          Informations Pratiques
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              Horaires de consultation
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                <span className="font-medium text-slate-700">
                  Lundi - Vendredi
                </span>
                <span className="text-slate-600">09:00 - 18:00</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                <span className="font-medium text-slate-700">Samedi</span>
                <span className="text-slate-600">09:00 - 12:00</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              Assurances acceptées
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-green-100 text-green-700 border-0">
                CNSS
              </Badge>
              <Badge className="bg-blue-100 text-blue-700 border-0">CNAS</Badge>
              <Badge className="bg-purple-100 text-purple-700 border-0">
                Mutuelle
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
));
ContactContent.displayName = "ContactContent";

// Composant principal optimisé
const MedecinProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role, token } = useContext(AuthContext);
  const { toast } = useToast();

  // États principaux
  const [medecin, setMedecin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("apropos");

  // États des fonctionnalités
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [rdvDate, setRdvDate] = useState("");
  const [rdvTime, setRdvTime] = useState("");
  const [consultationType, setConsultationType] = useState(
    "Consultation générale"
  );
  const [loadingRdv, setLoadingRdv] = useState(false);
  const [rdvMessage, setRdvMessage] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState("");

  const [availability, setAvailability] = useState({
    is_available: false,
    status: "loading",
    message: "Chargement...",
    next_available: null,
  });

  // Données mémoïsées
  const defaultMedecin = useMemo(
    () => ({
      titre: "Dr.",
      specialite: "Spécialité non spécifiée",
      address: "Adresse non spécifiée",
      education: "Diplôme non spécifié",
      bio: "Aucune biographie disponible",
      annees_experience: 0,
      languages: ["Français"],
      type: "independant",
    }),
    []
  );

  const medecinData = useMemo(() => {
    if (!medecin) return null;
    return {
      ...defaultMedecin,
      ...medecin,
      languages: Array.isArray(medecin.languages)
        ? medecin.languages
        : medecin.languages?.split(",").map((l) => l.trim()) || [],
    };
  }, [medecin, defaultMedecin]);

  const practiceInfo = useMemo(() => {
    if (medecinData?.type === "clinique" && medecinData?.clinique) {
      return {
        type: "clinique",
        label: `Clinique ${medecinData.clinique.nom}`,
        icon: Building2,
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-900",
      };
    }
    return {
      type: "independant",
      label: "Médecin indépendant",
      icon: User,
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-900",
    };
  }, [medecinData]);

  // Callbacks optimisés
  const checkAvailability = useCallback(async () => {
    try {
      const response = await api.get(`/medecins/${id}/availability`);
      setAvailability(response.data);
    } catch (error) {
      console.error("Erreur vérification disponibilité:", error);
      setAvailability({
        is_available: false,
        status: "error",
        message: "Indisponible",
        next_available: null,
      });
    }
  }, [id]);

  const toggleFavorite = useCallback(async () => {
    if (!user || role !== "patient") {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté en tant que patient pour ajouter aux favoris",
        variant: "default",
      });
      navigate("/login", {
        state: { from: `/profil-medecin/${id}`, role: "patient" },
      });
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFavorite(false);
        toast({
          title: "Retiré des favoris",
          description: "Le médecin a été retiré de vos favoris",
          variant: "default",
        });
      } else {
        await api.post(
          `/favorites/${id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsFavorite(true);
        toast({
          title: "Ajouté aux favoris",
          description: "Le médecin a été ajouté à vos favoris",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la gestion des favoris:", error);
      if (error.response?.status === 401) {
        toast({
          title: "Session expirée",
          description: "Veuillez vous reconnecter",
          variant: "destructive",
        });
        navigate("/login");
      } else {
        toast({
          title: "Erreur",
          description: "Erreur lors de la gestion des favoris",
          variant: "destructive",
        });
      }
    } finally {
      setFavoriteLoading(false);
    }
  }, [user, role, token, id, isFavorite, navigate, toast]);

  const checkFavoriteStatus = useCallback(async () => {
    if (!user || role !== "patient") {
      setIsFavorite(false);
      return;
    }
    try {
      const response = await api.get(`/favorites/check/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsFavorite(response.data.is_favorite);
    } catch (error) {
      console.error("Erreur vérification favoris:", error);
      setIsFavorite(false);
    }
  }, [user, role, token, id]);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await api.get(`/medecins/${id}/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error("Erreur chargement avis:", error);
    }
  }, [id]);

  const fetchReviewStats = useCallback(async () => {
    try {
      const response = await api.get(`/medecins/${id}/reviews/stats`);
      setReviewStats(response.data);
    } catch (error) {
      console.error("Erreur chargement stats:", error);
    }
  }, [id]);

  const submitReview = useCallback(async () => {
    if (!user || role !== "patient") {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté en tant que patient pour laisser un avis",
        variant: "default",
      });
      navigate("/login", {
        state: { from: `/profil-medecin/${id}`, role: "patient" },
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Note requise",
        description: "Veuillez sélectionner une note",
        variant: "default",
      });
      return;
    }

    setReviewLoading(true);
    try {
      await api.post(
        `/medecins/${id}/reviews`,
        { rating, comment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRating(0);
      setComment("");
      setShowReviewForm(false);
      await Promise.all([fetchReviews(), fetchReviewStats()]);
      
      toast({
        title: "Avis publié",
        description: "Votre avis a été ajouté avec succès",
        variant: "default",
      });
    } catch (error) {
      console.error("Erreur ajout avis:", error);
      if (error.response?.status === 401) {
        toast({
          title: "Session expirée",
          description: "Veuillez vous reconnecter",
          variant: "destructive",
        });
        navigate("/login");
      } else {
        toast({
          title: "Erreur",
          description: error.response?.data?.error || "Erreur lors de l'ajout de l'avis",
          variant: "destructive",
        });
      }
    } finally {
      setReviewLoading(false);
    }
  }, [
    user,
    role,
    token,
    id,
    rating,
    comment,
    navigate,
    fetchReviews,
    fetchReviewStats,
    toast
  ]);

  const handlePrendreRdv = useCallback(async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour prendre un rendez-vous",
        variant: "default",
      });
      navigate("/login", { state: { from: `/profil-medecin/${id}` } });
      return;
    }

    if (!rdvDate || !rdvTime) {
      setRdvMessage("Veuillez sélectionner une date et une heure");
      toast({
        title: "Informations manquantes",
        description: "Veuillez sélectionner une date et une heure",
        variant: "default",
      });
      return;
    }

    setLoadingRdv(true);
    setRdvMessage("");

    try {
      const response = await api.post(
        "/appointments",
        {
          medecin_id: medecinData.id,
          date: rdvDate,
          time: rdvTime,
          consultation_type: consultationType,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const successMessage = response.data.message || "Rendez-vous créé avec succès !";
      
      toast({
        title: "Rendez-vous confirmé",
        description: successMessage,
        variant: "default",
      });

      setRdvMessage(successMessage);
      setRdvDate("");
      setRdvTime("");
      setConsultationType("Consultation générale");
    } catch (error) {
      const errorData = error.response?.data;
      const errorMessage = errorData?.message || "Erreur lors de la prise de rendez-vous";
      
      toast({
        title: "Erreur de rendez-vous",
        description: errorMessage,
        variant: "destructive",
      });
      
      setRdvMessage(errorMessage);
    } finally {
      setLoadingRdv(false);
    }
  }, [
    user,
    token,
    id,
    rdvDate,
    rdvTime,
    consultationType,
    medecinData,
    navigate,
    toast
  ]);

  const handleShare = useCallback(async () => {
    const shareUrl = window.location.href;
    const shareText = `Découvrez le profil du Dr. ${medecinData.prenom} ${medecinData.nom} - ${medecinData.specialite}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Dr. ${medecinData.prenom} ${medecinData.nom}`,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        fallbackShare(shareUrl);
      }
    } else {
      fallbackShare(shareUrl);
    }
  }, [medecinData, toast]);

  const fallbackShare = (url) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast({
          title: "Lien copié",
          description: "Le lien a été copié dans le presse-papiers",
          variant: "default",
        });
      })
      .catch(() => {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        toast({
          title: "Lien copié",
          description: "Le lien a été copié dans le presse-papiers",
          variant: "default",
        });
      });
  };

  const handleSendMessage = useCallback(() => {
    if (!message.trim()) {
      toast({
        title: "Message vide",
        description: "Veuillez écrire un message avant d'envoyer",
        variant: "default",
      });
      return;
    }
    
    toast({
      title: "Message envoyé",
      description: `Votre message a été envoyé au Dr. ${medecinData.nom}`,
      variant: "default",
    });
    
    setMessage("");
    setChatOpen(false);
  }, [message, medecinData, toast]);

  // Effects
  useEffect(() => {
    const fetchMedecin = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/medecins/${id}`);
        setMedecin(response.data);
      } catch (err) {
        console.error("Erreur chargement médecin:", err);
        setError("Impossible de charger les informations du médecin");
      } finally {
        setLoading(false);
      }
    };
    fetchMedecin();
  }, [id]);

  useEffect(() => {
    if (medecinData) {
      checkAvailability();
      const interval = setInterval(checkAvailability, 60000);
      return () => clearInterval(interval);
    }
  }, [medecinData, checkAvailability]);

  useEffect(() => {
    if (medecinData) {
      fetchReviews();
      fetchReviewStats();
    }
  }, [medecinData, fetchReviews, fetchReviewStats]);

  useEffect(() => {
    if (medecinData && user) {
      checkFavoriteStatus();
    }
  }, [medecinData, user, checkFavoriteStatus]);

  // Composants d'interface
  const TabsNavigation = React.memo(() => (
    <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-2 mb-8">
      <div className="grid grid-cols-5 gap-2">
        {[
          { id: "apropos", label: "À Propos", icon: FileText },
          { id: "parcours", label: "Parcours", icon: GraduationCap },
          { id: "experience", label: "Expérience", icon: Briefcase },
          { id: "avis", label: "Avis", icon: ThumbsUp },
          { id: "contact", label: "Contact", icon: Languages },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                  : "text-slate-700 hover:bg-slate-100/50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  ));
  TabsNavigation.displayName = "TabsNavigation";

  const ChatBox = React.memo(() => {
    if (!chatOpen) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-6"
      >
        <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500" />
        <div className="p-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-slate-900">
              Message pour Dr. {medecinData.prenom} {medecinData.nom}
            </h3>
            <Button
              onClick={() => setChatOpen(false)}
              variant="ghost"
              size="sm"
              className="text-slate-500 hover:text-slate-700"
            >
              ✕
            </Button>
          </div>
          <textarea
            placeholder="Décrivez brièvement votre situation médicale..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 resize-none outline-none transition-all mb-4 h-32"
            rows={5}
          />
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => setChatOpen(false)}
              variant="outline"
              className="border-slate-300"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
              disabled={!message.trim()}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Envoyer
            </Button>
          </div>
        </div>
      </motion.div>
    );
  });
  ChatBox.displayName = "ChatBox";

  // Rendu conditionnel
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
        <div className="text-center p-12 bg-white rounded-2xl shadow-2xl max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center animate-pulse">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Chargement...
          </h2>
          <p className="text-slate-600">
            Récupération des informations du médecin
          </p>
        </div>
      </div>
    );
  }

  if (error || !medecinData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
        <div className="text-center p-12 bg-white rounded-2xl shadow-2xl max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-500 to-rose-500 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Médecin non trouvé
          </h2>
          <p className="text-slate-600 mb-6">
            {error || "Vérifiez l'URL ou retournez à la liste des médecins."}
          </p>
          <Button
            onClick={() => navigate("/trouver-medecin")}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  const PracticeIcon = practiceInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 pt-24 pb-24 mb-12">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-600/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        </div>

        <div className="container mx-auto px-6 pb-16 relative z-10">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="relative">
              <SafeAvatar
                src={medecinData?.photo_profil}
                alt={`Dr. ${medecinData?.prenom || ""} ${
                  medecinData?.nom || ""
                }`}
                size={160}
                initials={`${medecinData?.prenom?.charAt(0) ?? ""}${
                  medecinData?.nom?.charAt(0) ?? ""
                }`}
                className="rounded-3xl border-4 border-white shadow-2xl"
              />
              <div className="absolute -bottom-3 -right-3 w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center border-4 border-white shadow-xl">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-4">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-medium text-cyan-200">
                      Médecin vérifié
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                    Dr. {medecinData.prenom} {medecinData.nom}
                  </h1>
                  <p className="text-2xl text-cyan-300 font-semibold">
                    {medecinData.specialite}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={toggleFavorite}
                    disabled={!user || role !== "patient" || favoriteLoading}
                    className={`w-12 h-12 backdrop-blur-sm border rounded-xl flex items-center justify-center transition-all ${
                      isFavorite
                        ? "bg-red-500/20 border-red-400/30 text-red-400"
                        : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                    } ${
                      !user || role !== "patient" || favoriteLoading
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {favoriteLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Heart
                        className={`w-5 h-5 ${
                          isFavorite ? "fill-current" : ""
                        }`}
                      />
                    )}
                  </button>

                  <button
                    onClick={handleShare}
                    className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all"
                    title="Partager ce profil"
                  >
                    <Share2 className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <div
                className={`mb-6 ${practiceInfo.bgColor} border ${practiceInfo.borderColor} rounded-2xl p-4`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <PracticeIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className={`font-semibold ${practiceInfo.textColor}`}>
                      {practiceInfo.label}
                    </p>
                    {practiceInfo.type === "clinique" &&
                      medecinData.clinique && (
                        <p
                          className={`text-sm ${practiceInfo.textColor} opacity-80`}
                        >
                          {medecinData.clinique.address}
                        </p>
                      )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-2xl font-bold text-white">
                      {reviewStats?.average_rating
                        ? parseFloat(reviewStats.average_rating).toFixed(1)
                        : "0.0"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">
                    {reviewStats?.total_reviews || 0} avis
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-cyan-400" />
                    <span className="text-2xl font-bold text-white">
                      {medecinData.experience_years ||
                      medecinData.annees_experience > 0
                        ? `${
                            medecinData.experience_years ||
                            medecinData.annees_experience
                          }+`
                        : "Non spécifié"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">Années d'exp.</p>
                </div>
                <AvailabilityBadge availability={availability} />
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    <span className="text-2xl font-bold text-white">
                      {reviewStats?.average_rating
                        ? Math.min(
                            Math.round((reviewStats.average_rating / 5) * 100),
                            100
                          )
                        : "0"}
                      %
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-6 py-12 -mt-8 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TabsNavigation />
            <ChatBox />

            {/* Contenu des onglets */}
            {activeTab === "apropos" && (
              <AproposContent medecinData={medecinData} />
            )}
            {activeTab === "parcours" && (
              <ParcoursContent medecinData={medecinData} />
            )}
            {activeTab === "experience" && (
              <ExperienceContent medecinData={medecinData} />
            )}
            {activeTab === "avis" && (
              <AvisContent
                reviewStats={reviewStats}
                reviews={reviews}
                user={user}
                role={role}
                navigate={navigate}
                id={id}
                showReviewForm={showReviewForm}
                setShowReviewForm={setShowReviewForm}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                reviewLoading={reviewLoading}
                submitReview={submitReview}
              />
            )}
            {activeTab === "contact" && (
              <ContactContent medecinData={medecinData} />
            )}
          </div>

          {/* Sidebar RDV */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden sticky top-6">
              <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500" />
              <div className="p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-amber-600" />
                  Prendre rendez-vous
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Date *
                    </label>
                    <Input
                      type="date"
                      value={rdvDate}
                      onChange={(e) => setRdvDate(e.target.value)}
                      className="w-full h-12 rounded-xl border-2 border-slate-200 focus:border-blue-500"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Heure *
                    </label>
                    <Input
                      type="time"
                      value={rdvTime}
                      onChange={(e) => setRdvTime(e.target.value)}
                      className="w-full h-12 rounded-xl border-2 border-slate-200 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Motif *
                    </label>
                    <Input
                      value={consultationType}
                      onChange={(e) => setConsultationType(e.target.value)}
                      className="w-full h-12 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      placeholder="Décrivez le motif de votre consultation..."
                      required
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Ex: Consultation générale, Suivi de traitement, Bilan de
                      santé, Urgence, etc.
                    </p>
                  </div>
                  <Button
                    onClick={handlePrendreRdv}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 rounded-xl shadow-lg shadow-blue-500/25 font-semibold"
                    disabled={!rdvDate || !rdvTime || loadingRdv}
                  >
                    {loadingRdv ? (
                      "Chargement..."
                    ) : (
                      <>
                        <Calendar className="w-4 h-4 mr-2" />
                        Confirmer le rendez-vous
                      </>
                    )}
                  </Button>
                  {rdvMessage && (
                    <div
                      className={`p-4 rounded-xl ${
                        rdvMessage.toLowerCase().includes("erreur") ||
                        rdvMessage.toLowerCase().includes("indisponible")
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-green-50 text-green-700 border border-green-200"
                      }`}
                    >
                      <p className="text-sm font-medium">{rdvMessage}</p>
                    </div>
                  )}
                </div>
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-600" />
                    Tarifs
                  </h3>
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700 font-medium">
                        Consultation
                      </span>
                      <span className="text-2xl font-bold text-slate-900">
                        {medecinData.consultation_price || "Non spécifié"}{" "}
                        <span className="text-base text-slate-600">FCFA</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bouton de contact 
            <Button
              onClick={() => setChatOpen(true)}
              className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 rounded-xl shadow-lg shadow-green-500/25 font-semibold"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Contacter le médecin
            </Button> */}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-6 py-3 mb-6">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium">
                Besoin d'autres médecins ?
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Explorez plus de spécialistes
              </span>
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Découvrez notre réseau de professionnels de santé certifiés
              disponibles pour vous accompagner.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/trouver-medecin")}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl text-white font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                Voir tous les médecins
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </Button>
              <Button
                onClick={() => navigate("/specialites")}
                className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white font-semibold hover:bg-white/20 transition-all duration-300"
              >
                Voir les spécialités
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedecinProfilePage;