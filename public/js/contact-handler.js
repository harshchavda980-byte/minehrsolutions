/**
 * Dynamic Form Handler for MineHR
 * Handles Contact Form submissions via API
 */

document.addEventListener('DOMContentLoaded', function() {
    const contactForms = document.querySelectorAll('.contact-form, .ats-contact-form');
    
    contactForms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get submit button to show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerText : 'Send Message';
            
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = 'Sending...';
            }
            
            // Collect data
            const formData = new FormData(form);
            const data = {};
            
            // Handle both flat and nested field names
            // API expects: name, email, contact_number, company, message
            data.name = formData.get('name') || `${formData.get('first_name') || ''} ${formData.get('last_name') || ''}`.trim();
            data.email = formData.get('email');
            data.contact_number = formData.get('contact_number') || formData.get('phone');
            data.company = formData.get('company') || formData.get('company_name');
            data.message = formData.get('message');

            // Robustness fallback: If FormData missing fields (e.g. no name attribute), try selector
            if (!data.message) {
                const msgEl = form.querySelector('textarea');
                if (msgEl) data.message = msgEl.value;
            }
            
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (response.ok && result.success) {
                    alert('Thank you! Your message has been sent successfully.');
                    form.reset();
                } else {
                    alert('Submission failed: ' + (result.error || 'Please try again.'));
                }
            } catch (error) {
                console.error('Submission error:', error);
                alert('Submission failed. Please try again.');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalBtnText;
                }
            }
        });
    });
});
