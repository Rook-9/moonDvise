import { useState } from 'react';
import { Header } from './components/Header';
import { UserDataForm } from './components/UserDataForm';
import { InterviewDataForm } from './components/InterviewDataForm';
import { ResultBlock } from './components/ResultBlock';
import { Footer } from './components/Footer';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { Button } from './components/ui/button';
import { Sparkles } from 'lucide-react';
import { LocalizationProvider, useLocalization } from './components/LocalizationContext';
import { getSynastryAspects } from './lib/astrologyApi';
import { analyzeCosmicCareer, clearAnalysisCache } from './lib/openaiService';
import type { CosmicAnalysisResponse } from './lib/openaiService';

interface LocationData {
  date: string;
  city: string;
}

function AppContent() {
  const { t } = useLocalization();
  const [userData, setUserData] = useState<LocationData | null>(null);
  const [interviewData, setInterviewData] = useState<LocationData | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userDataSubmitted, setUserDataSubmitted] = useState(false);
  const [interviewDataSubmitted, setInterviewDataSubmitted] = useState(false);
  const [cosmicAnalysis, setCosmicAnalysis] = useState<CosmicAnalysisResponse | null>(null);

  const handleUserDataSubmit = (data: LocationData) => {
    setUserData(data);
    setUserDataSubmitted(true);
    // Clear cache and reset result when data changes
    clearAnalysisCache();
    setCosmicAnalysis(null);
    setShowResult(false);
    // Reset after 3 seconds
    setTimeout(() => setUserDataSubmitted(false), 3000);
  };

  const handleInterviewDataSubmit = (data: LocationData) => {
    setInterviewData(data);
    setInterviewDataSubmitted(true);
    // Clear cache and reset result when data changes
    clearAnalysisCache();
    setCosmicAnalysis(null);
    setShowResult(false);
    // Reset after 3 seconds
    setTimeout(() => setInterviewDataSubmitted(false), 3000);
  };

  const askStars = async () => {
    if (!userData || !interviewData) return;

    try {
      setIsAnalyzing(true);

      // Get synastry aspects between user and interview data
      const synastryResult = await getSynastryAspects(userData, interviewData);

      console.debug('Synastry aspects result:', synastryResult);

      // Analyze the aspects with OpenAI
      const analysis = await analyzeCosmicCareer(userData, interviewData, synastryResult);

      console.debug('Cosmic analysis result:', analysis);

      setCosmicAnalysis(analysis);
      setShowResult(true);
    } catch (err) {
      console.error(err);
      alert('Failed to analyze with astrology API. Check console and API keys.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const canAskStars = userData && interviewData;

  return (
    <div className="dark min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background nebula */}
      <div className="fixed inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1719448779841-4ebfe2f7af40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZWJ1bGElMjBzdGFycyUyMHNwYWNlJTIwZGFya3xlbnwxfHx8fDE3NTU2MjUxMTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Nebula background"
          className="w-full h-full object-cover opacity-20"
        />
      </div>

      {/* Animated stars overlay */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-32 w-0.5 h-0.5 bg-blue-300 rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-40 left-1/4 w-1 h-1 bg-purple-300 rounded-full animate-pulse delay-700"></div>
        <div className="absolute top-60 right-20 w-0.5 h-0.5 bg-pink-300 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-16 w-1 h-1 bg-cyan-300 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-60 right-1/3 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-200"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header />
        
        <main className="w-full max-w-none px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              月の導き
            </h1>
            <p className="text-xl mb-2 text-muted-foreground">
              {t.heroTitle}
            </p>
            <p className="text-muted-foreground">
              {t.heroSubtitle}
            </p>
          </div>

          {/* Forms Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <UserDataForm 
              onSubmit={handleUserDataSubmit} 
              isSubmitted={userDataSubmitted}
            />
            <InterviewDataForm 
              onSubmit={handleInterviewDataSubmit} 
              isSubmitted={interviewDataSubmitted}
            />
          </div>

          {/* Ask Stars Button */}
          <div className="text-center mb-12">
            <Button
              onClick={askStars}
              disabled={!canAskStars || isAnalyzing}
              className={`
                px-8 py-4 text-lg transition-all duration-300
                ${canAskStars 
                  ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 shadow-lg hover:shadow-xl hover:scale-105' 
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
                }
              `}
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  {t.consultingCosmos}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  {t.askStars}
                </>
              )}
            </Button>
            {!canAskStars && (
              <p className="text-sm text-muted-foreground mt-2">
                {t.fillBothForms}
              </p>
            )}
          </div>

          {/* Result Section */}
          {showResult && userData && interviewData && (
            <ResultBlock 
              userData={userData} 
              interviewData={interviewData} 
              cosmicAnalysis={cosmicAnalysis}
            />
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LocalizationProvider>
      <AppContent />
    </LocalizationProvider>
  );
}