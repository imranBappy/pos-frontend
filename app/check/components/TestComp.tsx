import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const ExampleDialog = () => {

    return (
        <Dialog

        >
            <DialogTrigger asChild>
                <button className="btn">Open Dialog</button>
            </DialogTrigger>
            <DialogContent

            >
                <p>This is the dialog content. Outside clicks are disabled.</p>

            </DialogContent>
        </Dialog>
    );
};

export default ExampleDialog;
