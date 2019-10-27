const React = require('react');
const cn = require('classnames');

const Clearfix = require('../Clearfix');

function ClearfixDiv({ className, children }) {
  return (
    <Clearfix>
      {cname => <div className={cn(cname, className)}>{children}</div>}
    </Clearfix>
  );
}

module.exports = ClearfixDiv;
