// Copyright (c) 2026 Cloudflare, Inc.
// Licensed under the Apache 2.0 license found in the LICENSE file or at:
//     https://opensource.org/licenses/Apache-2.0

/**
 * Email sending via Cloudflare Email Service binding.
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

function formatRecipient(addresses: string | string[] | { email: string; name?: string }[] | undefined): string | string[] | undefined {
	if (!addresses) return undefined;
	if (typeof addresses === "string") return addresses;
	if (Array.isArray(addresses)) {
		return addresses.map((addr) => {
			if (typeof addr === "string") return addr;
			return addr.name ? `${addr.name} <${addr.email}>` : addr.email;
		});
	}
	return undefined;
}

/**
 * Send an email using the Cloudflare Email Service binding.
 *
 * @param binding  - The `EMAIL` SendEmail binding from env
 * @param params   - Email parameters (to, from, subject, body, etc.)
 * @returns The send result with messageId
 * @throws On validation or delivery errors (error has `.code` property)
 */
export async function sendEmail(
	binding: SendEmail,
	params: SendEmailParams,
): Promise<{ messageId: string }> {
	const message: Record<string, unknown> = {
		to: formatRecipient(params.to),
		from: params.from,
		subject: params.subject,
	};

	if (params.html) message.html = params.html;
	if (params.text) message.text = params.text;
	if (params.cc) message.cc = formatRecipient(params.cc);
	if (params.bcc) message.bcc = formatRecipient(params.bcc);
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
