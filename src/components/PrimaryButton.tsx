interface Props {
  text: string;
  onClick: () => void;
  className?: string;
}

export const PrimaryButton = ({ text, onClick, className }: Props) => (
  <button 
    onClick={onClick}
    className={`bg-[#A78BFA] hover:bg-[#8B5CF6] text-white py-4 px-8 rounded-2xl font-bold transition-all shadow-lg shadow-purple-100 ${className}`}
  >
    {text}
  </button>
);
