require('./View.css');
const React = require('react');
const cn = require('classnames');

function View({ className, children }) {
  return (
    <div className={cn('view', className)}>
      <div>{children}</div>
    </div>
  );
}

module.exports = View;
