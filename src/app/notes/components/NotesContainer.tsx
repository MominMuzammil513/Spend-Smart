import React from 'react';
import Masonry from 'react-masonry-css';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, Clock, Edit, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { NoteFormValues } from './MainNotes';
import { UseFormReturn } from 'react-hook-form';

type Notes = {
    id: string;
    title: string;
    content: string;
    color: string;
    category: string;
    tags: string[];
    liked: boolean;
    pinned: boolean;
    userId: string;
    createdAt: string;
    updatedAt: string;
};

export default function NotesContainer({
    notes,
    isGridView,
    setEditingNote,
    form,
    setIsDialogOpen,
    deleteNote,
    togglePin,
    toggleLike,
    selectedTab,
  }: {
    notes: Notes[];
    isGridView: boolean;
    setEditingNote: (note: Notes) => void;
    form: UseFormReturn<NoteFormValues>; // Updated type
    setIsDialogOpen: (open: boolean) => void;
    deleteNote: (id: string) => void;
    togglePin: (id: string) => void;
    toggleLike: (id: string) => void;
    selectedTab: string;
  }) {
    const breakpointColumnsObj = {
        default: 3, // Maximum 3 columns
        1100: 2,
        700: 1,
        500: 1
    };

    // Filter notes based on selectedTab
    const filteredNotes = selectedTab === 'all' ? notes : notes.filter(note => note.category.toLowerCase() === selectedTab);

    return (
        <AnimatePresence>
            <div className="min-h-screen mt-3">
                <Masonry
                    breakpointCols={isGridView ? breakpointColumnsObj : 1} // Use 1 column for flex view
                    className={isGridView ? 'flex w-auto -ml-4' : 'flex justify-center items-center flex-wrap flex-col w-full'}
                    columnClassName={`${isGridView && 'pl-4 bg-clip-padding'}`}
                >
                    {filteredNotes.map((note) => (
                        <motion.div
                            key={note.id}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card className={`relative flex flex-col ${note.color} transition-all duration-200 overflow-hidden mb-4`}>
                                <CardHeader className="pb-2">
                                    <CardTitle className={`flex items-center justify-between`}>
                                        <span className="truncate mr-2">{note.title}</span>
                                        <div className="flex items-center space-x-2">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => togglePin(note.id)}
                                                        >
                                                            <Calendar className={`h-4 w-4 ${note.pinned ? 'fill-current' : ''}`} />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{note.pinned ? 'Unpin' : 'Pin'} note</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => toggleLike(note.id)}
                                                        >
                                                            <Heart className={`h-4 w-4 ${note.liked ? 'fill-current text-red-500' : ''}`} />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{note.liked ? 'Unlike' : 'Like'} note</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grow text-wrap">
                                    <div className="break-all">
                                        {note.content}
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {note.tags.map(tag => (
                                            <Badge key={tag} variant="secondary" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between items-center mt-auto pt-2 border-t">
                                    <div className={`text-xs flex items-center`}>
                                        <Clock className="h-3 w-3 mr-1" />
                                        {new Date(note.updatedAt).toLocaleString()}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => {
                                            setEditingNote(note);
                                            form.reset({
                                                title: note.title,
                                                content: note.content,
                                                color: note.color,
                                                category: note.category,
                                                tags: note.tags,
                                                liked: note.liked,
                                                pinned: note.pinned,
                                            });
                                            setIsDialogOpen(true);
                                        }}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => deleteNote(note.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </Masonry>
            </div>
        </AnimatePresence>
    );
}