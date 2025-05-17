'use client';

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createResourceSchema, type CreateResourceInput } from "@/lib/schemas/resource.schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";

interface CreateResourceModalProps {
  children: React.ReactNode;
  onResourceCreated?: () => void;
}

export function CreateResourceModal({ children, onResourceCreated }: CreateResourceModalProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateResourceInput>({
    resolver: zodResolver(createResourceSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
      mediaUrls: [],
      externalLink: "",
      creationInstructions: "",
    },
  });

  const { handleSubmit, formState: { errors }, reset, watch } = form;
  const currentTags = watch("tags", []);
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !currentTags.includes(newTag) && currentTags.length < 10) {
      form.setValue("tags", [...currentTags, newTag]);
      setTagInput("");
    } else if (currentTags.length >= 10) {
      toast({
        title: "Tag limit reached",
        description: "You can add a maximum of 10 tags.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    form.setValue("tags", currentTags.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = async (data: CreateResourceInput) => {
    if (!session) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create a resource.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create resource");
      }

      toast({
        title: "Resource Created!",
        description: "Your new resource has been added successfully.",
      });
      reset();
      setIsOpen(false);
      onResourceCreated?.();
    } catch (error) {
      console.error("Error creating resource:", error);
      toast({
        title: "Error",
        description: (error as Error).message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  useEffect(() => {
    if (!isOpen) {
      reset();
      setTagInput("");
    }
  }, [isOpen, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px] bg-white border border-[#B39DDB]/30 shadow-lg rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#00796B]">Create New Resource</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Beginner's Guide to Meditation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Textarea placeholder="Provide a detailed description of the resource..." {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormItem>
              <FormLabel>Tags <span className="text-red-500">*</span> (up to 10)</FormLabel>
              <div className="flex items-center gap-2">
                <Input 
                  placeholder="Enter a tag and press Add" 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="flex-grow"
                />
                <Button type="button" variant="outline" onClick={handleAddTag} disabled={currentTags.length >= 10 || !tagInput.trim()}>Add Tag</Button>
              </div>
              <FormDescription>
                Press Enter or click 'Add Tag'. Helps users find your resource.
              </FormDescription>
              <div className="mt-2 flex flex-wrap gap-2">
                {currentTags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 bg-gray-200 text-gray-800 px-2 py-1 rounded-md text-sm">
                    {tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="text-red-500 hover:text-red-700">&times;</button>
                  </span>
                ))}
              </div>
               {errors.tags && <p className="text-sm font-medium text-destructive">{errors.tags.message || (errors.tags as any)?.root?.message}</p>}
            </FormItem>

            <FormField
              control={form.control}
              name="externalLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>External Link (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/resource" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mediaUrls"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media URLs (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., https://image.com/img.png (separate multiple with commas)" 
                           {...field} 
                           onChange={(e) => {
                             const urls = e.target.value.split(',').map(url => url.trim()).filter(url => url);
                             field.onChange(urls);
                           }}
                           value={Array.isArray(field.value) ? field.value.join(', ') : ''} 
                    />
                  </FormControl>
                  <FormDescription>
                    Comma-separated list of URLs for images or videos.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="creationInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Creation/Usage Instructions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Instructions on how to create or use the resource if it's a physical item or complex digital tool..." {...field} rows={3}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="py-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting} className="bg-[#4CAF50] hover:bg-[#4CAF50]/90 text-white rounded-lg">
                {isSubmitting ? "Creating..." : "Create Resource"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 