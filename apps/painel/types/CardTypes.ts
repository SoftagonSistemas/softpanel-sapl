export interface Card {
    avatar?: string
    name: string
    politicalParty: string
    vote: 'sim' | 'nao' | 'abst'
}
