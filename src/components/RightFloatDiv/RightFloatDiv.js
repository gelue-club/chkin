require('./RightFloatDiv.css');

const React = require('react');
const cn = require('classnames');

module.exports = function RightFloatDiv({ className, children, w }) {
  return (
    <div className={cn('right', className)} style={{ width: w }}>
      {children}
    </div>
  );
};
