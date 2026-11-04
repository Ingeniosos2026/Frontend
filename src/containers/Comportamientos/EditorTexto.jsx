import EditorTextoComp from '../../components/Comportamientos/EditorTextoComp';

const EditorTexto = ({ value, onChange, onValidationChange }) => {

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
        monaco.languages.registerCompletionItemProvider("python", {
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

                const sugerencias = [
                    {
                        label: "correr",
                        kind: monaco.languages.CompletionItemKind.Method,
                        insertText: "correr(${1:destino})",
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        detail: "correr(destino: Coordenada)",
                        documentation: "Mueve el jugador al destino indicado.",
                        range: range,
                    },
                    {
                        label: "patear",
                        kind: monaco.languages.CompletionItemKind.Method,
                        insertText: "patear(${1:direccion})",
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        detail: "patear(direccion: Coordenada) -> bool",
                        documentation: "Patea la pelota hacia la dirección indicada.",
                        range: range,
                    },
                    {
                        label: "direccionPelota",
                        kind: monaco.languages.CompletionItemKind.Method,
                        insertText: "direccionPelota()",
                        detail: "direccionPelota() -> Coordenada",
                        documentation: "Devuelve la posición actual de la pelota.",
                        range: range,
                    },
                    {
                        label: "direccionCompañeros",
                        kind: monaco.languages.CompletionItemKind.Method,
                        insertText: "direccionCompañeros()",
                        detail: "direccionCompañeros() -> list[Coordenada]",
                        documentation: "Devuelve las posiciones de los compañeros.",
                        range: range,
                    },
                    {
                        label: "direccionRivales",
                        kind: monaco.languages.CompletionItemKind.Method,
                        insertText: "direccionRivales()",
                        detail: "direccionRivales() -> list[Coordenada]",
                        documentation: "Devuelve las posiciones de los rivales.",
                        range: range,
                    },
                    {
                        label: "pelotaCerca",
                        kind: monaco.languages.CompletionItemKind.Method,
                        insertText: "pelotaCerca()",
                        detail: "pelotaCerca() -> bool",
                        documentation: "True si la pelota está al alcance.",
                        range: range,
                    },
                    {
                        label: "direccionArcoRival",
                        kind: monaco.languages.CompletionItemKind.Method,
                        insertText: "direccionArcoRival()",
                        detail: "direccionArcoRival() -> Coordenada",
                        documentation: "Devuelve la posición del arco rival.",
                        range: range,
                    },
                    {
                        label: "direccionArcoPropio",
                        kind: monaco.languages.CompletionItemKind.Method,
                        insertText: "direccionArcoPropio()",
                        detail: "direccionArcoPropio() -> Coordenada",
                        documentation: "Devuelve la posición de tu arco.",
                        range: range,
                    }
                ];

                return { suggestions: sugerencias };
            },
        });
    };
    
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