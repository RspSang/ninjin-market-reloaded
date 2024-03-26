import { InputHTMLAttributes } from 'react';

interface InputProps {
  type: string;
  placeholder: string;
  required: boolean;
  errors?: string[];
  name: string;
}

export default function Input({
  errors = [],
  name,
  ...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <input
        name={name}
        className="bg-transparent rounded-md w-full h-10 ring-2 ring-neutral-200 border-none focus:outline-none focus:ring-4 focus:ring-orange-500 transition placeholder:text-neutral-400"
        {...rest}
      />
      {errors.map((error, index) => (
        <span key={index} className="text-red-500 font-medium">
          {error}
        </span>
      ))}
    </div>
  );
}
