import { Container, Table, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const RankingComp = ({ ranking, mensajeError, onVerPerfil, iD, volver }) => {

    if (mensajeError) {
        return <Alert variant="danger">{mensajeError}</Alert>;
    }

    return (
        <Container>
            <h2>Ranking Global de Clubes</h2>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Posición</th>
                        <th>Club</th>
                        <th>Puntaje</th>
                        <th>Perfil</th>
                    </tr>
                </thead>

                <tbody>
                    {ranking.map((club, index) => (
                        <tr key={club.usuario_id} className={String(club.usuario_id) === String(iD) ? 'table-secondary' : '' }>
                            <td>{index + 1}</td>
                            <td>{String(club.usuario_id) === String(iD) ? 'Tú' : club.nombre}</td>
                            <td>{club.puntos_ranking}</td>
                            <td>
                                <Button
                                    onClick={() => onVerPerfil(club.usuario_id)}
                                >
                                    Ver Perfil
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Button onClick={volver}>
                Volver
            </Button>
        </Container>
    );
};

export default RankingComp;