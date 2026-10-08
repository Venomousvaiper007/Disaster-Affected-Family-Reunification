import React from 'react';

export const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive,
  variant = 'teal', // 'teal', 'coral', 'amber', 'green', 'rose', 'blue'
  onClick
}) => {
  const variantStyles = {
    teal: {
      border: 'border-[#E1E9E7] hover:border-[#155E63]/50',
      iconBg: 'bg-[#D8F3EF] text-[#155E63] border-[#B2E4DD]',
      accent: 'bg-[#155E63]',
      valueColor: 'text-[#155E63]'
    },
    coral: {
      border: 'border-[#E1E9E7] hover:border-[#F47C65]/50',
      iconBg: 'bg-[#FEF4F2] text-[#D43C20] border-[#FBC9BF]',
      accent: 'bg-[#F47C65]',
      valueColor: 'text-[#1D3033]'
    },
    amber: {
      border: 'border-[#E1E9E7] hover:border-[#B7791F]/50',
      iconBg: 'bg-amber-50 text-[#B7791F] border-amber-200',
      accent: 'bg-[#B7791F]',
      valueColor: 'text-[#B7791F]'
    },
    green: {
      border: 'border-[#E1E9E7] hover:border-[#24856A]/50',
      iconBg: 'bg-emerald-50 text-[#24856A] border-emerald-200',
      accent: 'bg-[#24856A]',
      valueColor: 'text-[#24856A]'
    },
    rose: {
      border: 'border-[#E1E9E7] hover:border-[#C83D4D]/50',
      iconBg: 'bg-rose-50 text-[#C83D4D] border-rose-200',
      accent: 'bg-[#C83D4D]',
      valueColor: 'text-[#C83D4D]'
    },
    blue: {
      border: 'border-[#E1E9E7] hover:border-[#397BB5]/50',
      iconBg: 'bg-sky-50 text-[#397BB5] border-sky-200',
      accent: 'bg-[#397BB5]',
      valueColor: 'text-[#1D3033]'
    }
  };

  const style = variantStyles[variant] || variantStyles.teal;

  return (
    <div
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl bg-white border ${style.border} p-4 transition-all duration-200 shadow-soft
        ${onClick ? 'cursor-pointer hover:shadow-card hover:-translate-y-0.5' : ''}
      `}
    >
      {/* Accent top line */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${style.accent}`} />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-[#687A7C] block font-sans">
            {title}
          </span>
          <div className="text-2xl lg:text-3xl font-bold font-sans tracking-tight text-[#1D3033] flex items-baseline gap-2">
            <span className={style.valueColor}>{value}</span>
            {trend && (
              <span className={`text-[11px] font-mono font-semibold ${trendPositive ? 'text-[#24856A]' : 'text-[#687A7C]'}`}>
                {trend}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-xl border ${style.iconBg} flex items-center justify-center flex-shrink-0 shadow-xs`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 pt-2.5 border-t border-[#E1E9E7] flex items-center justify-between text-[11px] text-[#687A7C]">
        <span className="truncate">{subtitle}</span>
        {onClick && (
          <span className="text-[#155E63] font-sans font-semibold ml-2 flex-shrink-0 hover:underline">
            View →
          </span>
        )}
      </div>
    </div>
  );
};

