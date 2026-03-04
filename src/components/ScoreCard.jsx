import React from 'react';

function ScoreCard({ score, label, size = 'medium' }) {
  const getColor = (s) => {
    if (s >= 90) return '#22c55e';
    if (s >= 70) return '#eab308';
    if (s >= 50) return '#f97316';
    return '#ef4444';
  };

  const getGrade = (s) => {
    if (s >= 90) return 'A';
    if (s >= 80) return 'B';
    if (s >= 70) return 'C';
    if (s >= 50) return 'D';
    return 'F';
  };

  const color = getColor(score);
  const radius = size === 'large' ? 54 : 36;
  const stroke = size === 'large' ? 8 : 6;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const svgSize = (radius + stroke) * 2;

  return (
    <div className={`score-card score-card-${size}`}>
      <div className="score-ring">
        <svg width={svgSize} height={svgSize}>
          <circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            stroke="#1e293b"
            strokeWidth={stroke}
            fill="none"
          />
          <circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            stroke={color}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: 'stroke-dashoffset 1s ease-in-out',
              transform: 'rotate(-90deg)',
              transformOrigin: 'center',
            }}
          />
        </svg>
        <div className="score-value" style={{ color }}>
          <span className="score-number">{score}</span>
          {size === 'large' && <span className="score-grade">{getGrade(score)}</span>}
        </div>
      </div>
      {label && <span className="score-label">{label}</span>}
    </div>
  );
}

export default ScoreCard;
