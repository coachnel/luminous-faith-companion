
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, CheckCircle, Calendar, Trophy, Info } from 'lucide-react';

const DailyChallenges = () => {
  const [challenges] = useState([
    {
      id: 1,
      title: "Méditer 10 minutes",
      description: "Prenez un moment de silence et de recueillement",
      progress: 75,
      streak: 3,
      completed: false
    },
    {
      id: 2,
      title: "Lire un chapitre",
      description: "Avancez dans votre lecture spirituelle quotidienne",
      progress: 60,
      streak: 5,
      completed: true
    },
    {
      id: 3,
      title: "Prier pour quelqu'un",
      description: "Intercédez pour une personne de votre entourage",
      progress: 40,
      streak: 2,
      completed: false
    }
  ]);

  const handleCompleteChallenge = (id: number) => {
    console.log(`Défi ${id} validé`);
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 max-w-4xl mx-auto">
      {/* Explication */}
      <Card className="glass border-[var(--accent-primary)]/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center flex-shrink-0">
              <Info className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                Comment ça marche ?
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Relevez des défis spirituels quotidiens pour maintenir votre croissance personnelle. 
                Validez vos actions pour construire des séries et suivre votre progression. 
                Chaque défi complété vous rapproche de vos objectifs spirituels.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* En-tête */}
      <Card className="glass border-white/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
              <Target className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-800">Défis quotidiens</h1>
              <p className="text-sm text-gray-600 hidden sm:block">Maintenez votre discipline spirituelle</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Liste des défis */}
      <div className="grid gap-4">
        {challenges.map((challenge) => (
          <Card key={challenge.id} className="glass border-white/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4 text-orange-500" />
                  {challenge.title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {challenge.streak > 0 && (
                    <Badge variant="outline" className="text-orange-600 border-orange-600">
                      <Trophy className="h-3 w-3 mr-1" />
                      {challenge.streak}
                    </Badge>
                  )}
                  <Badge variant={challenge.completed ? "default" : "secondary"}>
                    {challenge.completed ? "Terminé" : "En cours"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{challenge.description}</p>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progression: {challenge.progress}%</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Série: {challenge.streak} jours
                    </span>
                  </div>
                  <Progress value={challenge.progress} className="h-2" />
                </div>
                
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={() => handleCompleteChallenge(challenge.id)}
                    disabled={challenge.completed}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    {challenge.completed ? "Terminé" : "Valider"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DailyChallenges;
