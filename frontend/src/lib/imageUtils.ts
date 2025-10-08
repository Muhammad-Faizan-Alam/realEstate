// Property image fallbacks for when images are missing
const PROPERTY_FALLBACK_IMAGES = [
  "https://media.istockphoto.com/id/2202135969/photo/modern-skyscraper-reaching-for-the-sky-in-tokyo-japan.jpg?s=612x612&w=0&k=20&c=uWryvwXZHNTRi2mo-ZWJaasx9zV54KBwGCoT7efmGIo=",
  "https://media.istockphoto.com/id/2202135969/photo/modern-skyscraper-reaching-for-the-sky-in-tokyo-japan.jpg?s=612x612&w=0&k=20&c=uWryvwXZHNTRi2mo-ZWJaasx9zV54KBwGCoT7efmGIo=",
  "https://media.istockphoto.com/id/2202135969/photo/modern-skyscraper-reaching-for-the-sky-in-tokyo-japan.jpg?s=612x612&w=0&k=20&c=uWryvwXZHNTRi2mo-ZWJaasx9zV54KBwGCoT7efmGIo=",
  "https://media.istockphoto.com/id/2202135969/photo/modern-skyscraper-reaching-for-the-sky-in-tokyo-japan.jpg?s=612x612&w=0&k=20&c=uWryvwXZHNTRi2mo-ZWJaasx9zV54KBwGCoT7efmGIo=",
  "https://media.istockphoto.com/id/2202135969/photo/modern-skyscraper-reaching-for-the-sky-in-tokyo-japan.jpg?s=612x612&w=0&k=20&c=uWryvwXZHNTRi2mo-ZWJaasx9zV54KBwGCoT7efmGIo="
];

export const getPropertyImageFallback = (index?: number | string): string => {
  if (index !== undefined) {
    const numIndex = typeof index === 'string' ? parseInt(index) || 0 : index;
    return PROPERTY_FALLBACK_IMAGES[numIndex % PROPERTY_FALLBACK_IMAGES.length];
  }
  // Random fallback
  return PROPERTY_FALLBACK_IMAGES[Math.floor(Math.random() * PROPERTY_FALLBACK_IMAGES.length)];
};

export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>, fallbackIndex?: number | string) => {
  const target = event.currentTarget;
  target.src = getPropertyImageFallback(fallbackIndex);
  target.onerror = null; // Prevent infinite loop if fallback also fails
};