import "./input.css";

export default function Input({ value, onChange, onClick }) {
  return (
    <div className="ip-wrapper">
      <input
        className="ip-text"
        placeholder="Your prompt here..."
        value={value}
        onChange={onChange}
      />
      <button className="ip-btn" onClick={onClick}>
        Go
      </button>
    </div>
  );
}
