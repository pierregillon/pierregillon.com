import type { Element, Root as HastRoot } from "hast";
import type { Code, Html, Root as MdastRoot } from "mdast";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { bundledLanguages, createHighlighter, type Highlighter, type ThemeRegistration } from "shiki";
import { unified } from "unified";
import { visit } from "unist-util-visit";

/**
 * Thème de coloration reprenant celui de l'ancien blog (SyntaxHighlighter "Default") :
 * mots-clés en bleu gras, commentaires en vert, chaînes en bleu, le reste en noir.
 */
const codeTheme: ThemeRegistration = {
  name: "pierregillon",
  type: "light",
  colors: {
    "editor.background": "#ffffff",
    "editor.foreground": "#000000",
  },
  tokenColors: [
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#008200" },
    },
    {
      scope: ["string", "punctuation.definition.string", "string.quoted", "string.template"],
      settings: { foreground: "#0000ff" },
    },
    {
      scope: [
        "keyword",
        "storage",
        "storage.type",
        "storage.modifier",
        "keyword.type",
        "keyword.operator.new",
        "keyword.operator.expression",
        "constant.language",
        "variable.language",
      ],
      settings: { foreground: "#006699", fontStyle: "bold" },
    },
    {
      // Les opérateurs symboliques (=, +, =>…) restent en noir, comme sur l'ancien site
      scope: [
        "keyword.operator",
        "keyword.operator.assignment",
        "keyword.operator.arithmetic",
        "keyword.operator.comparison",
        "keyword.operator.logical",
        "keyword.operator.arrow",
        "storage.type.function.arrow",
      ],
      settings: { foreground: "#000000", fontStyle: "" },
    },
    {
      scope: ["meta.preprocessor", "keyword.preprocessor", "punctuation.separator.hash"],
      settings: { foreground: "#808080", fontStyle: "" },
    },
  ],
};

let highlighterPromise: Promise<Highlighter> | undefined;

function getHighlighter() {
  highlighterPromise ??= createHighlighter({ themes: [codeTheme], langs: [] });
  return highlighterPromise;
}

/** "{3,5-7}" → Set(3, 5, 6, 7) : lignes à surligner dans un bloc de code. */
function parseHighlightedLines(meta: string | null | undefined) {
  const lines = new Set<number>();
  const match = meta?.match(/\{([\d,\s-]+)\}/);
  if (!match) return lines;
  for (const part of match[1].split(",")) {
    const [start, end = start] = part.split("-").map((value) => Number(value.trim()));
    for (let line = start; line <= end; line++) lines.add(line);
  }
  return lines;
}

/**
 * Blocs de code : coloration syntaxique à la compilation (aucun JavaScript côté navigateur),
 * numéros de ligne et lignes surlignées via ```csharp {3,5-7}
 */
function remarkHighlightCode() {
  return async (tree: MdastRoot) => {
    const nodes: Code[] = [];
    visit(tree, "code", (node) => {
      nodes.push(node);
    });
    if (nodes.length === 0) return;

    const highlighter = await getHighlighter();
    for (const node of nodes) {
      let lang = (node.lang ?? "text").toLowerCase();
      if (lang !== "text" && !(lang in bundledLanguages)) lang = "text";
      if (lang !== "text" && !highlighter.getLoadedLanguages().includes(lang)) {
        await highlighter.loadLanguage(lang as keyof typeof bundledLanguages);
      }

      const highlighted = parseHighlightedLines(node.meta);
      const digits = String(node.value.split("\n").length).length;
      const html = highlighter.codeToHtml(node.value, {
        lang,
        theme: codeTheme.name!,
        transformers: [
          {
            pre(element) {
              element.properties.style = `--line-digits:${digits}`;
              element.properties.tabindex = undefined;
            },
            line(element, line) {
              if (highlighted.has(line)) this.addClassToHast(element, "highlighted");
            },
          },
        ],
      });

      const replacement = node as unknown as Html;
      replacement.type = "html";
      replacement.value = `<div class="code-block">${html}</div>`;
    }
  };
}

/** Images : chargement différé, et pas de lien vers l'image en taille réelle sans attribut. */
function rehypeImages() {
  return (tree: HastRoot) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "img") return;
      node.properties.loading ??= "lazy";
      node.properties.decoding ??= "async";
    });
  };
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkHighlightCode)
  // Le HTML écrit dans le Markdown (figures, encadrés…) est conservé tel quel
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeImages)
  .use(rehypeStringify);

/** Convertit le Markdown d'un article en HTML. */
export async function renderMarkdown(markdown: string) {
  return String(await processor.process(markdown));
}
