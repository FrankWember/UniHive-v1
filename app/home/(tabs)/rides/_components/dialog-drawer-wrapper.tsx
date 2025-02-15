import React from "react"
import { Search } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export const DialogDrawerWrapper = ({
    title,
    description,
    children,
    searchIsOpen,
    setSearchIsOpen,
  }: {
    title: string
    description: string
    children: React.ReactNode
    searchIsOpen: boolean
    setSearchIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  }) => {
    const isMobile = useIsMobile()
  
    const [open, setOpen] = React.useState(false)
  
    React.useEffect(() => {
      const down = (e: KeyboardEvent) => {
        if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault()
          setOpen((open) => !open)
        }
      }
      document.addEventListener("keydown", down)
      return () => document.removeEventListener("keydown", down)
    }, [])
  
    if (isMobile) {
      return (
        <Drawer open={searchIsOpen} onOpenChange={setSearchIsOpen}>
          <DrawerTrigger asChild>
            <Button variant="secondary">
              <Search className="mr-2 h-4 w-4" /> Where to?
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </DrawerHeader>
            {children}
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )
    } else {
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary">
              <Search className="mr-2 h-4 w-4" /> Where to?
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            {children}
            <DialogFooter className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
    }
  }