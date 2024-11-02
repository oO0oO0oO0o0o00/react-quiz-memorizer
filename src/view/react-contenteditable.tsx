import * as React from "react";
const placeholderChar = "\u200e";

function strip(x: string) {
  return x.replaceAll(placeholderChar, '');
}

type MyState = {
  composing: boolean;
};

function printSelections() {
  const selections = window.getSelection();
  if (!selections || selections.rangeCount === 0) {
    console.log("[]");
    return;
  }
  let selectedText = "";
  for (let i = 0; i < selections.rangeCount; i++) {
    const range = selections.getRangeAt(i);
    if ( i > 0) { selectedText += ", "; }
    selectedText += range.toString();
  }
  console.log("["+selectedText+"]");
}

/**
 * A simple component for an html element with editable contents.
 */
export default class ContentEditable extends React.Component<Props> {
  lastText: string = this.props.text;
  el: any =
    typeof this.props.innerRef === "function"
      ? { current: null }
      : React.createRef<HTMLElement>();
  getEl = () =>
    (this.props.innerRef && typeof this.props.innerRef !== "function"
      ? this.props.innerRef
      : this.el
    ).current;

  state: MyState = {
    composing: false,
  };
  placeholderMode: boolean = false;
  displayText(text: string) {
    const prefix = placeholderChar.repeat(this.placeholderMode ? 1 : 2);
    return prefix + text;
  }
  render() {
    const { tagName, text, innerRef, ...props } = this.props;

    return React.createElement(
      tagName || "div",
      {
        ...props,
        ref:
          typeof innerRef === "function"
            ? (current: HTMLElement) => {
              innerRef(current);
              this.el.current = current;
            }
            : innerRef || this.el,
        onInput: this.emitChange,
        onChange: this.emitChange,
        onBlur: this.props.onBlur || this.emitChange,
        onKeyUp: this.props.onKeyUp || this.emitChange,
        onKeyDown: this.props.onKeyDown || this.emitChange,
        suppressContentEditableWarning: true,
        contentEditable: this.props.disabled ? "false" : "plaintext-only",
        onCompositionStart: () => { 
          this.setState({...this.state, composing: true});
        }, onCompositionEnd: (e: any) => {
          this.setState({...this.state, composing: false});
          // iOS Safari: 中文输入法联想词 start -> input -> end
          this.emitChange(e, true);
        },
      },
      this.displayText(text),
    );
  }

  shouldComponentUpdate(nextProps: Props): boolean {
    const { props } = this;
    const el = this.getEl();

    // We need not rerender if the change of props simply reflects the user's edits.
    // Rerendering in this case would make the cursor/caret jump

    // Rerender if there is no element yet... (somehow?)
    if (!el) {
      return true;
    }

    if (!this.state.composing &&
      strip(el.innerText) != nextProps.text) { 
        return true; 
      }

    // Handle additional properties
    return (
      props.disabled !== nextProps.disabled ||
      props.tagName !== nextProps.tagName ||
      props.className !== nextProps.className ||
      props.placeholder !== nextProps.placeholder ||
      false
    );
  }

  componentDidUpdate() {
    const el = this.getEl();
    if (!el) return;

    // Perhaps React (whose VDOM gets outdated because we often prevent
    // rerendering) did not update the DOM. So we update it manually now.
    // if (this.props.text !== strip(el.innerText)) {
    //   el.innerText = this.displayText(this.props.text);
    // }
    this.lastText = this.props.text;
  }

  emitChange = (originalEvt: React.SyntheticEvent<any>, ignoreComposing: boolean = false) => {
    if (this.state.composing && !ignoreComposing) {
      return;
    }
    const el = this.getEl();
    if (!el) return;

    const stripped = strip(el.innerText);
    // Side effect: this case we update text not entire dom
    if (stripped == "") { 
      el.innerText = this.displayText("");
    }
    el.setAttribute("data-pre", this.props['data-pre']);
    el.setAttribute("data-post", this.props['data-post']);

    if (this.props.onChange && stripped !== this.lastText) {
      // console.log(`🐱 emitChange(${stripped})`);
      const evt = Object.assign({}, originalEvt, {
        target: {
          value: stripped,
        },
      });
      this.props.onChange(evt);
    }
    this.lastText = stripped;
  };
}

export type ContentEditableEvent = React.SyntheticEvent<any, Event> & {
  target: { value: string };
};
type Modify<T, R> = Pick<T, Exclude<keyof T, keyof R>> & R;
type DivProps = Modify<
  JSX.IntrinsicElements["div"],
  { onChange: (event: ContentEditableEvent) => void }
>;

export interface Props extends DivProps {
  text: string;
  disabled?: boolean;
  tagName?: string;
  className?: string;
  style?: Object;
  placeholder?: string;
  innerRef?: React.RefObject<HTMLElement> | Function;
  enterKeyHint: string | undefined;
  "data-pre": string,
  "data-post": string,
}
