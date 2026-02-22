import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

// Native sheet implementation without Radix UI dependency (disk space workaround)
interface SheetProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    children: React.ReactNode
}

const SheetContext = React.createContext<{
    open: boolean
    setOpen: (open: boolean) => void
}>({
    open: false,
    setOpen: () => { },
})

const Sheet: React.FC<SheetProps> = ({ open: controlledOpen, onOpenChange, children }) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)

    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : uncontrolledOpen

    const setOpen = React.useCallback((newOpen: boolean) => {
        if (!isControlled) {
            setUncontrolledOpen(newOpen)
        }
        onOpenChange?.(newOpen)
    }, [isControlled, onOpenChange])

    return (
        <SheetContext.Provider value={{ open, setOpen }}>
            {children}
        </SheetContext.Provider>
    )
}

const SheetTrigger = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ asChild, onClick, children, ...props }, ref) => {
    const { setOpen } = React.useContext(SheetContext)

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        setOpen(true)
        onClick?.(e)
    }

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement<any>, {
            onClick: handleClick,
        })
    }

    return (
        <div ref={ref} onClick={handleClick} {...props}>
            {children}
        </div>
    )
})
SheetTrigger.displayName = "SheetTrigger"

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
    side?: "top" | "right" | "bottom" | "left"
}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
    ({ side = "right", className, children, ...props }, ref) => {
        const { open, setOpen } = React.useContext(SheetContext)

        React.useEffect(() => {
            if (open) {
                document.body.style.overflow = "hidden"
            } else {
                document.body.style.overflow = ""
            }
            return () => {
                document.body.style.overflow = ""
            }
        }, [open])

        if (!open) return null

        const sideClasses = {
            top: "inset-x-0 top-0 border-b",
            bottom: "inset-x-0 bottom-0 border-t",
            left: "inset-y-0 left-0 h-full border-r",
            right: "inset-y-0 right-0 h-full border-l",
        }

        return (
            <>
                {/* Overlay */}
                <div
                    className="fixed inset-0 z-50 bg-black/80 animate-in fade-in"
                    onClick={() => setOpen(false)}
                />

                {/* Sheet */}
                <div
                    ref={ref}
                    className={cn(
                        "fixed z-50 gap-4 bg-background p-6 shadow-lg transition-transform duration-300 ease-in-out",
                        sideClasses[side],
                        side === "right" && "w-3/4 sm:max-w-sm",
                        side === "left" && "w-3/4 sm:max-w-sm",
                        className
                    )}
                    {...props}
                >
                    {children}
                    <button
                        onClick={() => setOpen(false)}
                        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </button>
                </div>
            </>
        )
    }
)
SheetContent.displayName = "SheetContent"

const SheetHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    className,
    ...props
}) => (
    <div
        className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
        {...props}
    />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    className,
    ...props
}) => (
    <div
        className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
        {...props}
    />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
    className,
    ...props
}) => (
    <h2 className={cn("text-lg font-semibold text-foreground", className)} {...props} />
)
SheetTitle.displayName = "SheetTitle"

const SheetDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
    className,
    ...props
}) => (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
)
SheetDescription.displayName = "SheetDescription"

const SheetClose = SheetTrigger
const SheetPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>
const SheetOverlay: React.FC<React.HTMLAttributes<HTMLDivElement>> = () => null

export {
    Sheet,
    SheetPortal,
    SheetOverlay,
    SheetTrigger,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
}
