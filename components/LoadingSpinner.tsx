import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'white' | 'accent';
}

export default function LoadingSpinner({ size = 'medium', color = 'white' }: LoadingSpinnerProps) {
  let dimensions: string;
  
  switch (size) {
    case 'small':
      dimensions = 'w-4 h-4';
      break;
    case 'large':
      dimensions = 'w-12 h-12';
      break;
    case 'medium':
    default:
      dimensions = 'w-8 h-8';
      break;
  }
  
  const colorClass = color === 'accent' ? 'border-accent' : 'border-white';
  
  return (
    <div className={`animate-spin rounded-full border-2 border-t-transparent ${colorClass} ${dimensions}`}></div>
  );
}
