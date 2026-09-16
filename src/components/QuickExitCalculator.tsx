import React, { useState } from "react";
import { Lock, Delete } from "lucide-react";

interface QuickExitCalculatorProps {
  isOpen: boolean;
  onExitDisguise: () => void;
}

export const QuickExitCalculator: React.FC<QuickExitCalculatorProps> = ({
  isOpen,
  onExitDisguise,
}) => {
  const [display, setDisplay] = useState("0");
  const [prevVal, setPrevVal] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [clearOnNext, setClearOnNext] = useState(false);

  if (!isOpen) return null;

  const handleNum = (n: string) => {
    if (display === "0" || clearOnNext) {
      setDisplay(n);
      setClearOnNext(false);
    } else {
      setDisplay(display + n);
    }
  };

  const handleOp = (op: string) => {
    setPrevVal(display);
    setOperation(op);
    setClearOnNext(true);
  };

  const handleEqual = () => {
    if (!operation || prevVal === null) return;
    const a = parseFloat(prevVal);
    const b = parseFloat(display);
    let result = 0;
    if (operation === "+") result = a + b;
    if (operation === "-") result = a - b;
    if (operation === "×") result = a * b;
    if (operation === "÷") result = b !== 0 ? a / b : 0;

    setDisplay(result.toString().slice(0, 10));
    setPrevVal(null);
    setOperation(null);
    setClearOnNext(true);
  };

  const handleClear = () => {
    setDisplay("0");
    setPrevVal(null);
    setOperation(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col justify-between max-w-md mx-auto p-4 select-none animate-fadeIn">
      {/* Discreet top bar */}
      <div className="flex items-center justify-between pt-4 px-2 text-slate-400 text-xs">
        <span>Standard Calculator</span>
        <button
          onClick={onExitDisguise}
          className="flex items-center gap-1 bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-full text-xs cursor-pointer transition-all active:scale-95"
          title="Return to SafeHer"
        >
          <Lock className="w-3.5 h-3.5 text-rose-400" />
          <span>Return to SafeHer</span>
        </button>
      </div>

      {/* Calculator Display */}
      <div className="flex flex-col items-end justify-end px-4 py-8 overflow-hidden">
        <span className="text-slate-400 text-sm h-6">
          {prevVal} {operation}
        </span>
        <span className="text-6xl font-light tracking-tight truncate max-w-full">
          {display}
        </span>
      </div>

      {/* Calculator Keypad */}
      <div className="grid grid-cols-4 gap-3 pb-6">
        <button
          onClick={handleClear}
          className="h-18 rounded-full bg-slate-700 hover:bg-slate-600 text-white font-medium text-2xl flex items-center justify-center transition-colors active:scale-95"
        >
          C
        </button>
        <button
          onClick={() => {
            if (display.length > 1) {
              setDisplay(display.slice(0, -1));
            } else {
              setDisplay("0");
            }
          }}
          className="h-18 rounded-full bg-slate-700 hover:bg-slate-600 text-white font-medium text-2xl flex items-center justify-center transition-colors active:scale-95"
        >
          <Delete className="w-6 h-6" />
        </button>
        <button
          onClick={() => {
            const val = parseFloat(display) * 0.01;
            setDisplay(val.toString());
          }}
          className="h-18 rounded-full bg-slate-700 hover:bg-slate-600 text-white font-medium text-2xl flex items-center justify-center transition-colors active:scale-95"
        >
          %
        </button>
        <button
          onClick={() => handleOp("÷")}
          className="h-18 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-semibold text-2xl flex items-center justify-center transition-colors active:scale-95"
        >
          ÷
        </button>

        <button
          onClick={() => handleNum("7")}
          className="h-18 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-normal text-2xl flex items-center justify-center transition-colors active:scale-95"
        >
          7
        </button>
        <button
          onClick={() => handleNum("8")}
          className="h-18 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-normal text-2xl flex items-center justify-center transition-colors active:scale-95"
        >
          8
        </button>
        <button
          onClick={() => handleNum("9")}
          className="h-18 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-normal text-2xl flex items-center justify-center transition-colors active:scale-95"
        >
          9
        </button>
        <button
          onClick={() => handleOp("×")}
          className="h-18 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-semibold text-2xl flex items-center justify-center transition-colors active:scale-95"
        >
          ×
        </button>

        <button
          onClick={() => handleNum("4")}
          className="h-18 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-normal text-2xl flex items-center justify-center transition-colors active:scale-95"
        >
          4
        </button>
        <button
          onClick={() => handleNum("5")}
          className="h-18 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-normal text-2xl flex items-center justify-center transition-colors active:scale-95"
        >
          5
        </button>
        <button
          onClick={() => handleNum("6")}
          className="h-18 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-normal text-2xl flex items-center justify-center transition-colors active:scale-95"
        >
          6
        </button>
        <button
          onClick={() => handleOp("-")}
          className="h-18 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-semibold text-2xl flex items-center justify-center transition-colors active:scale-95"
        >
          -
        </button>

        <button
          onClick={() => handleNum("1")}
          className="h-18 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-normal text-2xl flex items-center justify-center transition-colors active:scale-95"
        >
          1
        </button>
        <button
          onClick={() => handleNum("2")}
          className="h-18 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-normal text-2xl flex items-center justify-center transition-colors active:scale-95"
        >
          2
        </button>
        <button
          onClick={() => handleNum("3")}
          className="h-18 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-normal text-2xl flex items-center justify-center transition-colors active:scale-95"
        >
          3
        </button>
        <button
          onClick={() => handleOp("+")}
          className="h-18 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-semibold text-2xl flex items-center justify-center transition-colors active:scale-95"
        >
          +
        </button>

        <button
          onClick={() => handleNum("0")}
          className="h-18 col-span-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-normal text-2xl flex items-center justify-start pl-8 transition-colors active:scale-95"
        >
          0
        </button>
        <button
          onClick={() => {
            if (!display.includes(".")) setDisplay(display + ".");
          }}
          className="h-18 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-normal text-2xl flex items-center justify-center transition-colors active:scale-95"
        >
          .
        </button>
        <button
          onClick={handleEqual}
          className="h-18 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-semibold text-2xl flex items-center justify-center transition-colors active:scale-95"
        >
          =
        </button>
      </div>
    </div>
  );
};
