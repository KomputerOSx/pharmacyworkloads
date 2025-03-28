"use client";

import "../../../styles/console/orgConsole.css";
import { OrgCard } from "@/components/org/OrgCard";
import AddOrgCard from "@/components/org/AddOrgCard";
import { useOrgContext } from "@/context/OrgContext";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loadingSpinner";

export default function OrgConsole() {
    const { orgs, isLoading, error, refetchOrgs } = useOrgContext();

    if (isLoading) {
        return (
            <LoadingSpinner
                className={"flex items-center justify-center h-screen"}
                text={"Loading organisations..."}
                size={"xxlg"}
            />
        );
    }

    if (error) {
        return (
            <div>JUPq8Mdk - Error loading organisations: {error.message}</div>
        );
    }

    return (
        <div className={"container"}>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Select organisation
            </h1>
            <AddOrgCard />
            <Button
                className={" container w-[150px]"}
                onClick={refetchOrgs}
                variant={"outline"}
            >
                Refresh
            </Button>

            <div className={"card-list"}>
                <div className={"card"}></div>

                {orgs.map((org) => (
                    <div key={org.id} className={"card"}>
                        <OrgCard key={org.id} org={org} />
                    </div>
                ))}
            </div>
        </div>
    );
}
