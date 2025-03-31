// src/services/OrganisationService.js
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    DocumentData,
    getDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { mapFirestoreDocToOrg } from "@/utils/firestoreUtil";
import { Org } from "@/types/orgTypes";

const OrgsCol = collection(db, "organisations");

export const getOrgs = async (): Promise<Org[]> => {
    try {
        const organisations: Org[] = [];
        const q = query(OrgsCol, orderBy("name"));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const organisation = mapFirestoreDocToOrg(doc.id, data);

            if (organisation) {
                organisations.push(organisation);
            } else {
                console.warn(
                    `CS8WkErM - Document ${doc.id} skipped during getOrgs mapping.`,
                );
            }
        });

        return organisations;
    } catch (error) {
        console.error("6g3FcdFR - Error getting Organisations:", error);
        throw error;
    }
};

export const getOrg = async (orgId: string): Promise<Org | null> => {
    if (!orgId) {
        console.error("Organisation ID is required");
        return null;
    }

    try {
        const docRef = doc(db, "organisations", orgId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return mapFirestoreDocToOrg(docSnap.id, data);
        } else {
            console.error(`YiDf9v38 - No organisation found with ID: ${orgId}`);
            return null;
        }
    } catch (error) {
        console.error("n0b846Cp - Error getting organisation:", error);
        throw error;
    }
};

export const addOrg = async (
    orgData: Omit<
        Org,
        "id" | "createdAt" | "updatedAt" | "createdById" | "updatedById"
    >,
    userId: string = "system",
): Promise<Org | null> => {
    try {
        const dataToAdd: DocumentData = {
            ...orgData,
            active: orgData.active ?? false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            createdById: userId,
            updatedById: userId,
        };

        const docRef = await addDoc(OrgsCol, dataToAdd);
        const newDocSnap = await getDoc(docRef);

        return mapFirestoreDocToOrg(newDocSnap.id, newDocSnap.data());
    } catch (error) {
        console.error("6pHK68JX - Error adding Organisation:", error);
        throw error;
    }
};

// Update an existing Organisation
export const updateOrg = async (
    orgId: string,
    orgUpdateData: Partial<Omit<Org, "id" | "createdAt" | "createdById">>,
    userId: string = "system",
): Promise<Org | null> => {
    if (!orgId) {
        console.error("wJ47B2Uk - Update failed: Organisation ID is required.");

        throw new Error("Lf41DxND - Organisation ID is required for update.");
    }

    const orgRef = doc(db, "organisations", orgId);

    try {
        const dataToUpdate: DocumentData = {
            ...orgUpdateData,
            updatedAt: serverTimestamp(),
            updatedById: userId,
        };

        await updateDoc(orgRef, dataToUpdate);

        const updatedDocSnap = await getDoc(orgRef);

        return mapFirestoreDocToOrg(updatedDocSnap.id, updatedDocSnap.data());
    } catch (error) {
        console.error(
            `wJ47B2Uk - Error updating Organisation with ID ${orgId}:`,
            error,
        );

        throw error;
    }
};

export const deleteOrg = async (orgId: string): Promise<void> => {
    if (!orgId) {
        console.error("1rsnPn8K - Delete failed: Organisation ID is required.");
        throw new Error("hgT9kRXT - Organisation ID is required for deletion.");
    }

    const organisationRef = doc(db, "organisations", orgId);

    try {
        await deleteDoc(organisationRef);
        console.log(
            `xK8NPLbv - Organisation with ID ${orgId} deleted successfully.`,
        );
    } catch (error) {
        console.error(
            `1rsnPn8K - Error deleting Organisation with ID ${orgId}:`,
            error,
        );
        throw error;
    }
};

export const countHospitals = async (
    organisationId: string,
): Promise<number> => {
    if (!organisationId) {
        console.error(
            "vfW8WEG7 - Error counting hospitals: Organisation ID is required.",
        );
        throw new Error("xh8RYSVu - Organisation ID is required.");
    }
    try {
        const hospOrgAssCol = collection(
            db,
            "hospital_organisation_assignments",
        );
        const orgRef = doc(db, "organisations", organisationId); // Create ref once
        const q = query(hospOrgAssCol, where("organisation", "==", orgRef));
        const querySnapshot = await getDocs(q);
        return querySnapshot.size;
    } catch (error) {
        console.error(
            `5zEwZu4E - Error counting hospitals for org ${organisationId}:`,
            error,
        );
        throw error;
    }
};
