export interface MockResource {
  id: string;
  title: string;
  bodySystems: string[]; // Array of body systems (required, min 1)
  tags: string[]; // Array of tags (optional)
  rating: number; // Out of 5
  description: string;
  // Future fields to align with full requirements:
  // media?: { type: 'image' | 'video'; url: string; altText: string }[];
  // acquisitionLink?: string;
  // creationInstructions?: string;
  // likes?: number;
}

// Selected filters interface
export interface SelectedFilters {
  bodySystems: string[];
  tags: string[];
}

// Filter logic settings interface
export interface FilterSettings {
  bodySystemsLogic: "AND" | "OR";
  tagsLogic: "AND" | "OR";
}

export interface ResourceCardProps {
  title: string;
  bodySystems: string[];
  tags: string[];
  rating: number;
  description: string;
} 