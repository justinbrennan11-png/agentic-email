// Copyright (c) 2026 Cloudflare, Inc.
// Licensed under the Apache 2.0 license found in the LICENSE file or at:
//     https://opensource.org/licenses/Apache-2.0

import type { Env } from "./types";

/**
 * Email sending via Cloudflare Email Service binding or Resend API.
 *
 * Uses the `send_email` Worker binding (`env.EMAIL.send()`) to send emails.
 *
 * See: https://developers.cloudflare.com/email-service/api/send-emails/workers-api/
 */

/**
 * Parameters for sending an email.
 * 
 * Recipients (`to`, `cc`, `bcc`) support multiple formats:
 * - Simple string: `"user@example.com"` or `"User Name <user@example.com>"`
 * - Array of strings: `["user1@example.com", "User 2 <user2@example.com>"]`
 * - Array of objects: `[{ email: "user@example.com", name: "User Name" }]`
 */
export interface SendEmailParams {
	to: string | string[] | { email: string; name?: string }[];
	from: string | { email: string; name: string };
	subject: string;
	html?: string;
	text?: string;
	cc?: string | string[] | { email: string; name?: string }[];
	bcc?: string | string[] | { email: string; name?: string }[];
	replyTo?: string | { email: string; name: string };
	attachments?: {
		content: string; // base64 encoded
		filename: string;
		type: string;
		disposition: "attachment" | "inline";
		contentId?: string;
	}[];
	headers?: Record<string, string>;
}

function extractRawEmail(addr: string): string {
	const match = addr.match(/<\s*([^>]+?)\s*>/);
	return match ? match[1].trim() : addr.trim();
}

function formatCloudflareRecipient(addresses: string | string[] | { email: string; name?: string }[] | undefined): string | string[] | undefined {
	if (!addresses) return undefined;
	if (typeof addresses === "string") return extractRawEmail(addresses);
	if (Array.isArray(addresses)) {
		return addresses.map((addr) => {
			if (typeof addr === "string") return extractRawEmail(addr);
			return addr.email; // Cloudflare envelope requires strictly raw email addresses
		});
	}
	return undefined;
}

function formatResendRecipient(addresses: string | string[] | { email: string; name?: string }[] | undefined): string[] | undefined {
	if (!addresses) return undefined;
	const arr = Array.isArray(addresses) ? addresses : [addresses];
	return arr.map(addr => {
		if (typeof addr === "string") return addr;
		return addr.name ? `${addr.name} <${addr.email}>` : addr.email;
	});
}

function formatResendFrom(from: string | { email: string; name: string }): string {
	if (typeof from === "string") return from;
	return `${from.name} <${from.email}>`;
}

/**
 * Send an email using either Resend (if configured) or the Cloudflare Email Service binding.
 *
 * @param env      - The Worker Env containing the EMAIL binding and optional RESEND_API_KEY
 * @param params   - Email parameters (to, from, subject, body, etc.)
 * @returns The send result with messageId
 * @throws On validation or delivery errors (error has `.code` property)
 */
export async function sendEmail(
	env: Env,
	params: SendEmailParams,
): Promise<{ messageId: string }> {
	if (env.RESEND_API_KEY) {
		return sendEmailViaResend(env.RESEND_API_KEY, params);
	}
	if (!env.EMAIL) {
		throw new Error("No email service configured. Please provide a RESEND_API_KEY or bind the Cloudflare EMAIL service.");
	}
	return sendEmailViaCloudflare(env.EMAIL, params);
}

async function sendEmailViaResend(apiKey: string, params: SendEmailParams): Promise<{ messageId: string }> {
	const payload: any = {
		from: formatResendFrom(params.from),
		to: formatResendRecipient(params.to),
		subject: params.subject,
	};
	if (params.html) payload.html = params.html;
	if (params.text) payload.text = params.text;
	if (params.cc) payload.cc = formatResendRecipient(params.cc);
	if (params.bcc) payload.bcc = formatResendRecipient(params.bcc);
	if (params.replyTo) payload.reply_to = formatResendFrom(params.replyTo);
	if (params.headers) payload.headers = params.headers;
	if (params.attachments && params.attachments.length > 0) {
		payload.attachments = params.attachments.map((att: any) => ({
			content: att.content,
			filename: att.filename,
		}));
	}

	const res = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify(payload),
	});

	if (!res.ok) {
		const errText = await res.text();
		throw new Error(`Resend API error: ${res.status} ${errText}`);
	}

	const data = await res.json() as any;
	return { messageId: data.id };
}

async function sendEmailViaCloudflare(
	binding: SendEmail,
	params: SendEmailParams,
): Promise<{ messageId: string }> {
	const message: Record<string, unknown> = {
		to: formatCloudflareRecipient(params.to),
		from: params.from,
		subject: params.subject,
	};

	if (params.html) message.html = params.html;
	if (params.text) message.text = params.text;
	if (params.cc) message.cc = formatCloudflareRecipient(params.cc);
	if (params.bcc) message.bcc = formatCloudflareRecipient(params.bcc);
	if (params.replyTo) message.replyTo = params.replyTo;

	if (params.headers && Object.keys(params.headers).length > 0) {
		message.headers = params.headers;
	}

	if (params.attachments && params.attachments.length > 0) {
		message.attachments = params.attachments.map((att) => ({
			content: att.content,
			filename: att.filename,
			type: att.type,
			disposition: att.disposition,
			...(att.contentId ? { contentId: att.contentId } : {}),
		}));
	}

	const result = await binding.send(message as any);
	return { messageId: result.messageId };
}
