const { Octokit } = require("@octokit/rest");
const yaml = require("js-yaml");
const fs = require("fs");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

async function monitorPRApproval() {
  try {
    const config = yaml.load(fs.readFileSync("auto-fix-config.yml", "utf8"));
    const prSettings = config.auto_fix_settings.pr_settings;
    const prNumber = parseInt(process.env.PR_NUMBER);

    let approved = false;
    let attempts = 0;
    const maxAttempts = 60; // Wait up to 1 hour (60 minutes)

    while (!approved && attempts < maxAttempts) {
      const { data: reviews } = await octokit.rest.pulls.listReviews({
        owner,
        repo,
        pull_number: prNumber,
      });

      // Check if any admin has approved
      const approvedReview = reviews.find(
        (review) =>
          review.state === "APPROVED" &&
          prSettings.reviewers.includes(review.user.login)
      );

      if (approvedReview) {
        approved = true;
        console.log(`PR approved by ${approvedReview.user.login}`);

        if (prSettings.auto_merge_after_approval) {
          // Auto-merge the PR
          await octokit.rest.pulls.merge({
            owner,
            repo,
            pull_number: prNumber,
            commit_title: "🤖 Auto-merge: Code scanning fixes approved",
            merge_method: "squash",
          });

          console.log("PR merged successfully");
        }
      } else {
        attempts++;
        console.log(`Waiting for approval... (${attempts}/${maxAttempts})`);
        await new Promise((resolve) => setTimeout(resolve, 60000)); // Wait 1 minute
      }
    }

    if (!approved) {
      console.log("No approval received within timeout period");
    }
  } catch (error) {
    console.error("Error monitoring PR approval:", error);
  }
}

monitorPRApproval();
