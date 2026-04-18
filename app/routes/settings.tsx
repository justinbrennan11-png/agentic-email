// Copyright (c) 2026 Cloudflare, Inc.
// Licensed under the Apache 2.0 license found in the LICENSE file or at:
//     https://opensource.org/licenses/Apache-2.0

import { Loader, useKumoToastManager } from "@cloudflare/kumo";
import { RobotIcon, ArrowCounterClockwiseIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useMailbox, useUpdateMailbox } from "~/queries/mailboxes";

// Placeholder shown in the textarea when no custom prompt is set.
// The authoritative default prompt lives in workers/agent/index.ts (DEFAULT_SYSTEM_PROMPT).
const PROMPT_PLACEHOLDER = `You are an email assistant that helps manage this inbox. You read emails, draft replies, and help organize conversations.\n\nWrite like a real person. Short, direct, flowing prose. Plain text only.\n\n(Leave empty to use the full built-in default prompt)`;

export default function SettingsRoute() {
	const { mailboxId } = useParams<{ mailboxId: string }>();
	const toastManager = useKumoToastManager();
	const { data: mailbox } = useMailbox(mailboxId);
	const updateMailboxMutation = useUpdateMailbox();

	const [displayName, setDisplayName] = useState("");
	const [agentPrompt, setAgentPrompt] = useState("");
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		if (mailbox) {
			setDisplayName(mailbox.settings?.fromName || mailbox.name || "");
			setAgentPrompt(mailbox.settings?.agentSystemPrompt || "");
		}
	}, [mailbox]);

	const handleSave = async () => {
		if (!mailbox || !mailboxId) return;
		setIsSaving(true);
		const settings = {
			...mailbox.settings,
			fromName: displayName,
			agentSystemPrompt: agentPrompt.trim() || undefined,
		};
		try {
			await updateMailboxMutation.mutateAsync({ mailboxId, settings });
			toastManager.add({ title: "Settings saved!" });
		} catch {
			toastManager.add({
				title: "Failed to save settings",
				variant: "error",
			});
		} finally {
			setIsSaving(false);
		}
	};

	const handleResetPrompt = () => {
		setAgentPrompt("");
	};

	if (!mailbox) {
		return (
			<div className="flex justify-center py-20">
				<Loader size="lg" />
			</div>
		);
	}

	const isCustomPrompt = agentPrompt.trim().length > 0;
	const inputClass = "w-full bg-sh-search-bg border border-sh-border-thin rounded-[2px] px-2.5 py-1.5 text-[13px] text-sh-text-white placeholder-sh-search-placeholder outline-none focus:border-sh-text-muted transition-colors mt-1";

	return (
		<div className="max-w-2xl px-4 py-4 md:px-8 md:py-6 h-full overflow-y-auto no-scrollbar">
			<h1 className="text-[15px] font-semibold text-sh-text-white mb-6">Settings</h1>

			<div className="space-y-6">
				{/* Account */}
				<div className="rounded-[2px] border border-sh-border bg-sh-bg-panel p-5">
					<div className="text-[13px] font-medium text-sh-text-white mb-4">
						Account
					</div>
					<div className="space-y-4">
						<div>
							<label className="text-[12px] font-medium text-sh-text-muted uppercase tracking-wider">Display Name</label>
							<input
								type="text"
								className={inputClass}
								value={displayName}
								onChange={(e) => setDisplayName(e.target.value)}
							/>
						</div>
						<div>
							<label className="text-[12px] font-medium text-sh-text-muted uppercase tracking-wider">Email</label>
							<input
								type="email"
								className={`${inputClass} opacity-50 cursor-not-allowed`}
								value={mailbox.email}
								disabled
							/>
						</div>
					</div>
				</div>

				{/* Agent System Prompt */}
				<div className="rounded-[2px] border border-sh-border bg-sh-bg-panel p-5">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-2">
							<RobotIcon size={16} weight="duotone" className="text-sh-text-muted" />
							<span className="text-[13px] font-medium text-sh-text-white">
								AI Agent Prompt
							</span>
							{isCustomPrompt ? (
								<span className="text-[10px] uppercase tracking-wider font-bold border border-sh-accent text-sh-accent px-1.5 py-0.5 rounded-[2px]">Custom</span>
							) : (
								<span className="text-[10px] uppercase tracking-wider font-bold border border-sh-border-thin text-sh-text-muted px-1.5 py-0.5 rounded-[2px]">Default</span>
							)}
						</div>
						{isCustomPrompt && (
							<button
								type="button"
								onClick={handleResetPrompt}
								className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium text-sh-text-muted hover:text-sh-text-white transition-colors focus:outline-none focus:ring-2 focus:ring-sh-accent rounded-[2px]"
							>
								<ArrowCounterClockwiseIcon size={14} />
								Reset to default
							</button>
						)}
					</div>
					<p className="text-[12px] text-sh-text-muted mb-3">
						Customize how the AI agent behaves for this mailbox.
						Leave empty to use the built-in default prompt.
					</p>
					<textarea
						value={agentPrompt}
						onChange={(e) => setAgentPrompt(e.target.value)}
						placeholder={PROMPT_PLACEHOLDER}
						rows={12}
						className="w-full resize-y rounded-[2px] border border-sh-border-thin bg-sh-search-bg px-3 py-2 text-[12px] text-sh-text-white placeholder:text-sh-search-placeholder focus:outline-none focus:border-sh-text-muted font-mono leading-relaxed transition-colors"
					/>
					<p className="text-[12px] text-sh-text-muted mt-2">
						The prompt is sent as the system message to the AI model.
						It controls the agent's personality, writing style, and behavior rules.
					</p>
				</div>

				{/* Save */}
				<div className="flex justify-end">
					<button 
						type="button"
						onClick={handleSave} 
						disabled={isSaving}
						className="bg-sh-accent hover:bg-opacity-90 text-sh-text-white px-4 py-2 rounded-[2px] text-[13px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-sh-accent disabled:opacity-50"
					>
						{isSaving ? "Saving..." : "Save Changes"}
					</button>
				</div>
			</div>
		</div>
	);
}
