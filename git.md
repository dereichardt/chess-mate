# Git & GitHub for Chess-Mate

Quick reference for using Git and GitHub with this project.

---

## Initial setup (one-time)

1. **Create a repo on GitHub**  
   [github.com](https://github.com) → New repository → name it (e.g. `chess-mate`). Don’t add README/.gitignore (project already exists).

2. **Initialize and push from your machine:**
   ```bash
   cd /path/to/chess-mate
   git init
   git add .
   git commit -m "Initial commit: Chess-Mate web app"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/chess-mate.git
   git push -u origin main
   ```

3. **If push fails with authentication:**
   - **HTTPS:** GitHub no longer accepts account passwords. Use a [Personal Access Token](https://github.com/settings/tokens) (classic, scope `repo`). When Git asks for a password, paste the token. Optional: `git config --global credential.helper store` so it’s remembered.
   - **SSH:** Create a key (`ssh-keygen -t ed25519 -C "your_email@example.com"`), add the public key in GitHub → Settings → SSH and GPG keys, then use `git remote set-url origin git@github.com:YOUR_USERNAME/chess-mate.git` and push again.

---

## Day-to-day workflow (new features)

1. **Develop** — Edit code as usual.
2. **Commit** when you finish a logical chunk:
   ```bash
   git add .
   git commit -m "Short description of what you did"
   ```
3. **Push** to GitHub:
   ```bash
   git push
   ```

That’s it. Your code is backed up and in sync with GitHub.

---

## Optional: branches for bigger features

```bash
git checkout -b feature/my-feature-name
# ... work, commit as usual ...
git push -u origin feature/my-feature-name
```

Then open a **Pull Request** on GitHub from that branch into `main`, review, and merge. Use when you want a safety net or to review changes before merging.

---

## Don’t commit

- `.env` and other env files (already in `.gitignore`)
- API keys, database URLs, secrets
