module.exports = robot => {
  robot.on('issue_comment', async context => {
    // Matches comments like, "This should be simple", "The is totally trivial",
    // "This is super trivial", etc.
    const regex = /(should be|would be|could be|is) (totally|completely|very|super|probably)? ?(simple|easy|trivial)/gi;
    const str = context.payload.comment.body;

    let m;
    let aMatches = [];

    while ((m = regex.exec(str)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      if (m.length > 0) {
        aMatches.push(m[0]);
      }
    }

    if (aMatches.length > 0 && context.payload.comment.user.type != "Bot") {
      try {
        const tbody = "> " + aMatches.join("\n\n> ")
                  + "\n\nDid you mean, \"_might be straightforward, but could have unforseen complexities that would completely change the prioritization of the issue, so we should let it go through the normal planning and estimation process_\"[?](https://en.wikipedia.org/wiki/Planning_fallacy)";
        context.github.issues.createComment(context.issue({body: tbody}))
      }
      catch (err) {
        if (err.code !== 404) {
          throw err
        }
      }
    }

  });
};
