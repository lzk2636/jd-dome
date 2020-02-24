const formatTime = date => {
    let Dates =new Date(date)
  const year = Dates.getFullYear()
  const month = Dates.getMonth() + 1
  const day = Dates.getDate()
 

  return [year, month, day].map(formatNumber).join("-")
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}
