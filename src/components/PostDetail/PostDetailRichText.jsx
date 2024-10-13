function PostDetailRichText({ content }) {
  const htmlContent = content;
  return (
    <div className="rte">
      {/* <p>
        Markdown is a lightweight markup language with plain-text-formatting syntax. Its design allows it to be
        converted to many output formats, but the original tool by the same name only supports HTML. Markdown is often
        used to format readme files, for writing messages in online discussion forums, and to create rich text using a
        plain text editor.
      </p>
      <h2>Emphasis</h2>
      <p>
        Emphasis, aka <i>italics</i>, with asterisks or <u>underscores</u>.
      </p>
      <p>
        Strong emphasis, aka bold, with <strong>asterisks</strong> or <strong>underscores</strong>.
      </p>
      <p>
        Strikethrough uses two tildes. <del>Scratch this</del>.
      </p>
      <h2>Code and Syntax Highlighting</h2>
      <p>
        Inline <code>code</code> has <code>back-ticks around</code> it.
      </p>
      <p>
        Blocks of code are either fenced by lines with three back-ticks ```, or are indented with four spaces. I
        recommend only using the fenced code blocks — they’re easier and only they support syntax highlighting.
      </p>
      <h2>Blockquote</h2>
      <blockquote>
        Blockquotes are very handy in email to emulate reply text. This line is part of the same quote.
      </blockquote>
      <h2>List</h2>
      <ol>
        <li>First ordered list item</li>
        <li>
          Another list item
          <ul>
            <li>Unordered sub-list.</li>
          </ul>
        </li>
        <li>
          Actual numbers don’t matter, just that it’s a number
          <ol>
            <li>Ordered sub-list</li>
          </ol>
        </li>
      </ol> */}
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}

export default PostDetailRichText;
