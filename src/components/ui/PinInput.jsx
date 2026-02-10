import { useNavigate } from "react-router-dom";

export function PinInput({ length = 4, onComplete, onIncomplete, error, loading }) {
  const [pin, setPin] = React.useState(Array(length).fill(""));
  const inputRefs = React.useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newPin = [...pin];
    newPin[index] = value.substring(value.length - 1);
    setPin(newPin);

    // Focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
    
    // Check completion
    const pinString = newPin.join('');
    if (pinString.length === length && !newPin.includes('')) {
      onComplete?.(pinString);
    } else {
        onIncomplete?.();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const currentPinString = pin.join('');

  return (
    <div className="flex gap-4 justify-center py-6">
      {pin.map((digit, index) => (
        <input
          key={index}
          type="password"
          maxLength={1}
          value={digit}
          ref={(el) => (inputRefs.current[index] = el)}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={cn(
            "w-14 h-16 text-center text-3xl font-bold bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/20 transition-all caret-transparent selection:bg-transparent",
            digit ? "text-white" : "text-transparent",
            error ? "border-red-500/50 shake" : "",
            loading ? "opacity-50 pointer-events-none" : ""
          )}
          autoFocus={index === 0}
          inputMode="numeric" pattern="[0-9]*"
        />
      ))}
    </div>
  );
}

import React from 'react';
import { cn } from '../../utils/cn';

export default PinInput;
