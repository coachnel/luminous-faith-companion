
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellRing, Check, CheckCheck } from 'lucide-react';
import { useCommunityNotifications } from '@/hooks/useCommunityContent';

const CommunityNotificationCenter = () => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useCommunityNotifications();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              size="sm"
              variant="outline"
              className="gap-2"
            >
              <CheckCheck className="h-4 w-4" />
              Tout marquer comme lu
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Aucune notification</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border transition-colors ${
                  notification.is_read 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {notification.is_read ? (
                      <Bell className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <BellRing className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className={`font-semibold text-sm break-words ${
                        notification.is_read ? 'text-gray-700' : 'text-gray-900'
                      }`}>
                        {notification.title}
                      </h4>
                      <p className={`text-sm mt-1 break-words ${
                        notification.is_read ? 'text-gray-600' : 'text-gray-700'
                      }`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notification.sent_at).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  {!notification.is_read && (
                    <Button
                      onClick={() => markAsRead(notification.id)}
                      size="sm"
                      variant="ghost"
                      className="gap-1 flex-shrink-0"
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommunityNotificationCenter;
