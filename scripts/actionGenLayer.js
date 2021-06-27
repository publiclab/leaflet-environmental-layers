const core = require("@actions/core");
const github = require("@actions/github");
const marked = require("marked");
const { generateSpreadsheetLayer } = require("./genSpreadsheetLayer");

const commentPrefix = "@github-actions run";

async function run() {
  const comment = github.context.payload.comment.body;
  if (!comment.startsWith(commentPrefix)) {
    console.log(
      `HINT: Comment-run is triggered when your comment start with "${commentPrefix}"`
    );
    return;
  }
  const tokens = marked.lexer(comment);
  for (const token of tokens) {
    if (token.type === "code") {
      if (token.lang === "json") {
        const layerData = JSON.parse(token.text);
        await generateSpreadsheetLayer(
          layerData,
          "../src/spreadsheetLayers/layers.json",
          "../src/info.json",
          true
        );
      }
    }
  }
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
  exec("git add .");
  exec(`git commit -m "layer: new layer ${layerData.name}"`);
  exec(`git push -fu origin ${prBranchName}`);
}

run().catch((e) => {
  core.setFailed(e);
});
