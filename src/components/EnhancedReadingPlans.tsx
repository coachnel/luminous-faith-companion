import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus, BarChart3 } from 'lucide-react';
import { useReadingProgress } from '@/hooks/useNewFeatures';
import ProgressVisualization from './ProgressVisualization';

const EnhancedReadingPlans = () => {
  const { progressData, updateProgress, loading } = useReadingProgress();

  // Gestion des plans personnalisés (localStorage)
  const [customPlans, setCustomPlans] = useState(() => {
    const stored = localStorage.getItem('customReadingPlans');
    return stored ? JSON.parse(stored) : [];
  });
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', days: '', readings: '' });
  const [formError, setFormError] = useState('');

  // Ajout d'un plan personnalisé
  const handleCustomPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.days.trim() || isNaN(Number(form.days)) || Number(form.days) < 1) {
      setFormError('Veuillez remplir tous les champs correctement.');
      return;
    }
    const newPlan = {
      name: form.title,
      days: Number(form.days),
      readings: form.readings.split('\n').filter(Boolean),
    };
    const updated = [...customPlans, newPlan];
    setCustomPlans(updated);
    localStorage.setItem('customReadingPlans', JSON.stringify(updated));
    setShowModal(false);
    setForm({ title: '', days: '', readings: '' });
    setFormError('');
  };

  // Fonction pour démarrer un plan (y compris personnalisé)
  const handleAddPlan = (planName: string, totalDays: number) => {
    updateProgress(planName, totalDays, 0);
  };

  // Plans de lecture disponibles
  const availablePlans = [
    { name: 'Évangiles - 30 jours', days: 30, type: 'default' },
    { name: 'Psaumes - 60 jours', days: 60, type: 'default' },
    { name: 'Bible complète - 365 jours', days: 365, type: 'default' },
    { name: 'Nouveau Testament - 90 jours', days: 90, type: 'default' },
    ...customPlans.map((p: any) => ({ ...p, type: 'custom' }))
  ];

  return (
    <div className="p-3 sm:p-4 max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* En-tête */}
      <Card className="glass border-white/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-800">Plans de lecture</h1>
              <p className="text-sm text-gray-600 hidden sm:block">Suivez votre progression spirituelle</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Visualisation de la progression */}
      {progressData.length > 0 && (
        <Card className="glass border-white/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Ma progression
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressVisualization progressData={progressData} loading={loading} />
          </CardContent>
        </Card>
      )}

      {/* Plans disponibles */}
      <Card className="glass border-white/30">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-3 justify-between">
            <span>Plans disponibles</span>
            <button
              className="bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition-all flex items-center gap-2"
              onClick={() => setShowModal(true)}
              type="button"
            >
              <Plus className="h-4 w-4" /> + Créer un plan personnalisé
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mt-2">
            {availablePlans.map((plan, idx) => {
              const isActive = progressData.some(p => p.plan_name === plan.name);
              return (
                <div
                  key={plan.name + idx}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border border-gray-200 rounded-lg bg-white w-full md:w-auto min-w-[220px] gap-2 shadow-sm hover:bg-blue-50 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-gray-800">{plan.name}</h3>
                    <p className="text-sm text-gray-600">{plan.days} jours de lecture</p>
                    {plan.readings && (
                      <ul className="text-xs text-gray-500 mt-1 list-disc list-inside">
                        {plan.readings.map((r: string, i: number) => <li key={i}>{r}</li>)}
                      </ul>
                    )}
                  </div>
                  {isActive ? (
                    <button
                      className="bg-blue-400 text-white rounded-md px-4 py-2 text-sm font-semibold cursor-not-allowed opacity-70 w-full md:w-auto"
                      disabled
                    >En cours</button>
                  ) : (
                    <button
                      className="bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition-all w-full md:w-auto"
                      onClick={() => handleAddPlan(plan.name, plan.days)}
                      type="button"
                    >Commencer</button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Modal création plan personnalisé */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              onClick={() => setShowModal(false)}
              aria-label="Fermer"
            >✕</button>
            <h2 className="text-lg font-bold mb-4 text-blue-700">Créer un plan personnalisé</h2>
            <form onSubmit={handleCustomPlan} className="flex flex-col gap-3">
              <input
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Titre du plan"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                required
              />
              <input
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Nombre de jours"
                type="number"
                min="1"
                value={form.days}
                onChange={e => setForm(f => ({ ...f, days: e.target.value }))}
                required
              />
              <textarea
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Liste de lectures personnalisées (une par ligne)"
                value={form.readings}
                onChange={e => setForm(f => ({ ...f, readings: e.target.value }))}
                rows={3}
              />
              {formError && <div className="text-red-500 text-xs">{formError}</div>}
              <button
                type="submit"
                className="bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition-all mt-2"
              >Créer</button>
            </form>
          </div>
        </div>
      )}

      {/* Instructions */}
      <Card className="glass border-white/30 bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800 mb-1">Comment ça marche ?</h3>
              <p className="text-sm text-blue-700">
                Choisissez un plan de lecture, suivez votre progression quotidienne et visualisez 
                vos statistiques. Votre progression est automatiquement sauvegardée.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedReadingPlans;
