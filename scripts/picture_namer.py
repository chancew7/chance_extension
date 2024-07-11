import os

def rename_images(directory):
    # Get a list of all files in the directory
    files = os.listdir(directory)
    
    # Filter out non-png files
    png_files = [file for file in files if file.lower().endswith('.png')]
    
    # Sort the files to ensure consistent order
    png_files.sort()
    
    # First pass: Rename files to temporary names
    temp_names = []
    for index, filename in enumerate(png_files):
        temp_name = f"temp_{index}.png"
        old_path = os.path.join(directory, filename)
        temp_path = os.path.join(directory, temp_name)
        os.rename(old_path, temp_path)
        temp_names.append(temp_name)
    
    # Second pass: Rename temporary files to final names
    for index, temp_name in enumerate(temp_names):
        final_name = f"p{index}.png"
        temp_path = os.path.join(directory, temp_name)
        final_path = os.path.join(directory, final_name)
        os.rename(temp_path, final_path)
        print(f"Renamed '{temp_name}' to '{final_name}'")

# Specify the directory containing the png files
directory_path = "../pictures/rand_pictures/"

# Call the function
rename_images(directory_path)
