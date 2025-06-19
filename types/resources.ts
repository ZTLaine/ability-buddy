export interface MockResource {
  id: string;
  title: string;
  bodySystems: string[]; // Array of body systems (required, min 1)
  tags: string[]; // Array of tags (optional)
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
  description: string;
  likesCount?: number;
  isSupported?: boolean; // Whether the current user has supported this resource
  onClick?: () => void;
}

export interface Author {
  id: string;
  name: string | null;
  image: string | null;
}

export interface Tag {
  id: string;
  name: string;
}

export interface ResourceTagLink {
  tag: Tag;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  mediaUrls: any; // Prisma stores Json as `any` by default, or you can type it e.g. string[] | null
  bodySystems: string[] | null; // Stored as Json in Prisma, comes as string[] or null
  userId: string;
  createdAt: string; // Date will be stringified
  updatedAt: string; // Date will be stringified
  externalLink: string | null;
  creationInstructions: string | null;
  author: Author;
  tags: ResourceTagLink[]; // Array of tag objects
  likesCount?: number; // Number of likes this resource has received
  isSupported?: boolean; // Whether the current user has supported this resource
} 