require('./Text.css');
const React = require('react');
const cn = require('classnames');

function Text({ className, children, b, size, align, color }) {
  return (
    <div
      className={cn('text', className)}
      style={{ fontWeight: b, fontSize: size, textAlign: align, color }}
    >
      {children}
    </div>
  );
}

module.exports = Text;
