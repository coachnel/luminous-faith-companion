
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const EmailConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      const tokenHash = searchParams.get('token_hash');
      const type = searchParams.get('type');

      if (!tokenHash || type !== 'email') {
        setStatus('error');
        setMessage('Lien de confirmation invalide');
        return;
      }

      try {
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: 'email'
        });

        if (error) {
          setStatus('error');
          setMessage('Erreur lors de la confirmation : ' + error.message);
        } else {
          setStatus('success');
          setMessage('Votre email a été confirmé avec succès !');
          
          // Rediriger vers l'application après 2 secondes
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 2000);
        }
      } catch (error) {
        setStatus('error');
        setMessage('Une erreur inattendue s\'est produite');
      }
    };

    confirmEmail();
  }, [searchParams, navigate]);

  const handleRedirect = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-heavenly-50 via-spiritual-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass border-white/30 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full spiritual-gradient flex items-center justify-center">
            {status === 'loading' && <Loader2 className="w-8 h-8 text-white animate-spin" />}
            {status === 'success' && <CheckCircle className="w-8 h-8 text-white" />}
            {status === 'error' && <XCircle className="w-8 h-8 text-white" />}
          </div>
          <CardTitle className="text-2xl glow-text">
            {status === 'loading' && 'Confirmation en cours...'}
            {status === 'success' && 'Email confirmé !'}
            {status === 'error' && 'Erreur de confirmation'}
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            {message}
          </p>
          
          {status === 'success' && (
            <div className="space-y-3">
              <p className="text-sm text-spiritual-600">
                Redirection automatique dans quelques secondes...
              </p>
              <Button 
                onClick={handleRedirect}
                className="w-full spiritual-gradient hover:opacity-90 transition-opacity"
              >
                Accéder à l'application
              </Button>
            </div>
          )}
          
          {status === 'error' && (
            <Button 
              onClick={handleRedirect}
              variant="outline"
              className="w-full glass border-white/30 hover:bg-white/20"
            >
              Retour à l'accueil
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailConfirmation;
