let tree; //adapted from tree-sitter docs -lelf

(async () => {
  const CAPTURE_REGEX = /@\s*([\w\._-]+)/g;
  //const COLORS_BY_INDEX = ['red','gray',    '#268bd2',    '#d33682',    '#6c71c4',    '#b58900',    '#859900',    '#2aa198',    "green","blue",        '#d00682',    '#6001c4',    '#200bd2',    '#b00900',    '#800900',    '#cb4b16',    '#dc322f',    '#c00b16',    '#d0022f',    '#bf8970',    '#200198',    '#cf4b76',    '#df327f',    '#df3672',    '#6f7174',    '#2f8b72',    '#2fa178',    '#8f9970',    '#bf8970',    '#cf4b76',    '#df327f',    '#df3672',    '#6f7174',    '#2f8b72',    '#2fa178',    '#8f9970',    'blue',    'chocolate',    'darkblue',    'darkcyan',    'darkgreen',    'darkred',    'darkslategray',    'dimgray',    'green',    'indigo',    'navy',    'red',    'sienna'  ];
  const COLOR_MAP = {
        'err':  'red',
        'nb':   'gray',
        'do':   '#268bd2',
        'mo':   '#d33682',
        'mavo': '#6c71c4',
        'sym':  '#b58900',
        'vass': '#859900',
        'io':   '#2aa198',
        'a':    'green',
        'i':    'blue',
        'I':    '#d00682',
        'f':    '#6001c4',
        'F':    '#200bd2',
        'b':    '#b00900',
        'B':    '#800900',
        'n':    '#cb4b16',
        'N':    '#dc322f',
        'c':    '#c00b16',
        'C':    '#d0022f',
        'pare': '#bf8970',
        'par':  '#200198',
        'parl': '#cf4b76',
        'parm': '#df327f',
        'lv':   '#df3672',
        'abrk': '#6f7174',
        'pard': '#2f8b72',
        'kv':   '#2fa178',
        'var':  '#8f9970',
        'op':   '#bf8970',
        'SEMI': '#cf4b76'
  };

  const scriptURL = document.currentScript.getAttribute('src');

  const codeInput = document.getElementById('code-input');
  const outputContainer = document.getElementById('output-container');
  const outputContainerScroll = document.getElementById('output-container-scroll');
  const playgroundContainer = document.getElementById('playground-container');
  const languagesByName = {};

  loadState();  await TreeSitter.init();

  const parser = new TreeSitter();
  const codeEditor = CodeMirror.fromTextArea(codeInput, {    lineNumbers: true,    showCursorWhenSelecting: true  });
  const cluster = new Clusterize({rows: [],noDataText: null,contentElem: outputContainer,scrollElem: outputContainerScroll});
  const renderTreeOnCodeChange = debounce(renderTree, 50);
  const saveStateOnChange = debounce(saveState, 2000);
  const runTreeQueryOnChange = debounce(runTreeQuery, 50);

  let languageName = 'k';
  let treeRows = null;  let treeRowHighlightedIndex = -1;  let parseCount = 0;  let isRendering = 0;  let query;

  codeEditor.on('changes', handleCodeChange);
  codeEditor.on('viewportChange', runTreeQueryOnChange);
  codeEditor.on('cursorActivity', debounce(handleCursorMovement, 150));
  outputContainer.addEventListener('click', handleTreeClick);

  await handleLanguageChange()
  playgroundContainer.style.visibility = 'visible';

  async function handleLanguageChange() {
    const newLanguageName = 'k';
    if (!languagesByName[newLanguageName]) {
      const url = `tree-sitter-k.wasm`
      try {languagesByName[newLanguageName] = await TreeSitter.Language.load(url);}
       catch (e) {console.error(e);return} finally {}
    }

    tree = null;
    languageName = newLanguageName;
    parser.setLanguage(languagesByName[newLanguageName]);
    handleCodeChange();
    handleQueryChange();
  }

  async function handleCodeChange(editor, changes) {
    const newText = codeEditor.getValue() + '\n';
    const edits = tree && changes && changes.map(treeEditForEditorChange);
    if (edits) {      for (const edit of edits) {        tree.edit(edit);      }    }
    const newTree = parser.parse(newText, tree);

    if (tree) tree.delete();    tree = newTree;    parseCount++;
    renderTreeOnCodeChange();
    runTreeQueryOnChange();
    saveStateOnChange();
  }

  async function renderTree() {
    isRendering++;
    const cursor = tree.walk();

    let currentRenderCount = parseCount;
    let row = '';
    let rows = [];
    let finishedRow = false;
    let visitedChildren = false;
    let indentLevel = 0;

    for (let i = 0;; i++) {
      if (i > 0 && i % 10000 === 0) {
        await new Promise(r => setTimeout(r, 0));
        if (parseCount !== currentRenderCount) {
          cursor.delete();
          isRendering--;
          return;
        }
      }

      let displayName;
      if (cursor.nodeIsMissing) {
        displayName = `MISSING ${cursor.nodeType}`
      } else if (cursor.nodeIsNamed) {
        displayName = cursor.nodeType;
      }

      if (visitedChildren) {
        if (displayName) {
          finishedRow = true;
        }

        if (cursor.gotoNextSibling()) {
          visitedChildren = false;
        } else if (cursor.gotoParent()) {
          visitedChildren = true;
          indentLevel--;
        } else {
          break;
        }
      } else {
        if (displayName) {
          if (finishedRow) {
            row += '</div>';
            rows.push(row);
            finishedRow = false;
          }
          const start = cursor.startPosition;
          const end = cursor.endPosition;
          const id = cursor.nodeId;
          let fieldName = cursor.currentFieldName();

          let nod=cursor.currentNode(); let ntxt=nod.text.split("\n").length>1 ? "": `｢`+nod.text.split("\n")[0]+`｣`;

          if (fieldName) {
            fieldName = `(${fieldName})`;
          } else {
            fieldName = '';
          }
          row = `<div>${'  '.repeat(indentLevel)}∙ ${fieldName}<a class='plain' href="#" data-id=${id} data-range="${start.row},${start.column},${end.row},${end.column}">${displayName}${nod.hasError()?"*":""}</a>  <span class="ctx">${ntxt}</span>`;
          finishedRow = true;
        }

        if (cursor.gotoFirstChild()) {
          visitedChildren = false;
          indentLevel++;
        } else {
          visitedChildren = true;
        }
      }
    }
    if (finishedRow) {
      row += '</div>';
      rows.push(row);
    }

    cursor.delete();
    cluster.update(rows);
    treeRows = rows;
    isRendering--;
    handleCursorMovement();
  }

  function runTreeQuery(_, startRow, endRow) {
    if (endRow == null) {
      const viewport = codeEditor.getViewport();
      startRow = viewport.from;
      endRow = viewport.to;
    }

    codeEditor.operation(() => {
      const marks = codeEditor.getAllMarks();
      marks.forEach(m => m.clear());

      if (tree && query) {
        const captures = query.captures(
          tree.rootNode,
          {row: startRow, column: 0},
          {row: endRow, column: 0},
        );
        let lastNodeId;
        for (const {name, node} of captures) {
          if (node.id === lastNodeId) continue;
          lastNodeId = node.id;
          const {startPosition, endPosition} = node;
          codeEditor.markText(
            {line: startPosition.row, ch: startPosition.column},
            {line: endPosition.row, ch: endPosition.column},
            {
              inclusiveLeft: true,
              inclusiveRight: true,
              css: `color: ${colorForCaptureName(name)}`
            }
          );
        }
      }
    });
  }

  function handleQueryChange() {
    var queryText = '';
    fetch('highlights.scm').then(x=>x.text()).then(function(x){if(x){query=parser.getLanguage().query(x);runTreeQuery()}});
  }

  function handleCursorMovement() {
    if (isRendering) return;

    const selection = codeEditor.getDoc().listSelections()[0];
    let start = {row: selection.anchor.line, column: selection.anchor.ch};
    let end = {row: selection.head.line, column: selection.head.ch};
    if (
      start.row > end.row ||
      (
        start.row === end.row &&
        start.column > end.column
      )
    ) {
      let swap = end;
      end = start;
      start = swap;
    }
    const node = tree.rootNode.namedDescendantForPosition(start, end);
    if (treeRows) {
      if (treeRowHighlightedIndex !== -1) {
        const row = treeRows[treeRowHighlightedIndex];
        if (row) treeRows[treeRowHighlightedIndex] = row.replace('highlighted', 'plain');
      }
      treeRowHighlightedIndex = treeRows.findIndex(row => row.includes(`data-id=${node.id}`));
      if (treeRowHighlightedIndex !== -1) {
        const row = treeRows[treeRowHighlightedIndex];
        if (row) treeRows[treeRowHighlightedIndex] = row.replace('plain', 'highlighted');
      }
      cluster.update(treeRows);
      const lineHeight = cluster.options.item_height;
      const scrollTop = outputContainerScroll.scrollTop;
      const containerHeight = outputContainerScroll.clientHeight;
      const offset = treeRowHighlightedIndex * lineHeight; let v=1;
      if (scrollTop > offset - 20) {
        $(outputContainerScroll).animate({scrollTop: offset - 20}, 50);
      } else if (scrollTop < (offset- containerHeight)*v+lineHeight+40) {
        $(outputContainerScroll).animate({scrollTop: (offset - containerHeight + 50*lineHeight)*v + 140}, 50);
      }
    }
  }

  function handleTreeClick(event) {
    if (event.target.tagName === 'A') {
      event.preventDefault();
      const [startRow, startColumn, endRow, endColumn] = event
        .target
        .dataset
        .range
        .split(',')
        .map(n => parseInt(n));
      codeEditor.focus();
      codeEditor.setSelection(
        {line: startRow, ch: startColumn},
        {line: endRow, ch: endColumn}
      );
    }
  }

  function treeEditForEditorChange(change) {
    const oldLineCount = change.removed.length;
    const newLineCount = change.text.length;
    const lastLineLength = change.text[newLineCount - 1].length;

    const startPosition = {row: change.from.line, column: change.from.ch};
    const oldEndPosition = {row: change.to.line, column: change.to.ch};
    const newEndPosition = {
      row: startPosition.row + newLineCount - 1,
      column: newLineCount === 1
        ? startPosition.column + lastLineLength
        : lastLineLength
    };

    const startIndex = codeEditor.indexFromPos(change.from);
    let newEndIndex = startIndex + newLineCount - 1;
    let oldEndIndex = startIndex + oldLineCount - 1;
    for (let i = 0; i < newLineCount; i++) newEndIndex += change.text[i].length;
    for (let i = 0; i < oldLineCount; i++) oldEndIndex += change.removed[i].length;

    return {
      startIndex, oldEndIndex, newEndIndex,
      startPosition, oldEndPosition, newEndPosition
    };
  }

  function colorForCaptureName(capture) {
    //const id = query.captureNames.indexOf(capture);console.log(query.captureNames, capture,id,id % COLORS_BY_INDEX.length);
    //return COLORS_BY_INDEX[id % COLORS_BY_INDEX.length];
    return COLOR_MAP[capture]||COLOR_MAP['err'];
  }

  function loadState() {
    const language = localStorage.getItem("language");
    const sourceCode = localStorage.getItem("sourceCode");
    if (language != null && sourceCode != null) {
      codeInput.value = sourceCode;
    }
  }

  function saveState() {
    localStorage.setItem("sourceCode", codeEditor.getValue());
    localStorage.setItem("language","k");
  }

  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
})();
