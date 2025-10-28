import { BottomNav } from "@/components/bottom-nav"

export const NotificationView = () => {
    return(
        <div>
            <BottomNav user={{id: 'user001', displayName: 'John Doe', role: 'manager'}} onScanQR={() => {}} />  
            <h1>Notification View</h1>
        </div>
    )
}