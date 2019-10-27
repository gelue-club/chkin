require('./LeftFloatDiv.css');

const React = require('react');
const cn = require('classnames');

module.exports = function LeftFloatDiv({ className, children, w }) {
  return (
    <div className={cn('left', className)} style={{ width: w }}>
      {children}
    </div>
  );
};
