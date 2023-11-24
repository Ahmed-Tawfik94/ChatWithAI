const unescapeHtmlEntities = function (str) {
    return str
      .replace(/\&\#91\;/g, "[")
      .replace(/\&\#93\;/g, "]")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'");
  };
  const hljsExtension = function () {
    return [
      {
        type: "output",
        filter: function (text) {
          return text.replace(
            /<pre><code\b[^>]*>([\s\S]*?)<\/code><\/pre>/gi,
            function (match, code) {
              const unescapedCode = unescapeHtmlEntities(code);
              const highlighted = hljs.highlightAuto(unescapedCode).value;
              return `<pre><code>${highlighted}</code></pre>`;
            }
          );
        },
      },
    ];
  };
  Mustache.tags = ["<%", "%>"];
  showdown.extension("highlight", hljsExtension);
  const markdown = new showdown.Converter({ extensions: ["highlight"] });