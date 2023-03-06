import './style.css';
import { basicSetup } from 'codemirror';
import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';

const CODE_DEBOUNCE_DT = 500;

function debounce(callback, dt) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback.apply(this, args);
    }, dt);
  }
}

const canvas = document.getElementById('c');
const context = canvas.getContext('2d');

let renderFn;
const refreshCode = debounce((update) => {
  const code = update.state.doc.toString();
  renderFn = new Function('canvas', 'context', `${code}`);
  // context.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = canvas.width;
  renderFn(canvas, context);
}, CODE_DEBOUNCE_DT);

const state = EditorState.create({
  extensions: [
    basicSetup,
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        refreshCode(update);
      }
    }),
    javascript(),
  ],
});
const editor = new EditorView({
  state,
  parent: document.getElementById('e'),
});

