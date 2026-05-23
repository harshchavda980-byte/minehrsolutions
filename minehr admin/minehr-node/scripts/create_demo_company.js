const axios = require('axios');
require('dotenv').config();

async function createDemoCompany() {
    const payload = {
        is_rise_event: false,
        company_name: "Demo Priority Corp",
        company_code: "DPC001",
        account_type: "Online",
        country: "India",
        state: "Maharashtra",
        city: "Mumbai",
        company_address: "789 Priority Towers, Mumbai",
        pincode: "400001",
        industry_type: "Technology",
        admin_name: "Demo Admin",
        currency: "INR",
        admin_mobile: "9876543210",
        admin_email: "priority.demo@minehr.com",
        company_base_url: "https://demo.minehr.com",
        end_url_name: "demo-priority",
        plan_type: "Pro",
        trial_days: "14",
        employee_limit: "100",
        expected_team_size: "200",
        employee_tracking_limit: "100",
        yearly_ticket_size: "1000",
        resolved_ticket_size: "950",
        per_employee_price: "10.00",
        sales_person_name: "Antigravity",
        implementation_executive_name: "Antigravity",
        year_type: "Calendar Year",
        company_priority: "80",
        training_type: "Remote",
        company_remark: "Priority demo company created for verification.",
        latitude: 19.0760,
        longitude: 72.8777
    };

    try {
        // We need an auth cookie or a way to bypass it for this script
        // For simplicity, let's assume the API is local and we can hit it if it doesn't have strict session check for this internal tool
        // Or I can use a controller method directly via node -e
        console.log("Submitting demo company registration...");
        // Since I'm on the same machine, I'll use the Controller directly
    } catch (e) {
        console.error("Failed to create demo company:", e.message);
    }
}

createDemoCompany();
