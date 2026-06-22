# LeetCode-Auto

<p align="center">
  <img src="assets/logo.png" alt="LeetCode-Auto Logo" width="120" height="120" />
</p>

A private, lightweight, and fully customized Chrome extension that automatically synchronizes your LeetCode and LeetCode CN solutions to your GitHub repositories upon passing all test cases.

---

## 🌟 Key Features

- **Automated Pushing**: Completely automates code pushes to GitHub whenever you solve a problem successfully.
- **Supported Platforms**: Works seamlessly with both **LeetCode.com** (English) and **LeetCode.cn** (Chinese / 力扣).
- **Direct GitHub Connection (PAT)**: Authenticate directly using a GitHub **Personal Access Token (PAT)**—no third-party OAuth app setup required.
- **Custom OAuth App Support**: Option to use your own registered GitHub OAuth application by configuring a `.env` file.
- **Customizable Organization**:
  - Store files by **Difficulty** (e.g., `LeetCode/Easy/0001-two-sum/0001-two-sum.js`).
  - Store files by **Language** (e.g., `LeetCode/JavaScript/Easy/0001-two-sum/0001-two-sum.js`).
  - Save versioned files with timestamped filenames.
- **Custom Commit Messages**: Tailor your GitHub commit messages dynamically using variables such as `{time}`, `{space}`, `{date}`, `{problemName}`, `{difficulty}`, `{language}`, and `{problemTopic}`.
- **Privacy-First**: No tracking, no external server hops, and zero telemetry.

---

## 🛠️ Supported UI & Synchronization Notes

### Supported Layouts

LeetCode-Auto works with two different LeetCode UIs:

1. **Old Layout**
2. **New Dynamic Layout**

### Synchronizing Submissions

- **Auto-Sync Delay**: To ensure successful upload, please wait **4 seconds** after submitting a solution before typing in the editor, switching languages, or navigating away. This gives the extension time to retrieve files and push to GitHub.
- **Manual Sync Button**: A manual synchronization button is available next to the notes icon in LeetCode. You can click this button after successful submission to force-sync, or to push any of your previous submissions.

---

## 🚀 Installation & Setup

### Step 1: Install Dependencies

Ensure you have **Node.js** installed, then run the setup command in your terminal:

```bash
npm run setup
```

This command installs the required development dependencies and automatically generates a `.env` and `.env.example` file in the root directory.

### Step 2: Choose Your Connection Method

#### Method A: Connect with Personal Access Token (Recommended)

1. Go to your [GitHub Personal Access Tokens settings (Classic)](https://github.com/settings/tokens).
2. Generate a new token with the **`repo`** scope.
3. Open the LeetCode-Auto popup in your browser.
4. Paste the token into the **Personal Access Token (PAT)** field and click **Connect**.

#### Method B: Connect with Your Own OAuth App

1. Create a developer OAuth App in your GitHub Settings ([Register new application](https://github.com/settings/applications/new)):
   - **Application Name**: LeetCode-Auto
   - **Homepage URL**: `https://github.com/` (or custom redirect)
   - **Authorization callback URL**: `https://github.com/`
2. Generate a Client Secret and copy both the **Client ID** and **Client Secret**.
3. Open the `.env` file in the root of this project and fill in the values:
   ```env
   GITHUB_CLIENT_ID=your_client_id_here
   GITHUB_CLIENT_SECRET=your_client_secret_here
   ```
4. Update the codebase with your secrets by running:
   ```bash
   npm run config
   ```
5. Click **Authenticate** in the extension popup to log in.

### Step 3: Load the Extension in Chrome

1. Open Google Chrome.
2. Navigate to `chrome://extensions`.
3. Enable **Developer mode** by toggling the switch in the top-right corner.
4. Click **Load unpacked** in the top-left corner.
5. Select the root folder of this project (`LeetCode-Auto`).

---

## 📦 Supported Development Scripts

```bash
npm run setup         # Installs dependencies & initializes environment files
npm run config        # Syncs GITHUB_CLIENT_ID/SECRET from .env to extension source code
npm run format        # Auto-formats JavaScript, HTML, and CSS using Prettier
npm run format-test   # Verifies code formatting status
npm run lint          # Lints and auto-fixes JavaScript files using ESLint
```
