# check_repeats.py

def check_repeats(filename):
    numbers = set()
    usernames = set()
    repeated_numbers = set()
    repeated_usernames = set()

    with open(filename, 'r') as file:
        for line in file:
            parts = line.split('=')
            if len(parts) == 2:
                number = parts[0].strip()
                username = parts[1].strip().split('@')[-1] if '@' in parts[1] else None

                # Check for repeated numbers
                if number in numbers:
                    repeated_numbers.add(number)
                else:
                    numbers.add(number)

                # Check for repeated usernames
                if username and username in usernames:
                    repeated_usernames.add(username)
                elif username:
                    usernames.add(username)

    return repeated_numbers, repeated_usernames

if __name__ == "__main__":
    filename = 'username.txt'
    repeated_numbers, repeated_usernames = check_repeats(filename)

    if repeated_numbers:
        print("Repeated numbers:", repeated_numbers)
    else:
        print("No repeated numbers found.")

    if repeated_usernames:
        print("Repeated usernames:", repeated_usernames)
    else:
        print("No repeated usernames found.")