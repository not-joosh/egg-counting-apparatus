import { useToast } from "@/components/ui/use-toast";

export const useTimer = () => {
    const { toast } = useToast();

    const startTimer = () => {
        return new Date().getTime();
    };

    const endTimer = (start: number) => {
        return new Date().getTime() - start;
    };

    const formatDuration = (duration: number, style: string) => {
        try {
            if(style === "seconds") return `${duration / 1000}s`;
            if(style === "minutes") return `${duration / 60000}m`;
            if(style === "hours") return `${duration / 3600000}h`;
            if(style === "milliseconds") return `${duration}ms`;
        } catch(error: unknown) {
            if(error instanceof Error) {
                toast({
                    title: "Error",
                    description: `${error.message}`,
                    variant: "destructive",
                    duration: 5000,
                });
            } else {
                console.error(error);
            }
        }
    };

    

    return { startTimer, endTimer, formatDuration };
};