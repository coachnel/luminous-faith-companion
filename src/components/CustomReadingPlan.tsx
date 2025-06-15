
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash, BookOpen, Calendar, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

interface CustomPlan {
  id: string;
  name: string;
  description: string;
  books: string[];
  duration: number;
  createdAt: string;
  isPublic?: boolean;
  isCustom: boolean;
}

const CustomReadingPlan = () => {
  const [customPlans, setCustomPlans] = useState<CustomPlan[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<CustomPlan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    books: '',
    duration: 30,
    isPublic: false
  });

  useEffect(() => {
    const savedPlans = localStorage.getItem('customReadingPlans');
    if (savedPlans) {
      setCustomPlans(JSON.parse(savedPlans));
    }
  }, []);

  const savePlans = (plans: CustomPlan[]) => {
    setCustomPlans(plans);
    localStorage.setItem('customReadingPlans', JSON.stringify(plans));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Plan form submitted:', formData); // Test de clic
    
    if (!formData.name.trim() || !formData.books.trim()) {
      toast({
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    const booksArray = formData.books.split(',').map(book => book.trim()).filter(book => book);
    
    if (editingPlan) {
      // Modifier un plan existant
      const updatedPlans = customPlans.map(plan =>
        plan.id === editingPlan.id
          ? {
              ...plan,
              name: formData.name,
              description: formData.description,
              books: booksArray,
              duration: formData.duration,
              isPublic: formData.isPublic
            }
          : plan
      );
      savePlans(updatedPlans);
      toast({
        title: "Plan modifié",
        description: "Votre plan de lecture a été mis à jour avec succès",
      });
    } else {
      // Créer un nouveau plan
      const newPlan: CustomPlan = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        books: booksArray,
        duration: formData.duration,
        createdAt: new Date().toISOString(),
        isPublic: formData.isPublic,
        isCustom: true
      };
      
      savePlans([...customPlans, newPlan]);
      toast({
        title: "📖 Plan créé",
        description: `Votre plan de lecture personnalisé a été créé${formData.isPublic ? ' et partagé avec la communauté' : ''}`,
      });
    }

    // Réinitialiser le formulaire
    setFormData({ name: '', description: '', books: '', duration: 30, isPublic: false });
    setEditingPlan(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (plan: CustomPlan) => {
    console.log('Editing plan:', plan.id); // Test de clic
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      books: plan.books.join(', '),
      duration: plan.duration,
      isPublic: plan.isPublic || false
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (planId: string) => {
    console.log('Deleting plan:', planId); // Test de clic
    const updatedPlans = customPlans.filter(plan => plan.id !== planId);
    savePlans(updatedPlans);
    toast({
      description: "Plan de lecture supprimé",
    });
  };

  const startCustomPlan = (plan: CustomPlan) => {
    console.log('Starting custom plan:', plan.id); // Test de clic
    // Créer un planning basé sur le plan personnalisé
    const schedule = plan.books.map((book, index) => ({
      day: index + 1,
      books: [book],
      chapters: undefined
    }));

    const readingPlan = {
      id: `custom-${plan.id}`,
      name: plan.name,
      description: plan.description,
      duration: plan.duration,
      schedule
    };

    // Sauvegarder comme plan actuel
    const progress = {
      planId: readingPlan.id,
      currentDay: 1,
      completedDays: [],
      startDate: new Date().toISOString()
    };

    localStorage.setItem('readingPlanProgress', JSON.stringify(progress));
    localStorage.setItem('currentCustomPlan', JSON.stringify(readingPlan));

    toast({
      title: "📚 Plan démarré",
      description: `Votre plan "${plan.name}" a été lancé`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-xl font-bold text-[var(--text-primary)]">Mes plans personnalisés</h3>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button
              onClick={() => {
                console.log('New plan button clicked'); // Test de clic
                setEditingPlan(null);
                setFormData({ name: '', description: '', books: '', duration: 30, isPublic: false });
              }}
              className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-2"
            >
              <Plus size={16} />
              Nouveau plan
            </button>
          </DialogTrigger>
          
          <DialogContent className="bg-white max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPlan ? 'Modifier le plan' : 'Créer un plan de lecture'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom du plan *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Mon plan de lecture"
                  className="border-gray-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description de votre plan..."
                  className="border-gray-300"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Livres à lire *</label>
                <Textarea
                  value={formData.books}
                  onChange={(e) => setFormData({ ...formData, books: e.target.value })}
                  placeholder="Genèse, Exode, Matthieu, Jean..."
                  className="border-gray-300"
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">Séparez les livres par des virgules</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Durée (jours)</label>
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 30 })}
                  min="1"
                  max="365"
                  className="border-gray-300"
                />
              </div>

              <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                <Switch
                  id="share-plan"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                />
                <div className="flex-1">
                  <Label htmlFor="share-plan" className="text-sm font-medium cursor-pointer">
                    Partager avec la communauté
                  </Label>
                  <p className="text-xs text-gray-600 mt-1">
                    Permettre aux autres utilisateurs de découvrir et utiliser votre plan
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  type="submit" 
                  className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 flex-1"
                >
                  {editingPlan ? 'Modifier' : 'Créer'}
                </button>
                <button 
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="bg-gray-300 text-gray-700 hover:bg-gray-400 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
                >
                  Annuler
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {customPlans.length === 0 ? (
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardContent className="p-6 text-center">
            <BookOpen className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600 mb-2">Aucun plan personnalisé</p>
            <p className="text-sm text-gray-500">Créez votre premier plan de lecture sur mesure</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {customPlans.map((plan) => (
            <Card key={plan.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                      <Star className="h-4 w-4 text-yellow-500" fill="currentColor" />
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Personnalisé
                      </span>
                      {plan.isPublic && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          Public
                        </span>
                      )}
                    </div>
                    {plan.description && (
                      <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                    )}
                  </div>
                  <div className="flex gap-1 ml-4">
                    <button
                      onClick={() => handleEdit(plan)}
                      className="bg-gray-100 text-gray-600 hover:bg-gray-200 rounded p-1 transition-all duration-200"
                    >
                      <Edit size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(plan.id)}
                      className="bg-red-100 text-red-600 hover:bg-red-200 rounded p-1 transition-all duration-200"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <BookOpen size={14} />
                    <span>{plan.books.length} livres</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{plan.duration} jours</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Créé le {new Date(plan.createdAt).toLocaleDateString()}
                  </div>
                  <button 
                    onClick={() => startCustomPlan(plan)}
                    className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
                  >
                    Commencer
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomReadingPlan;
