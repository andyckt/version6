# remove_numbers.py
def remove_numbers_from_file(file_path):
    with open(file_path, 'r') as file:
        lines = file.readlines()

    with open(file_path, 'w') as file:
        for line in lines:
            # Split the line at the '=' and keep the part after it
            parts = line.split('=')
            if len(parts) > 1:
                file.write(f"{parts[1].strip()}\n")  # Write the part after '='

if __name__ == "__main__":
    remove_numbers_from_file('username.txt')