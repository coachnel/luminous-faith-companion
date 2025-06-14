
import React, { useState } from 'react';
import { Mail, Lock, User, Chrome, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    if (!isLogin && !name) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer votre nom",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await signIn(email, password);
      } else {
        result = await signUp(email, password, name);
      }

      if (result.error) {
        let errorMessage = result.error.message;
        
        // Messages d'erreur en français
        if (errorMessage.includes('Invalid login credentials')) {
          errorMessage = 'Email ou mot de passe incorrect';
        } else if (errorMessage.includes('User already registered')) {
          errorMessage = 'Un compte existe déjà avec cet email';
        } else if (errorMessage.includes('Signup not allowed')) {
          errorMessage = 'Inscription non autorisée';
        } else if (errorMessage.includes('Password should be at least')) {
          errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
        } else if (errorMessage.includes('Invalid email')) {
          errorMessage = 'Adresse email invalide';
        } else if (errorMessage.includes('Email not confirmed')) {
          errorMessage = 'Veuillez confirmer votre email avant de vous connecter';
        }

        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        if (!isLogin) {
          toast({
            title: "Inscription réussie ! 🎉",
            description: "Un email de confirmation vous a été envoyé. Cliquez sur le lien dans l'email pour activer votre compte, puis revenez vous connecter ici.",
          });
          
          // Basculer vers la connexion après inscription
          setTimeout(() => {
            setIsLogin(true);
          }, 3000);
        } else {
          toast({
            title: "Connexion réussie ! ✨",
            description: "Bienvenue dans votre compagnon spirituel",
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de se connecter avec Google",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se connecter avec Google",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-heavenly-50 via-spiritual-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass border-white/30 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full spiritual-gradient flex items-center justify-center">
            <span className="text-2xl">✝️</span>
          </div>
          <CardTitle className="text-2xl glow-text">
            {isLogin ? 'Connexion' : 'Inscription'}
          </CardTitle>
          <p className="text-gray-600">
            {isLogin 
              ? 'Connectez-vous à votre compagnon spirituel' 
              : 'Créez votre compte pour commencer votre parcours'
            }
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            onClick={handleGoogleAuth}
            disabled={loading}
            variant="outline"
            className="w-full glass border-white/30 hover:bg-white/20"
          >
            <Chrome className="mr-2 h-4 w-4" />
            Continuer avec Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/80 text-gray-500">ou</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Nom complet"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 glass border-white/30"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="email"
                placeholder="Adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 glass border-white/30"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 glass border-white/30"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full spiritual-gradient hover:opacity-90 transition-opacity"
            >
              {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : "S'inscrire")}
            </Button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-spiritual-600 hover:text-spiritual-700 text-sm"
              disabled={loading}
            >
              {isLogin 
                ? "Pas encore de compte ? S'inscrire" 
                : 'Déjà un compte ? Se connecter'
              }
            </button>
          </div>

          {!isLogin && (
            <div className="text-xs text-gray-500 text-center">
              En vous inscrivant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
