// Copyright (c) 2026 Cloudflare, Inc.
// Licensed under the Apache 2.0 license found in the LICENSE file or at:
//     https://opensource.org/licenses/Apache-2.0

import { Tooltip } from "@cloudflare/kumo";
import {
	CheckIcon,
	CopyIcon,
	PlugsIcon,
	WrenchIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { useParams } from "react-router";

function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// Clipboard API unavailable or permission denied — ignore silently
		}
	};

	return (
		<Tooltip content={copied ? "Copied!" : "Copy"} asChild>
			<button
				type="button"
				onClick={handleCopy}
				className="p-1.5 rounded-[2px] transition-colors focus:outline-none focus:ring-2 focus:ring-sh-accent text-sh-text-muted hover:text-sh-text-white hover:bg-sh-bg-hover"
				aria-label="Copy to clipboard"
			>
				{copied ? (
					<CheckIcon size={14} weight="bold" className="text-green-500" />
				) : (
					<CopyIcon size={14} />
				)}
			</button>
		</Tooltip>
	);
}

const TOOLS = [
	{ name: "list_mailboxes", desc: "List all mailboxes" },
	{ name: "list_emails", desc: "List emails in a folder" },
	{ name: "get_email", desc: "Read a full email with body" },
	{ name: "get_thread", desc: "Load a conversation thread" },
	{ name: "search_emails", desc: "Search emails by query" },
	{ name: "draft_reply", desc: "Draft a reply to an email" },
	{ name: "send_reply", desc: "Send a reply" },
	{ name: "send_email", desc: "Send a new email" },
	{ name: "mark_email_read", desc: "Mark email as read/unread" },
	{ name: "move_email", desc: "Move email to a folder" },
];

export default function MCPPanel() {
	const { mailboxId } = useParams<{ mailboxId: string }>();
	const baseUrl =
		typeof window !== "undefined" ? window.location.origin : "https://your-app.workers.dev";
	const mcpUrl = `${baseUrl}/mcp`;

	return (
		<div className="flex flex-col h-full bg-sh-bg-dark text-sh-text-white">
			{/* Content */}
			<div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar">
				{/* Intro */}
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<div className="flex h-10 w-10 items-center justify-center rounded-[2px] bg-sh-bg-hover">
							<PlugsIcon
								size={20}
								weight="duotone"
								className="text-sh-accent"
							/>
						</div>
						<div>
							<h3 className="text-[13px] font-semibold text-sh-text-white">
								Connect via MCP
							</h3>
							<p className="text-[12px] text-sh-text-muted">
								Model Context Protocol
							</p>
						</div>
					</div>
					<p className="text-[12px] text-sh-text-muted leading-relaxed">
						This email agent exposes an MCP server so AI coding
						assistants can manage your inbox directly — read emails,
						search, draft replies, and send messages using natural
						language.
					</p>
				</div>

				{/* MCP URL */}
				<div className="space-y-1.5 mt-6">
					<label className="text-[11px] font-semibold text-sh-text-muted uppercase tracking-wider block">
						Server URL
					</label>
					<div className="relative group">
						<div className="absolute right-1.5 top-1/2 -translate-y-1/2">
							<CopyButton text={mcpUrl} />
						</div>
						<div className="bg-sh-bg-panel text-sh-text-white font-mono text-[11px] px-3 py-2.5 pr-10 rounded-[2px] border border-sh-border-thin break-all leading-relaxed">
							{mcpUrl}
						</div>
					</div>
				</div>

				{/* Available tools */}
				<div className="space-y-2 mt-6">
					<h4 className="text-[11px] uppercase tracking-wider font-semibold text-sh-text-muted px-0.5">
						Available Tools
					</h4>
					<div className="border border-sh-border-thin rounded-[2px] divide-y divide-sh-border-thin">
						{TOOLS.map((tool) => (
							<div
								key={tool.name}
								className="flex items-center gap-2.5 px-3 py-2"
							>
								<WrenchIcon
									size={12}
									weight="bold"
									className="text-sh-accent shrink-0"
								/>
								<div className="min-w-0 flex-1">
									<span className="text-[12px] font-mono font-medium text-sh-text-white">
										{tool.name}
									</span>
								</div>
								<span className="text-[11px] text-sh-text-muted shrink-0">
									{tool.desc}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
