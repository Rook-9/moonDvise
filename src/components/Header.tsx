import { Button } from './ui/button';
import { User, Globe } from 'lucide-react';
import { useLocalization } from './LocalizationContext';

export function Header() {
  const { t, language, setLanguage } = useLocalization();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ru' : 'en');
  };

  return (
    <header className="border-b border-border/20 backdrop-blur-sm bg-background/10">
      <div className="w-full max-w-none px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">月</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            moonDvise
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={toggleLanguage}
            className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10"
          >
            <Globe className="w-4 h-4 mr-1" />
            {language === 'en' ? 'RU' : 'EN'}
          </Button>
          
          <Button variant="outline" className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10">
            <User className="w-4 h-4 mr-2" />
            {t.login}
          </Button>
        </div>
      </div>
    </header>
  );
}