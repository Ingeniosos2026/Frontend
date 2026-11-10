import { Container, Table, Alert, Button } from 'react-bootstrap';

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
                        <tr key={club.id} className={String(club.id) === String(iD) ? 'table-secondary' : '' }>
                            <td>{index + 1}</td>
                            <td>{String(club.id) === String(iD) ? 'Tú' : club.club}</td>
                            <td>{club.puntos}</td>
                            <td>
                                <Button
                                    onClick={() => onVerPerfil(club.id)}
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