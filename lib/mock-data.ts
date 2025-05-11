export interface MockResource {
  id: string;
  title: string;
  category: string; // This can represent a primary tag like 'Symptom Relief' or 'Mobility Aid'
  bodySystem: string; // This can represent a tag like 'Neurological' or 'Musculoskeletal'
  rating: number; // Out of 5
  description: string;
  // Future fields to align with full requirements:
  // media?: { type: 'image' | 'video'; url: string; altText: string }[];
  // acquisitionLink?: string;
  // creationInstructions?: string;
  // likes?: number;
  // tags?: string[]; // For a more extensive tagging system
}

export const mockResources: MockResource[] = [
  {
    id: "1",
    title: "Ergonomic Hand Grip for Pens",
    category: "Mobility Aid",
    bodySystem: "Musculoskeletal",
    rating: 4,
    description: "A soft, ergonomic grip that slides onto standard pens or pencils to reduce hand fatigue and improve grip for those with arthritis or limited hand strength.",
  },
  {
    id: "2",
    title: "Weighted Blanket for Anxiety",
    category: "Symptom Relief",
    bodySystem: "Neurological",
    rating: 5,
    description: "A 15lb weighted blanket that provides deep pressure stimulation to help calm the nervous system and improve sleep quality for individuals with anxiety or sensory processing disorders.",
  },
  {
    id: "3",
    title: "Visual Timer for Task Management",
    category: "Cognitive Aid",
    bodySystem: "Neurological",
    rating: 4,
    description: "A simple visual timer that shows time elapsing, helping individuals with ADHD or autism to better understand time management and stay focused on tasks.",
  },
  {
    id: "4",
    title: "Adaptive Kitchen Utensils Set",
    category: "Daily Living Aid",
    bodySystem: "Musculoskeletal",
    rating: 5,
    description: "Set of kitchen utensils with built-up handles, designed for individuals with limited hand mobility, tremors, or arthritis, making meal preparation easier.",
  },
  {
    id: "5",
    title: "Noise-Cancelling Headphones for Sensory Overload",
    category: "Sensory Tool",
    bodySystem: "Auditory",
    rating: 4,
    description: "Comfortable over-ear headphones that significantly reduce ambient noise, beneficial for individuals prone to sensory overload in loud environments.",
  },
  {
    id: "6",
    title: "Portable Ramp for Wheelchair Access",
    category: "Mobility Aid",
    bodySystem: "General Mobility",
    rating: 3,
    description: "A lightweight, foldable ramp to help navigate small steps or curbs with a wheelchair or scooter. Best for occasional use.",
  },
]; 