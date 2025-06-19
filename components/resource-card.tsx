import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TagTooltip } from "@/components/tag-tooltip"
import { ResourceCardProps } from "@/types/resources"
import { Sprout, Flower } from "lucide-react"

export function ResourceCard({ title, bodySystems, tags, description, likesCount = 0, isSupported = false, onClick }: ResourceCardProps) {
  return (
    <div className="h-full flex">
      <Card 
        className="flex flex-col overflow-visible paper-texture transition-all duration-300 hover:shadow-xl transform-gpu hover:scale-[1.02] border-2 border-gray-200 hover:border-[#4CAF50] cursor-pointer group w-full rounded-xl"
        onClick={onClick}
      >
        <CardHeader className="bg-[#03A9F4]/5 p-5 transition-colors duration-300 group-hover:bg-[#03A9F4]/10 relative rounded-t-xl">
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
        <CardFooter className="flex justify-between border-t pt-4 rounded-b-xl">
          <div className="flex items-center gap-2 text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
            {isSupported ? (
              <Flower className="h-4 w-4 text-[#B39DDB] transition-all duration-300" />
            ) : (
              <Sprout className="h-4 w-4 text-[#4CAF50] transition-all duration-300" />
            )}
            <span className="text-sm font-medium">
              {likesCount} {likesCount === 1 ? 'supporter' : 'supporters'}
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
