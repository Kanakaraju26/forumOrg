import "../css/components/textfieldcomponent.css";

interface TextfieldProps {
  type?: string;
  placeholder?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function Textfield({ type = "text", placeholder, name, value, onChange }: TextfieldProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="text-field"
      name={name}
      value={value}
      onChange={onChange}
    />
  );
}

export default Textfield;
