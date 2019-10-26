import React from 'react';
import cn from 'classnames';

export default function RightFloatDiv({ className, children, width }) {
  return (
    <div className={cn('right', className)} style={{ width }}>
      {children}
    </div>
  );
}
