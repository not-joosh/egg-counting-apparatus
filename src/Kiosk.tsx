
import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { HOME_ROUTE, MENU_ROUTE, REDIRECT_ROUTE } from "./lib/routes"
import { Toaster } from "./components/ui/toaster"
import { useAppSelector, useAppDispatch } from "./app/hooks"
import { MenuView } from "./views/menu-view"
import { Setup } from "./components/setup"
import { AuthValidationView } from "./views/auth-validation-view"
import { setNetworkStatus } from "./features/network/network-slice"
import { AnimatePresence, motion } from 'framer-motion'
import { WifiOff } from "lucide-react"
import { EggCountingApparatusView } from "./views/egg-counting-apparatus-view"
import { WebcamProvider } from "./lib/webcam-provider"
import { useMonitor } from "./hooks/useMonitor"
import { VirtualKeyboard } from "@/components/keyboard"
import { flask_app } from "./lib/config"
import { BootOffUI } from './components/boot-off-component'
import { NoLabelsModal } from './components/scanning-components/nolabels-modal'
import { Button } from './components/ui/button'

function App() {
  const [isGodMode, setIsGodMode] = useState(false);
  const routeController = useAppSelector((state) => state.routingController)
  const networkStatus = useAppSelector((state) => state.network?.networkStatus)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if(isGodMode) {

    } else {
      const checkNetworkStatus = async () => {
        const res = await fetch(`${flask_app}check-internet`)
        const data = await res.json()
        // dispatch(setNetworkStatus(false))
        dispatch(setNetworkStatus(data.content.success))
      }
  
      checkNetworkStatus()
      const intervalId = setInterval(checkNetworkStatus, 5000)
  
      const handleOnline = () => dispatch(setNetworkStatus(true))
      const handleOffline = () => dispatch(setNetworkStatus(false))
  
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
  
      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
        clearInterval(intervalId)
      }
    }
  }, [dispatch, isGodMode])

  

  useEffect(() => {
    const checkLocalStorage = () => {
      if (!localStorage.getItem('persist:root')) {
        // we'll just define it really quick now
        localStorage.setItem('persist:root', '{}');
        window.location.reload();
      }
    };

    checkLocalStorage();
    const intervalId = setInterval(checkLocalStorage, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // This useEffect is for printing the size per item in terms of GB in local storage
    // This is useful for debugging purposes
    const size = (key: string) => {
      const item = localStorage.getItem(key)
      if (item) {
        const size = new Blob([item]).size
        console.log(`${key} is ${size / 1024 / 1024} MB`)
      };
    };

    size('persist:root')
  }, [])

  useMonitor()

  return (
    <>
      <BootOffUI />
      <div className="flex flex-col min-h-screen">
        <div
          id="main-content"
          className="main-content"
        >
          <Toaster />
          {routeController?.isSetup ? (
            <WebcamProvider>
              <Router>
                <Routes>
                  <Route path={MENU_ROUTE} element={<MenuView />} />
                  <Route path={REDIRECT_ROUTE} element={<AuthValidationView />} />
                  <Route path={HOME_ROUTE} element={<EggCountingApparatusView />} />
                </Routes>
              </Router>
            </WebcamProvider>
          ) : (
            <Setup />
          )}
        </div>
        <div className="flex justify-center items-center space-x-4 fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        {/* <Button
          className="bg-red-500 text-white p-4 rounded-lg shadow-lg flex items-center space-x-3 hover:bg-red-600"
          onClick={() => dispatch(setNetworkStatus(!networkStatus))}
        >
          Connection: {networkStatus ? "Online" : "Offline"}
        </Button> */}
        {/* <Button
          className="bg-blue-500 text-white p-4 rounded-lg shadow-lg flex items-center space-x-3 hover:bg-blue-600"
          onClick={() => setIsGodMode(!isGodMode)}
        >
          Godmode:
          {isGodMode ? " ON" : " OFF"}
        </Button>  */}
        </div>
        <AnimatePresence>
          {!networkStatus && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg flex items-center space-x-3 z-50"
            >
              <WifiOff size={20} />
              <span className="font-medium">No Internet Connection</span>
              <motion.div
                className="absolute inset-0 rounded-lg"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(239, 68, 68, 0)",
                    "0 0 0 0.1em rgba(239, 68, 68, 0.4)",
                    "0 0 0 0.2em rgba(239, 68, 68, 0)",
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <NoLabelsModal />
        <VirtualKeyboard />
      </div>
    </>
  );
};

export default App
