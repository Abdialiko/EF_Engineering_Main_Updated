import React from 'react';

interface TargetIconProps {
  className?: string;
  style?: React.CSSProperties;
}

const TargetIcon: React.FC<TargetIconProps> = ({ className = '', style = {} }) => {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer ring - Primary color (#F54927) with better visibility */}
      <circle cx="12" cy="12" r="10" fill="#F54927" stroke="currentColor" strokeWidth="2.5" opacity="0.95" />
      
      {/* Middle ring - Secondary color (#042970) with better contrast */}
      <circle cx="12" cy="12" r="6.5" fill="#042970" stroke="currentColor" strokeWidth="2.5" opacity="0.95" />
      
      {/* Inner bullseye - Primary color (#F54927) - center point */}
      <circle cx="12" cy="12" r="2.5" fill="#F54927" stroke="currentColor" strokeWidth="2.5" />
      
      {/* Arrow shaft - Secondary color (#042970), thicker and more visible */}
      <line 
        x1="18" 
        y1="6" 
        x2="12.8" 
        y2="11.2" 
        stroke="#042970" 
        strokeWidth="3" 
        strokeLinecap="round"
        opacity="0.9"
      />
      
      {/* Arrow tip pointing to center - Secondary color, more defined */}
      <path 
        d="M12.8 11.2 L10.5 13.5 L12 12 Z" 
        fill="#042970" 
        stroke="currentColor" 
        strokeWidth="2"
        strokeLinejoin="round"
        opacity="0.9"
      />
      
      {/* Arrow fletching - Primary color (#F54927) - three well-defined feathers */}
      <path 
        d="M18 6 L19.5 5 L19 6.5 L18 6 Z" 
        fill="#F54927" 
        stroke="currentColor" 
        strokeWidth="2"
        strokeLinejoin="round"
        opacity="0.95"
      />
      <path 
        d="M18 6 L19 6.8 L18.5 7.5 L18 6 Z" 
        fill="#F54927" 
        stroke="currentColor" 
        strokeWidth="2"
        strokeLinejoin="round"
        opacity="0.95"
      />
      <path 
        d="M18 6 L18.2 7.2 L17.5 7.5 L18 6 Z" 
        fill="#F54927" 
        stroke="currentColor" 
        strokeWidth="2"
        strokeLinejoin="round"
        opacity="0.95"
      />
      
      {/* Additional crosshair lines for better target representation */}
      <line x1="12" y1="2" x2="12" y2="4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <line x1="12" y1="19.5" x2="12" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <line x1="2" y1="12" x2="4.5" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <line x1="19.5" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
};

export default TargetIcon;

