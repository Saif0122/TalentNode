'use client';

import React, { useEffect, useState } from 'react';

interface MatchScoreProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const MatchScore: React.FC<MatchScoreProps> = ({ 
  score, 
  size = 48, 
  strokeWidth = 3,
  className = "" 
}) => {
  const [offset, setOffset] = useState(0);
  const radius = (size / 2) - (strokeWidth * 2);
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const progressOffset = ((100 - score) / 100) * circumference;
    setOffset(progressOffset);
  }, [score, circumference]);

  const getColor = (s: number) => {
    if (s >= 90) return 'text-emerald-500';
    if (s >= 75) return 'text-amber-500';
    return 'text-indigo-400';
  };

  const getTextColor = (s: number) => {
    if (s >= 90) return 'text-emerald-600';
    if (s >= 75) return 'text-amber-600';
    return 'text-indigo-600';
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg className="size-full">
        <circle
          className="text-slate-100"
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
        <circle
          className={`${getColor(score)} progress-ring__circle`}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          r={radius}
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
      </svg>
      <span className={`absolute text-[10px] font-bold ${getTextColor(score)}`}>
        {score}%
      </span>
    </div>
  );
};

export default MatchScore;
