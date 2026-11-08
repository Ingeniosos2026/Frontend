import { Form } from 'react-bootstrap';

const CambiarComportamientoComp = ({
    comportamientos,
    cargando,
    alConfirmar
}) => {
  return (
    <div style={{
        flexDirection:'column',
        display:'flex',
        alignContent:'end'
    }}>
        <Form.Select
            defaultValue=""
            disabled={cargando}
            onChange={(e) => alConfirmar(e.target.value)}
            style={{color:'#818181'}}
        >
            <option value="" style={{color:'#a8a8a8', textAlign: 'center'}}>
                Cambiar comportamiento
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