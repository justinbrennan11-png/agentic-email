// Copyright (c) 2026 Cloudflare, Inc.
// Licensed under the Apache 2.0 license found in the LICENSE file or at:
//     https://opensource.org/licenses/Apache-2.0

import { EnvelopeSimpleIcon, UserIcon, CalendarBlankIcon, XIcon, BuildingsIcon } from "@phosphor-icons/react";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

interface AppDrawerProps {
	isOpen: boolean;
	onClose: () => void;
	mailboxId: string;
}

export default function AppDrawer({ isOpen, onClose, mailboxId }: AppDrawerProps) {
	const navigate = useNavigate();
	const location = useLocation();

	// Close on escape key
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				onClose();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const handleOverlayClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	const isContactsActive = location.pathname.includes("/contacts");
	const isMailActive = !isContactsActive; // Default to mail active unless on contacts

	const navigateTo = (path: string) => {
		navigate(path);
		onClose();
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-stretch justify-start bg-black/30 backdrop-blur-sm"
			onClick={handleOverlayClick}
		>
			<div
				className="w-16 h-full bg-sh-bg-panel border-r border-sh-border flex flex-col items-center py-4 shadow-2xl"
				role="dialog"
				aria-modal="true"
			>
				<button
					type="button"
					onClick={onClose}
					className="p-2 mb-8 text-sh-text-muted hover:text-sh-text-white transition-colors focus:outline-none focus:ring-2 focus:ring-sh-accent rounded-[2px]"
					aria-label="Close menu"
				>
					<XIcon size={20} />
				</button>

				<div className="flex flex-col gap-6 w-full px-2">
					<button
						type="button"
						onClick={() => navigateTo(`/mailbox/${mailboxId}/emails/inbox`)}
						className={`p-3 flex justify-center w-full transition-colors rounded-[2px] focus:outline-none focus:ring-2 focus:ring-sh-accent ${
							isMailActive
								? "text-sh-text-white bg-sh-bg-hover"
								: "text-sh-text-muted hover:text-sh-text-white hover:bg-sh-bg-hover"
						}`}
						aria-label="Mail"
						title="Mail"
					>
						<EnvelopeSimpleIcon size={24} weight={isMailActive ? "fill" : "regular"} />
					</button>

					<button
						type="button"
						onClick={() => navigateTo(`/mailbox/${mailboxId}/contacts`)}
						className={`p-3 flex justify-center w-full transition-colors rounded-[2px] focus:outline-none focus:ring-2 focus:ring-sh-accent ${
							isContactsActive
								? "text-sh-text-white bg-sh-bg-hover"
								: "text-sh-text-muted hover:text-sh-text-white hover:bg-sh-bg-hover"
						}`}
						aria-label="Contacts"
						title="Contacts"
					>
						<UserIcon size={24} weight={isContactsActive ? "fill" : "regular"} />
					</button>

					<button
						type="button"
						onClick={() => {
							// For now, calendar is just a placeholder
							alert("Calendar coming soon");
							onClose();
						}}
						className="p-3 flex justify-center w-full text-sh-text-muted hover:text-sh-text-white hover:bg-sh-bg-hover transition-colors rounded-[2px] focus:outline-none focus:ring-2 focus:ring-sh-accent"
						aria-label="Calendar"
						title="Calendar"
					>
						<CalendarBlankIcon size={24} />
					</button>

					<button
						type="button"
						onClick={() => {
							// For now, organizations is just a placeholder
							alert("Organizations coming soon");
							onClose();
						}}
						className="p-3 flex justify-center w-full text-sh-text-muted hover:text-sh-text-white hover:bg-sh-bg-hover transition-colors rounded-[2px] focus:outline-none focus:ring-2 focus:ring-sh-accent"
						aria-label="Organizations"
						title="Organizations"
					>
						<BuildingsIcon size={24} />
					</button>
				</div>
			</div>
		</div>
	);
}
