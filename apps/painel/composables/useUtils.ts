class Utilities {
  format(datef: Date) {
    if (datef instanceof Date)
      return new Intl.DateTimeFormat('pt-BR').format(datef)
    else
      return new Intl.DateTimeFormat('pt-BR').format(new Date(`${datef}T12:00:00`))
  }

  AmericanDateToday() {
    const date = new Date()
    const getYear = date.toLocaleString('default', { year: 'numeric' })
    const getMonth = date.toLocaleString('default', { month: '2-digit' })
    const getDay = date.toLocaleString('default', { day: '2-digit' })
    const dateFormat = `${getYear}-${getMonth}-${getDay}`

    return dateFormat
  }

  typesVotation(id: number) {
    const type = id - 1

    const types = [
      'Votação Simbólica',
      'Votação Nominal',
      'Votação Secreta',
      'Apenas Leitura',
    ]

    return types[type]
  }

  bill(num: number, year: string) {
    const strr = `${num}/${year}`
    const strArray = strr.split('')
    const numLength = String(num).length
    const zeros = 4 - numLength
    const prop = ref(strArray)
    for (let i = zeros; i--; i === 0)
      strArray.unshift('0')

    return prop.value?.toString()?.replaceAll(',', '')
  }
}

export default Utilities
