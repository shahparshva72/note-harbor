interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const Textarea: React.FC<TextareaProps> = ({ className, ...props }) => {
  return (
    <textarea
      className={`text-sm resize-none border rounded-md p-3 w-full h-64 ${className}`}
      {...props}
    />
  );
};

export { Textarea };