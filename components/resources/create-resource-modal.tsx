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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import { masterBodySystems } from "@/lib/mock-data";

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

  const { handleSubmit, formState: { errors }, reset, watch, control } = form;
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
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] bg-white border border-[#B39DDB]/30 shadow-lg rounded-lg overflow-hidden flex flex-col">
        <DialogHeader className="pb-2 px-6 pt-6 flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-[#00796B]">Create New Resource</DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto flex-1 px-6 py-2 scrollbar-thin scrollbar-thumb-[#B39DDB]/30 scrollbar-track-transparent">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Accordion type="multiple" defaultValue={["basic-info", "tags-categories"]} className="w-full animate-accordion">
                
                {/* Basic Information Section */}
                <AccordionItem value="basic-info" className="border-[#4CAF50]/30 transition-all duration-300">
                  <AccordionTrigger className="text-lg font-medium text-[#00796B] hover:text-[#4CAF50] group transition-all duration-200 hover:no-underline">
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
                <AccordionItem value="tags-categories" className="border-[#B39DDB]/30 transition-all duration-300">
                  <AccordionTrigger className="text-lg font-medium text-[#00796B] hover:text-[#4CAF50] group transition-all duration-200 hover:no-underline">
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
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2">
                            {masterBodySystems.map((system) => (
                              <FormField
                                key={system}
                                control={control}
                                name="bodySystems"
                                render={({ field }) => {
                                  const currentBodySystems = field.value || [];
                                  return (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
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
                <AccordionItem value="links-media" className="border-[#03A9F4]/30 transition-all duration-300">
                  <AccordionTrigger className="text-lg font-medium text-[#00796B] hover:text-[#4CAF50] group transition-all duration-200 hover:no-underline">
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
                            Comma-separated list of URLs for images or videos that demonstrate the resource.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Advanced Section */}
                <AccordionItem value="advanced" className="border-[#FF9800]/30 transition-all duration-300">
                  <AccordionTrigger className="text-lg font-medium text-[#00796B] hover:text-[#4CAF50] group transition-all duration-200 hover:no-underline">
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
            disabled={isSubmitting} 
            className="bg-[#4CAF50] hover:bg-[#4CAF50]/90 text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
            onClick={handleSubmit(onSubmit)}
          >
            {isSubmitting ? "Creating..." : "Create Resource"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 