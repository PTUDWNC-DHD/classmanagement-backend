const { parse } = require("csv-parse/sync")

const readScore = async (file) => {
    let dataString = file.buffer.toString("utf8")
    const data = parse(
        dataString, 
        { 
            columns: true //['studentId', 'score'] 
        }
    )
    return data
}

const readStudent = async (file) => {
    let dataString = file.buffer.toString("utf8")
    const data = parse(
        dataString, 
        { 
            columns: true //['studentId', 'name'] 
        }
    )
    return data
}

module.exports = {
    readScore,
    readStudent,
}