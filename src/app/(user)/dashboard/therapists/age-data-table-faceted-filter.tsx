import * as React from "react"
import { Column } from "@tanstack/react-table"
import { Check, PlusCircle } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { Button } from "~/components/ui/button"
import { Separator } from "~/components/ui/separator"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "~/components/ui/command"
import { cn } from "~/lib/utils"
import { Badge } from "~/components/ui/badge"

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
}

const ageRanges: [number, number][] = [[18,24], [25,34], [35,44], [45,54], [55,64], [65,256]]

function formatAgeRange([min, max]: [number, number]){
  if (min >= 65) {return ("65+");}
  return (min.toString() + "-" + max.toString());
}

export function AgeDataTableFacetedFilter<TData, TValue>({
  column,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues()
  const selectedValues = new Set(column?.getFilterValue() as [number, number][])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle />
          Age
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                className="rounded-sm px-1 font-normal lg:hidden"
                variant="secondary"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    className="rounded-sm px-1 font-normal"
                    variant="secondary"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  ageRanges
                    .filter((ageRange) => selectedValues.has(ageRange))
                    .map((ageRange) => (
                      <Badge
                        key={formatAgeRange(ageRange)}
                        className="rounded-sm px-1 font-normal"
                        variant="secondary"
                      >
                        {formatAgeRange(ageRange)}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Age" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {ageRanges.map((ageRange) => {
                const isSelected = selectedValues.has(ageRange)
                return (
                  <CommandItem
                    key={formatAgeRange(ageRange)}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(ageRange)
                      } else {
                        selectedValues.add(ageRange)
                      }
                      const filterValues = Array.from(selectedValues)
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      )
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check />
                    </div>
                    <span>{formatAgeRange(ageRange)}</span>
                    {facets?.get(ageRange) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(ageRange)}
                      </span>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}