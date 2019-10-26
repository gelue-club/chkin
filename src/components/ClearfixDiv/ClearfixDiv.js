import React from 'react';
import cn from 'classnames';
import Clearfix from 'layouts/Clearfix';

function ClearfixDiv({ className, children }) {
  return (
    <Clearfix>
      {cname => <div className={cn(cname, className)}>{children}</div>}
    </Clearfix>
  );
}

export default ClearfixDiv;
