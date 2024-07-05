import os

def rename_images(directory):
    # Get a list of all files in the directory
    files = os.listdir(directory)
    
    # Filter out non-jpg files
    jpg_files = [file for file in files if file.lower().endswith('.jpg')]
    
    # Sort the files to ensure consistent order
    jpg_files.sort()
    
    # Rename each file
    for index, filename in enumerate(jpg_files):
        new_name = f"p{index}.png"
        old_path = os.path.join(directory, filename)
        new_path = os.path.join(directory, new_name)
        os.rename(old_path, new_path)
        print(f"Renamed '{filename}' to '{new_name}'")

# Specify the directory containing the jpg files
directory_path = "../pictures/rand_pictures/"

# Call the function
rename_images(directory_path)
