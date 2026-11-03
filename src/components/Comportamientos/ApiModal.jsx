import { useState} from "react";
import { Modal, Table, Button } from 'react-bootstrap';

function ApiComp(props) {
  return (
<Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body style={{ fontSize: '14px' }}>
        <h1 className="text-center mb-4" style={{ color: '#7b4fcc' }}>API de Primitivas</h1>
        
        <Table hover responsive className="mt-4 align-middle">
          <thead className="text-center">
            <tr>
              <th>Metodo</th>
              <th>Código</th>
              <th>Argumento</th>
              <th>Resultado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="fw-bold">Correr</td>
              <td><code style={{ color: '#6f42c1' }}>correr(destino: coordenadas)</code></td>
              <td style={{ textAlign: 'justify' }}>destino: coordenadas a las que se desea desplazar el jugador.</td>
              <td style={{ textAlign: 'justify' }}>Modifica el estado de la partida actualizando la posición del jugador.</td>
            </tr>
            <tr>
              <td className="fw-bold">Patear</td>
              <td><code style={{ color: '#6f42c1' }}>patear(direccion: coordenadas)</code></td>
              <td style={{ textAlign: 'justify' }}>direccion: coordenadas de la dirección a la que se desea enviar la pelota.</td>
              <td style={{ textAlign: 'justify' }}>Modifica el estado de la partida actualizando el estado de la pelota.</td>
            </tr>
            <tr>
              <td className="fw-bold">Dirección Pelota</td>
              <td><code style={{ color: '#6f42c1' }}>direccionPelota()</code></td>
              <td style={{ textAlign: 'justify' }}>Ninguno.</td>
              <td style={{ textAlign: 'justify' }}>Devuelve las coordenadas donde se encuentra la pelota.</td>
            </tr>
            <tr>
              <td className="fw-bold">Dirección Compañero</td>
              <td><code style={{ color: '#6f42c1' }}>direccionCompanero(companero: int)</code></td>
              <td style={{ textAlign: 'justify' }}>Recibe un id de un compañero de equipo.</td>
              <td style={{ textAlign: 'justify' }}>Devuelve las coordenadas donde se encuentra el compañero de equipo.</td>
            </tr>
            <tr>
              <td className="fw-bold">Dirección Rival</td>
              <td><code style={{ color: '#6f42c1' }}>direccionRival(rival: int)</code></td>
              <td style={{ textAlign: 'justify' }}>Recibe un id de un jugador rival.</td>
              <td style={{ textAlign: 'justify' }}>Devuelve las coordenadas donde se encuentra ese jugador rival.</td>
            </tr>
            <tr>
              <td className="fw-bold">Dirección Arco Rival</td>
              <td><code style={{ color: '#6f42c1' }}>direccionArcoRival()</code></td>
              <td style={{ textAlign: 'justify' }}>Ninguno.</td>
              <td style={{ textAlign: 'justify' }}>Devuelve las coordenadas donde se encuentra el arco del equipo rival.</td>
            </tr>
            <tr>
              <td className="fw-bold">Pelota Cerca</td>
              <td><code style={{ color: '#6f42c1' }}>pelotaCerca(jugador: int)</code></td>
              <td style={{ textAlign: 'justify' }}>Recibe un id de un jugador.</td>
              <td style={{ textAlign: 'justify' }}>Verdadero si la pelota se encuentra dentro de la distancia considerada cercana al jugador, falso en caso contrario.</td>
            </tr>
            <tr>
              <td className="fw-bold">Dirección Arco Propio</td>
              <td><code style={{ color: '#6f42c1' }}>direccionArcoPropio()</code></td>
              <td style={{ textAlign: 'justify' }}>Ninguno.</td>
              <td style={{ textAlign: 'justify' }}>Devuelve las coordenadas donde se encuentra el arco del equipo propio.</td>
            </tr>
          </tbody>
        </Table>

        <div className="d-flex justify-content-end mt-1">
          <Button style={{ backgroundColor: '#6f42c1',borderColor: '#6f42c1', }} onClick={props.onHide}>
            Close
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

function ApiModal() {
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <Button variant="link" style={{ paddingTop: '3px' }} onClick={() => setModalShow(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-question-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/>
        </svg>
      </Button>

      <ApiComp
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  );
}

export default ApiModal;