# Create a sample directory (including parent if not present)
mkdir -p ~/sample

# Create a sample text file
touch ~/sample/sample.txt

# Add a sample line of text to the file
echo "Hi! This is just a sample text file created using a shell script." >> ~/sample/sample.txt

# View the contents of the file
cat ~/sample/sample.txt

# Count how many times the character 't' appears in the file
grep -o 't' ~/sample/sample.txt | wc -l

# Give full permissions (read/write/execute) to the user for the file
chmod u+rwx ~/sample/sample.txt

# Append another sample line of text
echo "Hi! This is just another sample text added to the file." >> ~/sample/sample.txt

# Set group permissions to read-only; remove write and execute
chmod g+r-wx ~/sample/sample.txt

# Remove all permissions from others
chmod o-rwx ~/sample/sample.txt

# Make a copy of the sample file
cp ~/sample/sample.txt ~/sample/sample2.txt

# Append 1000 random numbers (one per line) to the sample file
for i in {1..1000}; do echo $RANDOM >> ~/sample/sample.txt; done

# Display the first 50 lines of the sample file
head -n 50 ~/sample/sample.txt

# Display the last 50 lines of the sample file
tail -n 50 ~/sample/sample.txt

# Create multiple files in the sample directory
touch ~/sample/prog1.txt ~/sample/prog2.txt ~/sample/program.txt ~/sample/code.txt ~/sample/info.txt

# List all files in the directory matching pattern '*prog*'
ls ~/sample/*prog*

# Define a function 'list' that lists all files containing a specific pattern
list() { ls ~/sample/*"$1"*; }

# Use the 'list' function with argument 'prog'
list prog

echo "1. Difference between source and sh :
>>> source executes commands from a file in the current shell process. Any variables or
functions defined in that file remain in the current environment. However, sh runs the script in a new shell. Changes to variables or
directory inside that script do not affect the previous shell.

2. cat > one.txt
hi there this is the first line
^C
cat > two.txt
hi there this is the first line
tumhe pata hai what is the difference between these two 
These two are the differences in these two;
^C
diff one.txt two.txt

3. Difference between ls and lsof :
>>> ls lists files and directories in a filesystem. 
lsof lists open files held by running processes. Since everything is a file in linux,
lsof can show which processes have a given file open or which processes
are listening on a port.

4. mkdir -p hello/world 
>>> Creates nested directories in one command.

5. echo \"export newvar=varval\" >> ~/.bashrc
>>> Adds a permanent environment variable to bash profile.

6. sudo lsof -i :1234
kill 5678
>>> Find process using port 1234 and kill it.

" >> ~/sample/sample.txt
