export interface Disciplina {
    id?: number;
    nome: string;
    categoria: 'BASICA' | 'ESPECIFICA';
    porcentagem: number;
    ciclos: number;
    ordem?: number;
}