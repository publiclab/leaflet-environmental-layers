const core = require("@actions/core");
const github = require("@actions/github");
const marked = require("marked");
const { execSync } = require("child_process");
const { generateSpreadsheetLayer } = require("./genSpreadsheetLayer");

const commentPrefix = "@github-actions run";

function exec(cmd) {
  console.log(execSync(cmd).toString());
}

async function run() {
  let comment;

  if (github.context.payload.action == "opened") {
    comment = github.context.payload.issue.body;
  } else {
    comment = github.context.payload.comment.body;
    if (!comment.startsWith(commentPrefix)) {
      console.log(
        `HINT: Comment-run is triggered when your comment start with "${commentPrefix}"`
      );
      return;
    }
  }
  const tokens = marked.lexer(comment);
  for (const token of tokens) {
    if (token.type === "code") {
      if (token.lang === "json") {
        const layerData = JSON.parse(token.text);
        console.log(layerData);
        await generateSpreadsheetLayer(layerData, true);
        const gitUserEmail = "github-actions[bot]@users.noreply.github.com";
        const gitUserName = "github-actions[bot]";
        const prBranchName = `new-gen-layer/${layerData.name}`;

        const baseBranchName = github.context.payload.repository.default_branch;
        exec(`git config --global user.email "${gitUserEmail}"`);
        exec(`git config --global user.name "${gitUserName}"`);
        exec(`git fetch --all`);
        exec(`git checkout ${baseBranchName}`);
        exec(`git checkout -b ${prBranchName}`);

        exec("git status");
        exec("git add **/layers.json");
        exec("git add **/info.json");
        exec(`git commit -m "layer: new layer ${layerData.name}"`);
        exec(`git push -fu origin ${prBranchName}`);

        exec(
          `gh pr create --title "new-layer: ${layerData.name}" --body "Ref ${github.context.payload.issue.html_url}" --head "${prBranchName}" --base "${baseBranchName}"`
        );
      }
    }
  }
}

run().catch((e) => {
  core.setFailed(e);
});
