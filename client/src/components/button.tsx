import '../css/components/button.css';

interface ButtonProps {
    name: string;
    className?: string;
    type?: "button" | "submit"; 
  }
  
  function Button({ name, className, type = "button" }: ButtonProps) {
    return (
      <button className={className ? className + " auth-btn" : "auth-btn"} type={type}>
        {name}
      </button>
    );
  }
  
  export default Button;
  
