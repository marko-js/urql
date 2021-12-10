const { types: t } = require("@marko/compiler");

module.exports = (path) => {
  path.replaceWith(
    t.variableDeclaration("var", [
      t.variableDeclarator(
        t.identifier("componentDef"),
        path.hub.file._componentDefIdentifier
      )
    ])
  );
};