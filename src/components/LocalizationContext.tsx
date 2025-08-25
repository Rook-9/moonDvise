import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ru';

interface Translations {
  // Header
  login: string;
  
  // Hero section
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  
  // User form
  userData: string;
  userDataDescription: string;
  birthDateTime: string;
  city: string;
  setUserData: string;
  
  // Interview form
  interviewData: string;
  interviewDataDescription: string;
  intendedInterviewDateTime: string;
  setInterviewData: string;
  
  // Ask stars button
  askStars: string;
  consultingCosmos: string;
  fillBothForms: string;
  
  // Results
  cosmicCareerAnalysis: string;
  basedOnData: string;
  highlyFavorable: string;
  favorable: string;
  proceedWithCaution: string;
  starsAlignedMessage: string;
  goodAlignmentMessage: string;
  cautionMessage: string;
  cosmicCareerAlignment: string;
  favorableCosmicFactors: string;
  cosmicChallenges: string;
  cosmicInterviewGuidance: string;
  yourBirthInformation: string;
  interviewInformation: string;
  date: string;
  location: string;
  intendedDate: string;
  
  // Favorable factors
  mercuryEnhances: string;
  jupiterSupports: string;
  moonPhaseConfidence: string;
  venusCharisma: string;
  sunAlignment: string;
  
  // Challenges
  marsNervousness: string;
  saturnPreparation: string;
  eclipseFlexibility: string;
  
  // Interview tips
  wearColors: string;
  practiceAnswers: string;
  arriveEarly: string;
  bringTalisman: string;
  
  // Footer
  footerTagline: string;
  disclaimer: string;
}

const translations: Record<Language, Translations> = {
  en: {
    // Header
    login: 'Login',
    
    // Hero section
    heroTitle: 'Is this the right time to schedule a job interview?',
    heroSubtitle: 'Let the moon and stars guide your career decisions through ancient wisdom',
    heroDescription: '',
    
    // User form
    userData: 'User Data',
    userDataDescription: 'Enter your birth information to align with cosmic energies',
    birthDateTime: 'Birth Date & Time',
    city: 'City',
    setUserData: 'Set User Data',
    
    // Interview form
    interviewData: 'Interview Data',
    interviewDataDescription: 'Enter the interview location and intended schedule date',
    intendedInterviewDateTime: 'Intended Interview Date & Time',
    setInterviewData: 'Set Interview Data',
    
    // Ask stars button
    askStars: 'Ask stars',
    consultingCosmos: 'Consulting the cosmos...',
    fillBothForms: 'Please fill out both forms to ask the stars',
    
    // Results
    cosmicCareerAnalysis: 'Cosmic Career Analysis',
    basedOnData: 'Based on your birth data and interview intentions',
    highlyFavorable: 'Highly Favorable',
    favorable: 'Favorable',
    proceedWithCaution: 'Proceed with Caution',
    starsAlignedMessage: 'The stars are perfectly aligned for your job interview. This is an auspicious time to showcase your talents.',
    goodAlignmentMessage: 'Good cosmic alignment for career advancement. Prepare well and confidence will follow.',
    cautionMessage: 'The cosmic energies suggest extra preparation. Consider rescheduling if possible.',
    cosmicCareerAlignment: 'Cosmic Career Alignment Score',
    favorableCosmicFactors: 'Favorable Cosmic Factors',
    cosmicChallenges: 'Cosmic Challenges',
    cosmicInterviewGuidance: 'Cosmic Interview Guidance',
    yourBirthInformation: 'Your Birth Information',
    interviewInformation: 'Interview Information',
    date: 'Date',
    location: 'Location',
    intendedDate: 'Intended Date',
    
    // Favorable factors
    mercuryEnhances: 'Mercury enhances communication skills',
    jupiterSupports: 'Jupiter supports career growth',
    moonPhaseConfidence: 'Moon phase encourages confidence',
    venusCharisma: 'Venus brings charisma and appeal',
    sunAlignment: 'Sun alignment boosts leadership qualities',
    
    // Challenges
    marsNervousness: 'Mars energy may create nervousness',
    saturnPreparation: 'Saturn suggests thorough preparation',
    eclipseFlexibility: 'Eclipse season requires flexibility',
    
    // Interview tips
    wearColors: 'Wear colors that align with your favorable planets',
    practiceAnswers: 'Practice your answers during a waxing moon phase',
    arriveEarly: 'Arrive early to align with positive energy',
    bringTalisman: 'Bring a small crystal or talisman for confidence',
    
    // Footer
    footerTagline: 'Moon-guided decisions',
    disclaimer: 'Disclaimer: For entertainment purposes only. Not financial advice.',
  },
  ru: {
    // Header
    login: 'Войти',
    
    // Hero section
    heroTitle: 'Подходящее ли сейчас время для собеседования?',
    heroSubtitle: 'Позвольте луне и звёздам направить ваши карьерные решения через древнюю мудрость',
    heroDescription: '',
    
    // User form
    userData: 'Данные пользователя',
    userDataDescription: 'Введите информацию о рождении для настройки на космические энергии',
    birthDateTime: 'Дата и время рождения',
    city: 'Город',
    setUserData: 'Установить данные пользователя',
    
    // Interview form
    interviewData: 'Данные собеседования',
    interviewDataDescription: 'Введите местоположение собеседования и планируемую дату',
    intendedInterviewDateTime: 'Планируемые дата и время собеседования',
    setInterviewData: 'Установить данные собеседования',
    
    // Ask stars button
    askStars: 'Спросить звёзды',
    consultingCosmos: 'Консультируюсь с космосом...',
    fillBothForms: 'Пожалуйста, заполните обе формы, чтобы спросить звёзды',
    
    // Results
    cosmicCareerAnalysis: 'Космический карьерный анализ',
    basedOnData: 'На основе ваших данных рождения и намерений собеседования',
    highlyFavorable: 'Очень благоприятно',
    favorable: 'Благоприятно',
    proceedWithCaution: 'Действуйте с осторожностью',
    starsAlignedMessage: 'Звёзды идеально выровнены для вашего собеседования. Это благоприятное время, чтобы показать свои таланты.',
    goodAlignmentMessage: 'Хорошее космическое выравнивание для карьерного роста. Хорошо подготовьтесь, и уверенность придёт.',
    cautionMessage: 'Космические энергии предлагают дополнительную подготовку. Рассмотрите возможность переноса, если это возможно.',
    cosmicCareerAlignment: 'Показатель космического карьерного выравнивания',
    favorableCosmicFactors: 'Благоприятные космические факторы',
    cosmicChallenges: 'Космические вызовы',
    cosmicInterviewGuidance: 'Космическое руководство для собеседования',
    yourBirthInformation: 'Информация о вашем рождении',
    interviewInformation: 'Информация о собеседовании',
    date: 'Дата',
    location: 'Местоположение',
    intendedDate: 'Планируемая дата',
    
    // Favorable factors
    mercuryEnhances: 'Меркурий улучшает навыки общения',
    jupiterSupports: 'Юпитер поддерживает карьерный рост',
    moonPhaseConfidence: 'Фаза луны поощряет уверенность',
    venusCharisma: 'Венера приносит харизму и привлекательность',
    sunAlignment: 'Выравнивание солнца усиливает лидерские качества',
    
    // Challenges
    marsNervousness: 'Энергия Марса может создавать нервозность',
    saturnPreparation: 'Сатурн предлагает тщательную подготовку',
    eclipseFlexibility: 'Сезон затмений требует гибкости',
    
    // Interview tips
    wearColors: 'Носите цвета, которые соответствуют вашим благоприятным планетам',
    practiceAnswers: 'Практикуйте свои ответы во время растущей луны',
    arriveEarly: 'Приходите раньше, чтобы настроиться на позитивную энергию',
    bringTalisman: 'Принесите небольшой кристалл или талисман для уверенности',
    
    // Footer
    footerTagline: 'Решения, направляемые луной',
    disclaimer: 'Отказ от ответственности: Только в развлекательных целях. Не финансовый совет.',
  }
};

interface LocalizationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export function LocalizationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('moonDvise-language') as Language;
    if (saved && (saved === 'en' || saved === 'ru')) {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('moonDvise-language', lang);
  };

  const value = {
    language,
    setLanguage: handleSetLanguage,
    t: translations[language],
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
}