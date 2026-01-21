import React, { useState } from 'react';

export default function AdminForm({ onSubmit, onCancel, loading }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: `admin@email!2026`,
        role: 'admin'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5 p-2">
            <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nom Complet</label>
                <input 
                    required
                    type="text"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                    placeholder="ex: Jean Dupont"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Adresse Email</label>
                <input 
                    required
                    type="email"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                    placeholder="admin@exemple.com"
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
                    className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md shadow-blue-200 disabled:opacity-50 transition-all"
                >
                    {loading ? "Création..." : "Enregistrer l'admin"}
                </button>
            </div>
        </form>
    );
}