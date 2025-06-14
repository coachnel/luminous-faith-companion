
import React, { useState, useEffect } from 'react';
import { Heart, Trash2, Book } from 'lucide-react';
import { ModernButton } from '@/components/ui/modern-button';
import { ModernCard } from '@/components/ui/modern-card';
import { useNeonFavoriteVerses } from '@/hooks/useNeonData';
import VerseCard from './VerseCard';
import { toast } from '@/hooks/use-toast';

const FavoriteVerses = () => {
  const { favoriteVerses, loading, removeFavoriteVerse } = useNeonFavoriteVerses();

  const handleRemoveFavorite = async (verseId: string) => {
    try {
      await removeFavoriteVerse(verseId);
      toast({
        description: "Verset supprimé des favoris",
      });
    } catch (error) {
      toast({
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  const clearAllFavorites = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer tous vos favoris ?')) return;
    
    try {
      for (const verse of favoriteVerses) {
        await removeFavoriteVerse(verse.verse_id);
      }
      toast({
        description: "Tous les favoris ont été supprimés",
      });
    } catch (error) {
      toast({
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4 max-w-4xl mx-auto">
        <ModernCard>
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-[var(--text-secondary)]">Chargement des favoris...</p>
          </div>
        </ModernCard>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto">
      <ModernCard variant="elevated">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="text-[var(--accent-primary)]" size={24} />
            <h1 className="text-xl font-semibold text-[var(--text-primary)]">Versets favoris</h1>
            <span className="text-sm bg-[var(--bg-secondary)] text-[var(--text-secondary)] px-2 py-1 rounded-full">
              {favoriteVerses.length}
            </span>
          </div>
          {favoriteVerses.length > 0 && (
            <ModernButton
              variant="outline"
              size="sm"
              onClick={clearAllFavorites}
            >
              <Trash2 size={16} className="mr-2" />
              Tout supprimer
            </ModernButton>
          )}
        </div>
      </ModernCard>

      {favoriteVerses.length === 0 ? (
        <ModernCard>
          <div className="p-8 text-center">
            <Heart className="mx-auto mb-4 text-[var(--text-secondary)]" size={48} />
            <h3 className="text-lg font-semibold mb-2 text-[var(--text-primary)]">Aucun verset favori</h3>
            <p className="text-[var(--text-secondary)]">
              Explorez la Bible et ajoutez vos versets préférés en cliquant sur l'étoile ⭐
            </p>
          </div>
        </ModernCard>
      ) : (
        <div className="space-y-4">
          {favoriteVerses.map((favoriteVerse, index) => {
            const verse = {
              book: favoriteVerse.book,
              chapter: favoriteVerse.chapter,
              verse: favoriteVerse.verse,
              text: favoriteVerse.text
            };
            
            return (
              <div key={`${favoriteVerse.id}-${index}`} className="relative">
                <VerseCard verse={verse} />
                <ModernButton
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFavorite(favoriteVerse.verse_id)}
                  className="absolute top-2 right-2 text-[var(--accent-primary)] hover:bg-[var(--bg-secondary)]"
                >
                  <Trash2 size={16} />
                </ModernButton>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FavoriteVerses;
