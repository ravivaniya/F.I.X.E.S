const { Octokit } = require("@octokit/rest");
const yaml = require("js-yaml");
const fs = require("fs");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

async function fetchCodeScanningIssues() {
  try {
    // Load configuration
    const config = yaml.load(fs.readFileSync("auto-fix-config.yml", "utf8"));
    const filters = config.auto_fix_settings.filters;

    // Get code scanning alerts
    const { data: alerts } = await octokit.rest.codeScanning.listAlertsForRepo({
      owner,
      repo,
      state: "open",
    });

    // Filter alerts based on configuration
    const filteredAlerts = alerts.filter((alert) => {
      // Filter by tool
      if (
        filters.tools &&
        !filters.tools.includes(alert.tool.name.toLowerCase())
      ) {
        return false;
      }

      // Filter by rule
      if (
        filters.rules.include &&
        !filters.rules.include.includes(alert.rule.id)
      ) {
        return false;
      }

      if (
        filters.rules.exclude &&
        filters.rules.exclude.includes(alert.rule.id)
      ) {
        return false;
      }

      // Filter by severity
      if (filters.severity && !filters.severity.includes(alert.rule.severity)) {
        return false;
      }

      // Filter by path
      const filePath = alert.most_recent_instance.location.path;

      if (filters.paths.include) {
        const included = filters.paths.include.some((pattern) =>
          filePath.match(new RegExp(pattern.replace("**", ".*")))
        );
        if (!included) return false;
      }

      if (filters.paths.exclude) {
        const excluded = filters.paths.exclude.some((pattern) =>
          filePath.match(new RegExp(pattern.replace("**", ".*")))
        );
        if (excluded) return false;
      }

      return true;
    });

    // Group issues by file and rule for batch processing
    const groupedIssues = {};
    filteredAlerts.forEach((alert) => {
      const filePath = alert.most_recent_instance.location.path;
      const ruleId = alert.rule.id;
      const key = `${filePath}:${ruleId}`;

      if (!groupedIssues[key]) {
        groupedIssues[key] = {
          filePath,
          ruleId,
          tool: alert.tool.name,
          severity: alert.rule.severity,
          description: alert.rule.description,
          instances: [],
        };
      }

      groupedIssues[key].instances.push({
        line: alert.most_recent_instance.location.start_line,
        column: alert.most_recent_instance.location.start_column,
        endLine: alert.most_recent_instance.location.end_line,
        endColumn: alert.most_recent_instance.location.end_column,
        message: alert.most_recent_instance.message.text,
      });
    });

    // Save issues to file for next step
    fs.writeFileSync(
      "code-scanning-issues.json",
      JSON.stringify(groupedIssues, null, 2)
    );

    const hasIssues = Object.keys(groupedIssues).length > 0;
    console.log(
      `Found ${Object.keys(groupedIssues).length} issue groups to fix`
    );

    // Set GitHub Actions output
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `has_issues=${hasIssues}\n`);
  } catch (error) {
    console.error("Error fetching code scanning issues:", error);
    process.exit(1);
  }
}

fetchCodeScanningIssues();
