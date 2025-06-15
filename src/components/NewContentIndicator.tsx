
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

interface NewContentIndicatorProps {
  hasNewContent: boolean;
  contentCount?: number;
}

const NewContentIndicator = ({ hasNewContent, contentCount }: NewContentIndicatorProps) => {
  if (!hasNewContent) return null;

  return (
    <Badge variant="secondary" className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-none">
      <Sparkles className="h-3 w-3 mr-1" />
      {contentCount ? `${contentCount} nouveautés` : 'Nouveau'}
    </Badge>
  );
};

export default NewContentIndicator;
