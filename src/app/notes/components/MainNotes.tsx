"use client";

import React, { useState } from 'react';
import { motion} from 'framer-motion';
import { Plus, X} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Notes } from '@/app/actions/getNotes';
import { handleResponse, handleCatchError } from '@/lib/transactionUtils/transactionFunctions';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import NotesContainer from './NotesContainer';
import Search, { InputSearch } from '@/app/components/Search';

const colors = [
  { bg: 'bg-yellow-100 dark:bg-yellow-800', text: 'text-yellow-900 dark:text-yellow-100', hover: 'hover:bg-yellow-200 dark:hover:bg-yellow-700' },
  { bg: 'bg-green-100 dark:bg-green-800', text: 'text-green-900 dark:text-green-100', hover: 'hover:bg-green-200 dark:hover:bg-green-700' },
  { bg: 'bg-blue-100 dark:bg-blue-800', text: 'text-blue-900 dark:text-blue-100', hover: 'hover:bg-blue-200 dark:hover:bg-blue-700' },
  { bg: 'bg-red-100 dark:bg-red-800', text: 'text-red-900 dark:text-red-100', hover: 'hover:bg-red-200 dark:hover:bg-red-700' },
  { bg: 'bg-purple-100 dark:bg-purple-800', text: 'text-purple-900 dark:text-purple-100', hover: 'hover:bg-purple-200 dark:hover:bg-purple-700' },
  { bg: 'bg-pink-100 dark:bg-pink-800', text: 'text-pink-900 dark:text-pink-100', hover: 'hover:bg-pink-200 dark:hover:bg-pink-700' },
  { bg: 'bg-indigo-100 dark:bg-indigo-800', text: 'text-indigo-900 dark:text-indigo-100', hover: 'hover:bg-indigo-200 dark:hover:bg-indigo-700' },
];

const categories = ['All', 'Work', 'Personal', 'Ideas', 'To-Do', 'Other'];

const noteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  color: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  liked: z.boolean(),
  pinned: z.boolean(),
});

type NoteFormValues = z.infer<typeof noteSchema>;

export default function MainNotes({ notes }: { notes: Notes[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGridView, setIsGridView] = useState(true);
  const [selectedTab, setSelectedTab] = useState('all');
  const [editingNote, setEditingNote] = useState<Notes | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: '',
      content: '',
      color: colors[0].bg,
      category: categories[0],
      tags: [],
      liked: false,
      pinned: false,
    },
  });

  const deleteNote = async (id: string) => {
    try {
      const response = await fetch(`/api/notes`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (handleResponse(response, "Note deleted successfully!", "Failed to delete note")) {
        router.refresh();
      }
    } catch (error) {
      handleCatchError("Failed to delete note. Please try again.");
    }
  };

  const togglePin = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}/pin`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (handleResponse(response, "Note pinned/unpinned successfully!", "Failed to pin/unpin note")) {
        router.refresh();
      }
    } catch (error) {
      handleCatchError("Failed to pin/unpin note. Please try again.");
    }
  };

  const toggleLike = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}/like`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (handleResponse(response, "Note liked/unliked successfully!", "Failed to like/unlike note")) {
        router.refresh();
      }
    } catch (error) {
      handleCatchError("Failed to like/unlike note. Please try again.");
    }
  };

  const onSubmit = async (values: NoteFormValues) => {
    setIsLoading(true);
    try {
      const dataToSend = editingNote ? { id: editingNote.id, ...values } : values;
      const response = await fetch(`/api/notes${editingNote ? `/${editingNote.id}` : ''}`, {
        method: editingNote ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      if (handleResponse(response, "Note added successfully!", "Failed to add note")) {
        setIsDialogOpen(false);
        setEditingNote(null);
        router.refresh();
      }
    } catch (error) {
      handleCatchError("Failed to add note. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchTerm(query);
  };

  // Filter notes based on search term
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className={`mx-auto max-w-5xl`}>
        <div className='mx-auto px-2 pb-2 pt-3 sticky top-1 z-20 flex flex-col gap-y-3 rounded-md shadow-md border dark:border-zinc-600 shadow-zinc-500/50 dark:bg-black bg-white'>
          <div className='flex justify-between items-center h-max'>
            <motion.h1
              className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              My Notes
            </motion.h1>
            <div className="flex items-center gap-2">
              <Search
                buttonClassName="text-xl"
                iconClassName="md:h-6 lg:h-7 lg:w-7 md:w-6 h-5 w-5"
                showSearchInput={showSearchInput}
                setShowSearchInput={setShowSearchInput}
              />
              <Label htmlFor="grid-view" className='sm:block hidden'>Grid View</Label>
              <Switch
                id="grid-view"
                className='sm:block hidden'
                checked={isGridView}
                onCheckedChange={setIsGridView}
              />
              <div className="flex items-center gap-4">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className='fixed bottom-14 lg:bottom-2 right-0 lg:right-4 h-12 w-12 rounded-full text-xl lg:text-3xl lg:h-16 lg:w-16 m-4 shadow-lg z-40' onClick={() => form.reset()}>
                      <Plus />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>{editingNote ? 'Edit Note' : 'Add New Note'}</DialogTitle>
                      <DialogDescription>
                        {editingNote ? 'Edit your note here. Click save when you\'re done.' : 'Create a new note here. Click save when you\'re done.'}
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter title" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Content</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Enter content" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="color"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Color</FormLabel>
                              <FormControl>
                                <div className="flex gap-2">
                                  {colors.map((color, index) => (
                                    <motion.button
                                      key={index}
                                      type="button"
                                      className={`w-6 h-6 rounded-full ${color.bg}`}
                                      onClick={() => field.onChange(color.bg)}
                                      whileHover={{ scale: 1.2 }}
                                      whileTap={{ scale: 0.9 }}
                                    />
                                  ))}
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categories.map(category => (
                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="tags"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tags</FormLabel>
                              <FormControl>
                                <div>
                                  <div className="flex flex-wrap gap-2 mb-2">
                                    {field.value.map(tag => (
                                      <Badge key={tag} variant="secondary" className="text-sm">
                                        {tag}
                                        <button type="button" onClick={() => field.onChange(field.value.filter(t => t !== tag))} className="ml-1 text-gray-500 hover:text-gray-700">
                                          <X className="h-3 w-3" />
                                        </button>
                                      </Badge>
                                    ))}
                                  </div>
                                  <div className="flex gap-2">
                                    <Input
                                      placeholder="Add a tag"
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          const newTag = e.currentTarget.value.trim();
                                          if (newTag && !field.value.includes(newTag)) {
                                            field.onChange([...field.value, newTag]);
                                            e.currentTarget.value = '';
                                          }
                                        }
                                      }}
                                    />
                                    <Button type="button" onClick={() => {
                                      const input = document.querySelector('input[placeholder="Add a tag"]') as HTMLInputElement;
                                      const newTag = input.value.trim();
                                      if (newTag && !field.value.includes(newTag)) {
                                        field.onChange([...field.value, newTag]);
                                        input.value = '';
                                      }
                                    }}>Add</Button>
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? 'Saving...' : 'Save'}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className='mt-2 dark:bg-black bg-white'>
            <div className="overflow-x-auto w-full flex justify-center items-center dark:bg-black bg-white">
              <TabsList className="w-max flex space-x-2 dark:bg-black bg-white">
                {categories.map(category => (
                  <TabsTrigger
                    key={category}
                    value={category.toLowerCase()}
                    className={`flex justify-between items-center dark:hover:bg-zinc-800 hover:bg-zinc-300 px-2 py-1.5 rounded-md text-xs lg:text-base border ${selectedTab === category.toLowerCase() ? 'ring-2 dark:ring-white ring-zinc-500 border-none' : 'inactive'}`}
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>
        </div>
        <NotesContainer
          notes={filteredNotes}
          isGridView={isGridView}
          setEditingNote={setEditingNote}
          form={form}
          setIsDialogOpen={setIsDialogOpen}
          deleteNote={deleteNote}
          togglePin={togglePin}
          toggleLike={toggleLike}
          selectedTab={selectedTab}
        />
      </div>
      {showSearchInput && (
        <InputSearch
          showSearchInput={showSearchInput}
          setShowSearchInput={setShowSearchInput}
          onSearchChange={handleSearchChange}
        />
      )}
    </>
  );
}