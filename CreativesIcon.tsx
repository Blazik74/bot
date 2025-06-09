import React from 'react';

export default function CreativesIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="16" height="16" rx="4" fill="currentColor" fillOpacity="0.15"/>
      <rect x="8" y="8" width="8" height="8" rx="2" fill="currentColor"/>
    </svg>
  );
} 