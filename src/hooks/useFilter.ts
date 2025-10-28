import { EggtrayFirebase } from "@/features/egg-counting-apparatus/egg-counting-apparatus-slice";
import { useMemo } from "react";

interface UseSortedAndFilteredItemsProps {
    historyItems: EggtrayFirebase[];
    searchTerm: string;
    selectedSizes: string[];
}

export const useFilter = ({ historyItems, searchTerm, selectedSizes }: UseSortedAndFilteredItemsProps) => {
    return useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase().trim();
    return (historyItems ?? [])
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
  }, [historyItems, searchTerm, selectedSizes]);
};