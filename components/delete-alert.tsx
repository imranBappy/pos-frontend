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
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { DocumentNode, useMutation } from '@apollo/client';
import { useState } from 'react';
interface DeleteAlertProps {
    query: DocumentNode;
    id: string;
    refreshQuery: DocumentNode;
    refreshVariables?: Record<string, unknown>;
}

function DeleteAlert({
    query,
    id,
    refreshQuery,
    refreshVariables,
}: DeleteAlertProps) {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const [deleteMutation, { loading: delete_loading }] = useMutation(query, {
        variables: {
            id: id,
        },
        onCompleted: () => {
            toast({
                title: 'Deleted',
                description: 'Item has been deleted',
            });
        },

        awaitRefetchQueries: true,
        refetchQueries: [
            {
                query: refreshQuery,
                variables: refreshVariables,
            },
        ],
    });

    const handleDelete = () => {
        deleteMutation();
        setOpen(false);
    };
    

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" className="px-2 h-6">
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setOpen(false)}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={delete_loading}
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
export default DeleteAlert;
