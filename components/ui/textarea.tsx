interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

const Textarea: React.FC<TextareaProps> = ({ className, ...props }) => {
  return (
    <textarea
      className={`h-64 w-full resize-none rounded-md border p-3 text-sm ${className}`}
      {...props}
    />
  );
};

export { Textarea };
