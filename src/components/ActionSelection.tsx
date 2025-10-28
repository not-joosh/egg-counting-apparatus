import { motion } from 'framer-motion';
import { Camera, DollarSign, Edit, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Action } from '@/views/testing-component';

const actions: Action[]  = [
  { value: 'Deleting Tray', icon: <Trash2 className="w-6 h-6" />, label: 'Delete' },
  { value: 'Editing Tray', icon: <Edit className="w-6 h-6" />, label: 'Edit' },
  { value: 'Viewing Tray', icon: <Eye className="w-6 h-6" />, label: 'View' },
  { value: 'Mark Tray as Sold', icon: <DollarSign className="w-6 h-6" />, label: 'Mark as Sold' },
];

interface ActionProps{
    selectedAction: Action;
    setSelectedAction: (action: Action) => void;
    setScannerState: (state: 'initial' | 'scanning' | 'result') => void;
}

export const ActionSelection = ({ selectedAction, setSelectedAction, setScannerState } : ActionProps) => (
  <motion.div
    key="initial"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
  >
    <h2 className="text-2xl font-bold mb-4 text-center">Select Action</h2>
    <p className="text-center text-gray-600 mb-6 text-xs">
      Select an action to perform on the scanned QR code
    </p>
    <div className="grid grid-cols-2 gap-4 mb-6">
      {actions.map((action) => (
        <motion.button
          key={action.value} 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedAction(action)}
          className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${
            selectedAction === action
              ? 'bg-purple-500 text-white'
              : 'bg-secondary hover:bg-purple-200'
          }`}
        >
          {action.icon}
          <span className="mt-2">{action.label}</span>
        </motion.button>
      ))}
    </div>
    <motion.div whileTap={{ scale: 0.95 }}>
      <Button
        onClick={() => setScannerState('scanning')}
        disabled={!selectedAction}
        className="w-full gap-2 bg-purple-500 hover:bg-purple-600 text-white"
      >
        <Camera className="w-5 h-5" />
        Start Scanning
      </Button>
    </motion.div>
  </motion.div>
);

