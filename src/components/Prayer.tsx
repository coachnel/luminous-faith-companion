
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ModernButton } from '@/components/ui/modern-button';
import { ModernCard } from '@/components/ui/modern-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Play, Pause, RotateCcw, Heart, Clock, Bookmark, Share2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface PrayerSession {
  id: string;
  duration: number;
  type: 'free' | 'guided';
  timestamp: Date;
}

const Prayer = () => {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [targetTime, setTargetTime] = useState(300); // 5 minutes par défaut
  const [prayerText, setPrayerText] = useState('');
  const [sessionType, setSessionType] = useState<'free' | 'guided'>('free');
  const [sessions, setSessions] = useState<PrayerSession[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTime(prev => {
          if (prev >= targetTime) {
            setIsActive(false);
            toast.success('🙏 Temps de prière terminé ! Que Dieu vous bénisse.');
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, targetTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startPrayer = () => {
    setIsActive(true);
    toast.success('🙏 Session de prière commencée');
  };

  const pausePrayer = () => {
    setIsActive(false);
    toast.info('⏸️ Session de prière mise en pause');
  };

  const resetPrayer = () => {
    setIsActive(false);
    if (time > 0) {
      const session: PrayerSession = {
        id: Date.now().toString(),
        duration: time,
        type: sessionType,
        timestamp: new Date()
      };
      setSessions(prev => [session, ...prev].slice(0, 10));
    }
    setTime(0);
    toast.info('🔄 Session réinitialisée');
  };

  const savePrayer = () => {
    if (prayerText.trim()) {
      toast.success('💾 Prière sauvegardée dans votre journal');
      setPrayerText('');
    }
  };

  const sharePrayer = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Session de prière',
        text: `J'ai prié pendant ${formatTime(time)} sur Compagnon Spirituel 🙏`,
      });
    } else {
      navigator.clipboard.writeText(`J'ai prié pendant ${formatTime(time)} sur Compagnon Spirituel 🙏`);
      toast.success('Lien copié !');
    }
  };

  const quickTimes = [300, 600, 900, 1200]; // 5, 10, 15, 20 minutes

  const progress = Math.min((time / targetTime) * 100, 100);

  return (
    <div className="p-3 sm:p-4 space-y-4 sm:space-y-6 max-w-4xl mx-auto min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* En-tête */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--accent-primary)' }}
            >
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] break-words">Temps de prière</h1>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] break-words">Connectez-vous avec Dieu en toute sérénité</p>
            </div>
          </div>
        </div>
      </ModernCard>

      {/* Minuteur principal */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="relative w-32 h-32 sm:w-48 sm:h-48 mx-auto">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="var(--border-default)"
                strokeWidth="8"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="var(--accent-primary)"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl sm:text-4xl font-bold text-[var(--text-primary)]">
                  {formatTime(time)}
                </div>
                <div className="text-xs sm:text-sm text-[var(--text-secondary)]">
                  / {formatTime(targetTime)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {!isActive ? (
              <ModernButton
                onClick={startPrayer}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-sm w-full sm:w-auto"
                size="lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Commencer
              </ModernButton>
            ) : (
              <ModernButton
                onClick={pausePrayer}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 shadow-sm w-full sm:w-auto"
                size="lg"
              >
                <Pause className="h-5 w-5 mr-2" />
                Pause
              </ModernButton>
            )}
            
            <ModernButton
              onClick={resetPrayer}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset
            </ModernButton>

            {time > 0 && (
              <ModernButton
                onClick={sharePrayer}
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Share2 className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Partager</span>
              </ModernButton>
            )}
          </div>
        </div>
      </ModernCard>

      {/* Temps rapides */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">Temps de prière rapide</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {quickTimes.map((duration) => (
              <ModernButton
                key={duration}
                onClick={() => setTargetTime(duration)}
                variant={targetTime === duration ? "primary" : "outline"}
                size="sm"
                className="text-xs sm:text-sm"
              >
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                {duration / 60}min
              </ModernButton>
            ))}
          </div>
        </div>
      </ModernCard>

      {/* Journal de prière */}
      <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">Journal de prière</h3>
          <Textarea
            value={prayerText}
            onChange={(e) => setPrayerText(e.target.value)}
            placeholder="Écrivez vos prières, vos demandes ou vos remerciements..."
            className="min-h-[120px] text-sm"
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <ModernButton
              onClick={savePrayer}
              disabled={!prayerText.trim()}
              className="flex-1 text-sm"
            >
              <Bookmark className="h-4 w-4 mr-2" />
              Sauvegarder
            </ModernButton>
          </div>
        </div>
      </ModernCard>

      {/* Historique des sessions */}
      {sessions.length > 0 && (
        <ModernCard variant="elevated" className="bg-[var(--bg-card)] border-[var(--border-default)]">
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">Sessions récentes</h3>
            <div className="space-y-2">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Badge variant="outline" className="text-xs">
                      {session.type === 'free' ? 'Libre' : 'Guidée'}
                    </Badge>
                    <span className="text-sm text-[var(--text-primary)] break-words">
                      {formatTime(session.duration)}
                    </span>
                  </div>
                  <span className="text-xs text-[var(--text-secondary)]">
                    {session.timestamp.toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ModernCard>
      )}
    </div>
  );
};

export default Prayer;
