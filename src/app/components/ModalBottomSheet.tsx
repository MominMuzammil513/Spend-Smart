"use client";

import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalBottomSheetProps {
    isOpen: boolean;
    onClose: (isOpen: boolean) => void;
    children: React.ReactNode;
    onCloseEditModal?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalBottomSheet: React.FC<ModalBottomSheetProps> = ({
    isOpen,
    onClose,
    children,
    onCloseEditModal,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ y: 0 });
    const modalRef = useRef<HTMLDivElement>(null);

    // Reset position when modal is opened
    useEffect(() => {
        if (isOpen) {
            setPosition({ y: 0 });
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onClose(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const handleDragStart = () => {
        setIsDragging(true);
    };

    const handleDragEnd = (
        event: MouseEvent | TouchEvent | PointerEvent,
        info: { offset: { y: number } }
    ) => {
        setIsDragging(false);
        if (info.offset.y > 100) {
            event.preventDefault();
            onClose(false);
        } else {
            setPosition({ y: 0 });
        }
    };

    const handleDrag = (
        _event: MouseEvent | TouchEvent | PointerEvent,
        info: { offset: { y: number } }
    ) => {
        setPosition((prevPosition) => ({ y: prevPosition.y + info.offset.y }));
    };

    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            event.preventDefault();
            onClose(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center"
                    onClick={handleOverlayClick}
                    aria-modal="true"
                    role="dialog"
                >
                    <motion.div
                        ref={modalRef}
                        initial={{ y: "100%" }}
                        animate={{ y: position.y }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 500 }}
                        drag="y"
                        dragConstraints={{ top: -window.innerHeight / 2, bottom: 0 }}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDrag={handleDrag}
                        dragElastic={0.5}
                        className="dark:bg-gradient-to-b dark:from-zinc-800 dark:to-zinc-950 bg-white rounded-t-2xl shadow-lg overflow-hidden w-full"
                        style={{ touchAction: "none", maxHeight: "90vh" }}
                    >
                        <div className="flex justify-between items-center px-4 py-6 border-b border-zinc-200 dark:border-zinc-600 relative">
                            <div className="w-8 h-1 dark:bg-zinc-500 bg-zinc-300 rounded-full mx-auto" />
                            <div className="absolute top-3 right-3">
                                {onCloseEditModal && (
                                    <button
                                        type="button"
                                        className="text-zinc-500 hover:text-zinc-700 dark:hover:text-white focus:outline-none group relative mr-2"
                                        onClick={() => onCloseEditModal(true)}
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                        </svg>
                                    </button>
                                )}
                                <button
                                    onClick={(event) => {
                                        event.preventDefault();
                                        onClose(false);
                                    }}
                                    className="text-zinc-500 hover:text-zinc-700 dark:hover:text-white focus:outline-none group relative"
                                    aria-label="Close modal"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                        <div className="px-5 pt-5 pb-10 text-nowrap flex flex-wrap gap-2 overflow-y-auto w-full max-h-[calc(90vh - 4rem)]">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ModalBottomSheet;