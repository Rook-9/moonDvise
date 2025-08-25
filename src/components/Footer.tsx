import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Github, Twitter, Instagram, Facebook } from 'lucide-react';
import { useLocalization } from './LocalizationContext';

export function Footer() {
  const { t } = useLocalization();

  return (
    <footer className="border-t border-border/20 backdrop-blur-sm bg-background/10 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo and tagline */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">月</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                moonDvise
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t.footerTagline}
            </p>
          </div>

          {/* Social Media Links */}
          <div className="flex space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-purple-500/20 text-purple-300 hover:text-purple-200"
            >
              <Twitter className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-pink-500/20 text-pink-300 hover:text-pink-200"
            >
              <Instagram className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-blue-500/20 text-blue-300 hover:text-blue-200"
            >
              <Facebook className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200"
            >
              <Github className="w-5 h-5" />
            </Button>
          </div>

          <Separator className="w-full max-w-md bg-border/20" />

          {/* Copyright */}
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 moonDvise. All rights reserved.</p>
            <p className="mt-1">
              {t.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}