export const getItem = (key) => {
    const nepjun = JSON.parse(localStorage.getItem('nepjun'))
    if (nepjun) {
        return nepjun[key]
    }
    localStorage.setItem('nepjun', '{}')
}

export const setItem = (key, value) => {
    const nepjun = JSON.parse(localStorage.getItem('nepjun'))
    nepjun[key] = value
    localStorage.setItem('nepjun', JSON.stringify(nepjun))
}