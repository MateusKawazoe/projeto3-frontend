exports.formatarData = (data) => {
    const date = new Date(data)
    const year = date.getFullYear()
    var day = date.getDate()
    var mounth = date.getMonth() + 1

    if(day < 10) {
        day = '0' + day
    }

    if(mounth < 10) {
        mounth = '0' + mounth
    }

    return (day + '/' + mounth + '/' + year)
}