import { Disciplina } from "./Disciplina"

export interface Contest {
    dataProvaDate: string
    id?: number
    nome: string
    percentualEstudadoFloat: number
    userId: number
    listaDisciplinaEntity?: Disciplina[]
    listaDisciplinaRequest?: Disciplina[]
    ordem?: number
}