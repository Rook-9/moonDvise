import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Star, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useLocalization } from './LocalizationContext';
import type { CosmicAnalysisResponse } from '../lib/openaiService';

interface LocationData {
  date: string;
  city: string;
}

interface ResultBlockProps {
  userData: LocationData;
  interviewData: LocationData;
  cosmicAnalysis?: CosmicAnalysisResponse | null;
}

export function ResultBlock({ userData, interviewData, cosmicAnalysis }: ResultBlockProps) {
  const { t } = useLocalization();
  
  // Check if cosmicAnalysis is available
  if (!cosmicAnalysis) {
    return (
      <Card className="bg-background/60 backdrop-blur-sm border-gradient-to-r from-purple-500/30 to-cyan-500/30 mx-auto max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center text-2xl">
            <Star className="w-6 h-6 mr-2 text-yellow-400" />
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {t.cosmicCareerAnalysis}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Analyzing cosmic alignment...</p>
        </CardContent>
      </Card>
    );
  }
  
  // Use the real cosmic analysis data
  const cosmicAlignment = cosmicAnalysis.cosmicAlignmentScore;
  const favorableFactors = cosmicAnalysis.favorableFactors;
  const challenges = cosmicAnalysis.cosmicChallenges;
  const interviewTips = cosmicAnalysis.cosmicInterviewGuidance;

  const getRecommendation = () => {
    if (cosmicAlignment >= 80) {
      return {
        status: t.highlyFavorable,
        icon: <CheckCircle className="w-5 h-5 text-green-400" />,
        message: t.starsAlignedMessage,
        color: 'text-green-400'
      };
    } else if (cosmicAlignment >= 60) {
      return {
        status: t.favorable,
        icon: <TrendingUp className="w-5 h-5 text-yellow-400" />,
        message: t.goodAlignmentMessage,
        color: 'text-yellow-400'
      };
    } else {
      return {
        status: t.proceedWithCaution,
        icon: <AlertTriangle className="w-5 h-5 text-orange-400" />,
        message: t.cautionMessage,
        color: 'text-orange-400'
      };
    }
  };

  const recommendation = getRecommendation();

  return (
    <Card className="bg-background/60 backdrop-blur-sm border-gradient-to-r from-purple-500/30 to-cyan-500/30 mx-auto max-w-4xl">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center text-2xl">
          <Star className="w-6 h-6 mr-2 text-yellow-400" />
          <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {t.cosmicCareerAnalysis}
          </span>
        </CardTitle>
        <CardDescription>{t.basedOnData}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Recommendation */}
        <div className="text-center p-6 rounded-lg bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
          <div className="flex items-center justify-center mb-2">
            {recommendation.icon}
            <span className={`ml-2 text-xl font-semibold ${recommendation.color}`}>
              {recommendation.status}
            </span>
          </div>
          <p className="text-muted-foreground">{recommendation.message}</p>
        </div>

        {/* Cosmic Alignment Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span>{t.cosmicCareerAlignment}</span>
            <span className="text-lg font-semibold">{cosmicAlignment}%</span>
          </div>
          <Progress value={cosmicAlignment} className="h-3" />
        </div>

        {/* Favorable Factors */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-green-400">{t.favorableCosmicFactors}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {favorableFactors.slice(0, 4).map((factor, index) => (
              <Badge key={index} variant="outline" className="border-green-500/50 text-green-400 p-2 justify-start">
                <CheckCircle className="w-3 h-3 mr-2" />
                {factor}
              </Badge>
            ))}
          </div>
        </div>

        {/* Challenges */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-orange-400">{t.cosmicChallenges}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {challenges.map((challenge, index) => (
              <Badge key={index} variant="outline" className="border-orange-500/50 text-orange-400 p-2 justify-start">
                <AlertTriangle className="w-3 h-3 mr-2" />
                {challenge}
              </Badge>
            ))}
          </div>
        </div>

        {/* Interview Tips */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-blue-400">{t.cosmicInterviewGuidance}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {interviewTips.map((tip, index) => (
              <Badge key={index} variant="outline" className="border-blue-500/50 text-blue-400 p-2 justify-start">
                <Star className="w-3 h-3 mr-2" />
                {tip}
              </Badge>
            ))}
          </div>
        </div>

        {/* Data Summary */}
        <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-border/20">
          <div className="space-y-2">
            <h4 className="font-semibold text-purple-300">{t.yourBirthInformation}</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{t.date}: {new Date(userData.date).toLocaleDateString()}</p>
              <p>{t.location}: {userData.city}</p>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-cyan-300">{t.interviewInformation}</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{t.intendedDate}: {new Date(interviewData.date).toLocaleDateString()}</p>
              <p>{t.location}: {interviewData.city}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}