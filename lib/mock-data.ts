import { MockResource } from "@/types/resources";

// Define mock data without redeclaring the interfaces
export const mockResources: MockResource[] = [
  {
    id: "1",
    title: "Ergonomic Hand Grip for Pens",
    bodySystems: ["Musculoskeletal"],
    tags: ["Mobility Aid", "Fine Motor Control", "Writing Tools"],
    description: "A soft, ergonomic grip that slides onto standard pens or pencils to reduce hand fatigue and improve grip for those with arthritis or limited hand strength.",
  },
  {
    id: "2",
    title: "Weighted Blanket for Anxiety",
    bodySystems: ["Neurological"],
    tags: ["Anxiety Relief", "Sleep Aid", "Sensory Tool"],
    description: "A 15lb weighted blanket that provides deep pressure stimulation to help calm the nervous system and improve sleep quality for individuals with anxiety or sensory processing disorders.",
  },
  {
    id: "3",
    title: "Visual Timer for Task Management",
    bodySystems: ["Neurological", "Cognitive"],
    tags: ["ADHD Tool", "Time Management", "Visual Aid"],
    description: "A simple visual timer that shows time elapsing, helping individuals with ADHD or autism to better understand time management and stay focused on tasks.",
  },
  {
    id: "4",
    title: "Adaptive Kitchen Utensils Set",
    bodySystems: ["Musculoskeletal"],
    tags: ["Daily Living Aid", "Kitchen Tool", "Independence"],
    description: "Set of kitchen utensils with built-up handles, designed for individuals with limited hand mobility, tremors, or arthritis, making meal preparation easier.",
  },
  {
    id: "5",
    title: "Noise-Cancelling Headphones for Sensory Overload",
    bodySystems: ["Auditory", "Neurological"],
    tags: ["Sensory Tool", "Noise Reduction", "Focus Aid"],
    description: "Comfortable over-ear headphones that significantly reduce ambient noise, beneficial for individuals prone to sensory overload in loud environments.",
  },
  {
    id: "6",
    title: "Portable Ramp for Wheelchair Access",
    bodySystems: ["General Mobility"],
    tags: ["Mobility Aid", "Accessibility Tool", "Travel"],
    description: "A lightweight, foldable ramp to help navigate small steps or curbs with a wheelchair or scooter. Best for occasional use.",
  },
];

// Define master lists for autocomplete/filtering
export const masterBodySystems = [
  "Musculoskeletal",
  "Neurological",
  "Cognitive",
  "Auditory",
  "Visual",
  "Respiratory",
  "Cardiovascular",
  "Digestive",
  "Integumentary",
  "Endocrine",
  "Immune",
  "Genitourinary",
  "General Mobility"
]; 