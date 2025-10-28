
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Power, AlertTriangle, RefreshCw, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { flask_app } from '@/lib/config'
import { useToast } from './ui/use-toast'

type ActionType = 'shutdown' | 'reboot'

export const BootOffUI = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [actionType, setActionType] = useState<ActionType>('shutdown')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  const handleActionClick = (action: ActionType) => {
    setActionType(action)
    setShowConfirmDialog(true)
  }

  const handleConfirmAction = async () => {
    setIsLoading(true)
    try {
      if (actionType === 'shutdown') {
        // await new Promise(resolve => setTimeout(resolve, 2000)) // Simulating API call
        // // Uncomment the following line when ready to actually perform the shutdown
        // console.log("Application shutting down...")
        // const res = await fetch(`${flask_app}shutdown`, {
        //     method: 'POST',
        // })
        // const results = await res.json();
        // console.log(results);
        toast({
          title: 'Jokes!',
          description: 'Application shutting down... jk. demo purposes only.',
          duration: 3000,
          className: 'bg-green-300 text-white',
        });
      } else {
        toast({
          title: 'Jokes!',
          description: 'Application rebooting... jk. demo purposes only.',
          duration: 3000,
          className: 'bg-green-300 text-white',
        });
      }
    } catch (error) {
      console.error(`Error during ${actionType}:`, error)
    } finally {
      setIsLoading(false)
      setShowConfirmDialog(false)
      setIsExpanded(false)
    }
  }

  const buttonVariants = {
    hidden: { width: 48, opacity: 0 },
    visible: { width: 'auto', opacity: 1, transition: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] } },
  }

  return (
    <>
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ease: 'easeOut', duration: 0.3 }}
      >
        <AnimatePresence>
          {isExpanded ? (
            <motion.div
              key="expanded"
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="bg-gray-800 rounded-full shadow-lg overflow-hidden flex items-center"
            >
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:bg-gray-700 focus:outline-none rounded-full"
                onClick={handleToggle}
              >
                <Power className="h-6 w-6" />
              </Button>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className="pr-4 pl-2 flex space-x-2"
              >
                <Button
                  variant="destructive"
                  size="sm"
                  className="focus:outline-none rounded-full px-4"
                  onClick={() => handleActionClick('shutdown')}
                >
                  <Power className="h-4 w-4 mr-2" />
                  Shut Down
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white bg-gray-700 hover:bg-gray-600 focus:outline-none rounded-full px-4"
                  onClick={() => handleActionClick('reboot')}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reboot
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="bg-gray-800 text-gray-300 hover:bg-gray-700 focus:outline-none rounded-full shadow-lg"
                onClick={handleToggle}
              >
                <Power className="h-6 w-6" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 ${actionType === 'shutdown' ? 'text-red-600' : 'text-yellow-600'}`}>
              <AlertTriangle className="h-6 w-6" />
              Confirm {actionType === 'shutdown' ? 'Shutdown' : 'Reboot'}
            </DialogTitle>
            <DialogDescription>
              Are you absolutely sure you want to {actionType === 'shutdown' ? 'shut down' : 'reboot'} the Egg Counting Apparatus? 
              {actionType === 'shutdown' ? ' This action will terminate the application.' : ' This action will restart the application.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant={actionType === 'shutdown' ? 'destructive' : 'default'}
              onClick={handleConfirmAction}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {actionType === 'shutdown' ? 'Shutting Down...' : 'Rebooting...'}
                </>
              ) : (
                <>Yes, {actionType === 'shutdown' ? 'Shut Down' : 'Reboot'}</>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}