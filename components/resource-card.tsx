import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LeafRating } from "@/components/leaf-rating"

interface ResourceCardProps {
  title: string
  category: string
  bodySystem: string
  rating: number
  description: string
}

export function ResourceCard({ title, category, bodySystem, rating, description }: ResourceCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl transform-gpu hover:scale-[1.02] border-2 border-gray-200 hover:border-[#4CAF50] cursor-pointer group">
      <CardHeader className="bg-[#03A9F4]/10 p-5 transition-colors duration-300 group-hover:bg-[#03A9F4]/20">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-[#00796B] group-hover:text-[#4CAF50] pb-1 transition-colors duration-300">
              {title}
            </CardTitle>
            <CardDescription className="mt-1">
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge className="bg-[#4CAF50] hover:bg-[#4CAF50]/90 transition-colors duration-300 hover:scale-105">
                  {category}
                </Badge>
                <Badge className="bg-[#B39DDB] hover:bg-[#B39DDB]/90 text-[#00796B] transition-colors duration-300 hover:scale-105">
                  {bodySystem}
                </Badge>
              </div>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <LeafRating rating={rating} />
        <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
          12 reviews
        </span>
      </CardFooter>
    </Card>
  )
}
