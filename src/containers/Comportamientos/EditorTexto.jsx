import EditorTextoComp from '../../components/Comportamientos/EditorTextoComp';
import { useEffect, useRef } from 'react';

const EditorTexto = ({ value, onChange, onValidationChange, sugerencias }) => {
    const proveedorRef = useRef(null);

    const handleChange = (newValue) => {
        if (onChange) {
            onChange(newValue);
        }
    };

    const handleValidation = (markers) => {
        const errores = markers.some((marker) => marker.severity >= 4);
        
        if (onValidationChange) {
            onValidationChange(!errores); 
        }
    };

    const handleEditorWillMount = (monaco) => {
        proveedorRef.current?.dispose();
        proveedorRef.current = monaco.languages.registerCompletionItemProvider("python", {
            triggerCharacters: ["."],
            provideCompletionItems: (model, position) => {
                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn,
                };

                const textUntilPosition = model.getValueInRange({
                    startLineNumber: position.lineNumber,
                    startColumn: 1,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column,
                });

                if (!textUntilPosition.match(/primitivas\.$/)) {
                    return { suggestions: [] };
                }

                const sugerenciasMonaco = sugerencias.map(sugerencia => ({
                    ...sugerencia,
                    kind: monaco.languages.CompletionItemKind.Method,
                    range: range
                }));

                return { suggestions: sugerenciasMonaco };
            },
        });
    };

    useEffect(() => {
        return () => {
            proveedorRef.current?.dispose();
            proveedorRef.current = null;
        };
    }, []);
    
    return (
        <EditorTextoComp
            value={value}
            onChange={handleChange}
            onValidate={handleValidation}
            beforeMount={handleEditorWillMount}
        />
    );
};
export default EditorTexto;
