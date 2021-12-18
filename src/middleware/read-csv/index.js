const { parse } = require("csv-parse/sync")

const readCSV = async (file) => {
    let dataString = file.buffer.toString("utf8")
    const data = parse(dataString, { columns: ['studentId', 'score'] })
    return data
}

module.exports = readCSV