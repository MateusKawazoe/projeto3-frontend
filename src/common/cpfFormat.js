exports.formatarCPF = (data) => {
    let aux = data[0] + data[1] + data[2] + '.' + data[3] + data[4] + data[5] + '.' + data[6] + data[7] + data[8] + '-' + data[9] + data[10]
    return aux
}

exports.removeMask = (data) => {
    let aux = data[0] + data[1] + data[2] + data[4] + data[5] + data[6] + data[8] + data[9] + data[10] + data[12] + data[13]
    return aux
}