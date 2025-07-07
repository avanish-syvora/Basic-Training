# Step 1: Create local git repo directory
mkdir i-am-a-git-noob
cd i-am-a-git-noob

# Step 2: Initialize empty local git repo
git init

# Step 3: Add remote pointing to private GitHub repo (alias: avi)
git remote add avi https://github.com/avanish-syvora/i-am-a-git-noob

# Step 4: Check current Git config (before setting)
git config --list

# Step 5: Set Git user name and email for this local repo
git config user.name "Avanish"
git config user.email avanish.garg@syvora.com

# Step 6: Create a test file and write the first line
echo "first line in file" > test1.txt

# Step 7: Stage and commit the file
git add test1.txt
git commit -m "Pushing the first file"

# Step 8: Push to GitHub remote 'avi'
git push avi main

# Step 9: Append second line, stage, and check status
echo "second line in file" >> test1.txt
git add test1.txt
git status

# Step 10: Append third line and check status again
echo "Third line in file" >> test1.txt
git status

# Step 11: Unstage the file (as it changed after staging)
git restore --staged test1.txt

# Step 12: Stage again and commit with message "My First Commit"
git add test1.txt
git commit -m "My First Commit"

# Step 13: Push commit to remote
git push avi main

# Step 14: Amend commit message to "My Second Commit"
git commit --amend -m "My Second Commit"

# Step 15: Force push to overwrite history on remote
git push --force avi main

# Step 16: View last few commits and diff between last two
git log --oneline
git diff HEAD HEAD~1

# Step 17: Revert last commit safely
git revert HEAD

# Step 18: Append fourth line and commit
echo "Fourth line in the file" >> test1.txt
git add test1.txt
git commit -m "Added Fourth line"

# Step 19: Append fifth line and amend previous commit without changing message
echo "Fifth line in the file" >> test1.txt
git add test1.txt
git commit --amend --no-edit --allow-empty

# Step 20: Force push amended commit
git push --force avi main

# Step 21: (Manual Step) A line was appended directly on GitHub via web interface

# Step 22: Pull changes from GitHub (remote avi)
git pull avi main

# Step 23: Clone repo into another directory to verify final state
cd
git clone https://github.com/avanish-syvora/i-am-a-git-noob clonetwo
