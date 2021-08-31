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
        //Handle names with spaces
        layerData.name = layerData.name.split(" ").join("_");
        console.log(layerData);
        await generateSpreadsheetLayer(layerData, true);
        const gitUserEmail = "github-actions[bot]@users.noreply.github.com";
        const gitUserName = "github-actions[bot]";
        const prBranchName = `new-gen-layer/${layerData.name}`;
        exec("grunt build");
        const baseBranchName = github.context.payload.repository.default_branch;
        exec(`git config --global user.email "${gitUserEmail}"`);
        exec(`git config --global user.name "${gitUserName}"`);
        exec(`git fetch --all`);
        exec(`git checkout ${baseBranchName}`);
        exec(`git checkout -b ${prBranchName}`);

        exec("git status");
        exec("git add **/layers.json");
        exec("git add **/info.json");
        exec("git add **/LeafletEnvironmentalLayers.js -f");
        exec(`git commit -m "layer: new layer ${layerData.name}"`);
        exec(`git push -fu origin ${prBranchName}`);

        exec(
          `gh pr create --title "new-layer: ${layerData.name}" --body "This PR creates a new layer based on the info at ${github.context.payload.issue.html_url}. Please try it out in GitPod to test, and/or make necessary changes to the description, etc. in this PR." --head "${prBranchName}" --base "${baseBranchName}"`
        );
      }
    }
  }
}

run().catch((e) => {
  try {
    exec(
      `git config --global user.email "github-actions[bot]@users.noreply.github.com"`
    );
    exec(`git config --global user.name "github-actions[bot]"`);
    exec(
      `gh issue comment ${github.context.payload.issue.html_url} --body 'Action Failed to execute. \n > This is auto-generared'`
    );
  } finally {
    core.setFailed(e);
  }
});
