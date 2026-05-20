import os

old_address = "Ahmedabad, Gujarat – India"
new_address = "509, Ananta elysium , Hill town circle, ankur chokadi, New india colony , ankur tenament, Nikol, Ahmedabad, 380049"

def update_files(directory):
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        if '.git' in dirs:
            dirs.remove('.git')
            
        for file in files:
            if file.endswith(".html"):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    if old_address in content:
                        print(f"Updating {filepath}")
                        new_content = content.replace(old_address, new_address)
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                    else:
                        # Try with standard dash just in case
                        old_address_alt = "Ahmedabad, Gujarat - India"
                        if old_address_alt in content:
                            print(f"Updating {filepath} (alt dash)")
                            new_content = content.replace(old_address_alt, new_address)
                            with open(filepath, 'w', encoding='utf-8') as f:
                                f.write(new_content)
                except Exception as e:
                    print(f"Error reading {filepath}: {e}")

if __name__ == "__main__":
    update_files(".")
