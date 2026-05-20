# MineHR Solutions - Laravel Conversion

This project is a professional conversion of the static MineHR Solutions website into a modern, robust Laravel application. It features a complete templating system, dynamic service pages, and a fully functional contact system with database storage and email notifications.

## 🚀 Key Features

- **Laravel Core**: Migrated from static HTML to Laravel 10+, providing a scalable and maintainable backend.
- **Blade Templating**: Implemented a comprehensive layout system (`layouts/app.blade.php`) to ensure consistency across all pages.
- **Dynamic Services Architecture**:
    - Centralized services hub (`/services`) with premium category filtering.
    - 9+ detailed service pages (CRM, IT Support, HRMS, etc.) powered by a dynamic controller (`ServiceController`).
- **Advanced Contact System**:
    - **Database Integration**: Securely stores all inquiries in a dedicated `contacts` table.
    - **Email Notifications**: Real-time alerts sent to `info@minehrsolutions.com` on every submission.
    - **User Feedback**: Session-based success messages and form validation.
- **Premium UI/UX**:
    - Integrated premium CSS and JS for modern aesthetics and smooth interactivity.
    - Refined layouts with optimized spacing and mobile-responsive designs.
- **Optimized SEO**: Semantic HTML5 structure and descriptive meta tags across all Blade views.

## 🛠 Technology Stack

- **Backend**: Laravel (PHP)
- **Frontend**: Blade Templating, Vanilla CSS, JavaScript
- **Database**: MySQL
- **Email**: SMTP / Mailables

## ⚙️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone [repository-url]
   cd MineHR-Solutions
   ```

2. **Install dependencies**:
   ```bash
   composer install
   npm install
   ```

3. **Configure Environment**:
   - Copy `.env.example` to `.env`.
   - Update `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD`.
   - Update `MAIL_*` settings with your SMTP provider (e.g., Gmail) to enable notifications.

4. **Database Migration**:
   ```bash
   php artisan migrate
   ```

5. **Generate App Key**:
   ```bash
   php artisan key:generate
   ```

6. **Run the application**:
   ```bash
   php artisan serve
   ```

---

*Developed and Maintained by the MineHR Solutions Engineering Team.*
