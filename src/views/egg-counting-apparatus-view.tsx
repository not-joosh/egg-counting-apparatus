import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { History, Lightbulb, LightbulbOff, Menu, Settings, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { EggTrayHistory } from '@/components/scanning-components/EggTrayHistory'
import { MainInputArea } from '@/components/scanning-components/maininputarea'
import { WebCamView } from '@/components/scanning-components/WebcamView'  
import { useCamera } from '@/hooks/useCamera'
import SettingsPage from '@/components/settings-components/_settings_'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { MENU_ROUTE } from '@/lib/routes'
import { Overlay } from '@/components/scanning-components/overlay'
import { closeKeyboard, resetInputs, setInputLimit } from '@/features/keyboard/keyboard-slice'
import { flask_app } from '@/lib/config'
import { toast } from '@/components/ui/use-toast'
import { setLedState, toggleLedState } from '@/features/led/led-slice'

const iconVariants = {
    expanded: (custom: number) => ({
        y: 0,
        x: 0,
        scale: 1,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 500,
            damping: 25,
            delay: custom * 0.1,
        }
    }),
    collapsed: (custom: number) => ({
        y: 50,
        x: 50,
        scale: 0,
        opacity: 0,
        transition: {
            type: "spring",
            stiffness: 500,
            damping: 25,
            delay: custom * 0.1,
        }
    })
};

const peelVariants = {
    expanded: {
        scale: 1,
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 500,
            damping: 30,
        }
    },
    collapsed: {
        scale: 0,
        y: 20,
        opacity: 0,
        transition: {
            type: "spring",
            stiffness: 500,
            damping: 30,
        }
    }
};

const tooltipVariants = {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 }
};

export const EggCountingApparatusView = () => {
    const [isHistoryOpen, setIsHistoryOpen] = useState(false)
    const { isCameraOn, handleCameraPermission } = useCamera()
    const [isMenuExpanded, setIsMenuExpanded] = useState(false)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [isMenuVisible, setIsMenuVisible] = useState(true)
    const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
    const [showAllTooltips, setShowAllTooltips] = useState(false)
    const isAuthenticated = useAppSelector((state) => state.routingController?.isAuthenticated);
    const isIdle = useAppSelector((state) => state.routingController?.isIdle);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const isFlashOn = useAppSelector((state) => state.led?.isOn)

    const toggleHistory = () => {
      setIsHistoryOpen(!isHistoryOpen)
      setIsMenuVisible(false)
    }

    const toggleMenu = () => {
        setIsMenuExpanded(!isMenuExpanded)
        if (!isMenuExpanded) {
            setShowAllTooltips(true)
            setTimeout(() => {
                setShowAllTooltips(false)
            }, 5000)
        }
    }

    const handleSettingsClick = () => {
      setIsSettingsOpen(true)
      setIsMenuVisible(false)
    }

    const handleFlashClick = async () => {
        try {
            // const endpoint = isFlashOn ? `${flask_app}/toggle-led-off` : `${flask_app}/toggle-led-on`;
            // const response = await fetch(endpoint, {
            //     method: 'POST',
            // });
            
            // const result = await response.json();

            // Setting opposite state
            dispatch(toggleLedState());
            toast({
                title: 'SUCCESS!',
                description: `Flash ${isFlashOn ? 'turned off' : 'turned on'}`,
                duration: 3000,
                className: 'bg-green-300 text-white',
            });
        } catch (error) {
            console.error('Error toggling flash:', error);
            toast({
                title: 'ERROR!',
                description: 'An error occurred while toggling flash',
                duration: 3000,
                className: 'bg-red-300 text-white',
            });
        }
    };

    const menuVariants = {
        hidden: { y: "100%", opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 20,
            }
        },
        exit: { 
            y: "100%", 
            opacity: 0,
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 20,
            }
        }
    }

    useEffect(() => {
        if (isIdle) 
            navigate(MENU_ROUTE);
        if(!isAuthenticated)
            navigate(MENU_ROUTE);
    }, [isIdle, isAuthenticated, navigate]);

    const renderTooltip = (text: string) => (
        <AnimatePresence>
            {(showAllTooltips || activeTooltip === text) && (
                <motion.div
                    variants={tooltipVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className=
                    {`
                        ${(text === "Turn Off Light" || text === "Turn On Light" || text === "Tray History")? "ml-24 mb-16 " : "ml-10 mb-16"} 
                        slide-in-from-top-0 absolute px-2 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap
                    `}
                >
                    {text}
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
      <div className="flex h-screen bg-gray-900 text-white overflow-hidden text-lg"> {/* Increase base text size */}
        {/* Floating Menu */}
        <AnimatePresence>
          {isMenuVisible && (
            <motion.div
              className="fixed bottom-4 left-4 z-50"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                className="relative"
                initial={false}
                animate={isMenuExpanded ? "expanded" : "collapsed"}
              >
                <motion.div
                  className="absolute bottom-16 left-0"
                  variants={iconVariants}
                  custom={0}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:text-primary-foreground/90"
                    onClick={handleSettingsClick}
                    onMouseEnter={() => setActiveTooltip("Settings")}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <Settings className="h-6 w-6" /> {/* Increase icon size */}
                    {renderTooltip("Settings")}
                  </Button>
                </motion.div>
    
                <motion.div
                  className="absolute bottom-12 left-12"
                  variants={iconVariants}
                  custom={1}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:text-primary-foreground/90"
                    onClick={handleFlashClick}
                    onMouseEnter={() => setActiveTooltip(isFlashOn ? "Turn Off Light" : "Turn On Light")}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    {isFlashOn ? <LightbulbOff className="h-6 w-6" /> : <Lightbulb className="h-6 w-6" />} {/* Increase icon size */}
                    {renderTooltip(isFlashOn ? "Turn Off Light" : "Turn On Light")}
                  </Button>
                </motion.div>
    
                <motion.div
                  className="absolute bottom-0 left-16"
                  variants={iconVariants}
                  custom={2}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:text-primary-foreground/90"
                    onClick={toggleHistory}
                    onMouseEnter={() => setActiveTooltip("Tray History")}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <History className="h-6 w-6" /> {/* Increase icon size */}
                    {renderTooltip("Tray History")}
                  </Button>
                </motion.div>
    
                <motion.div
                  className="absolute inset-0 bg-primary/10 rounded-full"
                  variants={peelVariants}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:text-primary-foreground/90 relative z-10"
                  onClick={toggleMenu}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isMenuExpanded ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -180, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 180, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="h-6 w-6" /> {/* Increase icon size */}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 180, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -180, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="h-6 w-6" /> {/* Increase icon size */}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    
        <motion.div 
          className="flex flex-col w-full"
          initial={false}
          animate={{ x: isHistoryOpen || isSettingsOpen? '100%' : '0%' }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Main Input Area and Webcam View */}
          <div className="flex-1 flex">
            <MainInputArea isCameraOn={isCameraOn}/>
            {isCameraOn ? (
                <WebCamView />
            ) : (
                <div className="bg-red-500/40 overflow-hidden w-full flex items-center justify-center h-full flex-col">
                    <p className="text-white text-lg">Camera is off</p> {/* Increase text size */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.99 }}
                        className="m-1 px-4 py-2 text-lg bg-white text-black rounded-md"
                        onClick={handleCameraPermission}
                    >
                        Turn On Camera
                    </motion.button>
                </div>
            )}
          </div>
        </motion.div>
        
        {/* Egg Tray History Component */}
        <EggTrayHistory 
          isOpen={isHistoryOpen} 
          onClose={() => {
            toggleHistory()
            setIsMenuVisible(true)
            dispatch(closeKeyboard())
            dispatch(setInputLimit(60))
            dispatch(resetInputs());
          }}
        />
        <SettingsPage
          isOpen={isSettingsOpen} 
          onClose={() => {
            setIsSettingsOpen(false)
            setIsMenuVisible(true)
            dispatch(closeKeyboard())
            dispatch(setInputLimit(60))
            dispatch(resetInputs());
          }} 
        />
        {isMenuVisible && <Overlay />}
      </div>
    )
  }