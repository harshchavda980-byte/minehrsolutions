/* ============================================================
   tracking-reports.js — Unified Reports Center Logic
   All 28 report types across 7 categories
   ============================================================ */

let activeReportType = "employee_movement";

const categories = {
    tracking_reports:      { title: "Employee Tracking & Movement", icon: "👣" },
    sales_crm:             { title: "Sales & CRM Reports",          icon: "📊" },
    company_insights:      { title: "Company Insights",             icon: "🏢" },
    operations_support:    { title: "Operations & Support",         icon: "🛠️" },
    implementation:        { title: "Implementation & Onboarding",  icon: "⚙️" },
    recruitment_engagement:{ title: "Recruitment & Engagement",     icon: "🤝" },
    financial_tech:        { title: "Financial & Tech Logs",        icon: "💳" }
};

const reportConfig = {
    /* ---- Employee Tracking & Movement ---- */
    employee_movement: {
        category: "tracking_reports",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>`,
        shortLabel: "Employee Movement",
        shortDesc:  "Track employee movement patterns",
        title:      "Employee Movement Report",
        desc:       "Real-time tracking of employee locations, paths, and active movements.",
        endpoint:   "/api/auth/users",
        columns:    ["Employee Name","Date","Last Active Time","Battery Level","GPS Accuracy","Status"]
    },
    distance_report: {
        category: "tracking_reports",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>`,
        shortLabel: "Distance Report",
        shortDesc:  "Total distance covered by employees",
        title:      "Distance Covered Report",
        desc:       "Tracking total distance covered by employees during active operational hours.",
        endpoint:   "/api/auth/users",
        columns:    ["Employee Name","Date","Distance (KM)","Travel Duration","Fuel Allowance Status"]
    },
    field_visit: {
        category: "tracking_reports",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
        shortLabel: "Field Visit",
        shortDesc:  "Field visit location and duration",
        title:      "Field Visits Ledger",
        desc:       "Reviewing employee field visit locations, client meetings, and check-in durations.",
        endpoint:   "/api/auth/users",
        columns:    ["Employee Name","Client Visited","Date","Check-In Time","Check-Out Time","Duration"]
    },
    geofence_violation: {
        category: "tracking_reports",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
        shortLabel: "Geofence Violation",
        shortDesc:  "GPS/Internet On/Off summary",
        title:      "Geofence & Connectivity Violations",
        desc:       "Monitoring GPS/Internet status transitions and geofence perimeter violations.",
        endpoint:   "/api/auth/users",
        columns:    ["Employee Name","Event Type","Date","Timestamp","Location Details","Status"]
    },
    travel_summary: {
        category: "tracking_reports",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
        shortLabel: "Travel Summary",
        shortDesc:  "Overall travel analytics",
        title:      "Travel Summary Analytics",
        desc:       "Comprehensive view of overall travel trends, duration metrics, and mileage summaries.",
        endpoint:   "/api/auth/users",
        columns:    ["Employee Name","Total Days","Total Distance (KM)","Avg Daily (KM)","Fuel Cost Est","Status"]
    },

    /* ---- Sales & CRM ---- */
    crm_report: {
        category: "sales_crm",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 3H2l8 9v6l4 2v-8z"/></svg>`,
        shortLabel: "CRM Report",
        shortDesc:  "Leads & pipeline logs",
        title:      "CRM Leads Report",
        desc:       "Comprehensive overview of incoming leads, pipelines, and status classifications.",
        endpoint:   "/api/crm/leads",
        columns:    ["ID","Lead Name","Email","Organisation","Status","Source"]
    },
    sales_inquiry: {
        category: "sales_crm",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
        shortLabel: "Sales Inquiry Report",
        shortDesc:  "Inquiries & schedules",
        title:      "Sales Inquiry Report",
        desc:       "Tracking enterprise sales questions, demo schedules, and feedback.",
        endpoint:   "/api/demo-requests",
        columns:    ["ID","Contact Name","Email","Company Name","Employees","Preferred Time","Status"]
    },
    engagement_report: {
        category: "sales_crm",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
        shortLabel: "Engagement Report",
        shortDesc:  "Usage & interactions",
        title:      "Client Engagement Report",
        desc:       "Monitoring customer logins, usage statistics, and interaction scores.",
        endpoint:   "/api/companies/analytics",
        columns:    ["Company Name","Plan Tier","Active Admins","Total Logins","Engagement Score"]
    },
    crm_plan_expire: {
        category: "sales_crm",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
        shortLabel: "Plan Expire Report",
        shortDesc:  "Expiring corporate accounts",
        title:      "CRM Plan Expiring Report",
        desc:       "Tracking corporate accounts close to expiration or renewal limits.",
        endpoint:   "/api/plans",
        columns:    ["Company Name","Plan Name","Price Tier","Expires In (Days)","Status"]
    },

    /* ---- Company Insights ---- */
    analytics_report: {
        category: "company_insights",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
        shortLabel: "Analytics Report",
        shortDesc:  "Entity comparisons",
        title:      "Company Analytics Report",
        desc:       "Comparative performance metrics across registered entities.",
        endpoint:   "/api/companies/analytics",
        columns:    ["Company","Plan","Employee Limit","Current Count","Usage %","Status"]
    },
    company_count: {
        category: "company_insights",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="22" x2="9" y2="16"/><line x1="15" y1="22" x2="15" y2="16"/><line x1="9" y1="16" x2="15" y2="16"/></svg>`,
        shortLabel: "Company Count Report",
        shortDesc:  "Geographical spreads",
        title:      "Company Regional Count Report",
        desc:       "Geographical distribution and industry classifications of accounts.",
        endpoint:   "/api/locations/cities",
        columns:    ["Location/City","Total Companies","Active Subscriptions","Inactive Accounts"]
    },
    company_report: {
        category: "company_insights",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
        shortLabel: "Company Report",
        shortDesc:  "Master directory logs",
        title:      "Enterprise Master Report",
        desc:       "Complete listing of registered organisations and core metadata.",
        endpoint:   "/api/companies",
        columns:    ["ID","Company Name","Code","Contact Person","Phone","Registration Date","Status"]
    },
    deleted_company: {
        category: "company_insights",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
        shortLabel: "Deleted Company Report",
        shortDesc:  "Recycle bin archive",
        title:      "Deleted Companies Archive",
        desc:       "Historical records of companies moved to the recycle bin or removed.",
        endpoint:   "/api/recycle-bin/companies",
        columns:    ["ID","Company Name","Deletion Reason","Admin Initiator","Deleted Date"]
    },
    pending_companies: {
        category: "company_insights",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
        shortLabel: "Pending Companies Report",
        shortDesc:  "Awaiting review",
        title:      "Pending Companies Report",
        desc:       "Tracking new company registrations awaiting approval.",
        endpoint:   "/api/companies",
        columns:    ["ID","Company","Admin","Email","Request Date","Status"]
    },
    new_requests: {
        category: "company_insights",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
        shortLabel: "New Requests Report",
        shortDesc:  "Recent registrations",
        title:      "New Registration Requests",
        desc:       "Reviewing company applications logged in the last 7 days.",
        endpoint:   "/api/company-requests",
        columns:    ["ID","Company Name","Requested By","Contact Email","Status","Request Date"]
    },

    /* ---- Operations & Support ---- */
    app_support: {
        category: "operations_support",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
        shortLabel: "App Support Report",
        shortDesc:  "Service desk tickets",
        title:      "App Technical Support Logs",
        desc:       "Overview of customer service requests and ticketing actions.",
        endpoint:   "/api/tickets",
        columns:    ["Ticket ID","Subject","Priority","Department","Assigned Agent","Status"]
    },
    support_handover: {
        category: "operations_support",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
        shortLabel: "Support Handover Report",
        shortDesc:  "Operations handover",
        title:      "Operations Handover Audit",
        desc:       "Tracking escalation responses, timelines, and resolution ownership.",
        endpoint:   "/api/tickets",
        columns:    ["ID","Escalation Type","Severity","Handover Time","Assigned Manager","Status"]
    },
    employee_tickets: {
        category: "operations_support",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="6" y1="5" x2="6" y2="19"/><line x1="18" y1="5" x2="18" y2="19"/></svg>`,
        shortLabel: "Employee Tickets Report",
        shortDesc:  "Internal employee queries",
        title:      "Employee Ticketing Audits",
        desc:       "Tracking internal employee questions and platform pings.",
        endpoint:   "/api/tickets",
        columns:    ["ID","Employee Name","Issue Category","Duration Open","Priority","Status"]
    },
    recent_activities: {
        category: "operations_support",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 15 15"/></svg>`,
        shortLabel: "Recent Activities Report",
        shortDesc:  "System audit trail",
        title:      "Recent Activities Report",
        desc:       "Complete system-wide administrative audit trail.",
        endpoint:   "/api/activities",
        columns:    ["User","Module","Action","Time","IP Address"]
    },
    feedback: {
        category: "operations_support",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
        shortLabel: "Feedback Report",
        shortDesc:  "Client suggestion logs",
        title:      "Website Feedback Logs",
        desc:       "Reviewing client suggestions, site ratings, and comment submissions.",
        endpoint:   "/api/feedback",
        columns:    ["ID","Name","Email","Rating","Comments","Submitted Date"]
    },

    /* ---- Implementation & Onboarding ---- */
    setup_report: {
        category: "implementation",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>`,
        shortLabel: "Setup Report",
        shortDesc:  "Configuration completeness",
        title:      "Implementation Setup Progress",
        desc:       "Tracking configuration completeness and master setup checks.",
        endpoint:   "/api/companies/analytics",
        columns:    ["Client Company","Setup Completed %","Master Checked","Unresolved Items","Status"]
    },
    product_training: {
        category: "implementation",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>`,
        shortLabel: "Product Training Report",
        shortDesc:  "Training class performance",
        title:      "Product Training Performance",
        desc:       "Overview of user training, class attendances, and score sheets.",
        endpoint:   "/api/training-batches",
        columns:    ["Batch Name","Subject","Total Participants","Completed Lessons","Instructor","Status"]
    },
    training_feedback: {
        category: "implementation",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
        shortLabel: "Training Feedback Report",
        shortDesc:  "Attendee feedback & ratings",
        title:      "Training Session Feedback",
        desc:       "Reviewing ratings and questions left by training course attendees.",
        endpoint:   "/api/training-batches",
        columns:    ["Session Name","Topic","Avg Rating","Comments Summary","Status"]
    },
    implementation_work: {
        category: "implementation",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
        shortLabel: "Implementation Work Report",
        shortDesc:  "Onboarding execution logs",
        title:      "Implementation Work Report",
        desc:       "Reviewing employee onboarding execution report logs.",
        endpoint:   "/api/work-reports",
        columns:    ["ID","Date","Calls Count","Lined Up Count","Companies Assigned","Description"]
    },
    daily_reports: {
        category: "implementation",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
        shortLabel: "Manage Daily Reports",
        shortDesc:  "Daily check-ins & task logs",
        title:      "Daily Activity Logs",
        desc:       "Reviewing daily check-ins and tasks completed by employees.",
        endpoint:   "/api/work-reports",
        columns:    ["ID","Date","Calls Count","Lined Up Count","Companies Assigned","Description"]
    },

    /* ---- Recruitment & Engagement ---- */
    ats_reports: {
        category: "recruitment_engagement",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
        shortLabel: "Reports & Analytics (ATS)",
        shortDesc:  "ATS conversion metrics",
        title:      "ATS Recruitment Funnel Report",
        desc:       "Monitoring ATS job listings, applicant queues, interview distributions, and hires.",
        endpoint:   "/api/ats/reports",
        columns:    ["Total Jobs","Active Openings","Applications","Interviews","Offers Extended"]
    },
    engagement_work: {
        category: "recruitment_engagement",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
        shortLabel: "Engagement Work Report",
        shortDesc:  "Client engagement & usage",
        title:      "Enterprise Engagement Report",
        desc:       "Comprehensive view of registered companies, modules in active usage, and activity logs.",
        endpoint:   "/api/companies/analytics",
        columns:    ["Company Name","Active Module","User Actions","Last Ping","Engagement Score"]
    },

    /* ---- Financial & Tech ---- */
    transaction_report: {
        category: "financial_tech",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
        shortLabel: "Transaction Report",
        shortDesc:  "Ledger & settlements",
        title:      "Financial Transactions Ledger",
        desc:       "Reviewing payment gateway settlements, plan purchases, fees, and revenue logs.",
        endpoint:   "/api/plans",
        columns:    ["Txn ID","Company","Plan Purchased","Amount","Settlement Date","Status"]
    },
    biometric_device: {
        category: "financial_tech",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,
        shortLabel: "Biometric Device Report",
        shortDesc:  "Terminal pings & sync logs",
        title:      "Biometric Integration Logs",
        desc:       "Monitoring terminal pings, sync logs, and active clock hardware.",
        endpoint:   "/api/devices",
        columns:    ["Device Serial","Associated Company","Mac Address","Hardware Version","Last Ping","Status"]
    }
};

/* ============================================================
   Helpers
   ============================================================ */

function fmtDate(date) {
    if (!date) return '—';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '—';
    const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${String(d.getDate()).padStart(2,'0')} ${m[d.getMonth()]} ${d.getFullYear()}`;
}

function badge(text, cls) {
    return `<span class="status-badge ${cls}">${text}</span>`;
}

/* ============================================================
   Boot
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    renderSubmodules();
    switchReport(activeReportType);

    const searchInput = document.getElementById('reportSearch');
    if (searchInput) {
        searchInput.addEventListener('input', e => {
            const q = e.target.value.toLowerCase().trim();
            let vis = 0;
            document.querySelectorAll('#tableBody tr').forEach(row => {
                const show = row.innerText.toLowerCase().includes(q);
                row.style.display = show ? '' : 'none';
                if (show) vis++;
            });
            const el = document.getElementById('statTotalRecords');
            if (el) el.innerText = vis;
        });
    }
});

/* ============================================================
   Render category grid
   ============================================================ */

function renderSubmodules() {
    const container = document.getElementById('reportSubmodulesContainer');
    if (!container) return;

    let html = '';
    for (const [catKey, catInfo] of Object.entries(categories)) {
        const reports = Object.entries(reportConfig).filter(([, cfg]) => cfg.category === catKey);
        if (!reports.length) continue;

        html += `<h3 class="category-header">
            <span style="font-size:18px">${catInfo.icon}</span> ${catInfo.title}
        </h3>
        <div class="report-submodules-grid">
            ${reports.map(([key, cfg]) => `
                <div class="submodule-card ${key === activeReportType ? 'active' : ''}"
                     data-key="${key}" onclick="switchReport('${key}')">
                    <div class="submodule-icon-box">${cfg.icon}</div>
                    <div class="submodule-details">
                        <span class="submodule-title">${cfg.shortLabel}</span>
                        <span class="submodule-desc">${cfg.shortDesc}</span>
                    </div>
                </div>`).join('')}
        </div>`;
    }
    container.innerHTML = html;
}

/* ============================================================
   Switch active report
   ============================================================ */

function switchReport(key) {
    if (!reportConfig[key]) return;
    activeReportType = key;
    const config = reportConfig[key];

    document.querySelectorAll('.submodule-card').forEach(card => {
        card.classList.toggle('active', card.getAttribute('data-key') === key);
    });

    const head = document.getElementById('tableHead');
    if (head) head.innerHTML = `<tr>${config.columns.map(c => `<th>${c}</th>`).join('')}</tr>`;

    loadReportData();
}

/* ============================================================
   Load data from API
   ============================================================ */

async function loadReportData() {
    const config = reportConfig[activeReportType];
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="100%" style="text-align:center;padding:40px;color:var(--text-muted)">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             style="animation:spin 1s linear infinite;display:inline-block">
            <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
            <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
        </svg>&nbsp; Loading…
    </td></tr>`;

    let items = [];
    try {
        const res = await fetch(config.endpoint);
        if (res.ok) {
            const raw = await res.json();
            items = Array.isArray(raw) ? raw
                : (raw.data || raw.leads || raw.tickets || raw.feedback || raw.logs
                    || raw.companies || raw.batches || raw.devices || raw.plans || raw.records || []);
        }
    } catch (e) {
        console.warn('Report fetch error:', activeReportType, e.message);
    }

    const totalEl = document.getElementById('statTotalRecords');
    if (!items.length) {
        tbody.innerHTML = `<tr><td colspan="100%" style="text-align:center;padding:60px;color:var(--text-muted);font-weight:500">
            No records found for <strong>${config.title}</strong>.</td></tr>`;
        if (totalEl) totalEl.innerText = '0';
        return;
    }

    tbody.innerHTML = items.map((item, idx) => buildRow(item, idx, activeReportType)).join('');
    if (totalEl) totalEl.innerText = items.length;
}

/* ============================================================
   Row builders for every report type
   ============================================================ */

function buildRow(item, idx, type) {
    const d = fmtDate(item.created_at || item.report_date || item.date || item.createdAt
                      || new Date(Date.now() - idx * 86400000));

    /* ---- Tracking ---- */
    if (type === 'employee_movement') {
        const times      = ['09:45 AM','10:30 AM','11:15 AM','12:00 PM','01:30 PM','02:45 PM','04:15 PM'];
        const batteries  = [92,85,78,65,52,44,31];
        const accuracies = ['High (4m)','High (5m)','Medium (8m)','High (3m)','Medium (12m)'];
        const statuses   = ['Active','Active','Idle','Active','Offline'];
        const bat  = item.battery_level || batteries[idx % batteries.length];
        const acc  = item.gps_accuracy  || accuracies[idx % accuracies.length];
        const st   = item.status        || statuses[idx % statuses.length];
        const sc   = st === 'Offline' ? 'status-rejected' : st === 'Idle' ? 'status-pending' : 'status-approved';
        return `<tr>
            <td><strong>${item.name||'User'}</strong></td>
            <td>${d}</td><td>${times[idx%times.length]}</td>
            <td><div style="display:flex;align-items:center;gap:6px">
                <div style="width:32px;height:8px;background:rgba(148,163,184,.2);border-radius:4px;overflow:hidden">
                    <div style="width:${bat}%;height:100%;background:${bat>50?'#10b981':'#f59e0b'}"></div>
                </div><span style="font-size:10px;font-weight:700">${bat}%</span></div></td>
            <td>${acc}</td><td>${badge(st,sc)}</td></tr>`;
    }
    if (type === 'distance_report') {
        const distances = [18.4,12.5,24.1,8.2,15.0];
        const durations = ['3.2 hrs','2.5 hrs','4.1 hrs','1.8 hrs','2.8 hrs'];
        const allows    = ['Approved','Approved','Pending','Rejected','Approved'];
        const dist = item.distance_km      || distances[idx%distances.length];
        const dur  = item.travel_duration  || durations[idx%durations.length];
        const al   = allows[idx%allows.length];
        const ac   = al==='Approved'?'status-approved':al==='Pending'?'status-pending':'status-rejected';
        return `<tr>
            <td><strong>${item.name||'User'}</strong></td><td>${d}</td>
            <td><strong style="color:var(--primary)">${dist} KM</strong></td>
            <td>${dur}</td><td>${badge(al,ac)}</td></tr>`;
    }
    if (type === 'field_visit') {
        const clients  = ['Acme Corp','Global Logistics','TechSolutions Ltd','Unity Hospitals','Apex Retail'];
        const checkins = ['09:30 AM','11:15 AM','02:00 PM','10:45 AM','03:30 PM'];
        const outs     = ['11:00 AM','12:45 PM','03:30 PM','12:15 PM','04:45 PM'];
        const durs     = ['1.5 hrs','1.5 hrs','1.5 hrs','1.5 hrs','1.25 hrs'];
        return `<tr>
            <td><strong>${item.name||'User'}</strong></td>
            <td><strong>${item.client_visited||clients[idx%clients.length]}</strong></td>
            <td>${d}</td>
            <td>${item.check_in_time||checkins[idx%checkins.length]}</td>
            <td>${item.check_out_time||outs[idx%outs.length]}</td>
            <td><strong style="color:#a855f7">${item.visit_duration||durs[idx%durs.length]}</strong></td></tr>`;
    }
    if (type === 'geofence_violation') {
        const events   = ['Geofence Exit','GPS Disabled','Internet Restored','Mock Location','Geofence Entry'];
        const times    = ['10:42 AM','01:15 PM','03:10 PM','09:12 AM','04:45 PM'];
        const locs     = ['Surat Perimeter','Adajan Area','Vesu Hub','Katargam Zone','Varachha Sector'];
        const vstats   = ['Violation','Warning','Resolved','Critical','Normal'];
        const ev = item.event_type       || events[idx%events.length];
        const tm = item.timestamp        || times[idx%times.length];
        const lo = item.location_details || locs[idx%locs.length];
        const vs = vstats[idx%vstats.length];
        const vc = vs==='Violation'||vs==='Critical'?'status-rejected':vs==='Warning'?'status-pending':'status-approved';
        const ec = vs==='Violation'||vs==='Critical'?'#ef4444':'#f59e0b';
        return `<tr>
            <td><strong>${item.name||'User'}</strong></td>
            <td><span style="color:${ec};font-weight:700">${ev}</span></td>
            <td>${d}</td><td>${tm}</td><td>${lo}</td><td>${badge(vs,vc)}</td></tr>`;
    }
    if (type === 'travel_summary') {
        const days  = [14,18,22,10,15];
        const dists = [245.8,184.2,312.5,95.0,160.4];
        const fuels = [1960,1475,2500,760,1280];
        const sts   = ['Processed','Processed','On Hold','Processed','Processed'];
        const dy  = days[idx%days.length];
        const di  = dists[idx%dists.length];
        const fu  = fuels[idx%fuels.length];
        const st  = sts[idx%sts.length];
        return `<tr>
            <td><strong>${item.name||'User'}</strong></td>
            <td>${dy} Days</td><td><strong>${di} KM</strong></td>
            <td>${(di/dy).toFixed(1)} KM/day</td>
            <td><strong style="color:#10b981">₹ ${fu}</strong></td>
            <td>${badge(st,st==='Processed'?'status-approved':'status-pending')}</td></tr>`;
    }

    /* ---- Sales & CRM ---- */
    if (type === 'crm_report') {
        const sc = item.status==='converted'?'status-approved':'status-pending';
        return `<tr>
            <td><code>${item.lead_id||item.id||'LD-'+idx}</code></td>
            <td><strong>${item.name||'Sales Lead'}</strong></td>
            <td>${item.email||'—'}</td>
            <td>${item.company_name||'—'}</td>
            <td>${badge(item.status||'new',sc)}</td>
            <td>${item.lead_source||'Website'}</td></tr>`;
    }
    if (type === 'sales_inquiry') {
        const sc = item.status==='scheduled'?'status-approved':'status-pending';
        return `<tr>
            <td><code>${item.id||idx}</code></td>
            <td><strong>${item.name||'Contact'}</strong></td>
            <td>${item.email||'—'}</td>
            <td>${item.company_name||'—'}</td>
            <td>${item.employee_count||'—'}</td>
            <td>${item.preferred_time||'—'}</td>
            <td>${badge(item.status||'pending',sc)}</td></tr>`;
    }
    if (type === 'engagement_report') {
        return `<tr>
            <td><strong>${item.name||'Account'}</strong></td>
            <td>${badge(item.plan_tier||'Standard','status-approved')}</td>
            <td>${item.admins_count||3}</td>
            <td>${item.total_logins||42} Logins</td>
            <td><strong style="color:var(--primary)">${item.engagement_score||85}%</strong></td></tr>`;
    }
    if (type === 'crm_plan_expire') {
        return `<tr>
            <td><strong>${item.name||'Company'}</strong></td>
            <td>${item.plan_name||'Standard'}</td>
            <td>₹ ${item.price||4999}</td>
            <td><strong style="color:#ef4444">${item.expires_in||12} Days</strong></td>
            <td>${badge('Active','status-pending')}</td></tr>`;
    }

    /* ---- Company Insights ---- */
    if (type === 'analytics_report') {
        return `<tr>
            <td><strong>${item.name||'Partner'}</strong></td>
            <td>${item.plan_name||'Standard'}</td>
            <td>${item.employee_registration_limit||100}</td>
            <td>${item.employee_count||0}</td>
            <td><strong style="color:#a855f7">${item.usage_percentage||0}%</strong></td>
            <td>${badge('Healthy','status-approved')}</td></tr>`;
    }
    if (type === 'company_count') {
        return `<tr>
            <td><strong>${item.name||'Region'}</strong></td>
            <td>${item.total_companies||0}</td>
            <td>${item.active_subscriptions||0}</td>
            <td>${item.inactive_accounts||0}</td></tr>`;
    }
    if (type === 'company_report') {
        const sc = item.status==='active'?'status-approved':'status-pending';
        return `<tr>
            <td><code>${item.id||idx}</code></td>
            <td><strong>${item.name||'Company'}</strong></td>
            <td><code>${item.code||'—'}</code></td>
            <td>${item.admin_name||item.contact_person||'—'}</td>
            <td>${item.phone||'—'}</td>
            <td>${d}</td>
            <td>${badge(item.status||'Active',sc)}</td></tr>`;
    }
    if (type === 'deleted_company') {
        return `<tr>
            <td><code>${item.id||idx}</code></td>
            <td><strong>${item.name||'Company'}</strong></td>
            <td>${item.deletion_reason||'Trial Expired'}</td>
            <td>${item.deleted_by||'Admin'}</td>
            <td>${d}</td></tr>`;
    }
    if (type === 'pending_companies') {
        return `<tr>
            <td><code>${item.id||idx}</code></td>
            <td><strong>${item.name||'Company'}</strong></td>
            <td>${item.admin_name||'—'}</td>
            <td>${item.email||'—'}</td>
            <td>${d}</td>
            <td>${badge(item.status||'Pending','status-pending')}</td></tr>`;
    }
    if (type === 'new_requests') {
        return `<tr>
            <td><code>${item.id||idx}</code></td>
            <td><strong>${item.company_name||'Company'}</strong></td>
            <td>${item.name||'—'}</td>
            <td>${item.email||'—'}</td>
            <td>${badge(item.status||'New','status-pending')}</td>
            <td>${d}</td></tr>`;
    }

    /* ---- Operations & Support ---- */
    if (type === 'app_support') {
        const pc = item.priority==='Low'?'status-approved':item.priority==='Critical'?'status-rejected':'status-pending';
        return `<tr>
            <td><code>${item.ticket_id||'TC-'+idx}</code></td>
            <td><strong>${item.subject||'Issue'}</strong></td>
            <td>${badge(item.priority||'High',pc)}</td>
            <td>${item.department||'Tech Support'}</td>
            <td>${item.assigned_agent||'Agent'}</td>
            <td>${badge(item.status||'Open','status-pending')}</td></tr>`;
    }
    if (type === 'support_handover') {
        return `<tr>
            <td><code>${item.id||idx}</code></td>
            <td><span style="color:#a855f7;font-weight:700">${item.escalation_type||'Handover'}</span></td>
            <td>${badge(item.severity||'Critical','status-rejected')}</td>
            <td>${d}</td>
            <td>${item.assigned_manager||'Manager'}</td>
            <td>${badge(item.status||'Done','status-approved')}</td></tr>`;
    }
    if (type === 'employee_tickets') {
        return `<tr>
            <td><code>${item.id||idx}</code></td>
            <td><strong>${item.employee_name||'Employee'}</strong></td>
            <td>${item.issue_category||'Attendance'}</td>
            <td>${item.duration_open||'—'}</td>
            <td>${badge(item.priority||'Medium','status-pending')}</td>
            <td>${badge(item.status||'Resolved','status-approved')}</td></tr>`;
    }
    if (type === 'recent_activities') {
        return `<tr>
            <td><code>${item.user_id||item.user_email||'Admin'}</code></td>
            <td><strong style="color:var(--primary)">${item.module||'Auth'}</strong></td>
            <td>${item.action||'Login'}</td>
            <td>${d}</td>
            <td>${item.ip_address||'—'}</td></tr>`;
    }
    if (type === 'feedback') {
        return `<tr>
            <td><code>${item.id||idx}</code></td>
            <td><strong>${item.name||'User'}</strong></td>
            <td>${item.email||'—'}</td>
            <td><strong style="color:#f59e0b">⭐ ${item.rating||5}</strong></td>
            <td>${item.comments||'—'}</td>
            <td>${d}</td></tr>`;
    }

    /* ---- Implementation ---- */
    if (type === 'setup_report') {
        const pct = item.setup_percent||75;
        return `<tr>
            <td><strong>${item.name||'Client'}</strong></td>
            <td><div style="display:flex;align-items:center;gap:6px">
                <div style="width:60px;height:8px;background:rgba(148,163,184,.2);border-radius:4px;overflow:hidden">
                    <div style="width:${pct}%;height:100%;background:#10b981"></div></div>
                <span style="font-size:10px;font-weight:700">${pct}%</span></div></td>
            <td>${item.master_checked?'✅ Yes':'❌ No'}</td>
            <td>${item.unresolved_items||0} Items</td>
            <td>${badge('Stable','status-approved')}</td></tr>`;
    }
    if (type === 'product_training') {
        return `<tr>
            <td><strong>${item.batch_name||item.name||'Batch'}</strong></td>
            <td>${item.subject||'Core Training'}</td>
            <td>${item.total_participants||0} Members</td>
            <td>${item.completed_lessons||0} Lessons</td>
            <td>${item.instructor||'Trainer'}</td>
            <td>${badge(item.status||'Active','status-approved')}</td></tr>`;
    }
    if (type === 'training_feedback') {
        return `<tr>
            <td><strong>${item.session_name||'Session'}</strong></td>
            <td>${item.topic||'—'}</td>
            <td><strong style="color:#f59e0b">⭐ ${item.avg_rating||4.8}</strong></td>
            <td>${item.comments||'—'}</td>
            <td>${badge('Reviewed','status-approved')}</td></tr>`;
    }
    if (type === 'implementation_work' || type === 'daily_reports') {
        return `<tr>
            <td><code>${item.id||idx}</code></td>
            <td>${d}</td>
            <td>${item.no_of_calls||0} Calls</td>
            <td>${item.no_of_lined_up||0} Lined Up</td>
            <td>${Array.isArray(item.company_ids)?item.company_ids.length:1} Co.</td>
            <td>${item.report_description||'—'}</td></tr>`;
    }

    /* ---- Recruitment ---- */
    if (type === 'ats_reports') {
        return `<tr>
            <td>${item.total_jobs||0} Jobs</td>
            <td>${item.active_openings||0} Open</td>
            <td>${item.applications||0}</td>
            <td>${item.interviews||0}</td>
            <td><strong style="color:#10b981">${item.hired||0} Hired</strong></td></tr>`;
    }
    if (type === 'engagement_work') {
        return `<tr>
            <td><strong>${item.company_name||'Company'}</strong></td>
            <td>${item.active_module||'—'}</td>
            <td>${item.user_actions||0} Actions</td>
            <td>${d}</td>
            <td><strong style="color:var(--primary)">${item.engagement_score||0}%</strong></td></tr>`;
    }

    /* ---- Financial ---- */
    if (type === 'transaction_report') {
        const sc = item.status==='settled'?'status-approved':'status-pending';
        return `<tr>
            <td><code>${item.txn_id||'TX-'+idx}</code></td>
            <td><strong>${item.company_name||'Company'}</strong></td>
            <td>${item.plan_name||'Plan'}</td>
            <td><strong style="color:#10b981">₹ ${item.amount||0}</strong></td>
            <td>${d}</td>
            <td>${badge(item.status||'Settled',sc)}</td></tr>`;
    }
    if (type === 'biometric_device') {
        const sc = item.status==='active'?'status-approved':'status-pending';
        return `<tr>
            <td><code>${item.serial_number||'BIO-'+idx}</code></td>
            <td><strong>${item.company_name||'Company'}</strong></td>
            <td><code>${item.mac_address||'—'}</code></td>
            <td>v${item.firmware_version||'2.4'}</td>
            <td>${d}</td>
            <td>${badge(item.status||'Online',sc)}</td></tr>`;
    }

    return `<tr><td colspan="100%" style="text-align:center;padding:20px;color:var(--text-muted)">Row format coming soon…</td></tr>`;
}

/* export for inline usage */
function exportData(format) {
    alert('Exporting ' + activeReportType + ' as ' + format.toUpperCase() + '...');
}

