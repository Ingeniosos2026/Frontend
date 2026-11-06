import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import EditorTexto from './EditorTexto'; 

vi.mock('@monaco-editor/react', () => {
    return {
        Editor: ({ value, onChange, onValidate, beforeMount }) => {
            global.monacoMockEvents = { onValidate, beforeMount };
            
            return (
                <textarea 
                    data-testid="monaco-textarea-mock"
                    value={value}
                    onChange={(e) => {
                        if (onChange) onChange(e.target.value);
                    }}
                />
            );
        }
    };
});

describe('Test del Editor de Texto', () => {
    
    beforeEach(() => {
        global.monacoMockEvents = null;
        vi.clearAllMocks();
    });

    it('renderiza y pasa el valor inicial al editor', () => {
        render(<EditorTexto value="def funcion_inicial():" />);
        
        const textarea = screen.getByTestId('monaco-textarea-mock');
        expect(textarea).toHaveValue('def funcion_inicial():');
    });

    it('el evento onChange va desde el textarea mockeado hasta la prop del contenedor', () => {
        const mockOnChange = vi.fn();
        render(<EditorTexto value="" onChange={mockOnChange} />);
        
        const textarea = screen.getByTestId('monaco-textarea-mock');
        
        fireEvent.change(textarea, { target: { value: 'nuevo codigo' } });
        
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenCalledWith('nuevo codigo');
    });

    it('integra correctamente la validación de errores estructurales (severidad >= 4)', () => {
        const mockValidationChange = vi.fn();
        render(<EditorTexto value="" onValidationChange={mockValidationChange} />);
        
        global.monacoMockEvents.onValidate([{ severity: 8 }]);
        
        expect(mockValidationChange).toHaveBeenCalledWith(false);
    });

    it('integracion del registro de autocompletado de primitivas', () => {
        render(<EditorTexto value="" />);
        
        const mockRegister = vi.fn();
        const mockMonacoInstance = {
            languages: {
                registerCompletionItemProvider: mockRegister,
                CompletionItemKind: { Method: 'method' },
                CompletionItemInsertTextRule: { InsertAsSnippet: 'snippet' }
            }
        };

        global.monacoMockEvents.beforeMount(mockMonacoInstance);

        expect(mockRegister).toHaveBeenCalledTimes(1);
        expect(mockRegister.mock.calls[0][0]).toBe('python');
    });
});