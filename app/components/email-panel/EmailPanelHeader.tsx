// Copyright (c) 2026 Cloudflare, Inc.
// Licensed under the Apache 2.0 license found in the LICENSE file or at:
//     https://opensource.org/licenses/Apache-2.0

import { InfoIcon } from "@phosphor-icons/react";
import { useUIStore } from "~/hooks/useUIStore";

interface EmailPanelHeaderProps {
	subject: string;
	messageCount: number;
	showThreadCount: boolean;
}

export default function EmailPanelHeader({
	subject,
	messageCount,
	showThreadCount,
}: EmailPanelHeaderProps) {
	const { isSenderCardOpen, toggleSenderCard } = useUIStore();

	return (
		<div className="flex items-center justify-between px-4 py-3 border-b border-sh-border shrink-0 md:px-6">
			<div>
				<h2 className="text-base font-semibold text-sh-text-white">{subject}</h2>
				{showThreadCount && (
					<span className="text-xs text-sh-text-muted mt-0.5 block">
						{messageCount} messages in this thread
					</span>
				)}
			</div>
			<button
				type="button"
				onClick={toggleSenderCard}
				className={`md:hidden p-2 rounded-[2px] transition-colors focus:outline-none focus:ring-2 focus:ring-sh-accent ${
					isSenderCardOpen ? "bg-sh-bg-selected text-sh-accent" : "text-sh-text-muted hover:text-sh-text-white hover:bg-sh-bg-hover"
				}`}
				aria-label="Toggle Sender Card"
			>
				<InfoIcon size={20} />
			</button>
		</div>
	);
}
