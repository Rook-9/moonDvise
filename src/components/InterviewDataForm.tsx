import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Calendar, MapPin, Briefcase, ArrowRight } from 'lucide-react';
import { useLocalization } from './LocalizationContext';

interface LocationData {
  date: string;
  city: string;
}

interface InterviewDataFormProps {
  onSubmit: (data: LocationData) => void;
  isSubmitted?: boolean;
  submittedData?: LocationData | null;
}

export function InterviewDataForm({ onSubmit, isSubmitted = false, submittedData = null }: InterviewDataFormProps) {
  const { t } = useLocalization();
  const [formData, setFormData] = useState<LocationData>({
    date: '',
    city: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isDuplicate = submittedData?.date === formData.date && submittedData.city === formData.city;
    if (formData.date && formData.city && !isDuplicate) {
      onSubmit(formData);
    }
  };

  const moveToNextDay = () => {
    if (!formData.date) return;

    const nextDate = new Date(formData.date);
    nextDate.setDate(nextDate.getDate() + 1);

    const pad = (value: number) => String(value).padStart(2, '0');
    const nextDateValue = `${nextDate.getFullYear()}-${pad(nextDate.getMonth() + 1)}-${pad(nextDate.getDate())}T${pad(nextDate.getHours())}:${pad(nextDate.getMinutes())}`;
    setFormData(prev => ({ ...prev, date: nextDateValue }));
  };

  return (
    <Card className="bg-background/50 backdrop-blur-sm border-cyan-500/20">
      <CardHeader>
        <CardTitle className="flex items-center text-cyan-300">
          <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 rounded mr-2 flex items-center justify-center">
            <Briefcase className="w-3 h-3 text-white" />
          </div>
          {t.interviewData}
        </CardTitle>
        <CardDescription>{t.interviewDataDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="interview-date" className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {t.intendedInterviewDateTime}
            </Label>
            <Input
              id="interview-date"
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="bg-background/30 border-cyan-500/30"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interview-city" className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              {t.city}
            </Label>
            <Input
              id="interview-city"
              type="text"
              placeholder="Tokyo, London, New York..."
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              className="bg-background/30 border-cyan-500/30"
              required
            />
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-2">
            <Button
              type="submit"
              disabled={isSubmitted && submittedData?.date === formData.date && submittedData.city === formData.city}
              className="min-w-0 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              {t.setInterviewData}
            </Button>
            <Button type="button" variant="outline" onClick={moveToNextDay} disabled={!formData.date} aria-label={t.nextDay}>
              <ArrowRight className="w-4 h-4 mr-2" />
              {t.nextDay}
            </Button>
          </div>
        </form>

        {/* Success State */}
        {isSubmitted && (
          <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
            <div className="flex items-center text-green-400">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="text-sm font-medium">{t.interviewDataSetSuccessfully}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}