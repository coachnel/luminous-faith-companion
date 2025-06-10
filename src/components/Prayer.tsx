
import React, { useState, useEffect } from 'react';
import { Heart, Clock, Users, Send, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import PrayerReminder from './PrayerReminder';

interface PrayerRequest {
  id: string;
  text: string;
  author: string;
  date: string;
  answered: boolean;
}

const Prayer = () => {
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [newPrayer, setNewPrayer] = useState('');
  const [reminderTimes, setReminderTimes] = useState<string[]>(['07:00', '12:00', '19:00']);

  useEffect(() => {
    // Charger les demandes de prière sauvegardées
    const saved = localStorage.getItem('prayerRequests');
    if (saved) {
      setPrayerRequests(JSON.parse(saved));
    }
  }, []);

  const addPrayerRequest = () => {
    if (!newPrayer.trim()) return;

    const request: PrayerRequest = {
      id: Date.now().toString(),
      text: newPrayer,
      author: 'Moi',
      date: new Date().toLocaleDateString('fr-FR'),
      answered: false
    };

    const updated = [request, ...prayerRequests];
    setPrayerRequests(updated);
    localStorage.setItem('prayerRequests', JSON.stringify(updated));
    setNewPrayer('');
  };

  const markAsAnswered = (id: string) => {
    const updated = prayerRequests.map(request =>
      request.id === id ? { ...request, answered: true } : request
    );
    setPrayerRequests(updated);
    localStorage.setItem('prayerRequests', JSON.stringify(updated));
  };

  const onPrayerCompleted = () => {
    console.log('Prière marquée comme terminée');
  };

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      {/* En-tête */}
      <Card className="glass border-white/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="text-red-500" size={24} />
            Centre de Prière
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Rappels de prière */}
      <PrayerReminder 
        reminderTimes={reminderTimes}
        onPrayerCompleted={onPrayerCompleted}
      />

      {/* Nouvelle demande de prière */}
      <Card className="glass border-white/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="text-purple-600" size={20} />
            Nouvelle demande de prière
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Partagez votre demande de prière..."
            value={newPrayer}
            onChange={(e) => setNewPrayer(e.target.value)}
            className="min-h-[100px] glass border-white/30 bg-white/90"
          />
          <Button 
            onClick={addPrayerRequest}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <Send size={16} className="mr-2" />
            Ajouter ma demande
          </Button>
        </CardContent>
      </Card>

      {/* Liste des demandes de prière */}
      <Card className="glass border-white/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="text-blue-600" size={20} />
            Demandes de prière ({prayerRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {prayerRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Aucune demande de prière pour le moment
            </p>
          ) : (
            <div className="space-y-4">
              {prayerRequests.map((request) => (
                <div
                  key={request.id}
                  className={`p-4 rounded-lg border ${
                    request.answered 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{request.author}</span>
                      <span className="text-xs text-gray-500">{request.date}</span>
                    </div>
                    {request.answered && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Exaucée ✓
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-3">{request.text}</p>
                  {!request.answered && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markAsAnswered(request.id)}
                      className="text-green-600 border-green-200 hover:bg-green-50"
                    >
                      <Heart size={14} className="mr-1" />
                      Marquer comme exaucée
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Prayer;
