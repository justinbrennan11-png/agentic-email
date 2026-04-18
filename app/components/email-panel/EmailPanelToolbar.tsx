// Copyright (c) 2026 Cloudflare, Inc.
// Licensed under the Apache 2.0 license found in the LICENSE file or at:
//     https://opensource.org/licenses/Apache-2.0

import { Tooltip } from "@cloudflare/kumo";
import { useEffect, useRef, useState } from "react";
import {
	ArrowBendUpLeftIcon,
	ArrowBendUpRightIcon,
	ArrowLeftIcon,
	ChatCircleIcon,
	CodeIcon,
	EnvelopeOpenIcon,
	EnvelopeSimpleIcon,
	FolderSimpleIcon,
	PaperPlaneTiltIcon,
	PencilSimpleIcon,
	StarIcon,
	TrashIcon,
	XIcon,
} from "@phosphor-icons/react";
import type { Folder, Email } from "~/types";

interface EmailPanelToolbarProps {
	email: Email;
	mailboxId?: string;
	isDraftFolder: boolean;
	isSending: boolean;
	moveToFolders: Folder[];
	lastReceivedMessage?: Email;
	onBack: () => void;
	onSendDraft: () => void;
	onEditDraft: () => void;
	onReply: () => void;
	onReplyAll: () => void;
	onForward: () => void;
	onToggleStar: () => void;
	onToggleRead: () => void;
	onMove: (folderId: string) => void;
	onViewSource: () => void;
	onDelete: () => void;
}

export default function EmailPanelToolbar({
	email,
	mailboxId,
	isDraftFolder,
	isSending,
	moveToFolders,
	onBack,
	onSendDraft,
	onEditDraft,
	onReply,
	onReplyAll,
	onForward,
	onToggleStar,
	onToggleRead,
	onMove,
	onViewSource,
	onDelete,
}: EmailPanelToolbarProps) {
	const iconBtnClass = "p-1.5 text-sh-text-muted hover:text-sh-text-white hover:bg-sh-bg-hover transition-colors rounded-[2px] focus:outline-none focus:ring-2 focus:ring-sh-accent flex items-center justify-center";
	
	return (
		<div className="flex items-center gap-1 px-3 py-2 border-b border-sh-border shrink-0 md:px-4">
			<button
				type="button"
				onClick={onBack}
				aria-label="Back to list"
				className={`${iconBtnClass} md:hidden shrink-0`}
			>
				<ArrowLeftIcon size={18} />
			</button>

			{isDraftFolder ? (
				<>
					<button
						type="button"
						onClick={onSendDraft}
						disabled={isSending}
						className="flex items-center gap-1.5 bg-sh-accent hover:bg-opacity-90 text-sh-text-white px-3 py-1 rounded-[2px] text-[12px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-sh-accent disabled:opacity-50"
					>
						<PaperPlaneTiltIcon size={16} />
						{isSending ? "Sending..." : "Send"}
					</button>
					<button
						type="button"
						onClick={onEditDraft}
						className="flex items-center gap-1.5 bg-sh-bg-hover text-sh-text-white px-3 py-1 rounded-[2px] text-[12px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-sh-accent"
					>
						<PencilSimpleIcon size={16} />
						Edit
					</button>
				</>
			) : (
				<>
					<Tooltip content="Reply" side="bottom" asChild>
						<button type="button" onClick={onReply} aria-label="Reply" className={iconBtnClass}>
							<ArrowBendUpLeftIcon size={18} />
						</button>
					</Tooltip>
					<Tooltip content="Reply All" side="bottom" asChild>
						<button type="button" onClick={onReplyAll} aria-label="Reply All" className={iconBtnClass}>
							<ChatCircleIcon size={18} />
						</button>
					</Tooltip>
					<Tooltip content="Forward" side="bottom" asChild>
						<button type="button" onClick={onForward} aria-label="Forward" className={iconBtnClass}>
							<ArrowBendUpRightIcon size={18} />
						</button>
					</Tooltip>
				</>
			)}

			<div className="h-5 w-px bg-sh-border-thin mx-0.5" />

			<Tooltip content={email.starred ? "Unstar" : "Star"} side="bottom" asChild>
				<button type="button" onClick={onToggleStar} aria-label={email.starred ? "Unstar" : "Star"} className={iconBtnClass}>
					<StarIcon
						size={18}
						weight={email.starred ? "fill" : "regular"}
						className={email.starred ? "text-[#eab308]" : ""}
					/>
				</button>
			</Tooltip>

			<Tooltip content={email.read ? "Mark as unread" : "Mark as read"} side="bottom" asChild>
				<button type="button" onClick={onToggleRead} aria-label={email.read ? "Mark as unread" : "Mark as read"} className={iconBtnClass}>
					{email.read ? <EnvelopeSimpleIcon size={18} /> : <EnvelopeOpenIcon size={18} />}
				</button>
			</Tooltip>

			<MoveToFolderMenu folders={moveToFolders} onMove={onMove} />

			<div className="ml-auto flex items-center gap-0.5">
				<Tooltip content="View source" side="bottom" asChild>
					<button type="button" onClick={onViewSource} aria-label="View source" className={iconBtnClass}>
						<CodeIcon size={18} />
					</button>
				</Tooltip>
				<Tooltip content="Delete" side="bottom" asChild>
					<button type="button" onClick={onDelete} aria-label="Delete" className={iconBtnClass}>
						<TrashIcon size={18} />
					</button>
				</Tooltip>
				<Tooltip content="Close" side="bottom" asChild>
					<button type="button" onClick={onBack} aria-label="Close" className={`${iconBtnClass} hidden md:flex`}>
						<XIcon size={18} />
					</button>
				</Tooltip>
			</div>
		</div>
	);
}

function MoveToFolderMenu({ folders, onMove }: { folders: Folder[]; onMove: (id: string) => void }) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	if (folders.length === 0) return null;

	return (
		<div className="relative" ref={ref}>
			<Tooltip content="Move to folder" side="bottom" asChild>
				<button
					type="button"
					onClick={() => setOpen(!open)}
					aria-label="Move to folder"
					className="p-1.5 text-sh-text-muted hover:text-sh-text-white hover:bg-sh-bg-hover transition-colors rounded-[2px] focus:outline-none focus:ring-2 focus:ring-sh-accent flex items-center justify-center"
				>
					<FolderSimpleIcon size={18} />
				</button>
			</Tooltip>

			{open && (
				<div className="absolute top-full left-0 z-50 mt-1 min-w-[160px] rounded-[2px] border border-sh-border bg-sh-bg-panel shadow-lg py-1">
					<div className="px-3 py-1.5 text-[11px] font-semibold text-sh-text-muted uppercase tracking-wider">Move to</div>
					<div className="h-px bg-sh-border-thin my-1" />
					{folders.map((f) => (
						<button
							key={f.id}
							type="button"
							onClick={() => {
								onMove(f.id);
								setOpen(false);
							}}
							className="w-full text-left px-3 py-1.5 text-[13px] text-sh-text-white hover:bg-sh-bg-hover transition-colors"
						>
							{f.name}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
