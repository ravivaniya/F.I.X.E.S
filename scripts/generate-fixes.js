const { Octokit } = require("@octokit/rest");
const fs = require("fs");
const path = require("path");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

async function generateFixes() {
  try {
    const issues = JSON.parse(
      fs.readFileSync("code-scanning-issues.json", "utf8")
    );
    let fixesApplied = false;

    for (const [key, issue] of Object.entries(issues)) {
      const filePath = issue.filePath;
      const fileContent = fs.readFileSync(filePath, "utf8");

      // Generate fix using GitHub Copilot API
      const fixedContent = await generateFixWithCopilot(fileContent, issue);

      if (fixedContent && fixedContent !== fileContent) {
        fs.writeFileSync(filePath, fixedContent);
        fixesApplied = true;
        console.log(`Applied fix for ${issue.ruleId} in ${filePath}`);
      }
    }

    // Set GitHub Actions output
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      `fixes_applied=${fixesApplied}\n`
    );
  } catch (error) {
    console.error("Error generating fixes:", error);
    process.exit(1);
  }
}

async function generateFixWithCopilot(fileContent, issue) {
  try {
    // Use GitHub Copilot API to generate fix
    const response = await octokit.request("POST /copilot/chat/completions", {
      messages: [
        {
          role: "system",
          content: `You are a code fixing assistant. Fix the following ${issue.tool} issue: ${issue.ruleId}. 
                   Description: ${issue.description}. 
                   Only return the complete fixed file content, no explanations.`,
        },
        {
          role: "user",
          content: `Fix this code:\n\n${fileContent}\n\nIssue locations:\n${JSON.stringify(
            issue.instances,
            null,
            2
          )}`,
        },
      ],
      model: "gpt-4",
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling Copilot API:", error);

    // Fallback to rule-specific fixes
    return applyRuleSpecificFix(fileContent, issue);
  }
}

function applyRuleSpecificFix(fileContent, issue) {
  let fixedContent = fileContent;

  switch (issue.ruleId) {
    case "@typescript-eslint/no-unused-vars":
      // Remove unused variable declarations
      fixedContent = fixUnusedVars(fixedContent, issue.instances);
      break;

    case "@typescript-eslint/no-unused-expressions":
      // Remove unused expressions
      fixedContent = fixUnusedExpressions(fixedContent, issue.instances);
      break;

    default:
      console.log(`No specific fix available for rule: ${issue.ruleId}`);
      return null;
  }

  return fixedContent;
}

function fixUnusedVars(content, instances) {
  const lines = content.split("\n");

  // Sort instances by line number in descending order to avoid index issues
  instances.sort((a, b) => b.line - a.line);

  instances.forEach((instance) => {
    const lineIndex = instance.line - 1;
    const line = lines[lineIndex];

    // Simple regex to remove unused variable declarations
    if (line.match(/^(\s*)(const|let|var)\s+\w+\s*=.*$/)) {
      lines[lineIndex] = line.replace(
        /^(\s*)(const|let|var)\s+\w+\s*=.*$/,
        "$1// Removed unused variable"
      );
    }
  });

  return lines.join("\n");
}

function fixUnusedExpressions(content, instances) {
  const lines = content.split("\n");

  instances.sort((a, b) => b.line - a.line);

  instances.forEach((instance) => {
    const lineIndex = instance.line - 1;
    const line = lines[lineIndex];

    // Remove standalone expressions
    if (line.trim().endsWith(";") && !line.includes("=")) {
      lines[lineIndex] = line.replace(
        /^(\s*).*$/,
        "$1// Removed unused expression"
      );
    }
  });

  return lines.join("\n");
}

generateFixes();
