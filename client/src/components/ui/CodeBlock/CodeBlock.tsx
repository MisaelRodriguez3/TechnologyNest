import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from './CodeBlock.module.css'

const CodeBlock = ({ code, language }: { code: string; language: string }) => {
    const detectedLanguage = language.toLowerCase();
  
    return (
      <SyntaxHighlighter
        language={detectedLanguage}
        style={vscDarkPlus}
        className={styles.codeBlock}
      >
        {code}
      </SyntaxHighlighter>
    );
};

export default CodeBlock;