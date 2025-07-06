const axios = require("axios");
const yaml = require("js-yaml");
const fs = require("fs");

async function sendTeamsNotification() {
  try {
    const config = yaml.load(fs.readFileSync("auto-fix-config.yml", "utf8"));
    const teamsSettings = config.auto_fix_settings.teams_settings;

    const prUrl = process.env.PR_URL;
    const prNumber = process.env.PR_NUMBER;

    const card = {
      "@type": "MessageCard",
      "@context": "https://schema.org/extensions",
      summary: "Code Scanning Auto-Fix PR Created",
      themeColor: "0078D4",
      sections: [
        {
          activityTitle: "🤖 Code Scanning Auto-Fix",
          activitySubtitle: `PR #${prNumber} created`,
          activityImage:
            "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
          facts: [
            {
              name: "Repository",
              value: process.env.GITHUB_REPOSITORY,
            },
            {
              name: "Status",
              value: "Awaiting Admin Approval",
            },
            {
              name: "Auto-merge",
              value: "Enabled after approval",
            },
          ],
        },
      ],
      potentialAction: [
        {
          "@type": "OpenUri",
          name: "Review PR",
          targets: [
            {
              os: "default",
              uri: prUrl,
            },
          ],
        },
        {
          "@type": "OpenUri",
          name: "View Repository",
          targets: [
            {
              os: "default",
              uri: `https://github.com/${process.env.GITHUB_REPOSITORY}`,
            },
          ],
        },
      ],
    };

    await axios.post(teamsSettings.webhook_url, card);
    console.log("Teams notification sent successfully");
  } catch (error) {
    console.error("Error sending Teams notification:", error);
  }
}

sendTeamsNotification();
