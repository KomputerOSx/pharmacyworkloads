// src/app/admin/components/WardManagement.tsx
"use client";

import { useState } from "react";
import { useWards, Ward } from "@/context/WardContext";
import { Department, useDepartments } from "@/context/DepartmentContext";
import WardFilter from "./wards/WardFilter";
import WardCard from "./wards/WardCard";
import WardModal from "./wards/WardModal";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import AlertMessage from "@/components/common/AlertMessage";
import ConfirmDialog from "@/components/common/ConfirmDialog";

export default function WardManagement() {
    const {
        wards,
        loading,
        error,
        filter,
        setFilter,
        addNewWard,
        updateExistingWard,
        removeWard,
    } = useWards();

    // We also use departments context to get the hierarchical department structure
    const { departmentHierarchy } = useDepartments();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentWard, setCurrentWard] = useState<Ward | null>(null);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<
        string | undefined
    >(undefined);

    const [actionResult, setActionResult] = useState<{
        success: boolean;
        message: string;
    } | null>(null);

    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        wardId: string;
        wardName: string;
    }>({
        isOpen: false,
        wardId: "",
        wardName: "",
    });

    // For the department selector
    const [isDepartmentSelectorOpen, setIsDepartmentSelectorOpen] =
        useState(false);

    const handleAddWard = (departmentId?: string) => {
        setCurrentWard(null);
        setSelectedDepartmentId(departmentId);
        setModalMode("add");
        setIsModalOpen(true);
        setIsDepartmentSelectorOpen(false);
    };

    const handleEditWard = (ward: Ward) => {
        setCurrentWard(ward);
        setSelectedDepartmentId(undefined);
        setModalMode("edit");
        setIsModalOpen(true);
    };

    const handleDeleteConfirm = (id: string, name: string) => {
        setConfirmDialog({
            isOpen: true,
            wardId: id,
            wardName: name,
        });
    };

    const handleDeleteWard = async () => {
        try {
            await removeWard(confirmDialog.wardId);

            setActionResult({
                success: true,
                message: `Ward "${confirmDialog.wardName}" deleted successfully`,
            });

            // Close the confirm dialog
            setConfirmDialog({
                isOpen: false,
                wardId: "",
                wardName: "",
            });
        } catch (err: any) {
            setActionResult({
                success: false,
                message: err.message || "Failed to delete ward",
            });

            // Close the confirm dialog
            setConfirmDialog({
                isOpen: false,
                wardId: "",
                wardName: "",
            });
        }
    };

    const handleSaveWard = async (ward: Ward) => {
        try {
            if (modalMode === "add") {
                const { id, createdAt, updatedAt, ...newWard } = ward;
                await addNewWard(newWard);

                setActionResult({
                    success: true,
                    message: `Ward "${ward.name}" added successfully`,
                });
            } else {
                await updateExistingWard(ward.id, ward);

                setActionResult({
                    success: true,
                    message: `Ward "${ward.name}" updated successfully`,
                });
            }
            setIsModalOpen(false);
        } catch (err) {
            setActionResult({
                success: false,
                message: `Failed to ${modalMode === "add" ? "add" : "update"} ward`,
            });
        }
    };

    // Toggle the department selector dropdown
    const toggleDepartmentSelector = () => {
        setIsDepartmentSelectorOpen(!isDepartmentSelectorOpen);
    };

    // Build a recursive component to render the department hierarchy
    const renderDepartmentTree = (departments: Department[], level = 0) => {
        if (!departments || departments.length === 0) return null;

        return (
            <ul
                className="menu-list"
                style={{ marginLeft: level > 0 ? "1rem" : "0" }}
            >
                {departments.map((dept) => (
                    <li key={dept.id}>
                        <a
                            onClick={() => handleAddWard(dept.id)}
                            className="is-flex is-align-items-center"
                        >
                            <span
                                className="icon is-small mr-2"
                                style={{
                                    color: dept.color || "#3273dc",
                                    borderRadius: "50%",
                                    width: "10px",
                                    height: "10px",
                                    display: "inline-block",
                                    backgroundColor: dept.color || "#3273dc",
                                }}
                            ></span>
                            <span>{dept.name}</span>
                        </a>
                        {dept.children &&
                            dept.children.length > 0 &&
                            renderDepartmentTree(dept.children, level + 1)}
                    </li>
                ))}
            </ul>
        );
    };

    // Clear action result after 5 seconds
    if (actionResult) {
        setTimeout(() => {
            setActionResult(null);
        }, 5000);
    }

    return (
        <div className="columns">
            <div className="column is-3">
                <div className="box">
                    <h3 className="title is-4 mb-4">Wards</h3>
                    <p className="subtitle is-6 mb-5">Manage hospital wards</p>

                    <div className="buttons mb-4">
                        <div
                            className={`dropdown ${isDepartmentSelectorOpen ? "is-active" : ""}`}
                        >
                            <div className="dropdown-trigger">
                                <button
                                    className="button is-primary"
                                    aria-haspopup="true"
                                    aria-controls="department-dropdown-menu"
                                    onClick={toggleDepartmentSelector}
                                >
                                    <span className="icon">
                                        <i className="fas fa-plus"></i>
                                    </span>
                                    <span>Add Ward</span>
                                    <span className="icon is-small">
                                        <i
                                            className="fas fa-angle-down"
                                            aria-hidden="true"
                                        ></i>
                                    </span>
                                </button>
                            </div>
                            <div
                                className="dropdown-menu"
                                id="department-dropdown-menu"
                                role="menu"
                            >
                                <div className="dropdown-content">
                                    <div className="dropdown-item">
                                        <p className="has-text-weight-bold mb-2">
                                            Select Department
                                        </p>
                                        <p className="is-size-7 mb-3">
                                            Choose which department to add a
                                            ward to:
                                        </p>
                                        {renderDepartmentTree(
                                            departmentHierarchy,
                                        )}
                                    </div>
                                    <hr className="dropdown-divider" />
                                    <a
                                        className="dropdown-item"
                                        onClick={() => handleAddWard()}
                                    >
                                        Add without department
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <WardFilter filter={filter} setFilter={setFilter} />
                </div>
            </div>

            <div className="column is-9">
                {/* Action result message */}
                {actionResult && (
                    <AlertMessage
                        type={actionResult.success ? "success" : "danger"}
                        message={actionResult.message}
                        onClose={() => setActionResult(null)}
                    />
                )}

                {/* Main content area */}
                {loading ? (
                    <LoadingSpinner />
                ) : error ? (
                    <div className="notification is-danger">
                        <button className="delete" onClick={() => {}}></button>
                        {error}
                    </div>
                ) : (
                    <div className="columns is-multiline">
                        {wards.length === 0 ? (
                            <div className="column is-12">
                                <div className="notification is-info">
                                    No wards found. Try adjusting your filters
                                    or add a new ward.
                                </div>
                            </div>
                        ) : (
                            wards.map((ward) => (
                                <div className="column is-4" key={ward.id}>
                                    <WardCard
                                        ward={ward}
                                        onEdit={() => handleEditWard(ward)}
                                        onDelete={() =>
                                            handleDeleteConfirm(
                                                ward.id,
                                                ward.name,
                                            )
                                        }
                                    />
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Ward Modal */}
            <WardModal
                isOpen={isModalOpen}
                mode={modalMode}
                ward={currentWard}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveWard}
                departmentId={selectedDepartmentId}
            />

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title="Delete Ward"
                message={`Are you sure you want to delete "${confirmDialog.wardName}"? This action cannot be undone.`}
                confirmText="Delete Ward"
                cancelText="Cancel"
                onConfirm={handleDeleteWard}
                onCancel={() =>
                    setConfirmDialog({
                        isOpen: false,
                        wardId: "",
                        wardName: "",
                    })
                }
                confirmButtonClass="is-danger"
            />
        </div>
    );
}
