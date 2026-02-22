import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

// Native alert dialog implementation without Radix UI dependency (disk space workaround)
interface AlertDialogProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    children: React.ReactNode
}

const AlertDialogContext = React.createContext<{
    open: boolean
    setOpen: (open: boolean) => void
}>({
    open: false,
    setOpen: () => { },
})

const AlertDialog: React.FC<AlertDialogProps> = ({ open: controlledOpen, onOpenChange, children }) => {
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
        <AlertDialogContext.Provider value={{ open, setOpen }}>
            {children}
        </AlertDialogContext.Provider>
    )
}

const AlertDialogTrigger = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ asChild, onClick, children, ...props }, ref) => {
    const { setOpen } = React.useContext(AlertDialogContext)

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
AlertDialogTrigger.displayName = "AlertDialogTrigger"

const AlertDialogContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    const { open, setOpen } = React.useContext(AlertDialogContext)

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

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 z-50 bg-black/80 animate-in fade-in" />

            {/* Dialog */}
            <div
                ref={ref}
                className={cn(
                    "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </>
    )
})
AlertDialogContent.displayName = "AlertDialogContent"

const AlertDialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    className,
    ...props
}) => (
    <div
        className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
        {...props}
    />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
    className,
    ...props
}) => (
    <div
        className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
        {...props}
    />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
    className,
    ...props
}) => (
    <h2 className={cn("text-lg font-semibold", className)} {...props} />
)
AlertDialogTitle.displayName = "AlertDialogTitle"

const AlertDialogDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
    className,
    ...props
}) => (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
)
AlertDialogDescription.displayName = "AlertDialogDescription"

const AlertDialogAction = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, ...props }, ref) => {
    const { setOpen } = React.useContext(AlertDialogContext)

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e)
        setOpen(false)
    }

    return (
        <button
            ref={ref}
            className={cn(buttonVariants(), className)}
            onClick={handleClick}
            {...props}
        />
    )
})
AlertDialogAction.displayName = "AlertDialogAction"

const AlertDialogCancel = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
    const { setOpen } = React.useContext(AlertDialogContext)

    return (
        <button
            ref={ref}
            className={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className)}
            onClick={() => setOpen(false)}
            {...props}
        />
    )
})
AlertDialogCancel.displayName = "AlertDialogCancel"

const AlertDialogPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>
const AlertDialogOverlay: React.FC<React.HTMLAttributes<HTMLDivElement>> = () => null

export {
    AlertDialog,
    AlertDialogPortal,
    AlertDialogOverlay,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
}
