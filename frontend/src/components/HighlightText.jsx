/* eslint-disable no-unused-vars */
import { useTheme } from "../hooks/useTheme";

function HighlightText({ text = "", highlight = "", className = "" }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!highlight.trim()) {
    return <span className={className}>{text}</span>;
  }

  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  
  try {
    const regex = new RegExp(`(${escapeRegex(highlight)})`, "gi");
    const parts = text.split(regex);

    return (
      <span className={className}>
        {parts.map((part, index) => 
          regex.test(part) ? (
            <mark
              key={index}
              className={`${
                isDark
                  ? "bg-yellow-500/30 text-yellow-200"
                  : "bg-yellow-200 text-gray-900"
              } rounded px-0.5 font-semibold`}
            >
              {part}
            </mark>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </span>
    );
  } catch (error) {
    // Fallback if regex fails
    return <span className={className}>{text}</span>;
  }
}

export default HighlightText;