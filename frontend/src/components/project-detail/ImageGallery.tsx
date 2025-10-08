import { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

const ImageGallery = ({ images, title }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Project Gallery</h2>
          <p className="text-muted-foreground">
            Explore the stunning architecture and design of {title}
          </p>
        </div>

        {/* Main Gallery */}
        <div className="relative animate-fade-in">
          {/* Main Image Display */}
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-card-hover mb-4">
            <img
              src={images[currentIndex]}
              alt={`${title} - Image ${currentIndex + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Navigation Arrows */}
            <Button
              variant="ghost"
              size="icon"
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm"
              disabled={images.length <= 1}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm"
              disabled={images.length <= 1}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>

            {/* Fullscreen Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm"
                  onClick={() => setSelectedImage(images[currentIndex])}
                >
                  <Maximize2 className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-7xl w-full h-[90vh] p-0">
                <img
                  src={selectedImage || images[currentIndex]}
                  alt={`${title} - Fullscreen`}
                  className="w-full h-full object-contain"
                />
              </DialogContent>
            </Dialog>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-4 bg-black/40 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </div>

          {/* Thumbnail Navigation */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all hover:opacity-100 ${
                  index === currentIndex
                    ? "ring-2 ring-primary opacity-100"
                    : "opacity-60 hover:opacity-80"
                }`}
              >
                <img
                  src={image}
                  alt={`${title} - Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center space-x-2 mt-4">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mobile Swipe Hint */}
        <div className="text-center mt-4 md:hidden">
          <p className="text-sm text-muted-foreground">
            Swipe left or right to navigate through images
          </p>
        </div>
      </div>
    </section>
  );
};

export default ImageGallery;