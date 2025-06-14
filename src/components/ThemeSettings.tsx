
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Palette, Sun, Moon, Coffee } from 'lucide-react';
import { useUserPreferences } from '@/hooks/useSupabaseData';
import { toast } from 'sonner';

export function ThemeSettings() {
  const { preferences, loading, updatePreferences } = useUserPreferences();

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'sepia') => {
    try {
      await updatePreferences({ theme_mode: newTheme });
      toast.success('Thème mis à jour !');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du thème');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Apparence et thème
        </CardTitle>
        <CardDescription>
          Personnalisez l'apparence de l'application selon vos préférences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium">Mode d'affichage</Label>
            <RadioGroup 
              value={preferences?.theme_mode || 'light'} 
              onValueChange={(value) => handleThemeChange(value as 'light' | 'dark' | 'sepia')}
              className="mt-3"
            >
              <div className="space-y-3">
                {/* Mode clair */}
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light" className="flex items-center gap-3 cursor-pointer flex-1">
                    <div className="flex items-center justify-center w-8 h-8 bg-white border rounded shadow-sm">
                      <Sun className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div>
                      <div className="font-medium">Mode clair</div>
                      <div className="text-sm text-gray-600">Interface lumineuse classique</div>
                    </div>
                  </Label>
                </div>

                {/* Mode sombre */}
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark" className="flex items-center gap-3 cursor-pointer flex-1">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-900 border rounded shadow-sm">
                      <Moon className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-medium">Mode sombre</div>
                      <div className="text-sm text-gray-600">Idéal pour la lecture en soirée</div>
                    </div>
                  </Label>
                </div>

                {/* Mode sépia */}
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="sepia" id="sepia" />
                  <Label htmlFor="sepia" className="flex items-center gap-3 cursor-pointer flex-1">
                    <div className="flex items-center justify-center w-8 h-8 bg-amber-100 border rounded shadow-sm">
                      <Coffee className="h-4 w-4 text-amber-700" />
                    </div>
                    <div>
                      <div className="font-medium">Mode lecture douce</div>
                      <div className="text-sm text-gray-600">Ton sépia, reposant pour les yeux</div>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Aperçu du thème */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Aperçu</Label>
            <div className="p-4 border rounded-lg bg-card text-card-foreground">
              <div className="space-y-2">
                <div className="font-medium">Exemple de texte</div>
                <div className="text-sm text-muted-foreground">
                  Voici comment apparaîtra le texte avec le thème sélectionné. 
                  Ce mode d'affichage sera appliqué à toute l'application.
                </div>
                <Button size="sm" variant="outline">Bouton d'exemple</Button>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            💡 <strong>Conseil:</strong> Le mode sombre réduit la fatigue oculaire dans des environnements peu éclairés, 
            tandis que le mode lecture douce utilise des tons chauds pour une lecture prolongée plus confortable.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
