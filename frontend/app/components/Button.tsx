interface ButtonProps {
  onClick?: () => void;
  type?: 'button' | 'submit';
  className: string;
  children: React.ReactNode;
}

export function Button({ onClick, type = 'button', className, children }: ButtonProps) {
  return (
    <button type={type} onClick={onClick} className={className}>
      {children}
    </button>
  );
}