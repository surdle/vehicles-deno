export async function getVehicles() {
    const csv = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTnkzzeHtt1WNzOhFKszlb2l--PT49lPYxRf-9cOw0rezvYFzPvZeCEe-W--gfzf35mbt_LPVX0GWH5/pub?output=csv')
    const text = await csv.text()

    return text.split('\n').slice(1).map( row => {
        const [id, make, model, year] = row.split(',')
        return {id, make, model, year: parseInt(year)}
    }
    )
}
