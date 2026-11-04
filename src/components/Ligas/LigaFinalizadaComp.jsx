import { Container, Card, Button, ListGroup, Table, Badge } from 'react-bootstrap';

const LigaFinalizadaComp = ({ alVolver, tablaLiga }) => {
    
    const campeon = tablaLiga.length > 0 ? tablaLiga[0] : null;

    return (
        <div 
            className="min-vh-100 d-flex flex-column align-items-center py-5"
            style={{
                backgroundColor: '#0d6efd',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}
        >
            <Container 
                className="p-4 p-md-5 bg-white rounded shadow-lg" 
                style={{ maxWidth: '800px', opacity: '0.95' }}
            >
                <div className="text-center mb-4">
                    <Badge bg="success" className="mb-2 px-3 py-2 fs-6 rounded-pill">
                        LIGA FINALIZADA
                    </Badge>
                    <h2 className="fw-bold text-uppercase mt-2" style={{ color: '#0d6efd' }}>
                        Resultados Finales
                    </h2>
                </div> 

                {campeon && (
                    <Card className="mb-4 border-0 shadow-sm bg-light">
                        <Card.Body className="text-center py-4">
                            <h5 className="text-muted text-uppercase fw-bold mb-3">🏆 Campeón de la Liga 🏆</h5>
                            <h1 className="text-primary fw-bold display-5 mb-0">
                                {campeon.nombre_club}
                            </h1>
                            <p className="text-muted mt-2 fw-semibold fs-5">
                                Con {campeon.puntos} Puntos
                            </p>
                        </Card.Body>
                    </Card>
                )}

                <Card className="shadow-sm mb-4" style={{ borderWidth: '1px' }}>
                    <Card.Header className="bg-dark text-white fw-bold d-flex justify-content-center align-items-center py-3">
                        <span>📊 Posiciones Finales</span>
                    </Card.Header>
                    <Card.Body className="p-0">
                        <Table responsive hover striped className="mb-0 align-middle text-center">
                            <thead className="bg-light text-muted small">
                                <tr>
                                    <th>#</th>
                                    <th className="text-start ps-3">CLUB</th>
                                    <th>PTS</th>
                                    <th>PG</th>
                                    <th>PE</th>
                                    <th>PP</th>
                                    <th>DIF</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tablaLiga.map((equipo, index) => (
                                    <tr key={equipo.id_equipo} className={index === 0 ? "table-warning fw-bold" : "fw-semibold"}>
                                        <td>
                                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                                        </td>
                                        <td className="text-start ps-3">{equipo.nombre_club}</td>
                                        <td className="fs-5">{equipo.puntos}</td>
                                        <td>{equipo.partidos_ganados}</td>
                                        <td>{equipo.partidos_empatados}</td>
                                        <td>{equipo.partidos_perdidos}</td>
                                        <td>{equipo.goles_a_favor - equipo.goles_en_contra}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>

                {/* BOTÓN PARA VOLVER */}
                <div className="d-flex justify-content-center pt-3">
                    <Button 
                        variant="primary" 
                        size="lg" 
                        className="px-5 shadow-sm fw-bold rounded-pill d-flex align-items-center"
                        onClick={alVolver}
                        style={{ transition: 'all 0.3s ease' }}
                    >
                        Volver al Menú Principal
                    </Button>
                </div>

            </Container>
        </div>
    );
};

export default LigaFinalizadaComp;