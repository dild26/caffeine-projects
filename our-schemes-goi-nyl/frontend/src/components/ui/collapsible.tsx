import * as React from "react"
import { cn } from "@/lib/utils"

// Native implementation without Radix UI dependency (disk space workaround)
interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    children: React.ReactNode
}

const CollapsibleContext = React.createContext<{
    open: boolean
    setOpen: (open: boolean) => void
}>({
    open: false,
    setOpen: () => { },
})

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
    ({ open: controlledOpen, onOpenChange, children, className, ...props }, ref) => {
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
            <CollapsibleContext.Provider value={{ open, setOpen }}>
                <div ref={ref} className={className} {...props}>
                    {children}
                </div>
            </CollapsibleContext.Provider>
        )
    }
)
Collapsible.displayName = "Collapsible"

const CollapsibleTrigger = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ onClick, children, asChild, ...props }, ref) => {
    const { open, setOpen } = React.useContext(CollapsibleContext)

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        setOpen(!open)
        onClick?.(e)
    }

    return (
        <div ref={ref} onClick={handleClick} {...props}>
            {children}
        </div>
    )
})
CollapsibleTrigger.displayName = "CollapsibleTrigger"

const CollapsibleContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    const { open } = React.useContext(CollapsibleContext)

    if (!open) return null

    return (
        <div
            ref={ref}
            className={cn("overflow-hidden transition-all", className)}
            {...props}
        >
            {children}
        </div>
    )
})
CollapsibleContent.displayName = "CollapsibleContent"

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
