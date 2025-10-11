'use client';

import { cn } from '@src/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Main page container with vertical dashed borders on left and right
 * Only shows borders on screens >= 1400px
 */
export const PageContainer = ({ children, className }: PageContainerProps) => {
  return <div className={cn('page-container', className)}>{children}</div>;
};

interface SectionDividerProps {
  showGradients?: boolean;
  showDiamonds?: boolean;
  className?: string;
}

/**
 * Horizontal section divider with optional gradient effects and diamond intersections
 * Use between major sections to create visual separation
 */
export const SectionDivider = ({
  showGradients = true,
  showDiamonds = true,
  className,
}: SectionDividerProps) => {
  return (
    <div className={cn('section-divider', className)} style={{ opacity: 1 }}>
      <div className="section-divider-inner">
        <hr className="section-divider-line" />
        {(showGradients || showDiamonds) && (
          <div className="section-divider-gradient-container">
            {showGradients && (
              <>
                <div className="section-divider-gradient-left">
                  <span />
                </div>
                <div className="section-divider-gradient-right">
                  <span />
                </div>
              </>
            )}
            {showDiamonds && (
              <>
                <span className="border-primary/20 bg-muted absolute top-1/2 left-0 z-1 size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-xs border" />
                <span className="border-primary/20 bg-muted absolute top-1/2 right-0 z-1 size-2.5 translate-x-1/2 -translate-y-1/2 rotate-45 rounded-xs border" />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface BlueprintSectionProps {
  children: React.ReactNode;
  className?: string;
  showDivider?: boolean;
  dividerPosition?: 'top' | 'bottom' | 'both';
}

/**
 * Section wrapper that optionally includes dividers
 */
export const BlueprintSection = ({
  children,
  className,
  showDivider = false,
  dividerPosition = 'bottom',
}: BlueprintSectionProps) => {
  return (
    <>
      {showDivider && (dividerPosition === 'top' || dividerPosition === 'both') && (
        <SectionDivider />
      )}
      <section className={className}>{children}</section>
      {showDivider && (dividerPosition === 'bottom' || dividerPosition === 'both') && (
        <SectionDivider />
      )}
    </>
  );
};
