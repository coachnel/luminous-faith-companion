
import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
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
  const { signIn, signUp } = useAuth();

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
            description: "Bienvenue dans votre application compagnon",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-heavenly-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass border-white/30 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-2xl">✝️</span>
          </div>
          <CardTitle className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            {isLogin ? 'Connexion' : 'Inscription'}
          </CardTitle>
          <p className="text-gray-600">
            {isLogin 
              ? 'Connectez-vous à l\'application' 
              : 'Créez votre compte pour commencer votre parcours'
            }
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
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
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 transition-opacity"
            >
              {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : "S'inscrire")}
            </Button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-700 text-sm"
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
