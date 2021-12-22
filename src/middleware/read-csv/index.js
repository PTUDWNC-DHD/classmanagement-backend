const { parse } = require("csv-parse/sync")

const file2str = (file) => {
    const dataStrWithBOM = file.buffer.toString("utf8")
    const dataStrWithoutBOM = dataStrWithBOM.replace(/^\uFEFF/, '')
    return dataStrWithoutBOM
}

const readScore = async (file) => {
    let dataString = file2str(file)
    const data = parse(
        dataString, 
        { 
            columns: true //['studentId', 'score'] 
        }
    )
    return data
}

const readStudent = async (file) => {
    let dataString = file2str(file)
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