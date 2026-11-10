import { Container, Table, Alert, Button } from 'react-bootstrap';

const RankingComp = ({ ranking, mensajeError, onVerPerfil, iD, volver }) => {

    return (
        <div className="min-vh-100 d-flex flex-column align-items-center py-5" style={{ backgroundColor: '#da2929' }}>
            <Container 
                className="p-4 p-md-5 bg-white rounded shadow-lg" 
                style={{ maxWidth: '800px', opacity: '0.95' }}
            >
                {mensajeError && (
                    <Alert variant="danger" className="shadow-sm mb-4">
                        {mensajeError}
                    </Alert>
                )}

                <div className="text-center mb-4 border-bottom pb-3">
                    <h2 className="fw-bold mb-0" style={{ color: '#fd0d0d' }}>
                        Ranking Global de Clubes
                    </h2>
                </div>

                <Table responsive hover className="mb-4 text-center align-middle">
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                        <tr>
                            <th className="py-3" style={{ color: '#fd0d0d', borderBottom: '2px solid #fd0d0d' }}>Posición</th>
                            <th className="py-3" style={{ color: '#fd0d0d', borderBottom: '2px solid #fd0d0d' }}>Club</th>
                            <th className="py-3" style={{ color: '#fd0d0d', borderBottom: '2px solid #fd0d0d' }}>Puntaje</th>
                            <th className="py-3" style={{ color: '#fd0d0d', borderBottom: '2px solid #fd0d0d' }}>Perfil</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ranking?.map((club, index) => (
                            <tr key={club.id} className={String(club.id) === String(iD) ? 'table-secondary fw-bold' : '' }>
                                <td className="py-3 text-muted fw-bold">{index + 1}</td>
                                <td className="py-3 text-dark">{String(club.id) === String(iD) ? 'Tú' : club.club}</td>
                                <td className="py-3">
                                    <span className="badge rounded-pill bg-light text-dark border">
                                        {club.puntos} pts
                                    </span>
                                </td>
                                <td className="py-3">
                                    <Button
                                        variant={String(club.id) === String(iD) ? "danger" : "outline-danger"}
                                        size="sm"
                                        className="fw-bold shadow-sm rounded-pill px-3"
                                        onClick={() => onVerPerfil(club.id)}
                                    >
                                        Ver Perfil
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                
                <div className="d-flex justify-content-start border-top pt-4">
                    <Button 
                        variant="outline-secondary" 
                        size="lg" 
                        onClick={volver} 
                        className="px-4 shadow-sm fw-bold"
                    >
                        ← Volver
                    </Button>
                </div>
            </Container>
        </div>
    );
};

export default RankingComp;