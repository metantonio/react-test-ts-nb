import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { instructionData } from '@/data/instructionData';

interface HelpModalProps {
    title: string;
    contentKey: keyof typeof instructionData;
    className?: string;
}

const HelpModal: React.FC<HelpModalProps> = ({ title, contentKey, className }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className={`h-6 w-6 text-muted-foreground hover:text-primary ${className}`}>
                    <HelpCircle className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    {instructionData[contentKey]}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default HelpModal;
