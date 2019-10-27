require('./Box.css');

const React = require('react');
const cn = require('classnames');

const Box = ({ className, children, p }) => (
  <div className={cn('row', className)}>
    <div className="column" style={{ padding: p }}>
      {children}
    </div>
  </div>
);

module.exports = Box;
