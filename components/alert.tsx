import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ALERT_PROPS_TYPE {
    name: string;
    title: string;
    description: string;
    onCancel?: () => void;
    onConfirm: () => void;
}

const Alert = (props: ALERT_PROPS_TYPE) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger>{props.name}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{props.title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {
                            props.description
                        }
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={props.onCancel}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={props.onConfirm}>Confirm</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    );
};

export default Alert;