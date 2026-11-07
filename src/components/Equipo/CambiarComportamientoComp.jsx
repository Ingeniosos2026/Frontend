import { Form } from 'react-bootstrap';

const CambiarComportamientoComp = ({
    comportamientos,
    cargando,
    alConfirmar
}) => {
  return (
    <div>
        <Form.Select
            defaultValue=""
            disabled={cargando}
            onChange={(e) => alConfirmar(e.target.value)}
        >
            <option value="" disabled>
                Seleccione un comportamiento
            </option>

            {comportamientos.map((comp) => (
                <option key={comp.id} value={comp.id}>
                    {comp.nombre}
                </option>
            ))}

        </Form.Select>
    </div>
  );
};

export default CambiarComportamientoComp;