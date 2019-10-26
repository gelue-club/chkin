import React from 'react';
import cn from 'classnames';

export default function LeftFloatDiv({ className, children, width }) {
  return (
    <div className={cn('left', className)} style={{ width }}>
      {children}
    </div>
  );
}
