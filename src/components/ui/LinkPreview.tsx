
import React from 'react';
import { ExternalLink } from 'lucide-react';

interface LinkPreviewProps {
  url: string;
  className?: string;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ url, className = '' }) => {
  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const formatUrl = (url: string) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  const getDomainFromUrl = (url: string) => {
    try {
      const domain = new URL(formatUrl(url)).hostname;
      return domain.replace('www.', '');
    } catch {
      return url;
    }
  };

  if (!isValidUrl(formatUrl(url))) {
    return <span className={`text-gray-600 ${className}`}>{url}</span>;
  }

  const formattedUrl = formatUrl(url);
  const domain = getDomainFromUrl(url);

  return (
    <a
      href={formattedUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline transition-colors ${className}`}
    >
      <ExternalLink className="h-3 w-3 flex-shrink-0" />
      <span className="truncate max-w-xs">{domain}</span>
    </a>
  );
};

export default LinkPreview;
