import React, { useState, useEffect } from 'react';

export default function EditAdminForm({ admin, onSubmit, onCancel, loading }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'admin'
    });

    // Pré-remplissage du formulaire quand l'admin est sélectionné
    useEffect(() => {
        if (admin) {
            setFormData({
                name: admin.name || '',
                email: admin.email || '',
            });
        }
    }, [admin]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // On renvoie l'ID pour savoir quel admin modifier côté API
        onSubmit({ ...formData, id: admin.id });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5 p-2">
            <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nom Complet</label>
                <input 
                    required
                    type="text"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all text-sm"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Adresse Email</label>
                <input 
                    required
                    type="email"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all text-sm"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                <button 
                    type="button" 
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                >
                    Annuler
                </button>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="px-4 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-200 disabled:opacity-50 transition-all"
                >
                    {loading ? "Mise à jour..." : "Enregistrer les modifications"}
                </button>
            </div>
        </form>
    );
}