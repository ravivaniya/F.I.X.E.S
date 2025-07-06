const { Octokit } = require("@octokit/rest");
const yaml = require("js-yaml");
const fs = require("fs");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

async function createPullRequest() {
  try {
    const config = yaml.load(fs.readFileSync("auto-fix-config.yml", "utf8"));
    const prSettings = config.auto_fix_settings.pr_settings;

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const branchName = `${prSettings.branch_prefix}/code-scanning-fixes-${timestamp}`;

    // Create new branch
    const { data: ref } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: "heads/main",
    });

    await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha: ref.object.sha,
    });

    // Get changed files
    const { execSync } = require("child_process");
    const changedFiles = execSync("git diff --name-only", { encoding: "utf8" })
      .trim()
      .split("\n")
      .filter((f) => f);

    if (changedFiles.length === 0) {
      console.log("No changes to commit");
      return;
    }

    // Commit changes
    execSync(`git config user.name "GitHub Actions"`);
    execSync(`git config user.email "actions@github.com"`);
    execSync(`git checkout -b ${branchName}`);
    execSync(`git add ${changedFiles.join(" ")}`);
    execSync(`git commit -m "🤖 Auto-fix code scanning issues"`);
    execSync(`git push origin ${branchName}`);

    // Create PR
    const { data: pr } = await octokit.rest.pulls.create({
      owner,
      repo,
      title: `${prSettings.title_prefix} Code scanning issues fixed`,
      head: branchName,
      base: "main",
      body: `## 🤖 Automated Code Scanning Fixes

This PR contains automated fixes for code scanning issues.

### Fixed Issues:
${changedFiles.map((file) => `- ${file}`).join("\n")}

### Review Required:
- [ ] Admin approval required before merge
- [ ] Automated tests passing
- [ ] Manual review of critical changes

**Note**: This PR will auto-merge after admin approval if configured.`,
      reviewers: prSettings.reviewers,
    });

    // Set GitHub Actions outputs
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `pr_created=true\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `pr_url=${pr.html_url}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `pr_number=${pr.number}\n`);

    console.log(`Created PR: ${pr.html_url}`);
  } catch (error) {
    console.error("Error creating PR:", error);
    process.exit(1);
  }
}

createPullRequest();
