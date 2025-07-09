'use client'

import { usePathname } from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Fragment } from "react";

function BreadCrumbs() {
    const pathname = usePathname();

    const segements = pathname.split('/');
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                {segements.map((segment, index) => {
                    if (!segment) return null;

                    const url = `/${segements.slice(0, index + 1).join('/')}`;
                    return (
                        <Fragment key={segment}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem key={segment}>
                                {index === segements.length - 1 ? (
                                    <BreadcrumbPage>{segment}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={url}>
                                        {segment}
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </Fragment>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
export default BreadCrumbs