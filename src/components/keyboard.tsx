import React, { useState, useEffect } from 'react';
import { closeKeyboard, updateValue, updateValue2, updateValue3 } from '@/features/keyboard/keyboard-slice';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { ArrowUp, ArrowLeft, ArrowBigDown } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/app/hooks';

const keys = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

const symbolKeys = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['@', '#', '$', '%', '&', '*', '-', '+', '(', ')'],
  ['!', '?', ':', ';', "'", '"', ',', '.', '/', '\\']
];

type KeyboardMode = 'letters' | 'symbols';

const KeyButton: React.FC<{ children: React.ReactNode; onClick: () => void; className?: string }> = ({ children, onClick, className = '' }) => (
  <motion.button
    onClick={onClick}
    className={`bg-gray-800 text-white rounded-lg text-2xl font-medium flex items-center justify-center shadow-md transition-colors hover:bg-gray-700 active:bg-gray-600 ${className}`}
    whileTap={{ scale: 0.95, backgroundColor: "#4A5568" }}
    whileHover={{ backgroundColor: "#4A5568" }}
  >
    {children}
  </motion.button>
);

export const VirtualKeyboard = () => {
  const dispatch = useAppDispatch();
  const isValue = useAppSelector((state) => state.keyboard?.isValueFocused);
  const isValue2 = useAppSelector((state) => state.keyboard?.isValue2Focused);
  const isValue3 = useAppSelector((state) => state.keyboard?.isValue3Focused);
  const isOpen = useAppSelector((state) => state.keyboard?.isOpen);
  const value = useAppSelector((state) => state.keyboard?.value);
  const value2 = useAppSelector((state) => state.keyboard?.value2);
  const value3 = useAppSelector((state) => state.keyboard?.value3);
  const inputLimit = useAppSelector((state) => state.keyboard?.inputLimit);
  const [mode, setMode] = useState<KeyboardMode>('letters');
  const [isUpperCase, setIsUpperCase] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    if (isOpen) {
      controls.start({ y: 0, opacity: 1 });
      document.getElementById('main-content')!.style.marginBottom = '20%';
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      document.body.style.overflow = 'hidden';
    } else {
      controls.start({ y: "100%", opacity: 0 }).then(() => {
        document.getElementById('main-content')!.style.marginBottom = '0';
        document.body.style.overflow = 'auto';
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isOpen, controls]);

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'letters' ? 'symbols' : 'letters'));
  };

  function renderKeys(): React.ReactNode {
    const currentKeys = mode === 'letters' ? keys : symbolKeys;
    return currentKeys.map((row, rowIndex) => (
      <motion.div 
        key={rowIndex} 
        className="flex justify-center space-x-2 mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: rowIndex * 0.1 }}
      >
        {row.map((key) => (
          <KeyButton 
            key={key} 
            onClick={() => handleKeyPress(key)} 
            className="w-[9%] h-16"
          >
            {mode === 'letters' && isUpperCase ? key.toUpperCase() : key}
          </KeyButton>
        ))}
      </motion.div>
    ));
  }

  function toggleCase(): void {
    setIsUpperCase((prev) => !prev);
  }

  function handleKeyPress(key: string): void {
    const currentValue = isValue ? value : isValue2 ? value2 : value3;
    if (currentValue?.length === inputLimit) return;

    const newKey = mode === 'letters' && isUpperCase ? key.toUpperCase() : key;
    
    if (isValue) dispatch(updateValue((value ?? '') + newKey));
    else if (isValue2) dispatch(updateValue2((value2 ?? '') + newKey));
    else if (isValue3) dispatch(updateValue3((value3 ?? '') + newKey));
  }

  function handleBackspace(): void {
    if (isValue) dispatch(updateValue((value ?? '').slice(0, -1)));
    else if (isValue2) dispatch(updateValue2((value2 ?? '').slice(0, -1)));
    else if (isValue3) dispatch(updateValue3((value3 ?? '').slice(0, -1)));
  }

  return (
    <AnimatePresence>
      <motion.div
        id="expandable-keyboard"
        initial={{ y: "100%", opacity: 0 }}
        animate={controls}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed bottom-0 left-0 right-0 bg-gray-900 shadow-lg z-50 ${!isOpen ? 'pointer-events-none' : ''}`}
      >
        <motion.div
          className="p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="max-w-4xl mx-auto">
            {renderKeys()}
            <motion.div 
              className="flex justify-between space-x-2 mt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <KeyButton onClick={toggleCase} className="w-[15%] h-16 bg-gray-700">
                <ArrowUp size={28} />
              </KeyButton>
              <KeyButton onClick={toggleMode} className="w-[15%] h-16 bg-gray-700">
                {mode === 'letters' ? '123' : 'ABC'}
              </KeyButton>
              <KeyButton onClick={() => handleKeyPress(' ')} className="flex-grow h-16">
                space
              </KeyButton>
              <KeyButton onClick={handleBackspace} className="w-[15%] h-16 bg-gray-700">
                <ArrowLeft size={28} />
              </KeyButton>
              <KeyButton onClick={() => dispatch(closeKeyboard())} className="w-[15%] h-16 bg-gray-700">
                <ArrowBigDown size={28} />
              </KeyButton>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}