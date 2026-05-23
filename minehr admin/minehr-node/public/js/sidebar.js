/**
 * Centralized Sidebar and Dropdown Logic
 * This script populates the sidebar and handles all toggle/dropdown interactions.
 */

function initSidebar() {
    const sidebarNav = document.getElementById('sidebarNav');
    if (!sidebarNav) return;

    // Get current page filename
    const path = window.location.pathname;
    const page = path.split("/").pop() || 'dashboard.html';

    const menuHTML = `
        <div class="sidebar-section">CORE</div>
        
        <a class="menu-item ${page === 'dashboard.html' ? 'active' : ''}" href="dashboard.html">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span class="menu-text">Dashboard</span>
        </a>

        <div class="has-dropdown ${['users.html', 'users-create.html', 'roles.html', 'role-create.html'].includes(page) ? 'open active-parent' : ''}">
            <div class="menu-item dropdown-toggle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                <span class="menu-text">User</span>
                <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
            <div class="submenu">
                <a href="users.html" class="${page === 'users.html' ? 'active' : ''}">Manage user</a>
                <a href="roles.html" class="${page === 'roles.html' ? 'active' : ''}">Manage Roles</a>
                <a href="activities.html" class="${page === 'activities.html' ? 'active' : ''}">Recent Activities</a>
            </div>
        </div>

        <a class="menu-item ${page === 'app-usage.html' ? 'active' : ''}" href="app-usage.html">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            <span class="menu-text">App Usage</span>
        </a>

        <div class="has-dropdown ${['companies.html', 'companies-analytics.html', 'companies-plans.html', 'companies-employee-limit.html'].includes(page) ? 'open active-parent' : ''}">
            <div class="menu-item dropdown-toggle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                <span class="menu-text">Company Management</span>
                <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
            <div class="submenu">
                <a href="companies.html" class="${page === 'companies.html' ? 'active' : ''}">Companies</a>
                <a href="companies-analytics.html" class="${page === 'companies-analytics.html' ? 'active' : ''}">Company Analytics</a>
                <a href="companies-plans.html" class="${page === 'companies-plans.html' ? 'active' : ''}">Plan Expire</a>
                <a href="companies-employee-limit.html" class="${page === 'companies-employee-limit.html' ? 'active' : ''}">Employee Count</a>
            </div>
        </div>

        <div class="has-dropdown ${['companies-create.html', 'companies-requests-new.html', 'companies-pending.html', 'companies-requests-created.html', 'companies-requests-rejected.html', 'companies-my.html'].includes(page) ? 'open active-parent' : ''}">
            <div class="menu-item dropdown-toggle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                <span class="menu-text">Company Request</span>
                <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
            <div class="submenu">
                <a href="companies-create.html" class="${page === 'companies-create.html' ? 'active' : ''}">Add New Company</a>
                <a href="companies-requests-new.html" class="${page === 'companies-requests-new.html' ? 'active' : ''}">New Company Request</a>
                <a href="companies-pending.html" class="${page === 'companies-pending.html' ? 'active' : ''}">Pending Companies</a>
                <a href="companies-requests-created.html" class="${page === 'companies-requests-created.html' ? 'active' : ''}">Created Company</a>
                <a href="companies-requests-rejected.html" class="${page === 'companies-requests-rejected.html' ? 'active' : ''}">Rejected Company</a>
                <a href="companies-my.html" class="${page === 'companies-my.html' ? 'active' : ''}">My Company</a>
            </div>
        </div>

        <div class="has-dropdown ${['operations-tickets.html', 'operations-escalations.html', 'operations-feedback.html', 'operations-company-requests.html'].includes(page) ? 'open active-parent' : ''}">
            <div class="menu-item dropdown-toggle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                <span class="menu-text">Operations</span>
                <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
            <div class="submenu">
                <a href="operations-tickets.html" class="${page === 'operations-tickets.html' ? 'active' : ''}">Tickets</a>
                <a href="operations-escalations.html" class="${page === 'operations-escalations.html' ? 'active' : ''}">Escalations</a>
                <a href="operations-feedback.html" class="${page === 'operations-feedback.html' ? 'active' : ''}">Website Feedback</a>
                <a href="operations-company-requests.html" class="${page === 'operations-company-requests.html' ? 'active' : ''}">Company Found Requests</a>
            </div>
        </div>

        <div class="has-dropdown ${['crm-leads', 'crm-leads.html', 'crm-demo', 'crm-demo.html'].includes(page) ? 'open active-parent' : ''}">
            <div class="menu-item dropdown-toggle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
                <span class="menu-text">CRM</span>
                <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
            <div class="submenu">
                <a href="/crm-leads" class="${page === 'crm-leads' ? 'active' : ''}">Leads</a>
                <a href="/crm-demo" class="${page === 'crm-demo' ? 'active' : ''}">Demo Requests</a>
            </div>
        </div>

        <div class="has-dropdown ${page.startsWith('report') ? 'open active-parent' : ''}">
            <div class="menu-item dropdown-toggle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                <span class="menu-text">Reports</span>
                <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
            <div class="submenu">
                <a href="reports.html" class="${page === 'reports.html' ? 'active' : ''}">Dashboard</a>
                
                <a href="tracking-reports.html" class="${page === 'tracking-reports.html' ? 'active' : ''}">Tracking Reports</a>

                <div class="has-dropdown">
                    <div class="menu-item dropdown-toggle">
                        <span class="menu-text">Sales & CRM</span>
                        <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <div class="submenu">
                        <a href="reports-viewer.html?type=crm_report">CRM Report</a>
                        <a href="reports-viewer.html?type=sales_inquiry">Sales Inquiry</a>
                        <a href="reports-viewer.html?type=engagement_report">Engagement</a>
                        <a href="reports-viewer.html?type=crm_plan_expire">Plan Expire</a>
                    </div>
                </div>

                <div class="has-dropdown">
                    <div class="menu-item dropdown-toggle">
                        <span class="menu-text">Company Insights</span>
                        <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <div class="submenu">
                        <a href="reports-viewer.html?type=analytics_report">Analytics</a>
                        <a href="reports-viewer.html?type=company_count">Company Count</a>
                        <a href="reports-viewer.html?type=company_report">Company Report</a>
                        <a href="reports-viewer.html?type=deleted_company">Deleted Company</a>
                        <a href="reports-viewer.html?type=pending_companies">Pending Companies</a>
                        <a href="reports-viewer.html?type=new_requests">New Requests</a>
                    </div>
                </div>

                <div class="has-dropdown">
                    <div class="menu-item dropdown-toggle">
                        <span class="menu-text">Operations & Support</span>
                        <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <div class="submenu">
                        <a href="reports-viewer.html?type=app_support">App Support</a>
                        <a href="reports-viewer.html?type=support_handover">Support Handover</a>
                        <a href="reports-viewer.html?type=employee_tickets">Employee Tickets</a>
                        <a href="reports-viewer.html?type=recent_activities">Recent Activities</a>
                        <a href="reports-viewer.html?type=feedback">Feedback</a>
                    </div>
                </div>

                <div class="has-dropdown">
                    <div class="menu-item dropdown-toggle">
                        <span class="menu-text">Specialized Analytics</span>
                        <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <div class="submenu">
                        <a href="reports-viewer.html?type=smart_society">Smart Society</a>
                        <a href="reports-viewer.html?type=my_association">My Association</a>
                        <a href="reports-viewer.html?type=white_label">White Label</a>
                    </div>
                </div>

                <div class="has-dropdown">
                    <div class="menu-item dropdown-toggle">
                        <span class="menu-text">Implementation</span>
                        <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <div class="submenu">
                        <a href="reports-viewer.html?type=setup_report">Setup</a>
                        <a href="reports-viewer.html?type=product_training">Product Training</a>
                        <a href="reports-viewer.html?type=training_feedback">Training Feedback</a>
                        <a href="reports-viewer.html?type=implementation">Meetings</a>
                    </div>
                </div>

                <div class="has-dropdown">
                    <div class="menu-item dropdown-toggle">
                        <span class="menu-text">Financial & Tech</span>
                        <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                    <div class="submenu">
                        <a href="reports-viewer.html?type=transaction_report">Transaction Report</a>
                        <a href="reports-viewer.html?type=biometric_device">Biometric Device</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="has-dropdown ${['country-management', 'state-management', 'city-management'].includes(page) ? 'open active-parent' : ''}">
            <div class="menu-item dropdown-toggle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
                <span class="menu-text">Locations</span>
                <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
            <div class="submenu">
                <a href="/country-management" class="${page === 'country-management' ? 'active' : ''}">Manage Countries</a>
                <a href="/state-management" class="${page === 'state-management' ? 'active' : ''}">Manage States</a>
                <a href="/city-management" class="${page === 'city-management' ? 'active' : ''}">Manage Cities</a>
            </div>
        </div>

        <div class="has-dropdown ${['ats-jobs', 'ats-applications', 'ats-interviews', 'ats-reports', 'ats-jobs.html', 'ats-applications.html'].includes(page) ? 'open active-parent' : ''}">
            <div class="menu-item dropdown-toggle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                <span class="menu-text">Recruitment (ATS)</span>
                <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
            <div class="submenu">
                <a href="/ats-jobs" class="${page === 'ats-jobs' ? 'active' : ''}">Job Listings</a>
                <a href="/ats-applications" class="${page === 'ats-applications' ? 'active' : ''}">Applications</a>
                <a href="/ats-interviews" class="${page === 'ats-interviews' ? 'active' : ''}">Interviews</a>
                <a href="/ats-reports" class="${page === 'ats-reports' ? 'active' : ''}">Reports & Analytics</a>
            </div>
        </div>

        <div class="has-dropdown ${['automation-settings', 'whatsapp-logs', 'execution-history', 'whatsapp-logs.html', 'execution-history.html'].includes(page) ? 'open active-parent' : ''}">
            <div class="menu-item dropdown-toggle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span class="menu-text">Automation (Cron)</span>
                <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
            <div class="submenu">
                <a href="/automation-settings" class="${page === 'automation-settings' ? 'active' : ''}">Automation Settings</a>
                <a href="whatsapp-logs.html" class="${page === 'whatsapp-logs.html' ? 'active' : ''}">WhatsApp Log</a>
                <a href="execution-history.html" class="${page === 'execution-history.html' ? 'active' : ''}">Execution History</a>
            </div>
        </div>

        <div class="sidebar-section">ENGAGEMENT & BANNERS</div>

        <div class="has-dropdown ${['banners', 'banners.html', 'banners-create.html', 'festival-banners', 'festival-banners.html'].includes(page) ? 'open active-parent' : ''}">
            <div class="menu-item dropdown-toggle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                <span class="menu-text">Banners</span>
                <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
            <div class="submenu">
                <a href="/banners" class="${page === 'banners' || page === 'banners.html' ? 'active' : ''}">App Banners</a>
                <a href="/festival-banners" class="${page === 'festival-banners' || page === 'festival-banners.html' ? 'active' : ''}">Festival Banners</a>
            </div>
        </div>
        <div class="has-dropdown ${['onboarding-welcome.html', 'onboarding-training-dashboard.html', 'onboarding-company-dashboard.html', 'onboarding-training-batch.html', 'onboarding-training-slots.html', 'onboarding-training-modules.html', 'onboarding-training-priority.html', 'onboarding-participants.html', 'onboarding-work-reports.html', 'onboarding-daily-reports.html', 'onboarding-email-templates.html'].includes(page) ? 'open active-parent' : ''}">
            <div class="menu-item dropdown-toggle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <span class="menu-text">Onboarding process</span>
                <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
            <div class="submenu">
                <a href="onboarding-welcome.html" class="${page === 'onboarding-welcome.html' ? 'active' : ''}">Welcome Process</a>
                <a href="onboarding-training-dashboard.html" class="${page === 'onboarding-training-dashboard.html' ? 'active' : ''}">Training Dashboard</a>
                <a href="onboarding-company-dashboard.html" class="${page === 'onboarding-company-dashboard.html' ? 'active' : ''}">Company Dashboard</a>
                <a href="onboarding-training-batch.html" class="${page === 'onboarding-training-batch.html' ? 'active' : ''}">Manage Training Batch</a>
                <a href="onboarding-training-slots.html" class="${page === 'onboarding-training-slots.html' ? 'active' : ''}">Manage Training Slots</a>
                <a href="onboarding-training-modules.html" class="${page === 'onboarding-training-modules.html' ? 'active' : ''}">Manage Training Modules</a>
                <a href="onboarding-training-priority.html" class="${page === 'onboarding-training-priority.html' ? 'active' : ''}">Manage Training Priority</a>
                <a href="onboarding-participants.html" class="${page === 'onboarding-participants.html' ? 'active' : ''}">Manage Participants</a>
                <a href="onboarding-work-reports.html" class="${page === 'onboarding-work-reports.html' ? 'active' : ''}">Implementation Work report</a>
                <a href="onboarding-daily-reports.html" class="${page === 'onboarding-daily-reports.html' ? 'active' : ''}">Manage Daily Reports</a>
                <a href="onboarding-email-templates.html" class="${page === 'onboarding-email-templates.html' ? 'active' : ''}">Email Templates</a>
            </div>
        </div>
        <div class="has-dropdown ${['engagement', 'engagement.html', 'engagement-report', 'engagement-report.html'].includes(page) ? 'open active-parent' : ''}">
            <div class="menu-item dropdown-toggle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                <span class="menu-text">Engagement</span>
                <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
            <div class="submenu">
                <a href="/engagement" class="${page === 'engagement' || page === 'engagement.html' ? 'active' : ''}">Engagement Dashboard</a>
                <a href="/engagement-report" class="${page === 'engagement-report' || page === 'engagement-report.html' ? 'active' : ''}">Engagement Work Report</a>
            </div>
        </div>

        <div class="sidebar-section">SYSTEM & CONFIGURATION</div>

        <a class="menu-item ${['manage-devices', 'manage-devices.html', 'devices.html'].includes(page) ? 'active' : ''}" href="devices.html">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
            <span class="menu-text">Manage Devices</span>
        </a>
        <a class="menu-item ${page === 'recycle-bin.html' ? 'active' : ''}" href="recycle-bin.html">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            <span class="menu-text">Backup (Recycle Bin)</span>
        </a>
        <a class="menu-item ${page === 'settings.html' ? 'active' : ''}" href="settings.html">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            <span class="menu-text">Settings</span>
        </a>
        <div class="has-dropdown ${['industry-type-management'].includes(page) ? 'open active-parent' : ''}">
            <div class="menu-item dropdown-toggle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                <span class="menu-text">Master Settings</span>
                <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
            <div class="submenu">
                <a href="/industry-type-management" class="${page === 'industry-type-management' ? 'active' : ''}">Industry Types</a>
                <a href="#" style="opacity: 0.5; pointer-events: none;">Company Categories</a>
            </div>
        </div>
    `;

    sidebarNav.innerHTML = menuHTML;

    // Add title attributes for tooltips in collapsed mode
    document.querySelectorAll('.menu-item').forEach(item => {
        const textEl = item.querySelector('.menu-text');
        if(textEl) {
            item.setAttribute('title', textEl.innerText.trim());
        }
    });

    // Attach Toggle Listeners
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // If sidebar is collapsed, expand it first
            if(document.body.classList.contains('sidebar-collapsed')) {
                document.body.classList.remove('sidebar-collapsed');
            }
            
            const parent = toggle.closest('.has-dropdown');
            
            // Accordion: close only sibling dropdowns at the same level
            const siblings = parent.parentElement.querySelectorAll(':scope > .has-dropdown.open');
            siblings.forEach(el => {
                if (el !== parent) {
                    el.classList.remove('open');
                }
            });

            parent.classList.toggle('open');
        });
    });
}

// Sidebar toggle for smaller screens or collapsed mode
function toggleSidebar() {
    document.body.classList.toggle('sidebar-collapsed');
    
    // Auto-close all open dropdowns when collapsing
    if(document.body.classList.contains('sidebar-collapsed')) {
        document.querySelectorAll('.has-dropdown.open').forEach(el => {
            el.classList.remove('open');
        });
    }
}

document.addEventListener('DOMContentLoaded', initSidebar);
