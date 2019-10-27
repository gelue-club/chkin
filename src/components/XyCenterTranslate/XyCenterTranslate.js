require('./XyCenterTranslate.css');

const React = require('react');
const cn = require('classnames');

function XyCenterTranslate({ className, children, onClick }) {
  return (
    <div className={cn('xy-center', className)} onClick={onClick}>
      {children}
    </div>
  );
}

module.exports = XyCenterTranslate;
