'use client';

import React, { useState, useEffect, useMemo } from "react";
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import { masterBodySystems } from "@/lib/mock-data";
import type { Resource } from "@/types/resources";

interface CreateResourceModalProps {
  children: React.ReactNode;
  onResourceCreated?: () => void;
  resource?: Resource; // Optional resource for editing
  mode?: 'create' | 'edit';
}

export function CreateResourceModal({ children, onResourceCreated, resource, mode = 'create' }: CreateResourceModalProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalHeight, setModalHeight] = useState<string>("auto");

  const isEditMode = mode === 'edit' && resource;

  const form = useForm<CreateResourceInput>({
    resolver: zodResolver(createResourceSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
      bodySystems: [],
      mediaUrls: [],
      externalLink: "",
      creationInstructions: "",
    },
  });

  const { handleSubmit, formState: { errors }, reset, watch, control } = form;
  const currentTags = watch("tags", []);
  const [tagInput, setTagInput] = useState("");
  
  // State for media URLs display value
  const [mediaUrlsDisplayValue, setMediaUrlsDisplayValue] = useState("");
  const currentMediaUrls = watch("mediaUrls", []);

  // Store original values for change detection
  const [originalValues, setOriginalValues] = useState<CreateResourceInput | null>(null);

  // Watch all form values for change detection
  const currentValues = watch();

  // Function to compare arrays (order-independent)
  const arraysEqual = (a: string[] | undefined, b: string[] | undefined): boolean => {
    if (!a && !b) return true;
    if (!a || !b) return false;
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, index) => val === sortedB[index]);
  };

  // Function to check if values have changed
  const hasChanges = useMemo(() => {
    if (!isEditMode || !originalValues) return true; // Always allow creation or if no original values

    const current = currentValues;
    const original = originalValues;

    return (
      current.title !== original.title ||
      current.description !== original.description ||
      current.externalLink !== original.externalLink ||
      current.creationInstructions !== original.creationInstructions ||
      !arraysEqual(current.tags, original.tags) ||
      !arraysEqual(current.bodySystems, original.bodySystems) ||
      !arraysEqual(current.mediaUrls, original.mediaUrls)
    );
  }, [currentValues, originalValues, isEditMode]);

  // Pre-populate form when editing
  useEffect(() => {
    if (isEditMode && isOpen) {
      const existingTags = resource.tags.map(rt => rt.tag.name);
      const existingMediaUrls = Array.isArray(resource.mediaUrls) ? resource.mediaUrls : [];
      
      const resourceValues: CreateResourceInput = {
        title: resource.title,
        description: resource.description,
        tags: existingTags,
        bodySystems: resource.bodySystems || [],
        mediaUrls: existingMediaUrls,
        externalLink: resource.externalLink || "",
        creationInstructions: resource.creationInstructions || "",
      };

      // Set form values
      form.setValue("title", resourceValues.title);
      form.setValue("description", resourceValues.description);
      form.setValue("tags", resourceValues.tags);
      form.setValue("bodySystems", resourceValues.bodySystems);
      form.setValue("mediaUrls", resourceValues.mediaUrls);
      form.setValue("externalLink", resourceValues.externalLink);
      form.setValue("creationInstructions", resourceValues.creationInstructions);
      
      // Store original values for comparison
      setOriginalValues(resourceValues);
      
      setMediaUrlsDisplayValue(existingMediaUrls.join(', '));
    }
  }, [isEditMode, resource, isOpen, form]);

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

  const handleMediaUrlsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMediaUrlsDisplayValue(e.target.value);
  };

  const handleMediaUrlsBlur = () => {
    // Process the URLs when user finishes typing
    const urls = mediaUrlsDisplayValue.split(',').map(url => url.trim()).filter(url => url);
    form.setValue("mediaUrls", urls);
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

    // Check for changes in edit mode
    if (isEditMode && !hasChanges) {
      toast({
        title: "No Changes Detected",
        description: "You haven't made any changes to this resource.",
        variant: "default",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const url = isEditMode ? `/api/resources/${resource.id}` : "/api/resources";
      const method = isEditMode ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || `Failed to ${isEditMode ? 'update' : 'create'} resource`);
      }

      toast({
        title: `Resource ${isEditMode ? 'Updated' : 'Created'}!`,
        description: `Your resource has been ${isEditMode ? 'updated' : 'added'} successfully.`,
      });
      reset();
      setIsOpen(false);
      onResourceCreated?.();
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} resource:`, error);
      toast({
        title: "Error",
        description: (error as Error).message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Sync media URLs display value with form value
  useEffect(() => {
    if (Array.isArray(currentMediaUrls)) {
      setMediaUrlsDisplayValue(currentMediaUrls.join(', '));
    }
  }, [currentMediaUrls]);

  useEffect(() => {
    if (!isOpen) {
      reset();
      setTagInput("");
      setMediaUrlsDisplayValue("");
      setModalHeight("auto");
      setOriginalValues(null);
    }
  }, [isOpen, reset]);

  // Track accordion state changes to adjust modal height
  useEffect(() => {
    if (isOpen) {
      // Small delay to allow DOM to update before measuring
      const timeoutId = setTimeout(() => {
        const dialogContent = document.querySelector('[data-radix-dialog-content]') as HTMLElement;
        if (dialogContent) {
          const currentHeight = dialogContent.scrollHeight;
          setModalHeight(`${currentHeight}px`);
        }
      }, 50);

      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent 
        className="sm:max-w-[700px] max-h-[85vh] bg-white border border-[#B39DDB]/30 shadow-lg rounded-lg overflow-hidden flex flex-col modal-smooth-height dialog-content-transition"
        style={{ height: modalHeight }}
      >
        <DialogHeader className="pb-2 px-6 pt-6 flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-[#00796B]">
            {isEditMode ? 'Edit Resource' : 'Create New Resource'}
          </DialogTitle>
          {isEditMode && (
            <p className="text-sm text-gray-600 mt-1">
              {hasChanges ? (
                <span className="text-amber-600">You have unsaved changes</span>
              ) : (
                <span className="text-gray-500">No changes made</span>
              )}
            </p>
          )}
        </DialogHeader>
        
        <div className="overflow-y-auto flex-1 px-6 py-2 scrollbar-thin scrollbar-thumb-[#B39DDB]/30 scrollbar-track-transparent modal-height-transition">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Accordion 
                type="multiple" 
                defaultValue={["basic-info", "tags-categories"]} 
                className="w-full animate-accordion accordion-container"
                onValueChange={() => {
                  // Update modal height when accordion values change
                  setTimeout(() => {
                    const dialogContent = document.querySelector('[data-radix-dialog-content]') as HTMLElement;
                    if (dialogContent) {
                      const newHeight = dialogContent.scrollHeight;
                      setModalHeight(`${newHeight}px`);
                    }
                  }, 50);
                }}
              >
                
                {/* Basic Information Section */}
                <AccordionItem value="basic-info" className="border-[#4CAF50]/30 accordion-item-smooth">
                  <AccordionTrigger className="text-lg font-medium text-[#00796B] hover:text-[#4CAF50] group accordion-trigger-smooth hover:no-underline">
                    <span className="group-hover:underline decoration-[#4CAF50]/40 decoration-2 underline-offset-4 flex items-center transition-all duration-200">
                      <span className="w-2 h-2 rounded-full bg-[#4CAF50] mr-2 transition-all duration-200 group-hover:scale-125"></span>
                      Basic Information <span className="text-red-500 ml-1">*</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2 animate-accordion-content">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Resource Title <span className="text-red-500">*</span></FormLabel>
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
                          <FormDescription>
                            Describe what this resource is, who it's for, and how it helps.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Tags & Categories Section */}
                <AccordionItem value="tags-categories" className="border-[#B39DDB]/30 accordion-item-smooth">
                  <AccordionTrigger className="text-lg font-medium text-[#00796B] hover:text-[#4CAF50] group accordion-trigger-smooth hover:no-underline">
                    <span className="group-hover:underline decoration-[#B39DDB]/40 decoration-2 underline-offset-4 flex items-center transition-all duration-200">
                      <span className="w-2 h-2 rounded-full bg-[#B39DDB] mr-2 transition-all duration-200 group-hover:scale-125"></span>
                      Tags & Categories <span className="text-red-500 ml-1">*</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2 animate-accordion-content">
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
                        <Button type="button" variant="outline" onClick={handleAddTag} disabled={currentTags.length >= 10 || !tagInput.trim()}>
                          Add Tag
                        </Button>
                      </div>
                      <FormDescription>
                        Add tags like "Mobility Aid", "Daily Living", "Technology" to help users find your resource.
                      </FormDescription>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {currentTags.map((tag) => (
                          <span key={tag} className="flex items-center gap-1 bg-gray-200 text-gray-800 px-2 py-1 rounded-md text-sm transition-all duration-200 hover:bg-gray-300">
                            {tag}
                            <button type="button" onClick={() => handleRemoveTag(tag)} className="text-red-500 hover:text-red-700 transition-colors duration-200">&times;</button>
                          </span>
                        ))}
                      </div>
                      {errors.tags && <p className="text-sm font-medium text-destructive">{errors.tags.message || (errors.tags as any)?.root?.message}</p>}
                    </FormItem>

                    <FormField
                      control={control}
                      name="bodySystems"
                      render={() => (
                        <FormItem>
                          <FormLabel>Body Systems (Optional, up to 10)</FormLabel>
                          <FormDescription>
                            Select the body systems relevant to this resource.
                          </FormDescription>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 px-1">
                            {masterBodySystems.map((system) => (
                              <FormField
                                key={system}
                                control={control}
                                name="bodySystems"
                                render={({ field }) => {
                                  const currentBodySystems = field.value || [];
                                  return (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 px-1">
                                      <FormControl>
                                        <Checkbox
                                          checked={currentBodySystems.includes(system)}
                                          onCheckedChange={(checked) => {
                                            const updatedSystems = checked
                                              ? [...currentBodySystems, system]
                                              : currentBodySystems.filter((s: string) => s !== system);
                                            if (updatedSystems.length <= 10) {
                                               field.onChange(updatedSystems);
                                            } else {
                                               toast({
                                                 title: "Limit Reached",
                                                 description: "You can select a maximum of 10 body systems.",
                                                 variant: "destructive"
                                               });
                                            }
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {system}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage>{errors.bodySystems?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Links & Media Section */}
                <AccordionItem value="links-media" className="border-[#03A9F4]/30 accordion-item-smooth">
                  <AccordionTrigger className="text-lg font-medium text-[#00796B] hover:text-[#4CAF50] group accordion-trigger-smooth hover:no-underline">
                    <span className="group-hover:underline decoration-[#03A9F4]/40 decoration-2 underline-offset-4 flex items-center transition-all duration-200">
                      <span className="w-2 h-2 rounded-full bg-[#03A9F4] mr-2 transition-all duration-200 group-hover:scale-125"></span>
                      Links & Media
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2 animate-accordion-content">
                    <FormField
                      control={form.control}
                      name="externalLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>External Link (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/resource" {...field} />
                          </FormControl>
                          <FormDescription>
                            Link to where people can purchase, download, or learn more about this resource.
                          </FormDescription>
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
                            <Input 
                              placeholder="e.g., https://image.com/img.png (separate multiple with commas)" 
                              value={mediaUrlsDisplayValue}
                              onChange={handleMediaUrlsChange}
                              onBlur={handleMediaUrlsBlur}
                            />
                          </FormControl>
                          <FormDescription>
                            Comma-separated list of URLs for images or videos that demonstrate the resource.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Advanced Section */}
                <AccordionItem value="advanced" className="border-[#FF9800]/30 accordion-item-smooth">
                  <AccordionTrigger className="text-lg font-medium text-[#00796B] hover:text-[#4CAF50] group accordion-trigger-smooth hover:no-underline">
                    <span className="group-hover:underline decoration-[#FF9800]/40 decoration-2 underline-offset-4 flex items-center transition-all duration-200">
                      <span className="w-2 h-2 rounded-full bg-[#FF9800] mr-2 transition-all duration-200 group-hover:scale-125"></span>
                      Advanced Options
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2 animate-accordion-content">
                    <FormField
                      control={form.control}
                      name="creationInstructions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Creation/Usage Instructions (Optional)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Instructions on how to create or use the resource if it's a physical item or complex digital tool..." {...field} rows={4}/>
                          </FormControl>
                          <FormDescription>
                            Detailed instructions for DIY resources, setup guides, or usage tips.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

              </Accordion>
            </form>
          </Form>
        </div>

        <DialogFooter className="pt-4 border-t px-6 pb-6 flex-shrink-0">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="transition-all duration-200 hover:scale-105">Cancel</Button>
          </DialogClose>
          <Button 
            type="submit" 
            disabled={isSubmitting || (isEditMode && !hasChanges)} 
            className={`transition-all duration-200 hover:scale-105 hover:shadow-lg ${
              isEditMode && !hasChanges 
                ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' 
                : 'bg-[#4CAF50] hover:bg-[#4CAF50]/90'
            } text-white`}
            onClick={handleSubmit(onSubmit)}
          >
            {isSubmitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Resource" : "Create Resource")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 