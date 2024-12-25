export interface DisciplinaMateria {
    nome: string;
    totalQuestoes: number;
    questoesAcertadas: number;
    categoria: 'BASICA' | 'ESPECIFICA';
  }