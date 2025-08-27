import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Calendar, MapPin } from 'lucide-react';
import { useLocalization } from './LocalizationContext';

interface LocationData {
  date: string;
  city: string;
}

interface UserDataFormProps {
  onSubmit: (data: LocationData) => void;
  isSubmitted?: boolean;
}

export function UserDataForm({ onSubmit, isSubmitted = false }: UserDataFormProps) {
  const { t } = useLocalization();
  const [formData, setFormData] = useState<LocationData>({
    date: '',
    city: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.date && formData.city) {
      onSubmit(formData);
    }
  };

  return (
    <Card className="bg-background/50 backdrop-blur-sm border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center text-purple-300">
          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded mr-2 flex items-center justify-center">
            <span className="text-white text-xs">人</span>
          </div>
          {t.userData}
        </CardTitle>
        <CardDescription>{t.userDataDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user-date" className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {t.birthDateTime}
            </Label>
            <Input
              id="user-date"
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="bg-background/30 border-purple-500/30"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-city" className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              {t.city}
            </Label>
            <Input
              id="user-city"
              type="text"
              placeholder="Tokyo, London, New York..."
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              className="bg-background/30 border-purple-500/30"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {t.setUserData}
          </Button>
        </form>
        
        {/* Success State */}
        {isSubmitted && (
          <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
            <div className="flex items-center text-green-400">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="text-sm font-medium">User data set successfully!</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}