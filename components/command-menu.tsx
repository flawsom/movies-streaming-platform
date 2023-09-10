'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { searchMovieAction } from '@/actions/search'
import { Home, Tv } from 'lucide-react'

import { Movie } from '@/types/movie-result'
import { cn, getPosterImageURL } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandDialogProps,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Icons } from '@/components/icons'

export function CommandMenu({ ...props }: CommandDialogProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [data, setData] = React.useState<Movie[]>([])

  const getMovieResults = async (value: string) => {
    const data = await searchMovieAction({ query: value })
    if (data?.results?.length) {
      setData(data?.results)
    }
  }

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          'relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64'
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="hidden lg:inline-flex">Search for a movie...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Type a command or search..."
          onValueChange={getMovieResults}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Search Movies...">
            {data?.map(
              (movie, index) =>
                movie?.poster_path && (
                  <CommandItem
                    key={index}
                    value={movie.title}
                    className="cursor-pointer"
                    onSelect={() => {
                      runCommand(() => router.push(`/movies/${movie.id}`))
                    }}
                  >
                    <div className="flex max-w-md items-center gap-2">
                      <Avatar>
                        <AvatarImage
                          src={`${getPosterImageURL(movie.poster_path)}`}
                        />
                        <AvatarFallback>G</AvatarFallback>
                      </Avatar>
                      <p className="truncate">{movie.title}</p>
                    </div>
                  </CommandItem>
                )
            )}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Shortcuts...">
            <CommandItem
              className="cursor-pointer"
              onSelect={() => runCommand(() => router.push(`/movies`))}
            >
              <Icons.playIcon className="mr-2 h-4 w-4" />
              Movies
            </CommandItem>
            <CommandItem
              className="cursor-pointer"
              onSelect={() => runCommand(() => router.push(`/tv-shows`))}
            >
              <Tv className="mr-2 h-4 w-4" />
              Series
            </CommandItem>
            <CommandItem
              className="cursor-pointer"
              onSelect={() => runCommand(() => router.push(`/`))}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </CommandItem>
            <CommandItem
              className="cursor-pointer"
              onSelect={() =>
                runCommand(() =>
                  window.open(`https://www.mohamedgado.info/`, '_blank')
                )
              }
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="personal-logo.png" />
                  <AvatarFallback>G</AvatarFallback>
                </Avatar>
                Portfolio
              </div>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  )
}
