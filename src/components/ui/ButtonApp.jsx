export const ButtonApp = ({ children, addedClass, onClick, ...props }) => {
  return (
    <button
      className={`calc__btn btn ${addedClass ? addedClass : ""}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};
