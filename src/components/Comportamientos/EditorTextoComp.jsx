import { Editor } from "@monaco-editor/react";

const EditorTextoComp = ({ value, onChange, onValidate, beforeMount }) => {
    
    return (
        <div w="100%" border="1px solid #333" overflow="hidden">
            <Editor
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: "on",
                    contextmenu: false,
                    suggestOnTriggerCharacters: true,
                    scrollBeyondLastLine: false,
                    
                }}
                height="300px"
                theme="vs-dark"
                language="python"
                value={value}
                onChange={onChange}
                onValidate={onValidate}
                beforeMount={beforeMount}
            />
        </div>
    );
};

export default EditorTextoComp;