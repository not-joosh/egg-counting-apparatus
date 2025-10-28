import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Search, Filter } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '@radix-ui/react-dropdown-menu'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { focusValue, openKeyboard, setInputLimit, updateValue } from '@/features/keyboard/keyboard-slice'

interface EggTrayHistoryProps {
  isOpen: boolean
  onClose: () => void
}

export const EggTrayHistory: React.FC<EggTrayHistoryProps> = ({ isOpen, onClose}) => {
  const searchTerm = useAppSelector((state) => state.keyboard?.value) ?? ""
  const trayHistory = useAppSelector((state) => state.eggCountingApparatus?.Eggtrays)
  const language = useAppSelector((state) => state.settings?.language);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const eggSizes = ['S', 'M', 'L', 'XL', 'J', 'CR']
  const dispatch = useAppDispatch();

  const handleFocus = () => {
    dispatch(focusValue());
    dispatch(setInputLimit(60));
    dispatch(openKeyboard());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateValue(e.target.value));
  };


  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    )
  }
  const sortedAndFilteredItems = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase().trim()
    if (!trayHistory) return []
    const cloneOfTrayHistory = [...trayHistory]
    return cloneOfTrayHistory
      .sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.timeStamp}`);
        const dateB = new Date(`${b.date} ${b.timeStamp}`);
        return dateB.getTime() - dateA.getTime();
      })
      .filter(item =>
        (selectedSizes.length === 0 || selectedSizes.includes(item.eggSize)) &&
        Object.values(item).some(value => 
          value.toString().toLowerCase().includes(lowercasedSearchTerm)
        )
      );
  }, [searchTerm, selectedSizes, trayHistory]);
  return (
    <motion.div
      className="fixed left-0 top-0 bottom-0 w-full bg-gray-800 shadow-lg"
      initial={{ x: '-100%' }}
      animate={{ x: isOpen ? '0%' : '-100%' }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="h-full flex flex-col p-6">
        <div className="flex justify-between items-center mb-6">
          <motion.h1
          className="text-4xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {language === "english" ? "Trays History" : language === "bisaya" ? "Mga na Scan nga Tray" : "Kasaysayan ng mga Tray"}
        </motion.h1>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-white hover:!text-white hover:bg-gray-700"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <div className="mb-6 flex gap-4">
          <div className="relative flex-grow">
          <input
              type="text"
              placeholder={language === "english" ? "Search by layer house or tray ID..." : language === "bisaya" ? "Search gamit ang layer house or tray ID..." : "Maghanap gamit ang layer house o tray ID..."}
              className="bg-gray-800 border-gray-700 w-full p-3 pl-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onFocus={handleFocus}
              onChange={(e) => handleChange(e)}
              aria-label="Search trays"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-gray-800 border-gray-700" aria-hidden="true" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-purple-600 hover:bg-purple-700 hover:!text-white items-center gap-2">
                <Filter className="w-4 h-4" />
                {selectedSizes.length > 0 ? `Filter: ${selectedSizes.join(', ')}` : 'Filter'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-700 border border-gray-600 shadow-lg rounded-lg w-56 p-2">
              <DropdownMenuLabel className="font-bold text-center">Egg Sizes</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-600" />
              {eggSizes.map((size) => (
                <DropdownMenuCheckboxItem
                  key={size}
                  checked={selectedSizes.includes(size)}
                  onCheckedChange={() => handleSizeToggle(size)}
                  className=" select-none cursor-pointer text-white hover:bg-gray-600 rounded-md p-2"
                >
                  {selectedSizes.includes(size)? (
                    <>
                      <motion.span
                        whileTap={{scale: 0.98}}
                        whileHover={{scale: 1.1}}
                        className=" text-green-300 text-xs">&#10003;</motion.span>
                      <motion.span
                        whileTap={{scale: 0.98}}
                        whileHover={{scale: 1.1}}
                        className = "ml-2">
                        {size}
                      </motion.span>
                    </>
                  )
                  :
                  (
                    <motion.span
                      whileTap={{scale: 0.98}}
                      whileHover={{scale: 1.1}}
                      className = "ml-4">
                      {size}
                    </motion.span>
                  )}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <ScrollArea className="flex-1">
          <div className="flex-grow overflow-y-auto pr-4" role="list" aria-label="Tray history">
            {(() => {
              const uniqueTrays = new Set();
              return sortedAndFilteredItems.filter(tray => {
                if (uniqueTrays.has(tray.egg_tray_id)) {
                  return false;
                } else {
                  uniqueTrays.add(tray.egg_tray_id);
                  return true;
                }
              }).map((tray) => (
                <motion.div 
                  key={tray.egg_tray_id} 
                  className="bg-grey-800 rounded-lg shadow-md p-4 hover:shadow-lg mb-4 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="font-semibold text-lg">Tray ID {tray.egg_tray_id}</p>
                  <p className="text-gray-300">{tray.label.displayName}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-300">Egg Size: {tray.eggSize}</p>
                  <p className="text-gray-300">Egg Count: {tray.eggCount}</p>
                  <p className="text-gray-400 text-sm">{tray.date.split('T')[0]}</p>
                  <p className="text-gray-400 text-sm">{tray.timeStamp}</p>
                  </div>
                </motion.div>
              ));
            })()}
          </div>
          {trayHistory?.length === 0 ? (
          <motion.p
            className="text-center text-gray-500 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {language === "english" ? "Tray history empty." : language === "bisaya" ? "Wala pa kay na scan nga tray." : "Walang history ng tray."}
          </motion.p>
        ) : sortedAndFilteredItems.length === 0 && (
          <motion.p
            className="text-center text-gray-500 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {language === "english" ? "No results found. Try adjusting your search or filters." : language === "bisaya" ? "Walay results nga nakita. Sulay ug adjust imong search o filters." : "Walang nahanap na resulta. Subukan baguhin ang iyong search o filter."} 
          </motion.p>
        )}
        </ScrollArea>
      </div>
    </motion.div>
  );
};
