import "./clear.css";

export default function Clear({ onClick }) {
  return (
    <button className="cl-wrapper" onClick={onClick}>
      Clear
    </button>
  );
}