
import React, { useState, useEffect } from 'react';
import { Clock, Bell, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getRandomEncouragement } from '../data/bibleVerses';

interface PrayerReminderProps {
  reminderTimes: string[];
  onPrayerCompleted: () => void;
}

const PrayerReminder: React.FC<PrayerReminderProps> = ({ reminderTimes, onPrayerCompleted }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todaysPrayers, setTodaysPrayers] = useState<string[]>([]);
  const [encouragement, setEncouragement] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    const savedPrayers = localStorage.getItem('today-prayers');
    if (savedPrayers) {
      setTodaysPrayers(JSON.parse(savedPrayers));
    }

    setEncouragement(getRandomEncouragement());

    return () => clearInterval(timer);
  }, []);

  const markPrayerCompleted = (time: string) => {
    const updated = [...todaysPrayers, time];
    setTodaysPrayers(updated);
    localStorage.setItem('today-prayers', JSON.stringify(updated));
    onPrayerCompleted();
  };

  const isTimeForPrayer = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const now = currentTime;
    const prayerTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    const timeDiff = Math.abs(now.getTime() - prayerTime.getTime());
    return timeDiff < 30 * 60 * 1000; // 30 minutes window
  };

  const upcomingPrayer = reminderTimes.find(time => 
    !todaysPrayers.includes(time) && isTimeForPrayer(time)
  );

  return (
    <div className="verse-card space-y-4">
      <div className="flex items-center gap-2">
        <Bell className="text-spiritual-600" size={20} />
        <h3 className="font-semibold text-lg">Rappels de prière</h3>
      </div>

      {upcomingPrayer && (
        <div className="bg-spiritual-50 rounded-lg p-4 border-l-4 border-spiritual-500 animate-pulse">
          <p className="text-spiritual-700 font-medium">
            Il est temps de prier ! 🙏
          </p>
          <p className="text-sm text-gray-600 mt-1">{encouragement}</p>
          <Button
            onClick={() => markPrayerCompleted(upcomingPrayer)}
            className="mt-2 bg-spiritual-500 hover:bg-spiritual-600"
            size="sm"
          >
            <CheckCircle size={16} className="mr-2" />
            J'ai prié
          </Button>
        </div>
      )}

      <div className="space-y-2">
        {reminderTimes.map((time) => (
          <div
            key={time}
            className={`flex items-center justify-between p-3 rounded-lg transition-all ${
              todaysPrayers.includes(time)
                ? 'bg-green-50 border border-green-200'
                : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-gray-500" />
              <span className="font-medium">{time}</span>
            </div>
            
            {todaysPrayers.includes(time) ? (
              <CheckCircle size={18} className="text-green-500" />
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => markPrayerCompleted(time)}
                className="text-xs"
              >
                Marquer comme fait
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrayerReminder;
