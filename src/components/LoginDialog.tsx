import { useState } from 'react';
import { useLocalization } from './LocalizationContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { login, register, type AuthSession } from '../lib/authService';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthenticated: (session: AuthSession) => void;
}

export function LoginDialog({ open, onOpenChange, onAuthenticated }: LoginDialogProps) {
  const { t } = useLocalization();
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const session = isRegistering
        ? await register(username, password)
        : await login(username, password);
      onAuthenticated(session);
      onOpenChange(false);
      setPassword('');
    } catch {
      setError(isRegistering ? t.loginError : t.loginError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isRegistering ? t.createAccount : t.login}</DialogTitle>
          <DialogDescription>{t.loginPrototypeNotice}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-username">{t.username}</Label>
            <Input
              id="login-username"
              value={username}
              onChange={event => setUsername(event.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password">{t.password}</Label>
            <Input
              id="login-password"
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              autoComplete={isRegistering ? 'new-password' : 'current-password'}
              minLength={6}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => { setIsRegistering(value => !value); setError(''); }}>
              {isRegistering ? t.signIn : t.signUp}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '...' : isRegistering ? t.signUp : t.signIn}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
