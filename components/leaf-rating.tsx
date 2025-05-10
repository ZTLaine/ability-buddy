import { Leaf } from "lucide-react"

interface LeafRatingProps {
  rating: number
  maxRating?: number
}

export function LeafRating({ rating, maxRating = 5 }: LeafRatingProps) {
  // Convert rating to nearest 0.5
  const roundedRating = Math.round(rating * 2) / 2

  return (
    <div className="flex items-center" aria-label={`Rating: ${rating} out of ${maxRating}`}>
      {Array.from({ length: maxRating }).map((_, i) => {
        const value = i + 1
        const isFilled = roundedRating >= value
        const isHalfFilled = roundedRating === value - 0.5

        return (
          <span key={i} className="relative">
            {isFilled ? (
              <Leaf className="w-5 h-5 text-[#4CAF50]" />
            ) : isHalfFilled ? (
              <>
                <Leaf className="w-5 h-5 text-gray-300" />
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <Leaf className="w-5 h-5 text-[#4CAF50]" />
                </div>
              </>
            ) : (
              <Leaf className="w-5 h-5 text-gray-300" />
            )}
          </span>
        )
      })}
    </div>
  )
}
