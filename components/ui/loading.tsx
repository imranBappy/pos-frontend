import {  Loader2 } from "lucide-react"

export const Loading = () => {
    return (
        <div className="absolute inset-0  flex items-center justify-center z-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );
};

export default Loading;