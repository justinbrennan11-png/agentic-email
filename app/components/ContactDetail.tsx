// Copyright (c) 2026 Cloudflare, Inc.
// Licensed under the Apache 2.0 license found in the LICENSE file or at:
//     https://opensource.org/licenses/Apache-2.0

import {
	CaretLeftIcon,
	ChatCircleIcon,
	EnvelopeSimpleIcon,
	LinkedinLogoIcon,
	DotsThreeIcon,
	DeviceMobileIcon,
	PhoneIcon,
	MapPinIcon,
	BuildingsIcon,
	UsersIcon,
	UserCircleIcon,
} from "@phosphor-icons/react";
import React from "react";
import type { Email } from "~/types";

interface Contact {
	emailAddress: string;
	displayName: string;
	latestEmail: Email;
	threadCount: number;
	unreadCount: number;
}

interface ContactDetailProps {
	contact?: Contact;
	onBack: () => void;
}

function ContactField({
	icon,
	label,
	value,
	isLink,
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
	isLink?: boolean;
}) {
	return (
		<div className="flex items-start gap-4">
			<div className="text-sh-text-muted mt-0.5">{icon}</div>
			<div className="flex flex-col min-w-0">
				<span className="text-[12px] text-sh-text-muted mb-0.5">{label}</span>
				{isLink ? (
					<a href="#" className="text-[14px] text-sh-accent hover:underline truncate">
						{value}
					</a>
				) : (
					<span className="text-[14px] text-sh-text-white truncate">{value}</span>
				)}
			</div>
		</div>
	);
}

export default function ContactDetail({ contact, onBack }: ContactDetailProps) {
	if (!contact) return null;

	const initial = contact.displayName.charAt(0).toUpperCase() || "?";

	return (
		<div className="flex flex-col h-full w-full bg-transparent text-sh-text-white relative overflow-y-auto no-scrollbar">
			{/* Mobile back button */}
			<div className="md:hidden sticky top-0 bg-sh-bg-dark/80 backdrop-blur-md z-10 px-4 py-3 border-b border-sh-border flex items-center">
				<button
					type="button"
					onClick={onBack}
					className="flex items-center text-sh-text-muted hover:text-sh-text-white transition-colors focus:outline-none focus:ring-2 focus:ring-sh-accent rounded-[2px]"
					aria-label="Back to contacts list"
				>
					<CaretLeftIcon size={20} />
					<span className="ml-1 text-[14px] font-medium">Contacts</span>
				</button>
			</div>

			<div className="p-6 md:p-12 max-w-5xl w-full">
				{/* Header Section */}
				<div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 mb-12">
					{/* Avatar */}
					<div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-sh-bg-hover flex items-center justify-center text-4xl md:text-5xl font-bold text-sh-text-white shrink-0 border border-sh-border relative">
						{initial}
						<div className="absolute bottom-1 right-1 w-6 h-6 md:w-8 md:h-8 bg-[#65a30d] border-2 border-[#1e1e2d] rounded-full flex items-center justify-center">
							<div className="w-2.5 h-2.5 md:w-3 md:h-3 border-b-2 border-r-2 border-white transform rotate-45 -translate-y-[2px]"></div>
						</div>
					</div>

					{/* Info & Actions */}
					<div className="flex flex-col flex-1 min-w-0">
						<h1 className="text-3xl md:text-[40px] font-bold mb-2 truncate">
							{contact.displayName}
						</h1>
						<p className="text-sh-text-muted text-[15px] mb-5 truncate">
							Senior Researcher • Oslo, Norway
						</p>

						<div className="flex items-center gap-2">
							<button className="flex items-center justify-center p-2.5 bg-sh-bg-panel hover:bg-sh-bg-hover transition-colors rounded-[4px] border border-sh-border focus:outline-none focus:ring-2 focus:ring-sh-accent" title="Email">
								<EnvelopeSimpleIcon size={20} />
							</button>
							<button className="flex items-center justify-center p-2.5 bg-sh-bg-panel hover:bg-sh-bg-hover transition-colors rounded-[4px] border border-sh-border focus:outline-none focus:ring-2 focus:ring-sh-accent" title="Chat">
								<ChatCircleIcon size={20} />
							</button>
							<button className="flex items-center justify-center p-2.5 bg-sh-bg-panel hover:bg-sh-bg-hover transition-colors rounded-[4px] border border-sh-border focus:outline-none focus:ring-2 focus:ring-sh-accent" title="LinkedIn">
								<LinkedinLogoIcon size={20} />
							</button>
							<button className="flex items-center justify-center p-2.5 bg-sh-bg-panel hover:bg-sh-bg-hover transition-colors rounded-[4px] border border-sh-border focus:outline-none focus:ring-2 focus:ring-sh-accent" title="More options">
								<DotsThreeIcon size={20} />
							</button>
						</div>
					</div>
				</div>

				{/* Tabs Section */}
				<div className="flex items-center gap-8 border-b border-sh-border mb-8 overflow-x-auto no-scrollbar shrink-0">
					<button className="pb-3 text-[15px] font-medium border-b-2 border-sh-accent text-sh-text-white whitespace-nowrap">
						Overview
					</button>
					<button className="pb-3 text-[15px] font-medium border-b-2 border-transparent text-sh-text-muted hover:text-sh-text-white transition-colors whitespace-nowrap">
						Contact
					</button>
					<button className="pb-3 text-[15px] font-medium border-b-2 border-transparent text-sh-text-muted hover:text-sh-text-white transition-colors whitespace-nowrap">
						Organization
					</button>
					<button className="pb-3 text-[15px] font-medium border-b-2 border-transparent text-sh-text-muted hover:text-sh-text-white transition-colors whitespace-nowrap">
						LinkedIn
					</button>
				</div>

				{/* Content Section */}
				<div>
					<h2 className="text-[16px] font-semibold text-sh-text-white mb-8">
						Contact information
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-12">
						<ContactField
							icon={<EnvelopeSimpleIcon size={20} />}
							label="Email"
							value={contact.emailAddress}
							isLink
						/>
						<ContactField
							icon={<ChatCircleIcon size={20} />}
							label="Chat"
							value={contact.emailAddress}
							isLink
						/>
						<ContactField
							icon={<DeviceMobileIcon size={20} />}
							label="Mobile"
							value="+1 (234) 456-7891"
							isLink
						/>
						<ContactField
							icon={<PhoneIcon size={20} />}
							label="Work phone"
							value="+1 (987) 654-3210"
							isLink
						/>
						<ContactField
							icon={<MapPinIcon size={20} />}
							label="Business address"
							value="Oslo, Norway"
						/>
						<ContactField
							icon={<BuildingsIcon size={20} />}
							label="Company"
							value="Contoso"
						/>
						<ContactField
							icon={<UsersIcon size={20} />}
							label="Department"
							value="Design"
						/>
						<ContactField
							icon={<UserCircleIcon size={20} />}
							label="Title"
							value="Senior Researcher"
						/>
						<ContactField
							icon={<MapPinIcon size={20} />}
							label="Office Location"
							value="OSLO-EUFEMIA/4175"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
