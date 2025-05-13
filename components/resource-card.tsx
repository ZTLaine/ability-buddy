import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LeafRating } from "@/components/leaf-rating"
import { TagTooltip } from "@/components/tag-tooltip"
import { ResourceCardProps } from "@/types/resources"

export function ResourceCard({ title, bodySystems, tags, rating, description }: ResourceCardProps) {
  return (
    <div className="h-full flex">
      <Card className="flex flex-col overflow-visible paper-texture transition-all duration-300 hover:shadow-xl transform-gpu hover:scale-[1.02] border-2 border-gray-200 hover:border-[#4CAF50] cursor-pointer group w-full">
        <CardHeader className="bg-[#03A9F4]/5 p-5 transition-colors duration-300 group-hover:bg-[#03A9F4]/10 relative">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-[#00796B] group-hover:text-[#4CAF50] pb-1 transition-colors duration-300 resources-highlight">
                {title}
              </CardTitle>
              <CardDescription className="mt-1">
                <div className="flex flex-wrap gap-2 mt-2">
                  <TagTooltip
                    items={bodySystems}
                    className="bg-[#4CAF50] hover:bg-[#4CAF50]/90 transition-all duration-300 hover:scale-105"
                    tooltipLabel="Body Systems"
                    textColor="text-white"
                  />
                  <TagTooltip
                    items={tags}
                    className="bg-[#B39DDB] hover:bg-[#B39DDB]/90 transition-all duration-300 hover:scale-105"
                    tooltipLabel="Tags"
                    textColor="text-black"
                  />
                </div>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 flex-grow">
          <p className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">{description}</p>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <LeafRating rating={rating} />
          <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
            12 reviews
          </span>
        </CardFooter>
      </Card>
    </div>
  )
}
