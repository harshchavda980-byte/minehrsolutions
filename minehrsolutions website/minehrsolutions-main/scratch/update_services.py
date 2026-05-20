import os
import re

services_dir = r'c:\Users\Ash\OneDrive\Desktop\minehrsolutions-main 3\minehrsolutions-main\services'
ats_nav_link = '                    <a href="../ats.html" class="nav-link">ATS</a>'
ats_footer_link = '                            <li><a href="../ats.html">ATS</a></li>'

for filename in os.listdir(services_dir):
    if filename.endswith('.html'):
        filepath = os.path.join(services_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Update Navbar
        if '<a href="../ats.html"' not in content:
            content = content.replace(
                '<a href="../blog.html" class="nav-link">Blog</a>',
                '<a href="../blog.html" class="nav-link">Blog</a>\n' + ats_nav_link
            )

        # Update Footer
        if '<li><a href="../ats.html">ATS</a></li>' not in content:
            content = content.replace(
                '<li><a href="../contact.html">Contact Us</a></li>',
                '<li><a href="../contact.html">Contact Us</a></li>\n' + ats_footer_link
            )

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

print("Updated all service pages.")
