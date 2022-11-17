function translateMarko4(_el, { builder }) {
  return builder.vars({
    componentDef: builder.identifier("__component"),
  });
}

function translateMarko5(path, t) {
  path.replaceWith(
    t.variableDeclaration("var", [
      t.variableDeclarator(
        t.identifier("componentDef"),
        path.hub.file._componentDefIdentifier
      ),
    ])
  );
}

module.exports = function translate(a, b) {
  if (a.hub) {
    return translateMarko5(a, b);
  }

  return translateMarko4(a, b);
};
