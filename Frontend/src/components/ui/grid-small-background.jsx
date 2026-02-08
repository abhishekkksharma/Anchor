import { cn } from "../../lib/utils";
import React from "react";

export function GridSmallBackground({ children, className }) {
    return (
        <>
            {/* Fixed background layers */}
            <div
                className={cn(
                    "fixed inset-0 z-0 bg-white dark:bg-black opacity-70 dark:opacity-100",
                    "[background-size:40px_40px]",
                    "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
                    "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
                )}
            />
            {/* Fixed radial gradient overlay */}
            <div className="pointer-events-none fixed inset-0 z-[1] [background:radial-gradient(ellipse_at_center,transparent_20%,rgba(255,255,255,0.8)_100%)] dark:[background:radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.8)_100%)]" />
            {/* Content wrapper */}
            <div className={cn("relative z-10 min-h-screen", className)}>
                {children}
            </div>
        </>
    );
}
