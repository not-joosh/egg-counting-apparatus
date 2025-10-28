import { Button } from '@/components/ui/button';
import { Action } from '@/views/testing-component';

interface ResultProps{
    selectedAction: Action;
    setScannerState: (state: 'initial' | 'scanning' | 'result') => void;
    scannedResult: string;
    handleAction: () => void;
}
export const ScannedResult = ({ scannedResult, selectedAction, handleAction, setScannerState }: ResultProps) => (
  <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
    <h2 className="text-2xl font-bold mb-4 text-center">Scanned Result</h2>
    <p className="mb-4 text-center break-all">{scannedResult}</p>
    <Button onClick={handleAction} className="w-full">
      Perform {selectedAction.label} Action
    </Button>
    <Button
      onClick={() => setScannerState('initial')}
      className="w-full mt-2"
      variant="outline"
    >
      Change Action
    </Button>
  </div>
);

