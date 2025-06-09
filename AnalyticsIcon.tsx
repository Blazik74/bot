import React from 'react';

export default function AnalyticsIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="13" width="3" height="8" rx="1.5" fill="currentColor"/>
      <rect x="8.5" y="9" width="3" height="12" rx="1.5" fill="currentColor"/>
      <rect x="14" y="5" width="3" height="16" rx="1.5" fill="currentColor"/>
      <rect x="19.5" y="2" width="3" height="19" rx="1.5" fill="currentColor"/>
    </svg>
  );
} 